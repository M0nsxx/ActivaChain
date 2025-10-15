// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title UnifiedReputationSystem
 * @dev Sistema unificado de reputación con decay temporal
 * @author ActivaChain Team
 * @notice Contrato único que maneja toda la lógica de reputación del ecosistema
 */
contract UnifiedReputationSystem is Ownable, ReentrancyGuard {
    
    // ============ STRUCTS ============
    
    struct ReputationProfile {
        uint256 baseScore;           // Puntuación base
        uint256 lastUpdate;          // Última actualización
        uint256 lastActivity;        // Última actividad
        uint256 endorsementCount;    // Número de endorsements
        uint256 activityStreak;     // Racha de actividad
        bytes32 zkProofHash;         // Hash del ZK proof
        bool isVerified;             // Estado de verificación
        uint8 verificationLevel;     // Nivel de verificación (0-3)
        mapping(address => bool) endorsers; // Quienes han endorsado
    }
    
    struct DecayConfig {
        uint256 decayPeriod;        // Período de decay (segundos)
        uint256 maxDecayPercent;    // Porcentaje máximo de decay
        uint256 activityThreshold;  // Umbral de actividad (segundos)
    }
    
    // ============ STATE VARIABLES ============
    
    mapping(address => ReputationProfile) public reputations;
    mapping(bytes32 => bool) public usedProofs;
    mapping(address => uint256) public lastEndorsementTime;
    mapping(address => uint256) public activityStreak;
    
    DecayConfig public decayConfig;
    
    // Constantes
    uint256 public constant ENDORSEMENT_COOLDOWN = 1 days;
    uint256 public constant VERIFICATION_BONUS = 500;
    uint256 public constant ENDORSEMENT_BONUS = 25;
    uint256 public constant ACTIVITY_BONUS = 10;
    uint256 public constant MIN_REPUTATION_TO_ENDORSE = 100;
    
    // ============ EVENTS ============
    
    event ReputationUpdated(
        address indexed user, 
        uint256 newScore, 
        uint256 decayApplied
    );
    
    event UserEndorsed(
        address indexed user, 
        address indexed endorser, 
        uint256 bonus
    );
    
    event UserVerified(
        address indexed user, 
        bytes32 proofHash, 
        uint8 level
    );
    
    event ActivityRecorded(
        address indexed user, 
        uint256 streak
    );
    
    event DecayApplied(
        address indexed user, 
        uint256 decayAmount
    );
    
    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) {
        decayConfig = DecayConfig({
            decayPeriod: 30 days,      // 30 días
            maxDecayPercent: 10,       // 10% máximo por período
            activityThreshold: 7 days  // 7 días de inactividad
        });
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Calcula el decay temporal de la reputación
     * @param user Dirección del usuario
     * @return Puntuación actual después del decay
     */
    function calculateDecay(address user) public view returns (uint256) {
        ReputationProfile storage rep = reputations[user];
        if (rep.lastUpdate == 0) return rep.baseScore;
        
        uint256 timeSinceUpdate = block.timestamp - rep.lastUpdate;
        uint256 periodsPassed = timeSinceUpdate / decayConfig.decayPeriod;
        
        if (periodsPassed == 0) return rep.baseScore;
        
        // Calcular decay basado en actividad
        uint256 timeSinceActivity = block.timestamp - rep.lastActivity;
        uint256 activityMultiplier = timeSinceActivity > decayConfig.activityThreshold ? 100 : 50;
        
        uint256 decay = (rep.baseScore * decayConfig.maxDecayPercent * periodsPassed * activityMultiplier) / (100 * 100);
        
        return rep.baseScore > decay ? rep.baseScore - decay : 0;
    }
    
    /**
     * @dev Actualiza la reputación de un usuario
     * @param user Dirección del usuario
     * @param points Puntos a agregar/quitar
     * @param isPositive Si es positivo o negativo
     */
    function updateReputation(
        address user, 
        uint256 points, 
        bool isPositive
    ) external onlyOwner {
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
    
    /**
     * @dev Verifica identidad con ZK proof
     * @param proofHash Hash del proof
     * @param proof Datos del proof
     * @param verificationLevel Nivel de verificación (1-3)
     */
    function verifyIdentityWithZK(
        bytes32 proofHash,
        bytes memory proof,
        uint8 verificationLevel
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
    
    /**
     * @dev Endorsa a un usuario
     * @param user Dirección del usuario a endorsar
     */
    function endorseUser(address user) external {
        require(!reputations[user].endorsers[msg.sender], "Already endorsed");
        require(reputations[msg.sender].baseScore >= MIN_REPUTATION_TO_ENDORSE, "Insufficient reputation");
        require(reputations[msg.sender].isVerified, "Must be verified to endorse");
        require(block.timestamp >= lastEndorsementTime[msg.sender] + ENDORSEMENT_COOLDOWN, "Endorsement cooldown");
        
        reputations[user].endorsers[msg.sender] = true;
        reputations[user].endorsementCount++;
        reputations[user].baseScore += ENDORSEMENT_BONUS;
        reputations[user].lastUpdate = block.timestamp;
        reputations[user].lastActivity = block.timestamp;
        
        lastEndorsementTime[msg.sender] = block.timestamp;
        
        emit UserEndorsed(user, msg.sender, ENDORSEMENT_BONUS);
        emit ReputationUpdated(user, reputations[user].baseScore, 0);
    }
    
    /**
     * @dev Registra actividad del usuario
     * @param user Dirección del usuario
     */
    function recordActivity(address user) external onlyOwner {
        uint256 timeSinceLastActivity = block.timestamp - reputations[user].lastActivity;
        
        if (reputations[user].lastActivity == 0 || timeSinceLastActivity <= decayConfig.activityThreshold) {
            activityStreak[user]++;
            reputations[user].baseScore += ACTIVITY_BONUS * activityStreak[user];
        } else {
            activityStreak[user] = 1;
            reputations[user].baseScore += ACTIVITY_BONUS;
        }
        
        reputations[user].lastActivity = block.timestamp;
        reputations[user].lastUpdate = block.timestamp;
        
        emit ActivityRecorded(user, activityStreak[user]);
        emit ReputationUpdated(user, reputations[user].baseScore, 0);
    }
    
    /**
     * @dev Aplica decay a un usuario específico
     * @param user Dirección del usuario
     */
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
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Obtiene la reputación de un usuario
     * @param user Dirección del usuario
     * @return score Puntuación actual
     * @return endorsementCount Número de endorsements
     * @return isVerified Estado de verificación
     * @return verificationLevel Nivel de verificación
     * @return userActivityStreak Racha de actividad
     * @return timeSinceLastActivity Tiempo desde última actividad
     */
    function getReputation(address user) external view returns (
        uint256 score,
        uint256 endorsementCount,
        bool isVerified,
        uint8 verificationLevel,
        uint256 userActivityStreak,
        uint256 timeSinceLastActivity
    ) {
        score = calculateDecay(user);
        endorsementCount = reputations[user].endorsementCount;
        isVerified = reputations[user].isVerified;
        verificationLevel = reputations[user].verificationLevel;
        userActivityStreak = activityStreak[user];
        timeSinceLastActivity = block.timestamp - reputations[user].lastActivity;
    }
    
    /**
     * @dev Obtiene reputación detallada
     * @param user Dirección del usuario
     * @return baseScore Puntuación base
     * @return timeDecay Puntuación después del decay
     * @return totalScore Puntuación total
     * @return lastUpdate Última actualización
     * @return lastActivity Última actividad
     */
    function getDetailedReputation(address user) external view returns (
        uint256 baseScore,
        uint256 timeDecay,
        uint256 totalScore,
        uint256 lastUpdate,
        uint256 lastActivity
    ) {
        baseScore = reputations[user].baseScore;
        timeDecay = calculateDecay(user);
        totalScore = timeDecay;
        lastUpdate = reputations[user].lastUpdate;
        lastActivity = reputations[user].lastActivity;
    }
    
    /**
     * @dev Verifica si un usuario ha sido endorsado por otro
     * @param user Usuario endorsado
     * @param endorser Usuario que endorsó
     * @return Si ha sido endorsado
     */
    function isEndorsedBy(address user, address endorser) external view returns (bool) {
        return reputations[user].endorsers[endorser];
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Actualiza configuración de decay
     * @param _decayPeriod Nuevo período de decay
     * @param _maxDecayPercent Nuevo porcentaje máximo de decay
     * @param _activityThreshold Nuevo umbral de actividad
     */
    function updateDecayConfig(
        uint256 _decayPeriod,
        uint256 _maxDecayPercent,
        uint256 _activityThreshold
    ) external onlyOwner {
        require(_maxDecayPercent <= 50, "Max decay too high");
        require(_activityThreshold <= 30 days, "Activity threshold too high");
        
        decayConfig.decayPeriod = _decayPeriod;
        decayConfig.maxDecayPercent = _maxDecayPercent;
        decayConfig.activityThreshold = _activityThreshold;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Verifica ZK proof (simplificado)
     * @param proof Datos del proof
     * @return Si el proof es válido
     */
    function verifyZKProof(bytes memory proof) internal pure returns (bool) {
        // En producción, integrar con Semaphore o Circom
        // Para testing, aceptar cualquier proof no vacío
        return proof.length > 0;
    }
}
