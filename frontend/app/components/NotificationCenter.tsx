'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para PushNotificationSystem
const NOTIFICATION_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getUserNotifications",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "recipient", "type": "address"},
          {"name": "title", "type": "string"},
          {"name": "message", "type": "string"},
          {"name": "notificationType", "type": "uint8"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "isRead", "type": "bool"},
          {"name": "metadata", "type": "string"}
        ],
        "name": "notifications",
        "type": "tuple[]"
      },
      {"name": "totalCount", "type": "uint256"},
      {"name": "unreadCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "notificationId", "type": "uint256"}],
    "name": "markAsRead",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "markAllAsRead",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bool", "name": "transactionNotifications", "type": "bool"},
      {"internalType": "bool", "name": "achievementNotifications", "type": "bool"},
      {"internalType": "bool", "name": "communityNotifications", "type": "bool"},
      {"internalType": "bool", "name": "systemNotifications", "type": "bool"},
      {"internalType": "bool", "name": "emailNotifications", "type": "bool"},
      {"internalType": "bool", "name": "pushNotifications", "type": "bool"},
      {"internalType": "uint256", "name": "quietHoursStart", "type": "uint256"},
      {"internalType": "uint256", "name": "quietHoursEnd", "type": "uint256"}
    ],
    "name": "updateNotificationSettings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

interface Notification {
  id: number
  recipient: string
  title: string
  message: string
  notificationType: number
  timestamp: number
  isRead: boolean
  metadata: string
}

interface NotificationSettings {
  transactionNotifications: boolean
  achievementNotifications: boolean
  communityNotifications: boolean
  systemNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  quietHoursStart: number
  quietHoursEnd: number
}

