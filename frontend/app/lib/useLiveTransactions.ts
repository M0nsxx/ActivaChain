import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi'
import { useContracts } from './useContracts'
import { MARKETPLACE_ABI, GOVERNANCE_ABI, ACTIVA_TOKEN_ABI } from './contracts'
import { formatEther } from 'viem'

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

export function useLiveTransactions() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLive, setIsLive] = useState(true)

  // Obtener contador de servicios del marketplace
  const { data: serviceCounter } = useReadContract({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    functionName: 'serviceCounter',
    query: {
      enabled: !!contracts.marketplace,
      refetchInterval: 30000 // Refetch cada 30 segundos
    }
  })

  // Función para formatear direcciones
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Función para obtener nombre del servicio
  const getServiceName = (serviceId: bigint) => {
    return `Servicio #${serviceId.toString()}`
  }

  // Escuchar eventos del marketplace
  useWatchContractEvent({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    eventName: 'ServiceCreated',
    onLogs(logs) {
      if (!isLive) return
      
      logs.forEach((log: any) => {
        const newTransaction: Transaction = {
          id: `service-${log.blockNumber}-${log.logIndex}`,
          type: 'creation',
          service: getServiceName(log.args?.serviceId || BigInt(0)),
          user: formatAddress(log.args?.provider || '0x0000...0000'),
          amount: formatEther(log.args?.price || BigInt(0)),
          timestamp: Date.now(),
          status: 'completed',
          hash: log.transactionHash
        }
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)])
      })
    },
    enabled: !!contracts.marketplace && isLive
  })

  useWatchContractEvent({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    eventName: 'OrderCreated',
    onLogs(logs) {
      if (!isLive) return
      
      logs.forEach((log: any) => {
        const newTransaction: Transaction = {
          id: `order-${log.blockNumber}-${log.logIndex}`,
          type: 'purchase',
          service: getServiceName(log.args?.serviceId || BigInt(0)),
          user: formatAddress(log.args?.buyer || '0x0000...0000'),
          amount: formatEther(log.args?.amount || BigInt(0)),
          timestamp: Date.now(),
          status: 'processing',
          hash: log.transactionHash
        }
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)])
      })
    },
    enabled: !!contracts.marketplace && isLive
  })

  useWatchContractEvent({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    eventName: 'OrderCompleted',
    onLogs(logs) {
      if (!isLive) return
      
      logs.forEach((log: any) => {
        const newTransaction: Transaction = {
          id: `completed-${log.blockNumber}-${log.logIndex}`,
          type: 'completion',
          service: getServiceName(log.args?.serviceId || BigInt(0)),
          user: formatAddress(log.args?.buyer || '0x0000...0000'),
          amount: formatEther(log.args?.amount || BigInt(0)),
          timestamp: Date.now(),
          status: 'completed',
          hash: log.transactionHash
        }
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)])
      })
    },
    enabled: !!contracts.marketplace && isLive
  })

  // Escuchar eventos de gobernanza
  useWatchContractEvent({
    address: contracts.governance,
    abi: GOVERNANCE_ABI,
    eventName: 'ProposalCreated',
    onLogs(logs) {
      if (!isLive) return
      
      logs.forEach((log: any) => {
        const newTransaction: Transaction = {
          id: `proposal-${log.blockNumber}-${log.logIndex}`,
          type: 'proposal',
          service: log.args?.title || 'Nueva propuesta',
          user: formatAddress(log.args?.proposer || '0x0000...0000'),
          amount: '0',
          timestamp: Date.now(),
          status: 'completed',
          hash: log.transactionHash
        }
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)])
      })
    },
    enabled: !!contracts.governance && isLive
  })

  useWatchContractEvent({
    address: contracts.governance,
    abi: GOVERNANCE_ABI,
    eventName: 'VoteCast',
    onLogs(logs) {
      if (!isLive) return
      
      logs.forEach((log: any) => {
        const newTransaction: Transaction = {
          id: `vote-${log.blockNumber}-${log.logIndex}`,
          type: 'vote',
          service: `Propuesta #${log.args?.proposalId?.toString() || 'N/A'}`,
          user: formatAddress(log.args?.voter || '0x0000...0000'),
          amount: formatEther(log.args?.votes || BigInt(0)),
          timestamp: Date.now(),
          status: 'completed',
          hash: log.transactionHash
        }
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)])
      })
    },
    enabled: !!contracts.governance && isLive
  })

  // Cargar transacciones históricas al inicializar
  useEffect(() => {
    const loadHistoricalTransactions = async () => {
      try {
        // En una implementación real, aquí cargaríamos transacciones históricas
        // desde un índice de eventos o API
        const historicalTransactions: Transaction[] = [
          {
            id: 'historical-1',
            type: 'purchase',
            service: 'Desarrollo Smart Contract',
            user: '0x123...abc',
            amount: '0.5',
            timestamp: Date.now() - 300000,
            status: 'completed'
          },
          {
            id: 'historical-2',
            type: 'completion',
            service: 'Diseño UI/UX Web3',
            user: '0x456...def',
            amount: '0.3',
            timestamp: Date.now() - 600000,
            status: 'completed'
          },
          {
            id: 'historical-3',
            type: 'proposal',
            service: 'Nuevo curso DeFi Avanzado',
            user: '0x789...ghi',
            amount: '0',
            timestamp: Date.now() - 900000,
            status: 'completed'
          }
        ]

        setTransactions(historicalTransactions)
      } catch (error) {
        console.error('Error loading historical transactions:', error)
      }
    }

    if (isConnected) {
      loadHistoricalTransactions()
    }
  }, [isConnected])

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev)
  }, [])

  return {
    transactions,
    isLive,
    toggleLive,
    isConnected
  }
}
