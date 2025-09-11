import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useContracts } from './useContracts'
import { useCallback, useEffect, useState } from 'react'
import { MARKETPLACE_ABI, ARB_TOKEN_ABI } from './contracts'

interface Service {
  id: number
  provider: string
  title: string
  description: string
  price: bigint
  tokenType: number // 0: ETH, 1: ARB
  category: number
  isActive: boolean
  minReputation: bigint
}

interface Order {
  serviceId: number
  buyer: string
  provider: string
  amount: bigint
  paymentToken: number
  status: number // 0: Pending, 1: InProgress, 2: Completed, 3: Disputed
  timestamp: bigint
}

export function useMarketplace() {
  const { address } = useAccount()
  const chainId = useChainId()
  const contracts = useContracts()
  const [services, setServices] = useState<Service[]>([])
  const [userServices, setUserServices] = useState<Service[]>([])
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Determinar si estamos en Arbitrum
  const isArbitrum = chainId === 421614

  const { writeContract: writeContract } = useWriteContract()
  const { data: hash, isPending, error } = useWriteContract()

  // Leer contador de servicios
  const { data: serviceCounter, refetch: refetchServiceCounter } = useReadContract({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    functionName: 'serviceCounter',
    query: {
      enabled: !!contracts.marketplace
    }
  })

  // Leer reputación del usuario
  const { data: userReputation, refetch: refetchUserReputation } = useReadContract({
    address: contracts.marketplace,
    abi: MARKETPLACE_ABI,
    functionName: 'userReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.marketplace
    }
  })

  // Leer balance de ARB del usuario
  const { data: arbBalance, refetch: refetchArbBalance } = useReadContract({
    address: contracts.arbToken,
    abi: ARB_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.arbToken
    }
  })

  // Leer allowance de ARB para el marketplace
  const { data: arbAllowance, refetch: refetchArbAllowance } = useReadContract({
    address: contracts.arbToken,
    abi: ARB_TOKEN_ABI,
    functionName: 'allowance',
    args: address && contracts.marketplace ? [address, contracts.marketplace] : undefined,
    query: {
      enabled: !!address && !!contracts.arbToken && !!contracts.marketplace
    }
  })

  // Función para cargar todos los servicios
  const loadServices = useCallback(async () => {
    if (!serviceCounter || !contracts.marketplace) {
      return
    }

    setIsLoading(true)
    try {
      const servicePromises = []
      const totalServices = Number(serviceCounter)
      
      // Cargar servicios basado en el rango de la red
      const { start, end } = isArbitrum ? { start: 1, end: Math.min(totalServices, 5) } : { start: 1, end: Math.min(totalServices, 3) }
      
      for (let i = start; i <= end; i++) {
        servicePromises.push(
          fetch(`/api/service/${i}`).then(res => res.json()).catch(() => null)
        )
      }

      const serviceResults = await Promise.all(servicePromises)
      const validServices = serviceResults.filter(service => service !== null)
      
      setServices(validServices)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setIsLoading(false)
    }
  }, [serviceCounter, contracts.marketplace, isArbitrum])

  // Función para cargar servicios del usuario
  const loadUserServices = useCallback(async () => {
    if (!address || !contracts.marketplace) {
      return
    }

    try {
      // Esta función necesitaría una implementación más compleja
      // Por ahora retornamos un array vacío
      setUserServices([])
    } catch (error) {
      console.error('Error loading user services:', error)
    }
  }, [address, contracts.marketplace])

  // Función para crear un servicio
  const createService = useCallback(async (
    title: string,
    description: string,
    price: bigint,
    paymentToken: number,
    category: number,
    minReputation: bigint
  ) => {
    if (!contracts.marketplace) {
      throw new Error('Marketplace contract not available')
    }

    try {
      await writeContract({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: 'createService',
        args: [title, description, price, paymentToken, category, minReputation]
      })

      // Refrescar servicios después de la transacción
      setTimeout(() => {
        refetchServiceCounter()
        loadServices()
        loadUserServices()
      }, 2000)
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  }, [contracts.marketplace, writeContract, refetchServiceCounter, loadServices, loadUserServices])

  // Función para comprar servicio con ETH
  const purchaseServiceWithETH = useCallback(async (serviceId: number, price: bigint) => {
    if (!contracts.marketplace) {
      throw new Error('Marketplace contract not available')
    }

    try {
      await writeContract({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: 'purchaseServiceWithETH',
        args: [BigInt(serviceId)],
        value: price
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchUserReputation()
        loadUserServices()
      }, 2000)
    } catch (error) {
      console.error('Error purchasing service with ETH:', error)
      throw error
    }
  }, [contracts.marketplace, writeContract, refetchUserReputation, loadUserServices])

  // Función para aprobar tokens ARB
  const approveARB = useCallback(async (amount: bigint) => {
    if (!contracts.arbToken || !contracts.marketplace) {
      throw new Error('ARB token or marketplace contract not available')
    }

    try {
      await writeContract({
        address: contracts.arbToken,
        abi: ARB_TOKEN_ABI,
        functionName: 'approve',
        args: [contracts.marketplace, amount]
      })

      // Refrescar allowance después de la transacción
      setTimeout(() => {
        refetchArbAllowance()
      }, 2000)
    } catch (error) {
      console.error('Error approving ARB tokens:', error)
      throw error
    }
  }, [contracts.arbToken, contracts.marketplace, writeContract, refetchArbAllowance])

  // Función para comprar servicio con ARB
  const purchaseServiceWithARB = useCallback(async (serviceId: number) => {
    if (!contracts.marketplace) {
      throw new Error('Marketplace contract not available')
    }

    try {
      await writeContract({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: 'purchaseServiceWithERC20',
        args: [BigInt(serviceId)]
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchUserReputation()
        refetchArbBalance()
        loadUserServices()
      }, 2000)
    } catch (error) {
      console.error('Error purchasing service with ARB:', error)
      throw error
    }
  }, [contracts.marketplace, writeContract, refetchUserReputation, refetchArbBalance, loadUserServices])

  // Función para completar una orden
  const completeOrder = useCallback(async (orderId: number) => {
    if (!contracts.marketplace) {
      throw new Error('Marketplace contract not available')
    }

    try {
      await writeContract({
        address: contracts.marketplace,
        abi: MARKETPLACE_ABI,
        functionName: 'completeOrder',
        args: [BigInt(orderId)]
      })

      // Refrescar datos después de la transacción
      setTimeout(() => {
        refetchUserReputation()
        loadUserServices()
      }, 2000)
    } catch (error) {
      console.error('Error completing order:', error)
      throw error
    }
  }, [contracts.marketplace, writeContract, refetchUserReputation, loadUserServices])

  // Cargar servicios cuando cambie el contador
  useEffect(() => {
    if (serviceCounter) {
      loadServices()
    }
  }, [serviceCounter, loadServices])

  // Cargar servicios del usuario cuando cambie la dirección
  useEffect(() => {
    if (address) {
      loadUserServices()
    }
  }, [address, loadUserServices])

  return {
    services,
    userServices,
    userOrders,
    userReputation: userReputation ? Number(userReputation) : 0,
    arbBalance: arbBalance ? Number(arbBalance) / 1e18 : 0,
    arbAllowance: arbAllowance ? Number(arbAllowance) / 1e18 : 0,
    isLoading,
    isPending,
    error,
    createService,
    purchaseServiceWithETH,
    purchaseServiceWithARB,
    approveARB,
    completeOrder,
    refreshServices: loadServices,
    refreshUserServices: loadUserServices
  }
}
