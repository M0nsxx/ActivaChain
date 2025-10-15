'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import GlassCard from './GlassCard'

interface Notification {
  id: number
  title: string
  message: string
  notificationType: number
  timestamp: number
  isRead: boolean
}

export default function NotificationSummary() {
  const { address, isConnected } = useAccount()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isConnected && address) {
      loadRecentNotifications()
    }
  }, [isConnected, address])

  const loadRecentNotifications = () => {
    if (!address) return
    
    const walletShort = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: '🎉 ¡Nuevo Achievement!',
        message: `¡Felicitaciones ${walletShort}! Has desbloqueado "Blockchain Explorer"`,
        notificationType: 2,
        timestamp: Date.now() - 3600000,
        isRead: false
      },
      {
        id: 2,
        title: '💰 Transacción Completada',
        message: 'Tu servicio "Desarrollo Smart Contract" ha sido completado',
        notificationType: 1,
        timestamp: Date.now() - 7200000,
        isRead: true
      },
      {
        id: 3,
        title: '👥 Nuevo Evento',
        message: `Workshop "DeFi para Principiantes" - Mañana 3PM`,
        notificationType: 3,
        timestamp: Date.now() - 10800000,
        isRead: false
      }
    ]
    
    setNotifications(mockNotifications.slice(0, 3)) // Solo mostrar las 3 más recientes
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }

  const getNotificationIcon = (type: number) => {
    switch (type) {
      case 1: return '💰'
      case 2: return '🎉'
      case 3: return '👥'
      case 4: return '🔔'
      default: return '📢'
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

  if (!isConnected) {
    return null
  }

  return (
    <GlassCard className="p-6 notification-summary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="animate-dashboard-float">🔔</span>
          Notificaciones Recientes
        </h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-dashboard-pulse">
            {unreadCount} nuevas
          </span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-white/60">No hay notificaciones recientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all duration-300 hover:bg-white/5 ${
                notification.isRead 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/10 border-white/20 shadow-lg'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-lg">
                  {getNotificationIcon(notification.notificationType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-semibold ${
                      notification.isRead ? 'text-white/80' : 'text-white'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-white/50">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className={`text-xs ${
                    notification.isRead ? 'text-white/60' : 'text-white/70'
                  }`}>
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <a 
          href="/notificaciones"
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors flex items-center gap-1"
        >
          Ver todas las notificaciones
          <span>→</span>
        </a>
      </div>
    </GlassCard>
  )
}
