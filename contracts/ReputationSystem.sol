// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReputationSystem {
    struct Reputation {
        uint256 score;
        uint256 lastUpdate;
        uint256 decayRate;
        mapping(address => bool) endorsers;
        uint256 endorsementCount;
        bytes32 zkProofHash; // Hash del ZK proof de identidad
        bool isVerified;
    }
    
    mapping(address => Reputation) public reputations;
    mapping(bytes32 => bool) public usedProofs;
    
    uint256 constant DECAY_PERIOD = 30 days;
    uint256 constant MAX_DECAY = 10; // 10% max decay per period
    uint256 constant VERIFICATION_BONUS = 500; // Bonus por verificación ZK
    
    event ReputationUpdated(address indexed user, uint256 newScore);
    event UserEndorsed(address indexed user, address indexed endorser);
    event UserVerified(address indexed user, bytes32 proofHash);
    
    function calculateDecay(address user) public view returns (uint256) {
        Reputation storage rep = reputations[user];
        if (rep.lastUpdate == 0) return rep.score;
        
        uint256 periodsPassed = (block.timestamp - rep.lastUpdate) / DECAY_PERIOD;
        uint256 decay = (rep.score * MAX_DECAY * periodsPassed) / 100;
        
        return rep.score > decay ? rep.score - decay : 0;
    }
    
    function verifyIdentityWithZK(bytes32 proofHash, bytes memory proof) external {
        require(!usedProofs[proofHash], "Proof already used");
        require(verifyZKProof(proof), "Invalid ZK proof");
        
        usedProofs[proofHash] = true;
        reputations[msg.sender].zkProofHash = proofHash;
        reputations[msg.sender].isVerified = true;
        reputations[msg.sender].score += VERIFICATION_BONUS;
        
        emit UserVerified(msg.sender, proofHash);
    }
    
    function verifyZKProof(bytes memory proof) internal pure returns (bool) {
        // Simplified ZK verification - en producción usar una librería ZK real
        // como Semaphore o Circom
        return proof.length > 0;
    }
    
    function updateReputation(address user, uint256 points, bool isPositive) external {
        uint256 currentScore = calculateDecay(user);
        
        if (isPositive) {
            reputations[user].score = currentScore + points;
        } else {
            reputations[user].score = currentScore > points ? currentScore - points : 0;
        }
        
        reputations[user].lastUpdate = block.timestamp;
        emit ReputationUpdated(user, reputations[user].score);
    }
    
    function endorseUser(address user) external {
        require(!reputations[user].endorsers[msg.sender], "Already endorsed");
        require(reputations[msg.sender].score >= 100, "Insufficient reputation to endorse");
        require(reputations[msg.sender].isVerified, "Must be verified to endorse");
        
        reputations[user].endorsers[msg.sender] = true;
        reputations[user].endorsementCount++;
        reputations[user].score += 10; // Bonus for endorsement
        
        emit UserEndorsed(user, msg.sender);
    }
    
    function getReputation(address user) external view returns (
        uint256 score,
        uint256 endorsementCount,
        bool isVerified
    ) {
        score = calculateDecay(user);
        endorsementCount = reputations[user].endorsementCount;
        isVerified = reputations[user].isVerified;
    }
}
