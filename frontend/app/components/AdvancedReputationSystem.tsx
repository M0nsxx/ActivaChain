'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para AdvancedReputationSystem
const REPUTATION_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getReputation",
    "outputs": [
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "uint256", "name": "endorsementCount", "type": "uint256"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint256", "name": "verificationLevel", "type": "uint256"},
      {"internalType": "uint256", "name": "activityStreak", "type": "uint256"},
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
      {"internalType": "uint256", "name": "endorsementBonus", "type": "uint256"},
      {"internalType": "uint256", "name": "activityScore", "type": "uint256"},
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
      {"internalType": "uint256", "name": "verificationLevel", "type": "uint256"}
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
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "applyDecay",
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
  activityStreak: bigint
  timeSinceLastActivity: bigint
}

interface DetailedReputationData {
  baseScore: bigint
  timeDecay: bigint
  endorsementBonus: bigint
  activityScore: bigint
  totalScore: bigint
  lastUpdate: bigint
  lastActivity: bigint
}

export function AdvancedReputationSystem() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const { addNotification } = useNotifications()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'endorsements'>('overview')
  const [endorseAddress, setEndorseAddress] = useState('')
  const [zkProof, setZkProof] = useState('')
  const [verificationLevel, setVerificationLevel] = useState(1)
  
  // Leer reputación del usuario
  const { data: reputationData, refetch: refetchReputation } = useReadContract({
    address: contracts.advancedReputation,
    abi: REPUTATION_ABI,
    functionName: 'getReputation',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })
  
  // Leer reputación detallada
  const { data: detailedReputation } = useReadContract({
    address: contracts.advancedReputation,
    abi: REPUTATION_ABI,
    functionName: 'getDetailedReputation',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
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
    activityStreak: reputation.activityStreak || BigInt(0),
    timeSinceLastActivity: reputation.timeSinceLastActivity || BigInt(0)
  } : {
    score: BigInt(0),
    endorsementCount: BigInt(0),
    isVerified: false,
    verificationLevel: BigInt(0),
    activityStreak: BigInt(0),
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
  
  const getVerificationLevelColor = (level: bigint) => {
    switch (Number(level)) {
      case 0: return 'text-gray-400'
      case 1: return 'text-green-400'
      case 2: return 'text-blue-400'
      case 3: return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }
  
  const getReputationLevel = (score: bigint) => {
    const scoreNum = Number(score)
    if (scoreNum < 100) return { level: 'Principiante', color: 'text-gray-400', icon: '🌱' }
    if (scoreNum < 500) return { level: 'Intermedio', color: 'text-blue-400', icon: '🌿' }
    if (scoreNum < 1000) return { level: 'Avanzado', color: 'text-purple-400', icon: '🌳' }
    if (scoreNum < 2000) return { level: 'Experto', color: 'text-pink-400', icon: '🏆' }
    return { level: 'Leyenda', color: 'text-yellow-400', icon: '👑' }
  }
  
  const handleZKVerification = async () => {
    if (!address || !zkProof) return
    
    try {
      const proofHash = `0x${Math.random().toString(16).substr(2, 8)}`
      
      await writeContract({
        address: contracts.advancedReputation,
        abi: REPUTATION_ABI,
        functionName: 'verifyIdentityWithZK',
        args: [proofHash as `0x${string}`, zkProof as `0x${string}`, BigInt(verificationLevel)]
      })
      
      addNotification({
        type: 'success',
        title: 'Verificación ZK',
        message: 'Tu identidad ha sido verificada con ZK proofs'
      })
      
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
        address: contracts.advancedReputation,
        abi: REPUTATION_ABI,
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
        address: contracts.advancedReputation,
        abi: REPUTATION_ABI,
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
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Sistema de <span className="gradient-text">Reputación Avanzado</span>
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Gestiona tu reputación con decay temporal, ZK proofs y endorsements
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-morphism rounded-xl p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'verification'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Verificación ZK
          </button>
          <button
            onClick={() => setActiveTab('endorsements')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'endorsements'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Endorsements
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reputación Principal */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Tu Reputación</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-2">{reputationLevel?.icon}</div>
                <h4 className={`text-2xl font-bold ${reputationLevel?.color}`}>
                  {reputationLevel?.level}
                </h4>
                <p className="text-3xl font-bold text-white mt-2">
                  {Number(safeReputation.score).toLocaleString()} pts
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">
                    {Number(safeReputation.endorsementCount)}
                  </div>
                  <div className="text-white/70 text-sm">Endorsements</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">
                    {Number(safeReputation.activityStreak)}
                  </div>
                  <div className="text-white/70 text-sm">Días Activo</div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Verificación:</span>
                  <span className={`font-semibold ${getVerificationLevelColor(safeReputation.verificationLevel)}`}>
                    {getVerificationLevelText(safeReputation.verificationLevel)}
                  </span>
                </div>
              </div>
                
              <button
                onClick={handleRecordActivity}
                className="w-full neural-button py-3"
              >
                Registrar Actividad Diaria
              </button>
            </div>
          </GlassCard>
          
          {/* Reputación Detallada */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Desglose Detallado</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span className="text-white/70">Puntuación Base:</span>
                <span className="text-white font-semibold">
                  {detailed ? Number(detailed.baseScore).toLocaleString() : '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span className="text-white/70">Decay Temporal:</span>
                <span className="text-red-400 font-semibold">
                  -{detailed ? Number(detailed.timeDecay).toLocaleString() : '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span className="text-white/70">Bonus Endorsements:</span>
                <span className="text-green-400 font-semibold">
                  +{detailed ? Number(detailed.endorsementBonus).toLocaleString() : '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span className="text-white/70">Puntuación Actividad:</span>
                <span className="text-blue-400 font-semibold">
                  +{detailed ? Number(detailed.activityScore).toLocaleString() : '0'}
                </span>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-white font-bold text-xl">
                    {detailed ? Number(detailed.totalScore).toLocaleString() : '0'}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-white/50 space-y-1">
                <p>Última actualización: {detailed ? new Date(Number(detailed.lastUpdate) * 1000).toLocaleDateString() : 'Nunca'}</p>
                <p>Última actividad: {detailed ? new Date(Number(detailed.lastActivity) * 1000).toLocaleDateString() : 'Nunca'}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
      
      {activeTab === 'verification' && (
        <GlassCard className="p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Verificación ZK</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Nivel de Verificación</label>
              <select
                value={verificationLevel}
                onChange={(e) => setVerificationLevel(Number(e.target.value))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value={1}>Básico (+500 pts)</option>
                <option value={2}>Avanzado (+1000 pts)</option>
                <option value={3}>Premium (+1500 pts)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">ZK Proof</label>
              <textarea
                value={zkProof}
                onChange={(e) => setZkProof(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                placeholder="Ingresa tu ZK proof aquí..."
              />
            </div>
            
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">¿Qué es ZK Proof?</h4>
              <p className="text-white/70 text-sm">
                Los ZK proofs te permiten verificar tu identidad sin revelar información personal.
                Esto aumenta tu reputación y te da acceso a funciones premium.
              </p>
            </div>
            
            <button
              onClick={handleZKVerification}
              className="w-full neural-button py-3"
              disabled={!zkProof}
            >
              Verificar con ZK Proof
            </button>
          </div>
        </GlassCard>
      )}
      
      {activeTab === 'endorsements' && (
        <GlassCard className="p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Endorsements</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Dirección a Endorsar</label>
              <input
                type="text"
                value={endorseAddress}
                onChange={(e) => setEndorseAddress(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="0x..."
              />
            </div>
            
            <div className="p-4 bg-green-500/20 rounded-lg">
              <h4 className="text-green-400 font-semibold mb-2">Requisitos para Endorsar</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Tener al menos 100 puntos de reputación</li>
                <li>• Estar verificado con ZK proof</li>
                <li>• No haber endorsado a esta persona antes</li>
                <li>• Cooldown de 24 horas entre endorsements</li>
              </ul>
            </div>
            
            <button
              onClick={handleEndorseUser}
              className="w-full neural-button py-3"
              disabled={!endorseAddress}
            >
              Endorsar Usuario
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
