'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'

interface StatItem {
  id: string
  label: string
  value: number
  unit: string
  icon: string
  color: string
  trend: 'up' | 'down' | 'stable'
  change: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'reputation',
      label: 'Reputación',
      value: 85,
      unit: '/100',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      trend: 'up',
      change: 5
    },
    {
      id: 'earnings',
      label: 'Ganancias',
      value: 1250,
      unit: ' ARB',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      change: 12
    },
    {
      id: 'services',
      label: 'Servicios',
      value: 12,
      unit: ' completados',
      icon: '💼',
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      change: 2
    },
    {
      id: 'courses',
      label: 'Cursos',
      value: 3,
      unit: ' completados',
      icon: '🎓',
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      change: 1
    }
  ])

  const [animatedStats, setAnimatedStats] = useState<StatItem[]>(stats)

  useEffect(() => {
    // Animar los valores de las estadísticas
    const animateStats = () => {
      setAnimatedStats(prevStats => 
        prevStats.map(stat => {
          const targetValue = stats.find(s => s.id === stat.id)?.value || stat.value
          const currentValue = stat.value
          const difference = targetValue - currentValue
          
          if (Math.abs(difference) > 0.1) {
            return {
              ...stat,
              value: currentValue + (difference * 0.1)
            }
          }
          return stat
        })
      )
    }

    const interval = setInterval(animateStats, 50)
    return () => clearInterval(interval)
  }, [stats])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {animatedStats.map((stat, index) => (
        <GlassCard 
          key={stat.id} 
          className="p-6 text-center dashboard-hover"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="space-y-4">
            <div className="text-4xl animate-dashboard-float">
              {stat.icon}
            </div>
            
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.id === 'earnings' ? `$${Math.round(stat.value)}` : Math.round(stat.value)}
                <span className="text-lg text-white/70">{stat.unit}</span>
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                stat.trend === 'up' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : stat.trend === 'down'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                <span className={stat.trend === 'up' ? 'animate-dashboard-pulse' : ''}>
                  {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                </span>
                {stat.change}%
              </div>
            </div>

            {/* Barra de progreso animada */}
            <div className="progress-bar h-2">
              <div 
                className={`progress-fill bg-gradient-to-r ${stat.color}`}
                style={{ 
                  width: `${(() => {
                    const maxValue = stat.id === 'reputation' ? 100 : 
                                   stat.id === 'earnings' ? 2000 : 
                                   stat.id === 'services' ? 20 : 10;
                    return Math.min((stat.value / maxValue) * 100, 100);
                  })()}%` 
                }}
              ></div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
