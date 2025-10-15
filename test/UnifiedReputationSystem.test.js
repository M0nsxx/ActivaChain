const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UnifiedReputationSystem", function () {
  let unifiedReputation;
  let owner, user1, user2, user3;
  
  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const UnifiedReputationSystem = await ethers.getContractFactory("UnifiedReputationSystem");
    unifiedReputation = await UnifiedReputationSystem.deploy();
    await unifiedReputation.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await unifiedReputation.owner()).to.equal(owner.address);
    });
    
    it("Should initialize with correct decay config", async function () {
      const config = await unifiedReputation.decayConfig();
      expect(config.decayPeriod).to.equal(30 * 24 * 60 * 60); // 30 days
      expect(config.maxDecayPercent).to.equal(10); // 10%
      expect(config.activityThreshold).to.equal(7 * 24 * 60 * 60); // 7 days
    });
  });
  
  describe("Reputation Management", function () {
    it("Should update reputation correctly", async function () {
      await unifiedReputation.updateReputation(user1.address, 100, true);
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(100);
    });
    
    it("Should apply negative reputation", async function () {
      await unifiedReputation.updateReputation(user1.address, 100, true);
      await unifiedReputation.updateReputation(user1.address, 30, false);
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(70);
    });
    
    it("Should not allow negative reputation to go below zero", async function () {
      await unifiedReputation.updateReputation(user1.address, 50, true);
      await unifiedReputation.updateReputation(user1.address, 100, false);
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(0);
    });
  });
  
  describe("ZK Verification", function () {
    it("Should verify identity with ZK proof", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("test_proof"));
      const proof = ethers.toUtf8Bytes("test_proof_data");
      const verificationLevel = 2;
      
      await unifiedReputation.connect(user1).verifyIdentityWithZK(
        proofHash,
        proof,
        verificationLevel
      );
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.isVerified).to.be.true;
      expect(reputation.verificationLevel).to.equal(verificationLevel);
      expect(reputation.score).to.equal(500 * verificationLevel); // 500 * 2 = 1000
    });
    
    it("Should not allow duplicate proof usage", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("duplicate_proof"));
      const proof = ethers.toUtf8Bytes("duplicate_proof_data");
      
      await unifiedReputation.connect(user1).verifyIdentityWithZK(proofHash, proof, 1);
      
      await expect(
        unifiedReputation.connect(user2).verifyIdentityWithZK(proofHash, proof, 1)
      ).to.be.revertedWith("Proof already used");
    });
    
    it("Should reject invalid verification levels", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("invalid_level"));
      const proof = ethers.toUtf8Bytes("invalid_level_data");
      
      await expect(
        unifiedReputation.connect(user1).verifyIdentityWithZK(proofHash, proof, 0)
      ).to.be.revertedWith("Invalid verification level");
      
      await expect(
        unifiedReputation.connect(user1).verifyIdentityWithZK(proofHash, proof, 4)
      ).to.be.revertedWith("Invalid verification level");
    });
  });
  
  describe("Endorsements", function () {
    beforeEach(async function () {
      // Setup user1 with enough reputation to endorse
      await unifiedReputation.updateReputation(user1.address, 200, true);
      await unifiedReputation.connect(user1).verifyIdentityWithZK(
        ethers.keccak256(ethers.toUtf8Bytes("user1_proof")),
        ethers.toUtf8Bytes("user1_proof_data"),
        1
      );
    });
    
    it("Should allow endorsement with sufficient reputation", async function () {
      await unifiedReputation.connect(user1).endorseUser(user2.address);
      
      const reputation = await unifiedReputation.getReputation(user2.address);
      expect(reputation.score).to.equal(25); // Endorsement bonus
      expect(reputation.endorsementCount).to.equal(1);
    });
    
    it("Should not allow endorsement without sufficient reputation", async function () {
      await expect(
        unifiedReputation.connect(user2).endorseUser(user3.address)
      ).to.be.revertedWith("Insufficient reputation");
    });
    
    it("Should not allow endorsement without verification", async function () {
      await unifiedReputation.updateReputation(user2.address, 200, true);
      
      await expect(
        unifiedReputation.connect(user2).endorseUser(user3.address)
      ).to.be.revertedWith("Must be verified to endorse");
    });
    
    it("Should not allow duplicate endorsements", async function () {
      await unifiedReputation.connect(user1).endorseUser(user2.address);
      
      await expect(
        unifiedReputation.connect(user1).endorseUser(user2.address)
      ).to.be.revertedWith("Already endorsed");
    });
    
    it("Should enforce endorsement cooldown", async function () {
      await unifiedReputation.connect(user1).endorseUser(user2.address);
      
      await expect(
        unifiedReputation.connect(user1).endorseUser(user3.address)
      ).to.be.revertedWith("Endorsement cooldown");
    });
  });
  
  describe("Activity System", function () {
    it("Should record activity and update streak", async function () {
      await unifiedReputation.recordActivity(user1.address);
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.userActivityStreak).to.equal(1);
      expect(reputation.score).to.equal(10); // Activity bonus
    });
    
    it("Should increase streak for consecutive activities", async function () {
      await unifiedReputation.recordActivity(user1.address);
      await unifiedReputation.recordActivity(user1.address);
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.userActivityStreak).to.equal(2);
      expect(reputation.score).to.equal(30); // 10 + 20 (streak bonus)
    });
  });
  
  describe("Decay System", function () {
    it("Should calculate decay correctly", async function () {
      await unifiedReputation.updateReputation(user1.address, 1000, true);
      
      // Fast forward time (simulate 30 days)
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.be.lessThan(1000);
    });
    
    it("Should apply less decay for active users", async function () {
      await unifiedReputation.updateReputation(user1.address, 1000, true);
      await unifiedReputation.recordActivity(user1.address);
      
      // Fast forward time (simulate 30 days)
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      const reputation = await unifiedReputation.getReputation(user1.address);
      // Should have less decay due to activity
      expect(reputation.score).to.be.greaterThan(900);
    });
  });
  
  describe("Admin Functions", function () {
    it("Should allow owner to update decay config", async function () {
      await unifiedReputation.updateDecayConfig(
        15 * 24 * 60 * 60, // 15 days
        5, // 5%
        3 * 24 * 60 * 60   // 3 days
      );
      
      const config = await unifiedReputation.decayConfig();
      expect(config.decayPeriod).to.equal(15 * 24 * 60 * 60);
      expect(config.maxDecayPercent).to.equal(5);
      expect(config.activityThreshold).to.equal(3 * 24 * 60 * 60);
    });
    
    it("Should not allow non-owner to update config", async function () {
      await expect(
        unifiedReputation.connect(user1).updateDecayConfig(1, 1, 1)
      ).to.be.revertedWithCustomError(unifiedReputation, "OwnableUnauthorizedAccount");
    });
    
    it("Should enforce config limits", async function () {
      await expect(
        unifiedReputation.updateDecayConfig(1, 60, 1) // 60% > 50% max
      ).to.be.revertedWith("Max decay too high");
      
      await expect(
        unifiedReputation.updateDecayConfig(1, 1, 40 * 24 * 60 * 60) // 40 days > 30 days max
      ).to.be.revertedWith("Activity threshold too high");
    });
  });
  
  describe("Events", function () {
    it("Should emit ReputationUpdated event", async function () {
      await expect(unifiedReputation.updateReputation(user1.address, 100, true))
        .to.emit(unifiedReputation, "ReputationUpdated")
        .withArgs(user1.address, 100, 0);
    });
    
    it("Should emit UserVerified event", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("test_proof"));
      const proof = ethers.toUtf8Bytes("test_proof_data");
      
      await expect(
        unifiedReputation.connect(user1).verifyIdentityWithZK(proofHash, proof, 2)
      ).to.emit(unifiedReputation, "UserVerified")
        .withArgs(user1.address, proofHash, 2);
    });
    
    it("Should emit UserEndorsed event", async function () {
      await unifiedReputation.updateReputation(user1.address, 200, true);
      await unifiedReputation.connect(user1).verifyIdentityWithZK(
        ethers.keccak256(ethers.toUtf8Bytes("user1_proof")),
        ethers.toUtf8Bytes("user1_proof_data"),
        1
      );
      
      await expect(unifiedReputation.connect(user1).endorseUser(user2.address))
        .to.emit(unifiedReputation, "UserEndorsed")
        .withArgs(user2.address, user1.address, 25);
    });
  });
  
  describe("Integration Tests", function () {
    it("Should handle complete user journey", async function () {
      // 1. User starts with no reputation
      let reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(0);
      expect(reputation.isVerified).to.be.false;
      
      // 2. User verifies identity
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("user1_proof"));
      const proof = ethers.toUtf8Bytes("user1_proof_data");
      
      await unifiedReputation.connect(user1).verifyIdentityWithZK(proofHash, proof, 2);
      
      reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(1000); // 500 * 2
      expect(reputation.isVerified).to.be.true;
      expect(reputation.verificationLevel).to.equal(2);
      
      // 3. User gets additional reputation
      await unifiedReputation.updateReputation(user1.address, 500, true);
      
      reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.score).to.equal(1500);
      
      // 4. User endorses another user
      await unifiedReputation.connect(user1).endorseUser(user2.address);
      
      const user2Reputation = await unifiedReputation.getReputation(user2.address);
      expect(user2Reputation.score).to.equal(25);
      expect(user2Reputation.endorsementCount).to.equal(1);
      
      // 5. User records activity
      await unifiedReputation.recordActivity(user1.address);
      
      reputation = await unifiedReputation.getReputation(user1.address);
      expect(reputation.userActivityStreak).to.equal(1);
      expect(reputation.score).to.equal(1510); // 1500 + 10
    });
  });
});
