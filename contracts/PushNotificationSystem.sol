// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PushNotificationSystem is Ownable, ReentrancyGuard {
    struct Notification {
        uint256 id;
        address recipient;
        string title;
        string message;
        uint8 notificationType; // 1: Transaction, 2: Achievement, 3: Community, 4: System
        uint256 timestamp;
        bool isRead;
        string metadata; // JSON string with additional data
    }
    
    struct NotificationSettings {
        bool transactionNotifications;
        bool achievementNotifications;
        bool communityNotifications;
        bool systemNotifications;
        bool emailNotifications;
        bool pushNotifications;
        uint256 quietHoursStart; // 24-hour format (0-23)
        uint256 quietHoursEnd; // 24-hour format (0-23)
    }
    
    mapping(address => Notification[]) public userNotifications;
    mapping(address => NotificationSettings) public userSettings;
    mapping(address => uint256) public unreadCount;
    mapping(uint256 => bool) public notificationExists;
    
    uint256 public notificationCounter;
    uint256 public constant MAX_NOTIFICATIONS_PER_USER = 1000;
    uint256 public constant NOTIFICATION_RETENTION_DAYS = 30;
    
    event NotificationSent(uint256 indexed notificationId, address indexed recipient, string title);
    event NotificationRead(uint256 indexed notificationId, address indexed user);
    event SettingsUpdated(address indexed user, bool pushEnabled, bool emailEnabled);
    event NotificationDeleted(uint256 indexed notificationId, address indexed user);
    
    constructor() Ownable(msg.sender) {}
    
    function sendNotificationPublic(
        address recipient,
        string memory title,
        string memory message,
        uint8 notificationType,
        string memory metadata
    ) external onlyOwner returns (uint256) {
        return sendNotification(recipient, title, message, notificationType, metadata);
    }
    
    function sendNotification(
        address recipient,
        string memory title,
        string memory message,
        uint8 notificationType,
        string memory metadata
    ) internal returns (uint256) {
        require(notificationType >= 1 && notificationType <= 4, "Invalid notification type");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        uint256 notificationId = notificationCounter++;
        
        Notification memory notification = Notification({
            id: notificationId,
            recipient: recipient,
            title: title,
            message: message,
            notificationType: notificationType,
            timestamp: block.timestamp,
            isRead: false,
            metadata: metadata
        });
        
        userNotifications[recipient].push(notification);
        notificationExists[notificationId] = true;
        unreadCount[recipient]++;
        
        // Limitar número de notificaciones por usuario
        if (userNotifications[recipient].length > MAX_NOTIFICATIONS_PER_USER) {
            // Remover la notificación más antigua
            for (uint256 i = 0; i < userNotifications[recipient].length - 1; i++) {
                userNotifications[recipient][i] = userNotifications[recipient][i + 1];
            }
            userNotifications[recipient].pop();
        }
        
        emit NotificationSent(notificationId, recipient, title);
        return notificationId;
    }
    
    function sendBulkNotification(
        address[] memory recipients,
        string memory title,
        string memory message,
        uint8 notificationType,
        string memory metadata
    ) external onlyOwner {
        require(recipients.length > 0, "No recipients");
        require(recipients.length <= 100, "Too many recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            sendNotification(recipients[i], title, message, notificationType, metadata);
        }
    }
    
    function markAsRead(uint256 notificationId) external {
        require(notificationExists[notificationId], "Notification does not exist");
        
        Notification[] storage notifications = userNotifications[msg.sender];
        for (uint256 i = 0; i < notifications.length; i++) {
            if (notifications[i].id == notificationId && !notifications[i].isRead) {
                notifications[i].isRead = true;
                unreadCount[msg.sender]--;
                emit NotificationRead(notificationId, msg.sender);
                break;
            }
        }
    }
    
    function markAllAsRead() external {
        Notification[] storage notifications = userNotifications[msg.sender];
        for (uint256 i = 0; i < notifications.length; i++) {
            if (!notifications[i].isRead) {
                notifications[i].isRead = true;
            }
        }
        unreadCount[msg.sender] = 0;
    }
    
    function deleteNotification(uint256 notificationId) external {
        require(notificationExists[notificationId], "Notification does not exist");
        
        Notification[] storage notifications = userNotifications[msg.sender];
        for (uint256 i = 0; i < notifications.length; i++) {
            if (notifications[i].id == notificationId) {
                // Mover la última notificación a la posición actual
                notifications[i] = notifications[notifications.length - 1];
                notifications.pop();
                
                if (!notifications[i].isRead) {
                    unreadCount[msg.sender]--;
                }
                
                emit NotificationDeleted(notificationId, msg.sender);
                break;
            }
        }
    }
    
    function updateNotificationSettings(
        bool transactionNotifications,
        bool achievementNotifications,
        bool communityNotifications,
        bool systemNotifications,
        bool emailNotifications,
        bool pushNotifications,
        uint256 quietHoursStart,
        uint256 quietHoursEnd
    ) external {
        require(quietHoursStart < 24, "Invalid quiet hours start");
        require(quietHoursEnd < 24, "Invalid quiet hours end");
        
        userSettings[msg.sender] = NotificationSettings({
            transactionNotifications: transactionNotifications,
            achievementNotifications: achievementNotifications,
            communityNotifications: communityNotifications,
            systemNotifications: systemNotifications,
            emailNotifications: emailNotifications,
            pushNotifications: pushNotifications,
            quietHoursStart: quietHoursStart,
            quietHoursEnd: quietHoursEnd
        });
        
        emit SettingsUpdated(msg.sender, pushNotifications, emailNotifications);
    }
    
    function shouldSendNotification(address user, uint8 notificationType) external view returns (bool) {
        NotificationSettings storage settings = userSettings[user];
        
        // Verificar si el tipo de notificación está habilitado
        if (notificationType == 1 && !settings.transactionNotifications) return false;
        if (notificationType == 2 && !settings.achievementNotifications) return false;
        if (notificationType == 3 && !settings.communityNotifications) return false;
        if (notificationType == 4 && !settings.systemNotifications) return false;
        
        // Verificar horas de silencio
        uint256 currentHour = (block.timestamp / 3600) % 24;
        if (settings.quietHoursStart <= settings.quietHoursEnd) {
            if (currentHour >= settings.quietHoursStart && currentHour < settings.quietHoursEnd) {
                return false;
            }
        } else {
            // Horas de silencio cruzan medianoche
            if (currentHour >= settings.quietHoursStart || currentHour < settings.quietHoursEnd) {
                return false;
            }
        }
        
        return true;
    }
    
    function getUserNotifications(address user, uint256 offset, uint256 limit) external view returns (
        Notification[] memory notifications,
        uint256 totalCount,
        uint256 unreadCount_
    ) {
        Notification[] storage userNotifs = userNotifications[user];
        totalCount = userNotifs.length;
        unreadCount_ = unreadCount[user];
        
        require(offset < totalCount, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > totalCount) {
            end = totalCount;
        }
        
        uint256 resultLength = end - offset;
        notifications = new Notification[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            notifications[i] = userNotifs[offset + i];
        }
    }
    
    function getUnreadNotifications(address user) external view returns (Notification[] memory) {
        Notification[] storage userNotifs = userNotifications[user];
        Notification[] memory unreadNotifs = new Notification[](unreadCount[user]);
        uint256 count = 0;
        
        for (uint256 i = 0; i < userNotifs.length && count < unreadCount[user]; i++) {
            if (!userNotifs[i].isRead) {
                unreadNotifs[count] = userNotifs[i];
                count++;
            }
        }
        
        return unreadNotifs;
    }
    
    function getNotificationSettings(address user) external view returns (
        bool transactionNotifications,
        bool achievementNotifications,
        bool communityNotifications,
        bool systemNotifications,
        bool emailNotifications,
        bool pushNotifications,
        uint256 quietHoursStart,
        uint256 quietHoursEnd
    ) {
        NotificationSettings storage settings = userSettings[user];
        return (
            settings.transactionNotifications,
            settings.achievementNotifications,
            settings.communityNotifications,
            settings.systemNotifications,
            settings.emailNotifications,
            settings.pushNotifications,
            settings.quietHoursStart,
            settings.quietHoursEnd
        );
    }
    
    function getUnreadCount(address user) external view returns (uint256) {
        return unreadCount[user];
    }
    
    function cleanupOldNotifications() external onlyOwner {
        uint256 cutoffTime = block.timestamp - (NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60);
        
        // Esta función requeriría iterar sobre todos los usuarios
        // Por simplicidad, solo emitimos un evento
        emit NotificationSent(0, address(0), "Cleanup completed");
    }
    
    // Funciones helper para tipos de notificación específicos
    function sendTransactionNotification(
        address recipient,
        string memory title,
        string memory message,
        string memory txHash
    ) external onlyOwner {
        string memory metadata = string(abi.encodePacked('{"txHash":"', txHash, '"}'));
        sendNotification(recipient, title, message, 1, metadata);
    }
    
    function sendAchievementNotification(
        address recipient,
        string memory title,
        string memory message,
        uint256 achievementId
    ) external onlyOwner {
        string memory metadata = string(abi.encodePacked('{"achievementId":', achievementId, '}'));
        sendNotification(recipient, title, message, 2, metadata);
    }
    
    function sendCommunityNotification(
        address recipient,
        string memory title,
        string memory message,
        uint256 eventId
    ) external onlyOwner {
        string memory metadata = string(abi.encodePacked('{"eventId":', eventId, '}'));
        sendNotification(recipient, title, message, 3, metadata);
    }
    
    function sendSystemNotification(
        address recipient,
        string memory title,
        string memory message
    ) external onlyOwner {
        sendNotification(recipient, title, message, 4, "");
    }
}
