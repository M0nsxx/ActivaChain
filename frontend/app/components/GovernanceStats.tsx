'use client'

import GlassCard from './GlassCard'
import { useGovernanceStats } from '../lib/useGovernanceStats'

interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  executedProposals: number
  totalVoters: number
  treasuryBalance: string
  participationRate: number
  averageVotingPower: string
  topProposer: string
  recentActivity: Array<{
    type: 'proposal' | 'vote' | 'execution'
    description: string
    timestamp: number
    user: string
  }>
}

export default function GovernanceStats() {
  const { stats, isLoading, isConnected } = useGovernanceStats()

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    return `${minutes}m`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal': return '✨'
      case 'vote': return '🗳️'
      case 'execution': return '⚡'
      default: return '📋'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'proposal': return 'text-purple-400'
      case 'vote': return 'text-green-400'
      case 'execution': return 'text-blue-400'
      default: return 'text-white/60'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-8 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-white mb-2">{stats.totalProposals}</div>
          <p className="text-white/70">Propuestas Totales</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.activeProposals}</div>
          <p className="text-white/70">Activas</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-blue-400 mb-2">{stats.executedProposals}</div>
          <p className="text-white/70">Ejecutadas</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-pink-400 mb-2">{stats.totalVoters.toLocaleString()}</div>
          <p className="text-white/70">Votantes</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
        </GlassCard>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📊 Métricas de Participación</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Tasa de participación</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.participationRate}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-green-400">{stats.participationRate}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/80">Poder de votación promedio</span>
              <span className="text-2xl font-bold text-purple-400">{stats.averageVotingPower} ACTIVA</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/80">Balance del treasury</span>
              <span className="text-2xl font-bold text-pink-400">${stats.treasuryBalance}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/80">Top proponente</span>
              <span className="text-lg font-semibold text-white/80">{stats.topProposer}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">⚡ Actividad Reciente</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-relaxed">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${getActivityColor(activity.type)}`}>
                      {activity.user}
                    </span>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="text-white/50 text-xs">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Gráfico de tendencias */}
      <GlassCard className="p-8">
        <h3 className="text-2xl font-bold text-white mb-6">📈 Tendencias de Gobernanza</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Propuestas por Mes</h4>
            <div className="space-y-2">
              {[8, 12, 15, 18, 24].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-16">Mes {index + 1}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(value / 24) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Participación</h4>
            <div className="space-y-2">
              {[65, 72, 78, 75, 78.5].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-16">Mes {index + 1}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">{value}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-4">Treasury Growth</h4>
            <div className="space-y-2">
              {[85000, 95000, 105000, 115000, 125000].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-16">Mes {index + 1}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${((value - 85000) / 40000) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">${(value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
