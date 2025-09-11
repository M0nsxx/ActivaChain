'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import GovernanceStats from './GovernanceStats'
import { useGovernance } from '../lib/useGovernance'

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  startTime: number
  endTime: number
  forVotes: string
  againstVotes: string
  abstainVotes: string
  proposalType: number
  executed: boolean
  cancelled: boolean
}

interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  totalVoters: number
  treasuryBalance: string
}

export default function GovernanceSection() {
  // Verificar si AppKit está disponible antes de usar el hook
  let open: (() => void) | undefined
  try {
    const appKit = useAppKit()
    open = appKit?.open
  } catch (error) {
    console.warn('AppKit not ready yet:', error)
  }
  const { address, isConnected } = useAccount()
  const { 
    proposals: realProposals, 
    governanceStats, 
    votingPower, 
    activaBalance, 
    stakingInfo,
    isLoading,
    createProposal: createProposalContract,
    vote: voteContract,
    executeProposal: executeProposalContract,
    stakeTokens,
    unstakeTokens
  } = useGovernance()
  
  const [activeTab, setActiveTab] = useState<'proposals' | 'create' | 'stats'>('proposals')
  const [isVisible, setIsVisible] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [stats, setStats] = useState<GovernanceStats>({
    totalProposals: 0,
    activeProposals: 0,
    totalVoters: 0,
    treasuryBalance: '0'
  })
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 1
  })

  // Detectar cuando la sección es visible
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('governance')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  // Mock data para demostración
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: 1,
        title: "Aumentar comisión de plataforma al 3%",
        description: "Propuesta para incrementar la comisión de la plataforma del 2.5% al 3% para mejorar la sostenibilidad del protocolo y financiar nuevas funcionalidades.",
        proposer: "0x1234...5678",
        startTime: Date.now() - 86400000, // 1 día atrás
        endTime: Date.now() + 518400000, // 6 días restantes
        forVotes: "15000000000000000000000", // 15,000 ACTIVA
        againstVotes: "8000000000000000000000", // 8,000 ACTIVA
        abstainVotes: "2000000000000000000000", // 2,000 ACTIVA
        proposalType: 2,
        executed: false,
        cancelled: false
      },
      {
        id: 2,
        title: "Fondo de desarrollo comunitario - $50,000",
        description: "Crear un fondo de 50,000 ARB para financiar proyectos de desarrollo comunitario y hackathons dirigidos a mujeres en Web3.",
        proposer: "0x9876...5432",
        startTime: Date.now() - 172800000, // 2 días atrás
        endTime: Date.now() + 432000000, // 5 días restantes
        forVotes: "25000000000000000000000", // 25,000 ACTIVA
        againstVotes: "5000000000000000000000", // 5,000 ACTIVA
        abstainVotes: "1000000000000000000000", // 1,000 ACTIVA
        proposalType: 1,
        executed: false,
        cancelled: false
      },
      {
        id: 3,
        title: "Nuevo curso: DeFi Avanzado para Mujeres",
        description: "Aprobar la creación de un nuevo curso especializado en DeFi avanzado, incluyendo yield farming, liquidity mining y protocolos de lending.",
        proposer: "0x4567...8901",
        startTime: Date.now() - 259200000, // 3 días atrás
        endTime: Date.now() + 345600000, // 4 días restantes
        forVotes: "30000000000000000000000", // 30,000 ACTIVA
        againstVotes: "3000000000000000000000", // 3,000 ACTIVA
        abstainVotes: "2000000000000000000000", // 2,000 ACTIVA
        proposalType: 3,
        executed: false,
        cancelled: false
      }
    ]

    setProposals(mockProposals)
    setStats({
      totalProposals: 12,
      activeProposals: 3,
      totalVoters: 1250,
      treasuryBalance: '125000'
    })
  }, [])

  const formatVotes = (votes: string) => {
    const numVotes = parseInt(votes) / 10**18
    return numVotes.toLocaleString()
  }

  const getProposalTypeLabel = (type: number) => {
    switch (type) {
      case 1: return 'Treasury'
      case 2: return 'Protocolo'
      case 3: return 'Comunidad'
      default: return 'Desconocido'
    }
  }

  const getProposalTypeColor = (type: number) => {
    switch (type) {
      case 1: return 'from-green-500/20 to-emerald-500/20'
      case 2: return 'from-blue-500/20 to-cyan-500/20'
      case 3: return 'from-purple-500/20 to-pink-500/20'
      default: return 'from-gray-500/20 to-gray-500/20'
    }
  }

  const getVotingProgress = (proposal: Proposal) => {
    const total = parseInt(proposal.forVotes) + parseInt(proposal.againstVotes) + parseInt(proposal.abstainVotes)
    const forPercentage = total > 0 ? (parseInt(proposal.forVotes) / total) * 100 : 0
    const againstPercentage = total > 0 ? (parseInt(proposal.againstVotes) / total) * 100 : 0
    const abstainPercentage = total > 0 ? (parseInt(proposal.abstainVotes) / total) * 100 : 0
    
    return { forPercentage, againstPercentage, abstainPercentage, total }
  }

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now()
    const remaining = endTime - now
    
    if (remaining <= 0) return 'Finalizada'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h`
  }

  const handleVote = (proposalId: number, support: number) => {
    if (!isConnected) {
      open?.()
      return
    }
    // Acá se implementaría la lógica de votación real
    console.log(`Voting ${support} on proposal ${proposalId}`)
  }

  const handleCreateProposal = () => {
    if (!isConnected) {
      open?.()
      return
    }
    // Acá se implementaría la lógica de creación de propuesta real
    console.log('Creating proposal:', newProposal)
  }

  return (
    <section className={`py-20 px-4 relative transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <h2 className="text-5xl font-bold text-white mb-6">
            🏛️ <span className="gradient-text">Gobernanza DAO</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Participa en las decisiones que moldean el futuro de ActivaChain. Tu voz cuenta.
          </p>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}>
          <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-white mb-2">{stats.totalProposals}</div>
            <p className="text-white/70">Propuestas Totales</p>
          </GlassCard>
          <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.activeProposals}</div>
            <p className="text-white/70">Activas</p>
          </GlassCard>
          <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalVoters.toLocaleString()}</div>
            <p className="text-white/70">Votantes</p>
          </GlassCard>
          <GlassCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-pink-400 mb-2">${stats.treasuryBalance}</div>
            <p className="text-white/70">Treasury</p>
          </GlassCard>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-morphism p-2 rounded-xl">
            <div className="flex gap-2">
              {[
                { id: 'proposals', label: 'Propuestas', icon: '📋' },
                { id: 'create', label: 'Crear', icon: '✨' },
                { id: 'stats', label: 'Estadísticas', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const progress = getVotingProgress(proposal)
              return (
                <GlassCard key={proposal.id} className="p-8 hover:scale-102 transition-all duration-300">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getProposalTypeColor(proposal.proposalType)} text-white`}>
                            {getProposalTypeLabel(proposal.proposalType)}
                          </span>
                          <span className="text-white/60 text-sm">#{proposal.id}</span>
                          <span className="text-white/60 text-sm">por {proposal.proposer}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{proposal.title}</h3>
                        <p className="text-white/80 leading-relaxed">{proposal.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{getTimeRemaining(proposal.endTime)}</div>
                        <div className="text-white/60 text-sm">restante</div>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-white/70">
                        <span>Total: {formatVotes((progress.total / 10**18).toString())} ACTIVA</span>
                        <span>Quorum: 10,000 ACTIVA</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-semibold">A Favor</span>
                          <span className="text-white">{progress.forPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${progress.forPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-red-400 font-semibold">En Contra</span>
                          <span className="text-white">{progress.againstPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${progress.againstPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-semibold">Abstención</span>
                          <span className="text-white">{progress.abstainPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${progress.abstainPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleVote(proposal.id, 1)}
                        className="flex-1 neural-button text-center py-3"
                      >
                        ✅ Votar A Favor
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 0)}
                        className="flex-1 neural-button-secondary text-center py-3"
                      >
                        ❌ Votar En Contra
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, 2)}
                        className="flex-1 neural-button-secondary text-center py-3"
                      >
                        ⚪ Abstenerse
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">✨ Crear Nueva Propuesta</h3>
                  <p className="text-white/80">Propón cambios que beneficien a toda la comunidad ActivaChain</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Título de la Propuesta</label>
                    <input
                      type="text"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Aumentar comisión de plataforma al 3%"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Descripción Detallada</label>
                    <textarea
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Explica detalladamente tu propuesta, incluyendo beneficios, riesgos y implementación..."
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Tipo de Propuesta</label>
                    <select
                      value={newProposal.type}
                      onChange={(e) => setNewProposal({...newProposal, type: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>💰 Treasury - Gestión de fondos</option>
                      <option value={2}>⚙️ Protocolo - Cambios técnicos</option>
                      <option value={3}>👥 Comunidad - Iniciativas sociales</option>
                    </select>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl">
                    <h4 className="text-white font-bold mb-3">📋 Requisitos para Proponer</h4>
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Mínimo 1,000 ACTIVA tokens</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Reputación verificada</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Propuesta bien fundamentada</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleCreateProposal}
                    className="w-full neural-button text-lg py-4"
                  >
                    🚀 Crear Propuesta
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'stats' && <GovernanceStats />}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <GlassCard gradient className="p-12">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white">
                🗳️ Tu Voz <span className="gradient-text">Moldeará el Futuro</span>
              </h3>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Cada voto cuenta. Cada propuesta importa. Únete a la revolución de la gobernanza descentralizada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => open?.()}
                  className="neural-button text-lg px-8 py-4"
                >
                  🚀 Conectar Wallet
                </button>
                <button className="neural-button-secondary text-lg px-8 py-4">
                  📚 Aprender Más
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
