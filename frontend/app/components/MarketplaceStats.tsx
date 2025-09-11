'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'

interface Stat {
  id: string
  label: string
  value: number
  unit: string
  change: number
  icon: string
  color: string
}

export function MarketplaceStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      id: 'total-services',
      label: 'Servicios Activos',
      value: 0,
      unit: '',
      change: 12,
      icon: '💼',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'total-volume',
      label: 'Volumen Total',
      value: 0,
      unit: 'K ARB',
      change: 8.5,
      icon: '💰',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'active-users',
      label: 'Usuarios Activos',
      value: 0,
      unit: '',
      change: 15,
      icon: '👥',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'avg-rating',
      label: 'Rating Promedio',
      value: 0,
      unit: '/5',
      change: 0.2,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500'
    }
  ])

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simular carga de datos
    const loadStats = async () => {
      setIsAnimating(true)
      
      // Animar los valores
      const targetValues = [47, 45, 1250, 4.8]
      
      for (let i = 0; i < stats.length; i++) {
        const targetValue = targetValues[i]
        const duration = 2000
        const steps = 60
        const stepValue = targetValue / steps
        const stepDuration = duration / steps
        
        for (let step = 0; step <= steps; step++) {
          setTimeout(() => {
            setStats(prev => prev.map((stat, index) => 
              index === i 
                ? { ...stat, value: Math.min(step * stepValue, targetValue) }
                : stat
            ))
          }, step * stepDuration)
        }
      }
      
      setTimeout(() => setIsAnimating(false), 2000)
    }

    loadStats()
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <GlassCard
          key={stat.id}
          className={`p-6 hover:scale-105 transition-all duration-500 ${
            isAnimating ? 'animate-neural-pulse-glow' : ''
          }`}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="space-y-4">
            {/* Icono y cambio */}
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white text-2xl`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                stat.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>{stat.change > 0 ? '↗' : '↘'}</span>
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>

            {/* Valor principal */}
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">
                {stat.value.toFixed(stat.id === 'avg-rating' ? 1 : 0)}
                <span className="text-white/60 text-lg ml-1">{stat.unit}</span>
              </div>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </div>

            {/* Barra de progreso animada */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-2000 ease-out`}
                style={{ 
                  width: `${Math.min((stat.value / (stat.id === 'avg-rating' ? 5 : 100)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