export default function NotificationCenter() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { addNotification } = useNotifications()
  
  const contracts = useContracts()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [settings, setSettings] = useState<NotificationSettings>({
    transactionNotifications: true,
    achievementNotifications: true,
    communityNotifications: true,
    systemNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
    quietHoursStart: 22,
    quietHoursEnd: 8
  })
  const [showSettings, setShowSettings] = useState(false)

  // Cargar notificaciones del usuario
  useEffect(() => {
    if (address && contracts.pushNotificationSystem) {
      loadNotifications()
    }
  }, [address, contracts.pushNotificationSystem])

  const loadNotifications = async () => {
    // Simular carga de notificaciones
    const mockNotifications: Notification[] = [
      {
        id: 1,
        recipient: address || '',
        title: '🎉 ¡Nuevo Achievement Desbloqueado!',
        message: 'Has completado tu primer curso de blockchain',
        notificationType: 2,
        timestamp: Date.now() - 3600000,
        isRead: false,
        metadata: '{"achievementId": 1}'
      },
      {
        id: 2,
        recipient: address || '',
        title: '💰 Transacción Completada',
        message: 'Tu servicio "Desarrollo Smart Contract" ha sido completado',
        notificationType: 1,
        timestamp: Date.now() - 7200000,
        isRead: true,
        metadata: '{"txHash": "0x123..."}'
      },
      {
        id: 3,
        recipient: address || '',
        title: '👥 Nuevo Evento Comunitario',
        message: 'Workshop "DeFi para Principiantes" - Mañana 3PM',
        notificationType: 3,
        timestamp: Date.now() - 10800000,
        isRead: false,
        metadata: '{"eventId": 5}'
      },
      {
        id: 4,
        recipient: address || '',
        title: '🔔 Actualización del Sistema',
        message: 'Nuevas funcionalidades disponibles en ActivaChains',
        notificationType: 4,
        timestamp: Date.now() - 14400000,
        isRead: true,
        metadata: '{}'
      }
    ]
    
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }

  const markAsRead = async (notificationId: number) => {
    if (!isConnected || !contracts.pushNotificationSystem) {
      addNotification('error', 'Conecta tu wallet primero')
      return
    }

    try {
      await writeContract({
        address: contracts.pushNotificationSystem,
        abi: NOTIFICATION_ABI,
        functionName: 'markAsRead',
        args: [notificationId]
      })

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => prev - 1)
      addNotification('success', 'Notificación marcada como leída')
    } catch (err) {
      console.error('Error marking notification as read:', err)
      addNotification('error', 'Error al marcar notificación')
    }
  }

  const markAllAsRead = async () => {
    if (!isConnected || !contracts.pushNotificationSystem) {
      addNotification('error', 'Conecta tu wallet primero')
      return
    }

    try {
      await writeContract({
        address: contracts.pushNotificationSystem,
        abi: NOTIFICATION_ABI,
        functionName: 'markAllAsRead',
        args: []
      })

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      addNotification('success', 'Todas las notificaciones marcadas como leídas')
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      addNotification('error', 'Error al marcar todas las notificaciones')
    }
  }

  const updateSettings = async () => {
    if (!isConnected || !contracts.pushNotificationSystem) {
      addNotification('error', 'Conecta tu wallet primero')
      return
    }

    try {
      await writeContract({
        address: contracts.pushNotificationSystem,
        abi: NOTIFICATION_ABI,
        functionName: 'updateNotificationSettings',
        args: [
          settings.transactionNotifications,
          settings.achievementNotifications,
          settings.communityNotifications,
          settings.systemNotifications,
          settings.emailNotifications,
          settings.pushNotifications,
          settings.quietHoursStart,
          settings.quietHoursEnd
        ]
      })

      addNotification('success', 'Configuración actualizada')
      setShowSettings(false)
    } catch (err) {
      console.error('Error updating settings:', err)
      addNotification('error', 'Error al actualizar configuración')
    }
  }

  const getNotificationIcon = (type: number) => {
    switch (type) {
      case 1: return '💰' // Transaction
      case 2: return '🎉' // Achievement
      case 3: return '👥' // Community
      case 4: return '🔔' // System
      default: return '📢'
    }
  }

  const getNotificationTypeName = (type: number) => {
    switch (type) {
      case 1: return 'Transacción'
      case 2: return 'Achievement'
      case 3: return 'Comunidad'
      case 4: return 'Sistema'
      default: return 'General'
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    return 'Ahora'
  }

  return (
    <div className="space-y-8">
      <NotificationSystem />
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🔔 Centro de Notificaciones
        </h1>
        <p className="text-white/70 text-lg">
          Gestiona tus notificaciones y configuraciones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">📬</div>
          <div className="text-2xl font-bold text-white">{notifications.length}</div>
          <div className="text-white/60">Total Notificaciones</div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">🔴</div>
          <div className="text-2xl font-bold text-white">{unreadCount}</div>
          <div className="text-white/60">No Leídas</div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">⚙️</div>
          <div className="text-2xl font-bold text-white">
            {Object.values(settings).filter(Boolean).length}
          </div>
          <div className="text-white/60">Configuraciones Activas</div>
        </GlassCard>
      </div>

      {/* Controls */}
      <GlassCard gradient className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              ⚙️ Configuración
            </button>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isPending ? 'Procesando...' : 'Marcar Todas como Leídas'}
              </button>
            )}
          </div>
          
          <div className="text-white/60 text-sm">
            Última actualización: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </GlassCard>

      {/* Settings Panel */}
      {showSettings && (
        <GlassCard gradient className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            ⚙️ Configuración de Notificaciones
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Tipos de Notificaciones</h3>
              
              {[
                { key: 'transactionNotifications', label: '💰 Transacciones', icon: '💰' },
                { key: 'achievementNotifications', label: '🎉 Achievements', icon: '🎉' },
                { key: 'communityNotifications', label: '👥 Comunidad', icon: '👥' },
                { key: 'systemNotifications', label: '🔔 Sistema', icon: '🔔' }
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof NotificationSettings] as boolean}
                    onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">{icon} {label}</span>
                </label>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Canales de Notificación</h3>
              
              {[
                { key: 'emailNotifications', label: '📧 Email', icon: '📧' },
                { key: 'pushNotifications', label: '📱 Push', icon: '📱' }
              ].map(({ key, label, icon }) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof NotificationSettings] as boolean}
                    onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-5 h-5 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
                  />
                  <span className="text-white">{icon} {label}</span>
                </label>
              ))}
              
              <div className="space-y-2">
                <label className="text-white text-sm">Horas de Silencio</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50"
                    placeholder="Inicio"
                  />
                  <span className="text-white/60 self-center">-</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50"
                    placeholder="Fin"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowSettings(false)}
              className="px-6 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={updateSettings}
              disabled={isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isPending ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </GlassCard>
      )}

      {/* Notifications List */}
      <GlassCard gradient className="p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          📬 Notificaciones Recientes
        </h2>
        
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl border transition-all duration-300 hover:bg-white/5 ${
                  notification.isRead 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white/10 border-white/20 shadow-lg'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.notificationType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${
                        notification.isRead ? 'text-white/80' : 'text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-white/50">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      notification.isRead ? 'text-white/60' : 'text-white/80'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                          {getNotificationTypeName(notification.notificationType)}
                        </span>
                        {notification.metadata && notification.metadata !== '{}' && (
                          <span className="text-xs text-white/50">
                            📎 Con metadatos
                          </span>
                        )}
                      </div>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
