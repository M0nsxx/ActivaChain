// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AdvancedReputationSystem is Ownable, ReentrancyGuard {
    struct ReputationScore {
        uint256 baseScore;
        uint256 timeDecay;
        uint256 endorsementBonus;
        uint256 activityScore;
        uint256 lastUpdate;
        uint256 lastActivity;
        mapping(address => bool) endorsers;
        uint256 endorsementCount;
        bytes32 zkProofHash;
        bool isVerified;
        uint256 verificationLevel; // 0: No verificado, 1: Básico, 2: Avanzado, 3: Premium
    }
    
    struct DecayConfig {
        uint256 decayPeriod; // Período de decay en segundos
        uint256 maxDecay; // Porcentaje máximo de decay por período
        uint256 activityThreshold; // Actividad mínima para evitar decay
    }
    
    mapping(address => ReputationScore) public reputations;
    mapping(bytes32 => bool) public usedProofs;
    mapping(address => uint256) public lastEndorsementTime;
    mapping(address => uint256) public activityStreak;
    
    DecayConfig public decayConfig;
    uint256 public constant ENDORSEMENT_COOLDOWN = 1 days;
    uint256 public constant ACTIVITY_THRESHOLD = 7 days;
    uint256 public constant VERIFICATION_BONUS = 500;
    uint256 public constant ENDORSEMENT_BONUS = 25;
    uint256 public constant ACTIVITY_BONUS = 10;
    
    event ReputationUpdated(address indexed user, uint256 newScore, uint256 decay);
    event UserEndorsed(address indexed user, address indexed endorser, uint256 bonus);
    event UserVerified(address indexed user, bytes32 proofHash, uint256 level);
    event ActivityRecorded(address indexed user, uint256 streak);
    event DecayApplied(address indexed user, uint256 decayAmount);
    
    constructor() Ownable(msg.sender) {
        decayConfig = DecayConfig({
            decayPeriod: 30 days, // 30 días
            maxDecay: 10, // 10% máximo por período
            activityThreshold: 7 days // 7 días de inactividad
        });
    }
    
    function calculateDecay(address user) public view returns (uint256) {
        ReputationScore storage rep = reputations[user];
        if (rep.lastUpdate == 0) return rep.baseScore;
        
        uint256 timeSinceUpdate = block.timestamp - rep.lastUpdate;
        uint256 periodsPassed = timeSinceUpdate / decayConfig.decayPeriod;
        
        if (periodsPassed == 0) return rep.baseScore;
        
        // Calcular decay basado en actividad
        uint256 timeSinceActivity = block.timestamp - rep.lastActivity;
        uint256 activityMultiplier = timeSinceActivity > decayConfig.activityThreshold ? 100 : 50; // 50% menos decay si está activo
        
        uint256 decay = (rep.baseScore * decayConfig.maxDecay * periodsPassed * activityMultiplier) / (100 * 100);
        
        return rep.baseScore > decay ? rep.baseScore - decay : 0;
    }
    
    function updateReputation(address user, uint256 points, bool isPositive) external onlyOwner {
        uint256 currentScore = calculateDecay(user);
        
        if (isPositive) {
            reputations[user].baseScore = currentScore + points;
        } else {
            reputations[user].baseScore = currentScore > points ? currentScore - points : 0;
        }
        
        reputations[user].lastUpdate = block.timestamp;
        reputations[user].lastActivity = block.timestamp;
        
        emit ReputationUpdated(user, reputations[user].baseScore, 0);
    }
    
    function verifyIdentityWithZK(
        bytes32 proofHash, 
        bytes memory proof, 
        uint256 verificationLevel
    ) external {
        require(!usedProofs[proofHash], "Proof already used");
        require(verifyZKProof(proof), "Invalid ZK proof");
        require(verificationLevel >= 1 && verificationLevel <= 3, "Invalid verification level");
        
        usedProofs[proofHash] = true;
        reputations[msg.sender].zkProofHash = proofHash;
        reputations[msg.sender].isVerified = true;
        reputations[msg.sender].verificationLevel = verificationLevel;
        
        // Bonus basado en nivel de verificación
        uint256 bonus = VERIFICATION_BONUS * verificationLevel;
        reputations[msg.sender].baseScore += bonus;
        reputations[msg.sender].lastUpdate = block.timestamp;
        reputations[msg.sender].lastActivity = block.timestamp;
        
        emit UserVerified(msg.sender, proofHash, verificationLevel);
        emit ReputationUpdated(msg.sender, reputations[msg.sender].baseScore, 0);
    }
    
    function verifyZKProof(bytes memory proof) internal pure returns (bool) {
        // En producción, integrar con Semaphore o Circom
        // Por ahora, validación básica
        return proof.length >= 32;
    }
    
    function endorseUser(address user) external {
        require(!reputations[user].endorsers[msg.sender], "Already endorsed");
        require(reputations[msg.sender].baseScore >= 100, "Insufficient reputation to endorse");
        require(reputations[msg.sender].isVerified, "Must be verified to endorse");
        require(block.timestamp >= lastEndorsementTime[msg.sender] + ENDORSEMENT_COOLDOWN, "Endorsement cooldown");
        
        reputations[user].endorsers[msg.sender] = true;
        reputations[user].endorsementCount++;
        reputations[user].endorsementBonus += ENDORSEMENT_BONUS;
        reputations[user].baseScore += ENDORSEMENT_BONUS;
        reputations[user].lastUpdate = block.timestamp;
        reputations[user].lastActivity = block.timestamp;
        
        lastEndorsementTime[msg.sender] = block.timestamp;
        
        emit UserEndorsed(user, msg.sender, ENDORSEMENT_BONUS);
        emit ReputationUpdated(user, reputations[user].baseScore, 0);
    }
    
    function recordActivity(address user) external onlyOwner {
        uint256 timeSinceLastActivity = block.timestamp - reputations[user].lastActivity;
        
        if (timeSinceLastActivity <= ACTIVITY_THRESHOLD) {
            activityStreak[user]++;
            reputations[user].activityScore += ACTIVITY_BONUS * activityStreak[user];
        } else {
            activityStreak[user] = 1;
            reputations[user].activityScore = ACTIVITY_BONUS;
        }
        
        reputations[user].lastActivity = block.timestamp;
        reputations[user].lastUpdate = block.timestamp;
        
        emit ActivityRecorded(user, activityStreak[user]);
    }
    
    function applyDecay(address user) external {
        uint256 currentScore = calculateDecay(user);
        uint256 decayAmount = reputations[user].baseScore - currentScore;
        
        if (decayAmount > 0) {
            reputations[user].baseScore = currentScore;
            reputations[user].lastUpdate = block.timestamp;
            
            emit DecayApplied(user, decayAmount);
            emit ReputationUpdated(user, currentScore, decayAmount);
        }
    }
    
    function getReputation(address user) external view returns (
        uint256 score,
        uint256 endorsementCount,
        bool isVerified,
        uint256 verificationLevel,
        uint256 userActivityStreak,
        uint256 timeSinceLastActivity
    ) {
        score = calculateDecay(user) + reputations[user].endorsementBonus + reputations[user].activityScore;
        endorsementCount = reputations[user].endorsementCount;
        isVerified = reputations[user].isVerified;
        verificationLevel = reputations[user].verificationLevel;
        userActivityStreak = activityStreak[user];
        timeSinceLastActivity = block.timestamp - reputations[user].lastActivity;
    }
    
    function getDetailedReputation(address user) external view returns (
        uint256 baseScore,
        uint256 timeDecay,
        uint256 endorsementBonus,
        uint256 activityScore,
        uint256 totalScore,
        uint256 lastUpdate,
        uint256 lastActivity
    ) {
        baseScore = reputations[user].baseScore;
        timeDecay = calculateDecay(user);
        endorsementBonus = reputations[user].endorsementBonus;
        activityScore = reputations[user].activityScore;
        totalScore = timeDecay + endorsementBonus + activityScore;
        lastUpdate = reputations[user].lastUpdate;
        lastActivity = reputations[user].lastActivity;
    }
    
    function updateDecayConfig(
        uint256 _decayPeriod,
        uint256 _maxDecay,
        uint256 _activityThreshold
    ) external onlyOwner {
        require(_maxDecay <= 50, "Max decay too high"); // Máximo 50%
        require(_activityThreshold <= 30 days, "Activity threshold too high");
        
        decayConfig.decayPeriod = _decayPeriod;
        decayConfig.maxDecay = _maxDecay;
        decayConfig.activityThreshold = _activityThreshold;
    }
    
    function isEndorsedBy(address user, address endorser) external view returns (bool) {
        return reputations[user].endorsers[endorser];
    }
    
    function getEndorsers(address user) external view returns (address[] memory) {
        // Esta función requeriría un array adicional para almacenar endorsers
        // Por simplicidad, solo retornamos el count
        return new address[](reputations[user].endorsementCount);
    }
}
