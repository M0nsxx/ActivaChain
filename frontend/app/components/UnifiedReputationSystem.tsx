'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para UnifiedReputationSystem
const UNIFIED_REPUTATION_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getReputation",
    "outputs": [
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "uint256", "name": "endorsementCount", "type": "uint256"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint8", "name": "verificationLevel", "type": "uint8"},
      {"internalType": "uint256", "name": "userActivityStreak", "type": "uint256"},
      {"internalType": "uint256", "name": "timeSinceLastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getDetailedReputation",
    "outputs": [
      {"internalType": "uint256", "name": "baseScore", "type": "uint256"},
      {"internalType": "uint256", "name": "timeDecay", "type": "uint256"},
      {"internalType": "uint256", "name": "totalScore", "type": "uint256"},
      {"internalType": "uint256", "name": "lastUpdate", "type": "uint256"},
      {"internalType": "uint256", "name": "lastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "proofHash", "type": "bytes32"},
      {"internalType": "bytes", "name": "proof", "type": "bytes"},
      {"internalType": "uint8", "name": "verificationLevel", "type": "uint8"}
    ],
    "name": "verifyIdentityWithZK",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "endorseUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "recordActivity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

interface ReputationData {
  score: bigint
  endorsementCount: bigint
  isVerified: boolean
  verificationLevel: bigint
  userActivityStreak: bigint
  timeSinceLastActivity: bigint
}

interface DetailedReputationData {
  baseScore: bigint
  timeDecay: bigint
  totalScore: bigint
  lastUpdate: bigint
  lastActivity: bigint
}

export function UnifiedReputationSystem() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const { addNotification } = useNotifications()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'endorsements'>('overview')
  const [endorseAddress, setEndorseAddress] = useState('')
  const [zkProof, setZkProof] = useState('')
  const [verificationLevel, setVerificationLevel] = useState(1)
  
  // Leer reputación del usuario
  const { data: reputationData, refetch: refetchReputation } = useReadContract({
    address: contracts.unifiedReputation,
    abi: UNIFIED_REPUTATION_ABI,
    functionName: 'getReputation',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!contracts.unifiedReputation }
  })
  
  // Leer reputación detallada
  const { data: detailedReputation } = useReadContract({
    address: contracts.unifiedReputation,
    abi: UNIFIED_REPUTATION_ABI,
    functionName: 'getDetailedReputation',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!contracts.unifiedReputation }
  })
  
  const { writeContract } = useWriteContract()
  
  const reputation = reputationData as ReputationData | undefined
  const detailed = detailedReputation as DetailedReputationData | undefined
  
  // Datos de fallback para evitar NaN
  const safeReputation = reputation ? {
    score: reputation.score || BigInt(0),
    endorsementCount: reputation.endorsementCount || BigInt(0),
    isVerified: reputation.isVerified || false,
    verificationLevel: reputation.verificationLevel || BigInt(0),
    userActivityStreak: reputation.userActivityStreak || BigInt(0),
    timeSinceLastActivity: reputation.timeSinceLastActivity || BigInt(0)
  } : {
    score: BigInt(0),
    endorsementCount: BigInt(0),
    isVerified: false,
    verificationLevel: BigInt(0),
    userActivityStreak: BigInt(0),
    timeSinceLastActivity: BigInt(0)
  }
  
  const getVerificationLevelText = (level: bigint) => {
    switch (Number(level)) {
      case 0: return 'No verificado'
      case 1: return 'Básico'
      case 2: return 'Avanzado'
      case 3: return 'Premium'
      default: return 'Desconocido'
    }
  }
  
  const getReputationLevel = (score: bigint) => {
    const scoreNum = Number(score)
    if (scoreNum < 100) return { level: 'Principiante', color: 'text-gray-400' }
    if (scoreNum < 500) return { level: 'Intermedio', color: 'text-blue-400' }
    if (scoreNum < 1000) return { level: 'Avanzado', color: 'text-purple-400' }
    if (scoreNum < 2000) return { level: 'Experto', color: 'text-orange-400' }
    return { level: 'Maestro', color: 'text-yellow-400' }
  }
  
  const handleZKVerification = async () => {
    if (!address || !zkProof) return
    
    try {
      const proofHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      await writeContract({
        address: contracts.unifiedReputation,
        abi: UNIFIED_REPUTATION_ABI,
        functionName: 'verifyIdentityWithZK',
        args: [proofHash as `0x${string}`, zkProof as `0x${string}`, verificationLevel]
      })
      
      addNotification({
        type: 'success',
        title: 'Verificación ZK Completada',
        message: `Nivel ${verificationLevel} verificado exitosamente`
      })
      
      setZkProof('')
      refetchReputation()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error en la verificación ZK'
      })
    }
  }
  
  const handleEndorseUser = async () => {
    if (!address || !endorseAddress) return
    
    try {
      await writeContract({
        address: contracts.unifiedReputation,
        abi: UNIFIED_REPUTATION_ABI,
        functionName: 'endorseUser',
        args: [endorseAddress as `0x${string}`]
      })
      
      addNotification({
        type: 'success',
        title: 'Endorsement Enviado',
        message: `Has endorsado a ${endorseAddress.substring(0, 6)}...`
      })
      
      setEndorseAddress('')
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al enviar endorsement'
      })
    }
  }
  
  const handleRecordActivity = async () => {
    if (!address) return
    
    try {
      await writeContract({
        address: contracts.unifiedReputation,
        abi: UNIFIED_REPUTATION_ABI,
        functionName: 'recordActivity',
        args: [address]
      })
      
      addNotification({
        type: 'success',
        title: 'Actividad Registrada',
        message: 'Tu actividad diaria ha sido registrada'
      })
      
      refetchReputation()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al registrar actividad'
      })
    }
  }
  
  if (!isConnected) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-bold text-white mb-2">Conecta tu Wallet</h3>
        <p className="text-white/70">Necesitas conectar tu wallet para ver tu reputación</p>
      </GlassCard>
    )
  }
  
  const reputationLevel = getReputationLevel(safeReputation.score)
  
  return (
    <div className="space-y-8">
      <NotificationSystem notifications={[]} onRemove={() => {}} />
      
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sistema de Reputación Unificado</h2>
            <p className="text-white/70">Gestiona tu reputación, verificaciones y endorsements</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${reputationLevel.color}`}>
              {reputationLevel.level}
            </div>
            <div className="text-white/70">
              {Number(safeReputation.score).toLocaleString()} puntos
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'verification', label: 'Verificación', icon: '🔐' },
          { id: 'endorsements', label: 'Endorsements', icon: '👍' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white mb-1">
                {Number(safeReputation.score).toLocaleString()}
              </div>
              <div className="text-white/70">Puntos de Reputación</div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">👍</div>
              <div className="text-2xl font-bold text-white mb-1">
                {Number(safeReputation.endorsementCount)}
              </div>
              <div className="text-white/70">Endorsements</div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-white mb-1">
                {Number(safeReputation.userActivityStreak)}
              </div>
              <div className="text-white/70">Días Activo</div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔐</div>
              <div className="text-2xl font-bold text-white mb-1">
                {safeReputation.isVerified ? '✅' : '❌'}
              </div>
              <div className="text-white/70">
                {safeReputation.isVerified 
                  ? getVerificationLevelText(safeReputation.verificationLevel)
                  : 'No Verificado'
                }
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⏰</div>
              <div className="text-2xl font-bold text-white mb-1">
                {Math.floor(Number(safeReputation.timeSinceLastActivity) / 3600)}h
              </div>
              <div className="text-white/70">Última Actividad</div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6">
            <button
              onClick={handleRecordActivity}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              📝 Registrar Actividad
            </button>
          </GlassCard>
        </div>
      )}
      
      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Verificación de Identidad ZK</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2">Nivel de Verificación</label>
              <select
                value={verificationLevel}
                onChange={(e) => setVerificationLevel(Number(e.target.value))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value={1}>Básico (500 puntos)</option>
                <option value={2}>Avanzado (1000 puntos)</option>
                <option value={3}>Premium (1500 puntos)</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 mb-2">ZK Proof</label>
              <textarea
                value={zkProof}
                onChange={(e) => setZkProof(e.target.value)}
                placeholder="Ingresa tu ZK proof aquí..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
              />
            </div>
            <button
              onClick={handleZKVerification}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🔐 Verificar Identidad
            </button>
          </div>
        </GlassCard>
      )}
      
      {/* Endorsements Tab */}
      {activeTab === 'endorsements' && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Endorsar Usuario</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 mb-2">Dirección del Usuario</label>
              <input
                type="text"
                value={endorseAddress}
                onChange={(e) => setEndorseAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <button
              onClick={handleEndorseUser}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              👍 Endorsar Usuario
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
