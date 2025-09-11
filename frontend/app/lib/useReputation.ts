import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useContracts } from './useContracts'
import { useCallback, useEffect, useState } from 'react'
import { ADVANCED_REPUTATION_ABI, GAMIFICATION_ABI } from './contracts'

interface ReputationData {
  score: number
  level: string
  badges: Array<{
    name: string
    icon: string
    description: string
    earned: boolean
    rarity: number
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

export function useReputation() {
  const { address } = useAccount()
  const contracts = useContracts()
  const [reputationData, setReputationData] = useState<ReputationData>({
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

  // Leer reputación básica
  const { data: basicReputation, refetch: refetchBasic } = useReadContract({
    address: contracts.advancedReputation,
    abi: ADVANCED_REPUTATION_ABI,
    functionName: 'getReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.advancedReputation
    }
  })

  // Leer reputación detallada
  const { data: detailedReputation, refetch: refetchDetailed } = useReadContract({
    address: contracts.advancedReputation,
    abi: ADVANCED_REPUTATION_ABI,
    functionName: 'getDetailedReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.advancedReputation
    }
  })

  // Leer perfil de gamificación
  const { data: gamificationProfile, refetch: refetchGamification } = useReadContract({
    address: contracts.gamification,
    abi: GAMIFICATION_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.gamification
    }
  })

  // Leer achievements del usuario
  const { data: userAchievements, refetch: refetchAchievements } = useReadContract({
    address: contracts.gamification,
    abi: GAMIFICATION_ABI,
    functionName: 'getUserAchievements',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.gamification
    }
  })

  // Leer badges del usuario
  const { data: userBadges, refetch: refetchBadges } = useReadContract({
    address: contracts.gamification,
    abi: GAMIFICATION_ABI,
    functionName: 'getUserBadges',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.gamification
    }
  })

  const { writeContract: writeContract } = useWriteContract()

  // Función para endorsar a un usuario
  const endorseUser = useCallback(async (userAddress: string) => {
    if (!contracts.advancedReputation) {
      throw new Error('Contrato de reputación no disponible')
    }

    try {
      await writeContract({
        address: contracts.advancedReputation,
        abi: ADVANCED_REPUTATION_ABI,
        functionName: 'endorseUser',
        args: [userAddress as `0x${string}`]
      })
      
      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchBasic()
        refetchDetailed()
      }, 2000)
    } catch (error) {
      console.error('Error endorsing user:', error)
      throw error
    }
  }, [contracts.advancedReputation, writeContract, refetchBasic, refetchDetailed])

  // Función para verificar identidad con ZK
  const verifyIdentity = useCallback(async (proofHash: string, proof: string, verificationLevel: number) => {
    if (!contracts.advancedReputation) {
      throw new Error('Contrato de reputación no disponible')
    }

    try {
      await writeContract({
        address: contracts.advancedReputation,
        abi: ADVANCED_REPUTATION_ABI,
        functionName: 'verifyIdentityWithZK',
        args: [proofHash as `0x${string}`, proof as `0x${string}`, BigInt(verificationLevel)]
      })
      
      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchBasic()
        refetchDetailed()
      }, 2000)
    } catch (error) {
      console.error('Error verifying identity:', error)
      throw error
    }
  }, [contracts.advancedReputation, writeContract, refetchBasic, refetchDetailed])

  // Función para obtener información de un achievement
  const getAchievementInfo = useCallback(async (achievementId: number) => {
    if (!contracts.gamification) {
      return null
    }

    try {
      // Esta función necesitaría ser implementada como hook separado
      // Por ahora retornamos datos mock
      return {
        name: `Achievement ${achievementId}`,
        description: `Descripción del achievement ${achievementId}`,
        icon: '🏆',
        points: 100,
        category: 1,
        isActive: true,
        unlockCount: 0
      }
    } catch (error) {
      console.error('Error getting achievement info:', error)
      return null
    }
  }, [contracts.gamification])

  // Función para obtener información de un badge
  const getBadgeInfo = useCallback(async (badgeId: number) => {
    if (!contracts.gamification) {
      return null
    }

    try {
      // Esta función necesitaría ser implementada como hook separado
      // Por ahora retornamos datos mock
      return {
        name: `Badge ${badgeId}`,
        description: `Descripción del badge ${badgeId}`,
        imageURI: 'ipfs://badge',
        rarity: 1,
        requirements: 100,
        isActive: true,
        earnCount: 0
      }
    } catch (error) {
      console.error('Error getting badge info:', error)
      return null
    }
  }, [contracts.gamification])

  // Actualizar datos de reputación cuando cambien los datos del contrato
  useEffect(() => {
    if (basicReputation && detailedReputation && gamificationProfile) {
      const [score, endorsementCount, isVerified, verificationLevel, activityStreak] = basicReputation
      const [baseScore, timeDecay, endorsementBonus, activityScore, totalScore] = detailedReputation
      const [totalPoints, level, experience, achievements, badges, streak] = gamificationProfile

      // Calcular nivel basado en puntos
      const calculatedLevel = Math.floor(Number(totalPoints) / 1000)
      const levelNames = ['Principiante', 'Intermedio', 'Experto', 'Maestro', 'Leyenda']
      const levelName = levelNames[Math.min(calculatedLevel, levelNames.length - 1)]

      // Calcular progreso al siguiente nivel
      const currentLevelPoints = Number(totalPoints) % 1000
      const nextLevelRequired = 1000
      const progress = (currentLevelPoints / nextLevelRequired) * 100

      setReputationData({
        score: Number(totalScore || score),
        level: levelName,
        badges: [], // Se cargarán por separado
        achievements: [], // Se cargarán por separado
        nextLevel: {
          required: nextLevelRequired,
          progress: currentLevelPoints
        },
        isVerified: isVerified || false,
        verificationLevel: Number(verificationLevel || 0),
        endorsementCount: Number(endorsementCount || 0),
        activityStreak: Number(activityStreak || streak || 0)
      })
    }
  }, [basicReputation, detailedReputation, gamificationProfile])

  // Función para refrescar todos los datos
  const refreshReputation = useCallback(async () => {
    await Promise.all([
      refetchBasic(),
      refetchDetailed(),
      refetchGamification(),
      refetchAchievements(),
      refetchBadges()
    ])
  }, [refetchBasic, refetchDetailed, refetchGamification, refetchAchievements, refetchBadges])

  return {
    reputationData,
    endorseUser,
    verifyIdentity,
    getAchievementInfo,
    getBadgeInfo,
    refreshReputation,
    isLoading: !basicReputation && !detailedReputation && !gamificationProfile,
    isConnected: !!address
  }
}
