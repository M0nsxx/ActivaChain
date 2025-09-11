'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  title: string
  message: string
  duration?: number
  hash?: string
  autoClose?: boolean
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
  currentNetwork?: string
}

// Función helper para obtener la URL del explorer
const getExplorerUrl = (hash: string, network?: string) => {
  if (network?.includes('Arbitrum')) {
    return `https://sepolia.arbiscan.io/tx/${hash}`
  }
  return `https://sepolia.etherscan.io/tx/${hash}`
}

export function NotificationSystem({ notifications, onRemove, currentNetwork }: NotificationSystemProps) {
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    notifications.forEach(notification => {
      if (notification.autoClose !== false && notification.type !== 'loading') {
        const duration = notification.duration || (notification.type === 'error' ? 8000 : 5000)
        const timer = setTimeout(() => {
          if (onRemove && typeof onRemove === 'function') {
            onRemove(notification.id)
          }
        }, duration)
        timers.push(timer)
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [notifications, onRemove])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '🎉'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'loading': return null
    }
  }

  const getColorClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success': 
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-100'
      case 'error': 
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30 text-red-100'
      case 'info': 
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-100'
      case 'warning': 
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-100'
      case 'loading': 
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-100'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3 
            }}
            className={`
              relative p-4 rounded-xl border backdrop-blur-md
              ${getColorClasses(notification.type)}
              shadow-2xl shadow-black/20
              cursor-pointer hover:scale-[1.02] transition-transform duration-200
            `}
            onClick={() => onRemove(notification.id)}
          >
            {/* Botón cerrar */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(notification.id)
              }}
              className="absolute top-2 right-2 text-white/60 hover:text-white/90 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-3 pr-6">
              {notification.type === 'loading' ? (
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex-shrink-0 text-lg">
                  {getIcon(notification.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-white/90 leading-relaxed">
                  {notification.message}
                </p>
                
                {/* Transaction hash link */}
                {notification.hash && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <a
                      href={getExplorerUrl(notification.hash, currentNetwork)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Ver en Explorer</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar for auto-close notifications */}
            {notification.type !== 'loading' && notification.autoClose !== false && (
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ 
                  duration: notification.duration ? notification.duration / 1000 : (notification.type === 'error' ? 8 : 5),
                  ease: "linear" 
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook para manejar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11)
    setNotifications(prev => [...prev, { ...notification, id }])
    return id
  }

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates }
          : notification
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    clearAll
  }
}