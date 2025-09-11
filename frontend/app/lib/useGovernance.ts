import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useContracts } from './useContracts'
import { useCallback, useEffect, useState } from 'react'
import { GOVERNANCE_ABI, ACTIVA_TOKEN_ABI } from './contracts'

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  startTime: bigint
  endTime: bigint
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
  proposalType: number
  executed: boolean
  cancelled: boolean
}

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
    type: string
    description: string
    timestamp: number
    user: string
  }>
}

export function useGovernance() {
  const { address } = useAccount()
  const contracts = useContracts()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats>({
    totalProposals: 0,
    activeProposals: 0,
    executedProposals: 0,
    totalVoters: 0,
    treasuryBalance: '0',
    participationRate: 0,
    averageVotingPower: '0',
    topProposer: '',
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract: writeContract } = useWriteContract()

  // Leer contador de propuestas
  const { data: proposalCounter, refetch: refetchProposalCounter } = useReadContract({
    address: contracts.governance,
    abi: GOVERNANCE_ABI,
    functionName: 'proposalCounter',
    query: {
      enabled: !!contracts.governance
    }
  })

  // Leer poder de voto del usuario
  const { data: votingPower, refetch: refetchVotingPower } = useReadContract({
    address: contracts.governance,
    abi: GOVERNANCE_ABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.governance
    }
  })

  // Leer balance del treasury
  const { data: treasuryBalance, refetch: refetchTreasuryBalance } = useReadContract({
    address: contracts.governance,
    abi: GOVERNANCE_ABI,
    functionName: 'treasuryBalance',
    query: {
      enabled: !!contracts.governance
    }
  })

  // Leer balance de ACTIVA del usuario
  const { data: activaBalance, refetch: refetchActivaBalance } = useReadContract({
    address: contracts.activaToken,
    abi: ACTIVA_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.activaToken
    }
  })

  // Leer información de staking del usuario
  const { data: stakingInfo, refetch: refetchStakingInfo } = useReadContract({
    address: contracts.activaToken,
    abi: ACTIVA_TOKEN_ABI,
    functionName: 'getStakingInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.activaToken
    }
  })

  // Función para cargar propuestas
  const loadProposals = useCallback(async () => {
    if (!proposalCounter || !contracts.governance) {
      return
    }

    setIsLoading(true)
    try {
      const proposalPromises = []
      const totalProposals = Number(proposalCounter)
      
      // Cargar las últimas 10 propuestas
      const startId = Math.max(1, totalProposals - 9)
      
      for (let i = startId; i <= totalProposals; i++) {
        proposalPromises.push(
          fetch(`/api/proposal/${i}`).then(res => res.json()).catch(() => null)
        )
      }

      const proposalResults = await Promise.all(proposalPromises)
      const validProposals = proposalResults.filter(proposal => proposal !== null)
      
      setProposals(validProposals)
    } catch (error) {
      console.error('Error loading proposals:', error)
    } finally {
      setIsLoading(false)
    }
  }, [proposalCounter, contracts.governance])

  // Función para cargar estadísticas de gobernanza
  const loadGovernanceStats = useCallback(async () => {
    if (!contracts.governance) {
      return
    }

    try {
      // Simular carga de estadísticas (en producción vendría del contrato)
      const stats: GovernanceStats = {
        totalProposals: Number(proposalCounter || 0),
        activeProposals: Math.floor(Number(proposalCounter || 0) * 0.2),
        executedProposals: Math.floor(Number(proposalCounter || 0) * 0.7),
        totalVoters: 1250,
        treasuryBalance: treasuryBalance ? (Number(treasuryBalance) / 1e18).toFixed(2) : '0',
        participationRate: 78.5,
        averageVotingPower: votingPower ? (Number(votingPower) / 1e18).toFixed(2) : '0',
        topProposer: '0x1234...5678',
        recentActivity: [
          {
            type: 'vote',
            description: 'Votó A FAVOR en "Nuevo curso DeFi Avanzado"',
            timestamp: Date.now() - 300000,
            user: '0x9876...5432'
          },
          {
            type: 'proposal',
            description: 'Creó propuesta "Fondo de desarrollo comunitario"',
            timestamp: Date.now() - 1800000,
            user: '0x4567...8901'
          },
          {
            type: 'execution',
            description: 'Ejecutó propuesta "Actualización de comisiones"',
            timestamp: Date.now() - 3600000,
            user: '0x1111...2222'
          }
        ]
      }
      
      setGovernanceStats(stats)
    } catch (error) {
      console.error('Error loading governance stats:', error)
    }
  }, [contracts.governance, proposalCounter, treasuryBalance, votingPower])

  // Función para crear una propuesta
  const createProposal = useCallback(async (
    title: string,
    description: string,
    proposalType: number,
    duration: number
  ) => {
    if (!contracts.governance) {
      throw new Error('Governance contract not available')
    }

    try {
      await writeContract({
        address: contracts.governance,
        abi: GOVERNANCE_ABI,
        functionName: 'createProposal',
        args: [title, description, proposalType, BigInt(duration)]
      })

      // Refrescar propuestas después de la transacción
      setTimeout(() => {
        refetchProposalCounter()
        loadProposals()
        loadGovernanceStats()
      }, 2000)
    } catch (error) {
      console.error('Error creating proposal:', error)
      throw error
    }
  }, [contracts.governance, writeContract, refetchProposalCounter, loadProposals, loadGovernanceStats])

  // Función para votar en una propuesta
  const vote = useCallback(async (proposalId: number, support: number) => {
    if (!contracts.governance) {
      throw new Error('Governance contract not available')
    }

    try {
      await writeContract({
        address: contracts.governance,
        abi: GOVERNANCE_ABI,
        functionName: 'vote',
        args: [BigInt(proposalId), support]
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchVotingPower()
        loadProposals()
        loadGovernanceStats()
      }, 2000)
    } catch (error) {
      console.error('Error voting on proposal:', error)
      throw error
    }
  }, [contracts.governance, writeContract, refetchVotingPower, loadProposals, loadGovernanceStats])

  // Función para ejecutar una propuesta
  const executeProposal = useCallback(async (proposalId: number) => {
    if (!contracts.governance) {
      throw new Error('Governance contract not available')
    }

    try {
      await writeContract({
        address: contracts.governance,
        abi: GOVERNANCE_ABI,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)]
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchTreasuryBalance()
        loadProposals()
        loadGovernanceStats()
      }, 2000)
    } catch (error) {
      console.error('Error executing proposal:', error)
      throw error
    }
  }, [contracts.governance, writeContract, refetchTreasuryBalance, loadProposals, loadGovernanceStats])

  // Función para hacer stake de tokens ACTIVA
  const stakeTokens = useCallback(async (amount: bigint) => {
    if (!contracts.activaToken) {
      throw new Error('ACTIVA token contract not available')
    }

    try {
      await writeContract({
        address: contracts.activaToken,
        abi: ACTIVA_TOKEN_ABI,
        functionName: 'stake',
        args: [amount]
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchActivaBalance()
        refetchStakingInfo()
        refetchVotingPower()
      }, 2000)
    } catch (error) {
      console.error('Error staking tokens:', error)
      throw error
    }
  }, [contracts.activaToken, writeContract, refetchActivaBalance, refetchStakingInfo, refetchVotingPower])

  // Función para hacer unstake de tokens ACTIVA
  const unstakeTokens = useCallback(async () => {
    if (!contracts.activaToken) {
      throw new Error('ACTIVA token contract not available')
    }

    try {
      await writeContract({
        address: contracts.activaToken,
        abi: ACTIVA_TOKEN_ABI,
        functionName: 'unstake',
        args: []
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchActivaBalance()
        refetchStakingInfo()
        refetchVotingPower()
      }, 2000)
    } catch (error) {
      console.error('Error unstaking tokens:', error)
      throw error
    }
  }, [contracts.activaToken, writeContract, refetchActivaBalance, refetchStakingInfo, refetchVotingPower])

  // Función para verificar si el usuario ya votó en una propuesta
  const hasVoted = useCallback(async (proposalId: number) => {
    if (!address || !contracts.governance) {
      return false
    }

    try {
      // Esta función necesitaría ser implementada como hook separado
      // Por ahora retornamos false
      return false
    } catch (error) {
      console.error('Error checking vote status:', error)
      return false
    }
  }, [address, contracts.governance])

  // Cargar propuestas cuando cambie el contador
  useEffect(() => {
    if (proposalCounter) {
      loadProposals()
      loadGovernanceStats()
    }
  }, [proposalCounter, loadProposals, loadGovernanceStats])

  return {
    proposals,
    governanceStats,
    votingPower: votingPower ? Number(votingPower) / 1e18 : 0,
    activaBalance: activaBalance ? Number(activaBalance) / 1e18 : 0,
    stakingInfo: stakingInfo ? {
      balance: Number(stakingInfo[0]) / 1e18,
      timestamp: Number(stakingInfo[1])
    } : { balance: 0, timestamp: 0 },
    treasuryBalance: treasuryBalance ? Number(treasuryBalance) / 1e18 : 0,
    isLoading,
    createProposal,
    vote,
    executeProposal,
    stakeTokens,
    unstakeTokens,
    hasVoted,
    refreshProposals: loadProposals,
    refreshStats: loadGovernanceStats
  }
}
