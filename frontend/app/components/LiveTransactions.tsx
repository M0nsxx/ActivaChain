'use client'

import GlassCard from './GlassCard'
import { useLiveTransactions } from '../lib/useLiveTransactions'

interface Transaction {
  id: string
  type: 'purchase' | 'completion' | 'creation' | 'vote' | 'proposal'
  service: string
  user: string
  amount: string
  timestamp: number
  status: 'pending' | 'completed' | 'processing'
  hash?: string
}

export function LiveTransactions() {
  const { transactions, isLive, toggleLive, isConnected } = useLiveTransactions()

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '💎'
      case 'completion': return '✅'
      case 'creation': return '✨'
      case 'vote': return '🗳️'
      case 'proposal': return '📋'
      default: return '🔄'
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'from-blue-500 to-cyan-500'
      case 'completion': return 'from-green-500 to-emerald-500'
      case 'creation': return 'from-purple-500 to-pink-500'
      case 'vote': return 'from-yellow-500 to-orange-500'
      case 'proposal': return 'from-indigo-500 to-purple-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    
    if (seconds < 60) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes}m`
    return `Hace ${Math.floor(minutes / 60)}h`
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Transacciones en Vivo</h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
              isLive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              {isLive ? 'EN VIVO' : 'PAUSADO'}
            </div>
          </div>
          <button
            onClick={toggleLive}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isLive ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Lista de transacciones */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex items-center gap-4 p-4 glass-morphism rounded-xl transition-all duration-500 ${
                index === 0 ? 'animate-neural-pulse-glow' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icono de transacción */}
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getTransactionColor(transaction.type)} text-white text-lg`}>
                {getTransactionIcon(transaction.type)}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold truncate">{transaction.service}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400'
                      : transaction.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {transaction.status === 'completed' ? 'Completado' : 
                     transaction.status === 'processing' ? 'Procesando' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-white/60 text-sm truncate">{transaction.user}</p>
              </div>

              {/* Monto y tiempo */}
              <div className="text-right">
                <p className="text-white font-bold">{transaction.amount}</p>
                <p className="text-white/50 text-xs">{formatTime(transaction.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Últimas 24 horas</span>
            <span>Total: $45,230 USDC</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
