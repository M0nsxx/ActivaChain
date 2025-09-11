// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GamificationSystem is Ownable, ReentrancyGuard {
    struct Achievement {
        uint256 id;
        string name;
        string description;
        string icon;
        uint256 points;
        uint256 category; // 1: Educacion, 2: Comunidad, 3: Trading, 4: Desarrollo
        bool isActive;
        mapping(address => bool) unlocked;
        uint256 unlockCount;
    }
    
    struct Badge {
        uint256 id;
        string name;
        string description;
        string imageURI;
        uint256 rarity; // 1: Comun, 2: Raro, 3: Epico, 4: Legendario
        uint256 requirements;
        bool isActive;
        mapping(address => bool) earned;
        uint256 earnCount;
    }
    
    struct Leaderboard {
        address user;
        uint256 totalPoints;
        uint256 level;
        uint256 achievements;
        uint256 badges;
        uint256 lastUpdate;
    }
    
    struct UserProfile {
        uint256 totalPoints;
        uint256 level;
        uint256 experience;
        uint256 achievements;
        uint256 badges;
        uint256 streak;
        uint256 lastActivity;
        mapping(uint256 => bool) unlockedAchievements;
        mapping(uint256 => bool) earnedBadges;
    }
    
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Achievement) public achievements;
    mapping(uint256 => Badge) public badges;
    mapping(uint256 => Leaderboard) public leaderboard;
    
    uint256 public achievementCounter;
    uint256 public badgeCounter;
    uint256 public leaderboardCounter;
    
    uint256 public constant POINTS_PER_LEVEL = 1000;
    uint256 public constant STREAK_BONUS = 50;
    uint256 public constant DAILY_ACTIVITY_POINTS = 10;
    uint256 public constant WEEKLY_BONUS = 100;
    
    event AchievementUnlocked(address indexed user, uint256 achievementId, uint256 points);
    event BadgeEarned(address indexed user, uint256 badgeId, uint256 rarity);
    event LevelUp(address indexed user, uint256 newLevel, uint256 totalPoints);
    event StreakUpdated(address indexed user, uint256 streak);
    event LeaderboardUpdated(address indexed user, uint256 position);
    
    constructor() Ownable(msg.sender) {
        initializeAchievements();
        initializeBadges();
    }
    
    function initializeAchievements() internal {
        // Logros de Educacion
        createAchievement("Primer Curso", "Completa tu primer curso", "EDU", 100, 1);
        createAchievement("Estudiante Dedicada", "Completa 5 cursos", "BOOK", 500, 1);
        createAchievement("Experta en Blockchain", "Completa 10 cursos", "TROPHY", 1000, 1);
        createAchievement("Mentora", "Ayuda a 5 mentoreadas", "MENTOR", 750, 1);
        
        // Logros de Comunidad
        createAchievement("Primera Conexion", "Conecta tu primera wallet", "LINK", 50, 2);
        createAchievement("Participante Activa", "Participa en 3 eventos", "PARTY", 300, 2);
        createAchievement("Lider Comunitaria", "Organiza un evento", "CROWN", 500, 2);
        createAchievement("Colaboradora", "Recibe 10 endorsements", "HANDSHAKE", 400, 2);
        
        // Logros de Trading
        createAchievement("Primera Transaccion", "Realiza tu primera transaccion", "MONEY", 100, 3);
        createAchievement("Traders Activa", "Realiza 10 transacciones", "CHART", 500, 3);
        createAchievement("Inversora Inteligente", "Gana $1000 en el marketplace", "DIAMOND", 1000, 3);
        createAchievement("Staker", "Stakea 1000 ACTIVA tokens", "LOCK", 600, 3);
        
        // Logros de Desarrollo
        createAchievement("Primer NFT", "Mint tu primer NFT", "ART", 150, 4);
        createAchievement("Desarrolladora", "Crea tu primer smart contract", "LIGHTNING", 800, 4);
        createAchievement("Arquitecta DeFi", "Desarrolla un protocolo DeFi", "BUILD", 1500, 4);
        createAchievement("Auditora", "Audita un smart contract", "SEARCH", 1200, 4);
    }
    
    function initializeBadges() internal {
        // Badges de Raridad
        createBadge("Nueva en Web3", "Recien llegada al ecosistema", "ipfs://newbie", 1, 0);
        createBadge("Exploradora", "Ha explorado multiples protocolos", "ipfs://explorer", 2, 500);
        createBadge("Pionera", "Una de las primeras usuarias", "ipfs://pioneer", 3, 2000);
        createBadge("Leyenda", "Una verdadera leyenda de Web3", "ipfs://legend", 4, 10000);
        
        // Badges Especiales
        createBadge("Mentora del Mes", "Mentora destacada del mes", "ipfs://mentor-month", 3, 0);
        createBadge("Desarrolladora del Ano", "Desarrolladora destacada del ano", "ipfs://dev-year", 4, 0);
        createBadge("Comunidad Activa", "Participacion excepcional en la comunidad", "ipfs://community", 2, 0);
        createBadge("Innovadora", "Ha contribuido con innovaciones", "ipfs://innovator", 3, 0);
    }
    
    function createAchievement(
        string memory name,
        string memory description,
        string memory icon,
        uint256 points,
        uint256 category
    ) internal {
        uint256 id = achievementCounter++;
        Achievement storage achievement = achievements[id];
        achievement.id = id;
        achievement.name = name;
        achievement.description = description;
        achievement.icon = icon;
        achievement.points = points;
        achievement.category = category;
        achievement.isActive = true;
    }
    
    function createBadge(
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 rarity,
        uint256 requirements
    ) internal {
        uint256 id = badgeCounter++;
        Badge storage badge = badges[id];
        badge.id = id;
        badge.name = name;
        badge.description = description;
        badge.imageURI = imageURI;
        badge.rarity = rarity;
        badge.requirements = requirements;
        badge.isActive = true;
    }
    
    function unlockAchievement(address user, uint256 achievementId) external onlyOwner {
        require(achievements[achievementId].isActive, "Achievement not active");
        require(!userProfiles[user].unlockedAchievements[achievementId], "Achievement already unlocked");
        
        userProfiles[user].unlockedAchievements[achievementId] = true;
        userProfiles[user].achievements++;
        userProfiles[user].totalPoints += achievements[achievementId].points;
        userProfiles[user].experience += achievements[achievementId].points;
        userProfiles[user].lastActivity = block.timestamp;
        
        achievements[achievementId].unlocked[user] = true;
        achievements[achievementId].unlockCount++;
        
        // Verificar si sube de nivel
        checkLevelUp(user);
        
        emit AchievementUnlocked(user, achievementId, achievements[achievementId].points);
    }
    
    function earnBadge(address user, uint256 badgeId) external onlyOwner {
        require(badges[badgeId].isActive, "Badge not active");
        require(!userProfiles[user].earnedBadges[badgeId], "Badge already earned");
        require(userProfiles[user].totalPoints >= badges[badgeId].requirements, "Requirements not met");
        
        userProfiles[user].earnedBadges[badgeId] = true;
        userProfiles[user].badges++;
        userProfiles[user].lastActivity = block.timestamp;
        
        badges[badgeId].earned[user] = true;
        badges[badgeId].earnCount++;
        
        emit BadgeEarned(user, badgeId, badges[badgeId].rarity);
    }
    
    function recordDailyActivity(address user) external onlyOwner {
        uint256 timeSinceLastActivity = block.timestamp - userProfiles[user].lastActivity;
        
        if (timeSinceLastActivity <= 25 hours) { // 25 horas para permitir flexibilidad
            userProfiles[user].streak++;
            userProfiles[user].totalPoints += DAILY_ACTIVITY_POINTS + (userProfiles[user].streak * 5);
            userProfiles[user].experience += DAILY_ACTIVITY_POINTS + (userProfiles[user].streak * 5);
        } else {
            userProfiles[user].streak = 1;
            userProfiles[user].totalPoints += DAILY_ACTIVITY_POINTS;
            userProfiles[user].experience += DAILY_ACTIVITY_POINTS;
        }
        
        userProfiles[user].lastActivity = block.timestamp;
        
        // Bonus semanal
        if (userProfiles[user].streak % 7 == 0) {
            userProfiles[user].totalPoints += WEEKLY_BONUS;
            userProfiles[user].experience += WEEKLY_BONUS;
        }
        
        checkLevelUp(user);
        updateLeaderboard(user);
        
        emit StreakUpdated(user, userProfiles[user].streak);
    }
    
    function checkLevelUp(address user) internal {
        uint256 newLevel = userProfiles[user].experience / POINTS_PER_LEVEL;
        if (newLevel > userProfiles[user].level) {
            userProfiles[user].level = newLevel;
            emit LevelUp(user, newLevel, userProfiles[user].totalPoints);
        }
    }
    
    function updateLeaderboard(address user) internal {
        // Actualizar leaderboard (simplificado)
        leaderboard[leaderboardCounter] = Leaderboard({
            user: user,
            totalPoints: userProfiles[user].totalPoints,
            level: userProfiles[user].level,
            achievements: userProfiles[user].achievements,
            badges: userProfiles[user].badges,
            lastUpdate: block.timestamp
        });
        leaderboardCounter++;
        
        emit LeaderboardUpdated(user, leaderboardCounter);
    }
    
    function getUserProfile(address user) external view returns (
        uint256 totalPoints,
        uint256 level,
        uint256 experience,
        uint256 achievements,
        uint256 badges,
        uint256 streak,
        uint256 lastActivity
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            profile.totalPoints,
            profile.level,
            profile.experience,
            profile.achievements,
            profile.badges,
            profile.streak,
            profile.lastActivity
        );
    }
    
    function getAchievementInfo(uint256 achievementId) external view returns (
        string memory name,
        string memory description,
        string memory icon,
        uint256 points,
        uint256 category,
        bool isActive,
        uint256 unlockCount
    ) {
        Achievement storage achievement = achievements[achievementId];
        return (
            achievement.name,
            achievement.description,
            achievement.icon,
            achievement.points,
            achievement.category,
            achievement.isActive,
            achievement.unlockCount
        );
    }
    
    function getBadgeInfo(uint256 badgeId) external view returns (
        string memory name,
        string memory description,
        string memory imageURI,
        uint256 rarity,
        uint256 requirements,
        bool isActive,
        uint256 earnCount
    ) {
        Badge storage badge = badges[badgeId];
        return (
            badge.name,
            badge.description,
            badge.imageURI,
            badge.rarity,
            badge.requirements,
            badge.isActive,
            badge.earnCount
        );
    }
    
    function hasAchievement(address user, uint256 achievementId) external view returns (bool) {
        return userProfiles[user].unlockedAchievements[achievementId];
    }
    
    function hasBadge(address user, uint256 badgeId) external view returns (bool) {
        return userProfiles[user].earnedBadges[badgeId];
    }
    
    function getUserAchievements(address user) external view returns (uint256[] memory) {
        uint256[] memory userAchievements = new uint256[](achievementCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < achievementCounter; i++) {
            if (userProfiles[user].unlockedAchievements[i]) {
                userAchievements[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userAchievements[i];
        }
        
        return result;
    }
    
    function getUserBadges(address user) external view returns (uint256[] memory) {
        uint256[] memory userBadges = new uint256[](badgeCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < badgeCounter; i++) {
            if (userProfiles[user].earnedBadges[i]) {
                userBadges[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userBadges[i];
        }
        
        return result;
    }
    
    function getTopUsers(uint256 limit) external view returns (Leaderboard[] memory) {
        require(limit > 0 && limit <= 100, "Invalid limit");
        
        // Ordenar por puntos (simplificado)
        Leaderboard[] memory topUsers = new Leaderboard[](limit);
        uint256 count = 0;
        
        for (uint256 i = 0; i < leaderboardCounter && count < limit; i++) {
            topUsers[count] = leaderboard[i];
            count++;
        }
        
        return topUsers;
    }
    
    function getAchievementsByCategory(uint256 category) external view returns (uint256[] memory) {
        uint256[] memory categoryAchievements = new uint256[](achievementCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < achievementCounter; i++) {
            if (achievements[i].category == category && achievements[i].isActive) {
                categoryAchievements[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = categoryAchievements[i];
        }
        
        return result;
    }
    
    function getBadgesByRarity(uint256 rarity) external view returns (uint256[] memory) {
        uint256[] memory rarityBadges = new uint256[](badgeCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < badgeCounter; i++) {
            if (badges[i].rarity == rarity && badges[i].isActive) {
                rarityBadges[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = rarityBadges[i];
        }
        
        return result;
    }
}
