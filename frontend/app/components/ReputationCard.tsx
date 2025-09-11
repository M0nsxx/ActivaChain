'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import GlassCard from './GlassCard'
import { useReputation } from '../lib/useReputation'

interface ReputationData {
  score: number
  level: string
  badges: Array<{
    name: string
    icon: string
    description: string
    earned: boolean
    rarity?: number
  }>
  achievements: Array<{
    name: string
    description: string
    icon: string
    points: number
    unlocked: boolean
  }>
  nextLevel: {
    required: number
    progress: number
  }
  isVerified: boolean
  verificationLevel: number
  endorsementCount: number
  activityStreak: number
}

export function ReputationCard() {
  const { address } = useAccount()
  const { reputationData, isLoading, isConnected } = useReputation()
  const [reputation, setReputation] = useState<ReputationData>({
    score: 0,
    level: 'Principiante',
    badges: [],
    achievements: [],
    nextLevel: { required: 100, progress: 0 },
    isVerified: false,
    verificationLevel: 0,
    endorsementCount: 0,
    activityStreak: 0
  })

  useEffect(() => {
    if (reputationData && !isLoading) {
      // Animar el score cuando se carguen los datos reales
      let currentScore = 0
      const targetScore = reputationData.score
      const duration = 2000
      const steps = 60
      const stepValue = targetScore / steps
      const stepDuration = duration / steps

      for (let step = 0; step <= steps; step++) {
        setTimeout(() => {
          currentScore = Math.min(step * stepValue, targetScore)
          setReputation(prev => ({
            ...reputationData,
            score: Math.floor(currentScore),
            nextLevel: {
              ...reputationData.nextLevel,
              progress: Math.floor(currentScore)
            }
          }))
        }, step * stepDuration)
      }
    }
  }, [reputationData, isLoading])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'from-gray-500 to-gray-600'
      case 'Intermedia': return 'from-blue-500 to-cyan-500'
      case 'Experta': return 'from-purple-500 to-pink-500'
      case 'Maestra': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Principiante': return '🌱'
      case 'Intermedia': return '📈'
      case 'Experta': return '🏆'
      case 'Maestra': return '👑'
      default: return '🌱'
    }
  }

  if (!address) {
    return (
      <GlassCard className="p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔐</div>
          <h3 className="text-lg font-bold text-white">Conecta tu Wallet</h3>
          <p className="text-white/70 text-sm">
            Para ver tu reputación y badges
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${getLevelColor(reputation.level)} text-white mb-4`}>
            <span className="text-xl">{getLevelIcon(reputation.level)}</span>
            <span className="font-bold">{reputation.level}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {reputation.score} Puntos
          </h3>
          <p className="text-white/70 text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Progreso al siguiente nivel</span>
            <span className="text-white font-semibold">
              {reputation.nextLevel.progress}/{reputation.nextLevel.required}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getLevelColor(reputation.level)} rounded-full transition-all duration-2000 ease-out`}
              style={{ 
                width: `${Math.min((reputation.nextLevel.progress / reputation.nextLevel.required) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Badges y Achievements */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-white">Badges y Logros</h4>
          <div className="grid grid-cols-2 gap-3">
            {reputation.badges.length > 0 ? (
              reputation.badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    badge.earned 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-lg ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${badge.earned ? 'text-white' : 'text-white/50'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${badge.earned ? 'text-white/70' : 'text-white/40'}`}>
                        {badge.description}
                      </p>
                      {badge.rarity && (
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            badge.rarity === 1 ? 'bg-gray-500/20 text-gray-400' :
                            badge.rarity === 2 ? 'bg-blue-500/20 text-blue-400' :
                            badge.rarity === 3 ? 'bg-purple-500/20 text-purple-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {badge.rarity === 1 ? 'Común' :
                             badge.rarity === 2 ? 'Raro' :
                             badge.rarity === 3 ? 'Épico' : 'Legendario'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-4">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-white/70 text-sm">Aún no tienes badges</p>
                <p className="text-white/50 text-xs">¡Completa actividades para ganar badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Información de Verificación */}
        {reputation.isVerified && (
          <div className="pt-4 border-t border-white/20">
            <h4 className="text-sm font-bold text-white mb-2">Verificación de Identidad</h4>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span className="text-green-400">✓</span>
              <span>Verificada (Nivel {reputation.verificationLevel})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
              <span>Endorsements: {reputation.endorsementCount}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>Racha de actividad: {reputation.activityStreak} días</span>
            </div>
          </div>
        )}

        {/* Beneficios */}
        <div className="pt-4 border-t border-white/20">
          <h4 className="text-sm font-bold text-white mb-2">Beneficios Actuales</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-green-400">✓</span>
              <span>Comisión reducida: 2%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-green-400">✓</span>
              <span>Acceso a servicios premium</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-green-400">✓</span>
              <span>Soporte prioritario</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
