const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ActivaChain Quick Tests", function () {
  let activaNFT, marketplace, reputation, activaToken, mockUSDC;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    console.log("Deploying ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    activaNFT = await ActivaNFT.deploy();

    console.log("Deploying MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();

    console.log("Deploying ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    activaToken = await ActivaToken.deploy(
      "ActivaChain Token",
      "ACTIVA",
      ethers.utils.parseEther("1000000")
    );

    console.log("Deploying Marketplace...");
    const Marketplace = await ethers.getContractFactory("ActivaMarketplace");
    marketplace = await Marketplace.deploy(mockUSDC.address, activaNFT.address);

    console.log("Deploying ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    reputation = await ReputationSystem.deploy();
  });

  it("Should mint NFT certification", async function () {
    await activaNFT.mintCertification(
      user1.address,
      "Blockchain Basics",
      1,
      100,
      "ipfs://test"
    );

    const certs = await activaNFT.userCertifications(user1.address);
    expect(certs.length).to.equal(1);
    
    const certDetails = await activaNFT.getCertificationDetails(1);
    expect(certDetails.courseName).to.equal("Blockchain Basics");
    expect(certDetails.level).to.equal(1);
    expect(certDetails.score).to.equal(100);
  });

  it("Should verify identity with ZK proof", async function () {
    const proofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("proof"));
    const proof = "0x1234"; // Simplified proof
    
    await reputation.verifyIdentityWithZK(proofHash, proof);
    
    const rep = await reputation.getReputation(owner.address);
    expect(rep.isVerified).to.be.true;
    expect(rep.score).to.equal(500); // VERIFICATION_BONUS
  });

  it("Should handle reputation decay", async function () {
    await reputation.updateReputation(user1.address, 1000, true);
    
    const initialRep = await reputation.calculateDecay(user1.address);
    expect(initialRep).to.equal(1000);
  });

  it("Should create and purchase service in marketplace", async function () {
    // First mint a certification to give user1 reputation
    await activaNFT.mintCertification(
      user1.address,
      "Blockchain Basics",
      1,
      100,
      "ipfs://test"
    );

    // Create a service
    await marketplace.connect(user1).createService(
      "Smart Contract Development",
      "I will develop a smart contract for you",
      ethers.utils.parseUnits("100", 6), // 100 USDC
      1, // Dev category
      50 // Min reputation
    );

    // Give user2 some USDC
    await mockUSDC.mint(user2.address, ethers.utils.parseUnits("1000", 6));

    // User2 purchases the service
    await mockUSDC.connect(user2).approve(marketplace.address, ethers.utils.parseUnits("100", 6));
    await marketplace.connect(user2).purchaseService(1);

    const order = await marketplace.getOrderDetails(1);
    expect(order.buyer).to.equal(user2.address);
    expect(order.provider).to.equal(user1.address);
    expect(order.status).to.equal(1); // InProgress
  });

  it("Should stake and unstake tokens", async function () {
    // Give user1 some tokens
    await activaToken.transfer(user1.address, ethers.utils.parseEther("1000"));

    // User1 stakes tokens
    await activaToken.connect(user1).stake(ethers.utils.parseEther("100"));

    const stakingInfo = await activaToken.getStakingInfo(user1.address);
    expect(stakingInfo.balance).to.equal(ethers.utils.parseEther("100"));

    // Check that tokens are locked
    const balance = await activaToken.balanceOf(user1.address);
    expect(balance).to.equal(ethers.utils.parseEther("900"));
  });

  it("Should endorse users", async function () {
    // First verify both users
    const proofHash1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("proof1"));
    const proofHash2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("proof2"));
    
    await reputation.verifyIdentityWithZK(proofHash1, "0x1234");
    await reputation.connect(user1).verifyIdentityWithZK(proofHash2, "0x5678");

    // User1 endorses user2
    await reputation.connect(user1).endorseUser(user2.address);

    const rep = await reputation.getReputation(user2.address);
    expect(rep.endorsementCount).to.equal(1);
    expect(rep.score).to.equal(510); // 500 (verification) + 10 (endorsement)
  });
});
