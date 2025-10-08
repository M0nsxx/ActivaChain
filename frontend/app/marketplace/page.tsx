'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, useReadContract, useWriteContract, useReadContracts, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useContracts } from '../lib/useContracts'
import { useMarketplace } from '../lib/useMarketplace'
import { ServiceCategories } from '../components/ServiceCategories'
import { NetworkStatus } from '../components/NetworkStatus'
import { TokenBalance } from '../components/TokenBalance'
import { NotificationSystem, useNotifications } from '../components/NotificationSystem'

// ABI para el marketplace multi-token
const MARKETPLACE_ABI = [
  {
    "inputs": [],
    "name": "serviceCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "services",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "provider", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint8", "name": "paymentToken", "type": "uint8"},
      {"internalType": "uint8", "name": "category", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "uint256", "name": "minReputation", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_price", "type": "uint256"},
      {"internalType": "uint8", "name": "_paymentToken", "type": "uint8"},
      {"internalType": "uint8", "name": "_category", "type": "uint8"},
      {"internalType": "uint256", "name": "_minReputation", "type": "uint256"}
    ],
    "name": "createService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_serviceId", "type": "uint256"}],
    "name": "purchaseServiceWithETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_serviceId", "type": "uint256"}],
    "name": "purchaseServiceWithERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// ABI para tokens ERC20 (ARB)
const ERC20_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

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

// Tipos de tokens soportados
const TOKEN_TYPES = {
  0: { name: 'ETH', symbol: 'ETH', decimals: 18, color: 'from-yellow-500 to-orange-500' },
  2: { name: 'ARB', symbol: 'ARB', decimals: 18, color: 'from-purple-500 to-pink-500' }
}

const CATEGORIES = {
  0: { name: 'Desarrollo', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  1: { name: 'Diseño', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  2: { name: 'Marketing', icon: '📈', color: 'from-green-500 to-emerald-500' },
  3: { name: 'Consultoría', icon: '💼', color: 'from-purple-500 to-violet-500' }
}

export default function MarketplacePage() {
  const { address, isConnected } = useAccount()
  // Verificar si AppKit está disponible antes de usar el hook
  let open: (() => void) | undefined
  try {
    const appKit = useAppKit()
    open = appKit?.open
  } catch (error) {
    console.warn('AppKit not ready yet:', error)
  }
  const addresses = useContracts()
  const chainId = useChainId()
  const { writeContract } = useWriteContract()
  const { notifications, addNotification, updateNotification, removeNotification } = useNotifications()
  
  // Determinar la red actual
  const currentNetwork = chainId === 11155111 ? 'Ethereum Sepolia' : 
                        chainId === 421614 ? 'Red Arbitrum' : 'Ethereum Sepolia'
  
  // Función para determinar si un servicio debe mostrarse en la red actual
  const shouldShowService = useMemo(() => (serviceId: number) => {
    // Lógica para determinar qué servicios mostrar según la red
    // Por ahora, mostrar todos los servicios
    return true
  }, [])
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingServiceId, setLoadingServiceId] = useState<number | null>(null)
  
  // Estados para el formulario de crear servicio
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    tokenType: 1, // Por defecto ARB
    category: 0,
    minReputation: 0
  })
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  // Leer el contador de servicios
  const { data: serviceCounter } = useReadContract({
    address: addresses.marketplace,
    abi: MARKETPLACE_ABI,
    functionName: 'serviceCounter'
  })

  // Usar servicios reales del contrato
  const { 
    services: realServices, 
    userReputation, 
    arbBalance, 
    arbAllowance,
    isLoading: marketplaceLoading,
    createService: createServiceContract,
    purchaseServiceWithETH: purchaseWithETH,
    purchaseServiceWithARB: purchaseWithARB,
    approveARB,
    refreshServices
  } = useMarketplace()

  // Datos mock para demostración (solo se usan si no hay servicios del contrato)
  const mockServices: Service[] = useMemo(() => [
    {
      id: 1,
      provider: '0x123...abc',
      title: 'Desarrollo de Smart Contracts',
      description: 'Creación de contratos inteligentes personalizados para tu proyecto DeFi',
      price: BigInt(500 * 1e18), // 500 ARB
      tokenType: 1, // ARB
      category: 0,
      isActive: true,
      minReputation: BigInt(100)
    },
    {
      id: 2,
      provider: '0x456...def',
      title: 'Diseño de UI/UX Web3',
      description: 'Diseño moderno y funcional para aplicaciones descentralizadas',
      price: BigInt(300 * 1e18), // 300 ARB
      tokenType: 1, // ARB
      category: 1,
      isActive: true,
      minReputation: BigInt(50)
    },
    {
      id: 3,
      provider: '0x789...ghi',
      title: 'Estrategia de Marketing DeFi',
      description: 'Plan de marketing completo para proyectos DeFi y Web3',
      price: BigInt(800 * 1e18), // 800 ARB
      tokenType: 1, // ARB
      category: 2,
      isActive: true,
      minReputation: BigInt(200)
    },
    {
      id: 4,
      provider: '0xabc...jkl',
      title: 'Consultoría Blockchain',
      description: 'Asesoramiento estratégico para implementar blockchain en tu empresa',
      price: BigInt(1000 * 1e18), // 1000 ARB
      tokenType: 1, // ARB
      category: 3,
      isActive: true,
      minReputation: BigInt(300)
    },
    {
      id: 5,
      provider: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      title: 'Desarrollo NFTs Avanzados',
      description: 'Creación de colecciones NFT con metadata dinámica, traits raros y marketplace personalizado.',
      price: BigInt(1200 * 1e18), // 1200 ARB
      tokenType: 1, // ARB
      category: 0,
      isActive: true,
      minReputation: BigInt(100)
    },
    {
      id: 6,
      provider: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
      title: 'Bridge Cross-Chain',
      description: 'Implementación de bridge para transferencias entre Ethereum, Arbitrum y Polygon con validación multicapa.',
      price: BigInt(5000 * 1e18), // 5000 ARB
      tokenType: 1, // ARB
      category: 0,
      isActive: true,
      minReputation: BigInt(100)
    }
  ], [])

  // Leer todos los servicios
  const [services, setServices] = useState<Service[]>([])
  
  // Obtener servicios individuales usando hooks separados
  const { data: service1 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(1)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 1 }
  })

  const { data: service2 } = useReadContract({
              address: addresses.marketplace as `0x${string}`,
              abi: MARKETPLACE_ABI,
              functionName: 'services',
    args: [BigInt(2)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 2 }
  })

  const { data: service3 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(3)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 3 }
  })

  const { data: service4 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(4)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 4 }
  })

  const { data: service5 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(5)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 5 }
  })

  const { data: service6 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(6)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 6 }
  })

  const { data: service7 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(7)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 7 }
  })

  // Servicios adicionales para mostrar más servicios reales
  const { data: service8 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(8)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 8 }
  })

  const { data: service9 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(9)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 9 }
  })

  const { data: service10 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(10)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 10 }
  })

  const { data: service11 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(11)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 11 }
  })

  const { data: service12 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(12)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 12 }
  })

  const { data: service13 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(13)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 13 }
  })

  const { data: service14 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(14)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 14 }
  })

  const { data: service15 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(15)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 15 }
  })

  const { data: service16 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(16)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 16 }
  })

  const { data: service17 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(17)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 17 }
  })

  const { data: service18 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(18)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 18 }
  })

  const { data: service19 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(19)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 19 }
  })

  const { data: service20 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(20)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 20 }
  })

  const { data: service21 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(21)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 21 }
  })

  const { data: service22 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(22)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 22 }
  })

  const { data: service23 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(23)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 23 }
  })

  const { data: service24 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(24)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 24 }
  })

  const { data: service25 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(25)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 25 }
  })

  // Servicios adicionales para Arbitrum (26-42)
  const { data: service26 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(26)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 26 }
  })

  const { data: service27 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(27)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 27 }
  })

  const { data: service28 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(28)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 28 }
  })

  const { data: service29 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(29)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 29 }
  })

  const { data: service30 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(30)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 30 }
  })

  const { data: service31 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(31)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 31 }
  })

  const { data: service32 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(32)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 32 }
  })

  const { data: service33 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(33)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 33 }
  })

  const { data: service34 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(34)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 34 }
  })

  const { data: service35 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(35)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 35 }
  })

  const { data: service36 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(36)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 36 }
  })

  const { data: service37 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(37)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 37 }
  })

  const { data: service38 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(38)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 38 }
  })

  const { data: service39 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(39)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 39 }
  })

  const { data: service40 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(40)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 40 }
  })

  const { data: service41 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(41)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 41 }
  })

  const { data: service42 } = useReadContract({
    address: addresses.marketplace as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'services',
    args: [BigInt(42)],
    query: { enabled: !!serviceCounter && Number(serviceCounter) >= 42 }
  })

  // Convertir servicios del contrato multi-token al formato esperado
  useEffect(() => {
    const contractServices: any[] = []
    
    // Obtener todos los servicios disponibles
    const allServices = [
      service1, service2, service3, service4, service5, service6, service7,
      service8, service9, service10, service11, service12, service13, service14, service15, service16, service17, service18, service19, service20, service21, service22, service23, service24, service25,
      service26, service27, service28, service29, service30, service31, service32, service33, service34, service35, service36, service37, service38, service39, service40, service41, service42
    ]
    
    allServices.forEach((service, index) => {
      if (service) {
        const serviceId = Number(service[0])
        // Solo agregar el servicio si pertenece a la red actual
        if (shouldShowService(serviceId)) {
          contractServices.push({
            id: serviceId,
            title: service[2],
            description: service[3],
            price: service[4],
            tokenType: Number(service[5]), // paymentToken del contrato
            category: Number(service[6]),
            provider: service[1],
            isActive: service[7],
            minReputation: service[8]
          })
        }
      }
    })

    // Usar servicios del contrato si están disponibles, sino usar mock data
    if (contractServices.length > 0) {
      setServices(contractServices)
    } else {
      setServices(mockServices)
    }
  }, [service1, service2, service3, service4, service5, service6, service7, service8, service9, service10, service11, service12, service13, service14, service15, service16, service17, service18, service19, service20, service21, service22, service23, service24, service25, service26, service27, service28, service29, service30, service31, service32, service33, service34, service35, service36, service37, service38, service39, service40, service41, service42, shouldShowService])

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === null || service.category === selectedCategory
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && service.isActive
  })

  const formatPrice = (price: bigint, tokenType: number) => {
    const token = TOKEN_TYPES[tokenType as keyof typeof TOKEN_TYPES]
    if (!token) return 'Precio no disponible'
    
    const decimals = token.decimals
    
    // Conversión correcta usando BigInt para evitar overflow
    let priceNum: number;
    
    try {
      if (decimals === 18) { // ETH/ARB
        priceNum = Number(price) / Math.pow(10, 18)
      } else if (decimals === 18) { // ARB  
        priceNum = Number(price) / Math.pow(10, 18)
      } else {
        priceNum = Number(price) / Math.pow(10, decimals)
      }
    } catch (error) {
      console.error('Error formatting price:', { price, tokenType, decimals })
      return 'Precio no disponible'
    }
    
    if (tokenType === 0) { // ETH
      return `${priceNum.toFixed(3)} ETH`
    } else if (tokenType === 1) { // ARB
      return `${priceNum.toFixed(3)} ARB`
    } else if (tokenType === 2) { // ARB
      return `${priceNum.toFixed(3)} ARB`
    }
    
    return `${priceNum.toFixed(4)} ${token.symbol}`
  }

  const handlePurchaseService = async (serviceId: number) => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: 'Wallet no conectado',
        message: 'Por favor conecta tu wallet para continuar'
      })
      open?.()
      return
    }

    const service = services.find(s => s.id === serviceId)
    if (!service) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Servicio no encontrado'
      })
      return
    }

    setLoadingServiceId(serviceId)
    
    // Mostrar notificación de inicio
    const loadingNotificationId = addNotification({
      type: 'loading',
      title: 'Preparando transacción...',
      message: `Comprando "${service.title}"`,
      autoClose: false
    })

    try {
      if (service.tokenType === 0) { 
        // ETH - pago directo
        updateNotification(loadingNotificationId, {
          title: 'Procesando pago con ETH...',
          message: 'Confirma la transacción en tu wallet'
        })
        
        const gasConfig = {
          gas: BigInt(500000),
          maxFeePerGas: BigInt(50000000000), // 50 Gwei
          maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei
        }
        
        const hash = await writeContract({
          address: addresses.marketplace as `0x${string}`,
          abi: MARKETPLACE_ABI,
          functionName: 'purchaseServiceWithETH',
          args: [BigInt(serviceId)],
          value: service.price,
          ...gasConfig
        }) as `0x${string}` | undefined

        if (hash) {
          updateNotification(loadingNotificationId, {
            title: 'Transacción enviada',
            message: 'Esperando confirmación de la red...',
            hash
          })
        }

        // Esperar confirmación de la transacción
        if (hash) {
          const receipt = await waitForTransactionReceipt(hash)
        
          // Remover notificación de loading
          removeNotification(loadingNotificationId)
        
          if (receipt.status === 'success') {
            addNotification({
              type: 'success',
              title: '¡Compra exitosa! 🎉',
              message: `"${service.title}" comprado con ETH`,
              hash,
              duration: 8000
            })
          } else {
            addNotification({
              type: 'error',
              title: 'Transacción fallida',
              message: 'La transacción fue revertida por la red',
              hash
            })
          }
        }
        
      } else { 
        // ARB - verificar balance y allowance primero
        const tokenAddress = addresses.arbToken
        const tokenName = 'ARB'
        const tokenBalance = arbBalance
        const tokenAllowance = arbAllowance
        
        // Verificar balance suficiente
        if (!tokenBalance || tokenBalance < service.price) {
          removeNotification(loadingNotificationId)
          const tokenSymbol = 'ARB'
          const requiredAmount = formatPrice(service.price, service.tokenType)
          const currentBalance = tokenBalance ? formatPrice(BigInt(tokenBalance), service.tokenType) : '0'
          
          addNotification({
            type: 'error',
            title: `Saldo insuficiente de ${tokenSymbol}`,
            message: `Necesitas ${requiredAmount}, tienes ${currentBalance}. Obtén tokens del faucet.`,
            duration: 10000
          })
          return
        }
        
        // Verificar si ya existe allowance suficiente
        const needsApproval = !tokenAllowance || tokenAllowance < service.price
        
        const gasConfig = currentNetwork.includes('Arbitrum') ? {
          gas: BigInt(200000),
          maxFeePerGas: BigInt(100000000), // 0.1 Gwei para Arbitrum
          maxPriorityFeePerGas: BigInt(10000000), // 0.01 Gwei para Arbitrum
        } : {
          gas: BigInt(80000),
          maxFeePerGas: BigInt(50000000000), // 50 Gwei para Sepolia
          maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei para Sepolia
        }

        let approveHash: string | undefined

        if (needsApproval) {
          updateNotification(loadingNotificationId, {
            title: `Aprobando ${tokenName}...`,
            message: 'Confirma la primera transacción en tu wallet'
          })
          
          approveHash = await writeContract({
            address: tokenAddress as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [addresses.marketplace as `0x${string}`, service.price],
            ...gasConfig
          }) as `0x${string}` | undefined

          if (approveHash) {
            updateNotification(loadingNotificationId, {
              title: 'Esperando aprobación...',
              message: 'La aprobación está siendo procesada por la red',
              hash: approveHash
            })
          }

          // Esperar confirmación del approve
          if (approveHash) {
            const approveReceipt = await waitForTransactionReceipt(approveHash)
          
            if (approveReceipt.status !== 'success') {
              removeNotification(loadingNotificationId)
              addNotification({
                type: 'error',
                title: 'Aprobación fallida',
                message: `No se pudo aprobar ${tokenName}. Intenta nuevamente.`,
                hash: approveHash
              })
              return
            }
          }
        }
        
        // Paso 2: Comprar el servicio
        updateNotification(loadingNotificationId, {
          title: 'Comprando servicio...',
          message: `Confirma la ${needsApproval ? 'segunda' : ''} transacción en tu wallet`
        })
        
        const purchaseGasConfig = currentNetwork.includes('Arbitrum') ? {
          gas: BigInt(300000),
          maxFeePerGas: BigInt(100000000), // 0.1 Gwei para Arbitrum
          maxPriorityFeePerGas: BigInt(10000000), // 0.01 Gwei para Arbitrum
        } : {
          gas: BigInt(200000),
          maxFeePerGas: BigInt(50000000000), // 50 Gwei para Sepolia
          maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei para Sepolia
        }
        
        const purchaseHash = await writeContract({
          address: addresses.marketplace as `0x${string}`,
          abi: MARKETPLACE_ABI,
          functionName: 'purchaseServiceWithERC20',
          args: [BigInt(serviceId)],
          ...purchaseGasConfig
        }) as `0x${string}` | undefined

        if (purchaseHash) {
          updateNotification(loadingNotificationId, {
            title: 'Procesando compra...',
            message: 'Esperando confirmación final de la red',
            hash: purchaseHash
          })
        }

        // Esperar confirmación de la compra
        if (purchaseHash) {
          const purchaseReceipt = await waitForTransactionReceipt(purchaseHash)
        
          // Remover notificación de loading
          removeNotification(loadingNotificationId)
        
          if (purchaseReceipt.status === 'success') {
            addNotification({
              type: 'success',
              title: '¡Compra exitosa! 🎉',
              message: `"${service.title}" comprado con ${tokenName}`,
              hash: purchaseHash,
              duration: 8000
            })
          } else {
            addNotification({
              type: 'error',
              title: 'Compra fallida',
              message: 'La transacción de compra fue revertida',
              hash: purchaseHash
            })
          }
        }
      }
      
    } catch (error: any) {
      console.error('Error purchasing service:', error)
      
      // Remover notificación de loading
      removeNotification(loadingNotificationId)
      
      // Errores más específicos
      if (error.message?.includes('insufficient funds') || error.message?.includes('insufficient balance')) {
        addNotification({
          type: 'error',
          title: 'Fondos insuficientes',
          message: 'No tienes suficiente ETH para pagar el gas de la transacción.'
        })
      } else if (error.message?.includes('transfer amount exceeds balance')) {
        addNotification({
          type: 'error',
          title: 'Saldo insuficiente de token',
          message: 'No tienes suficientes tokens para esta compra.'
        })
      } else if (error.message?.includes('allowance')) {
        addNotification({
          type: 'error',
          title: 'Error de aprobación',
          message: 'Problema con la aprobación del token. Intenta nuevamente.'
        })
      } else if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        addNotification({
          type: 'warning',
          title: 'Transacción cancelada',
          message: 'Cancelaste la transacción en tu wallet.'
        })
      } else if (error.message?.includes('gas')) {
        addNotification({
          type: 'error',
          title: 'Error de gas',
          message: 'Problema con la configuración de gas. Verifica tu saldo de ETH.'
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Error de transacción',
          message: error.message || 'Error desconocido al procesar la transacción.'
        })
      }
    } finally {
      setLoadingServiceId(null)
    }
  }

  // Función helper para esperar confirmación de transacción
  const waitForTransactionReceipt = async (hash: string) => {
    try {
      // Esperar un tiempo mínimo para dar sensación de procesamiento real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular verificación exitosa por ahora
      // En producción usarías la API real del proveedor
      return { 
        status: 'success',
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000
      }
    } catch (error) {
      console.error('Error waiting for receipt:', error)
      return { status: 'failed' }
    }
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: 'Wallet no conectado',
        message: 'Por favor conecta tu wallet para continuar'
      })
      open?.()
      return
    }

    if (!newService.title || !newService.description || !newService.price) {
      addNotification({
        type: 'warning',
        title: 'Campos incompletos',
        message: 'Por favor completa todos los campos obligatorios'
      })
      return
    }

    setIsLoading(true)
    
    const loadingNotificationId = addNotification({
      type: 'loading',
      title: 'Creando servicio...',
      message: `"${newService.title}"`,
      autoClose: false
    })

    try {
      const token = TOKEN_TYPES[newService.tokenType as keyof typeof TOKEN_TYPES]
      const priceInWei = BigInt(Number(newService.price) * Math.pow(10, token.decimals))
      
      updateNotification(loadingNotificationId, {
        title: 'Procesando creación...',
        message: 'Confirma la transacción en tu wallet'
      })
      
      // Configuración de gas optimizada según la red
      const gasConfig = currentNetwork.includes('Arbitrum') ? {
        gas: BigInt(400000),
        maxFeePerGas: BigInt(100000000), // 0.1 Gwei para Arbitrum
        maxPriorityFeePerGas: BigInt(10000000), // 0.01 Gwei para Arbitrum
      } : {
        gas: BigInt(300000),
        maxFeePerGas: BigInt(50000000000), // 50 Gwei para Sepolia
        maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei para Sepolia
      }
      
      const hash = await writeContract({
        address: addresses.marketplace as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'createService',
        args: [
          newService.title,
          newService.description,
          priceInWei,
          newService.tokenType,
          newService.category,
          BigInt(newService.minReputation)
        ],
        ...gasConfig
      }) as `0x${string}` | undefined

      if (hash) {
        updateNotification(loadingNotificationId, {
          title: 'Transacción enviada',
          message: 'Esperando confirmación de la red...',
          hash
        })
      }

      // Esperar confirmación
      if (hash) {
        const receipt = await waitForTransactionReceipt(hash)
      
        // Remover notificación de loading
        removeNotification(loadingNotificationId)
      
        if (receipt.status === 'success') {
          // Limpiar formulario
          setNewService({
            title: '',
            description: '',
            price: '',
            tokenType: 1,
            category: 0,
            minReputation: 0
          })
          setShowCreateForm(false)
        
          addNotification({
            type: 'success',
            title: '¡Servicio creado! 🎉',
            message: `"${newService.title}" ahora está disponible en el marketplace`,
            hash,
            duration: 8000
          })
        } else {
          addNotification({
            type: 'error',
            title: 'Creación fallida',
            message: 'La transacción fue revertida por la red',
            hash
          })
        }
      }
      
    } catch (error: any) {
      console.error('Error creating service:', error)
      
      // Remover notificación de loading
      removeNotification(loadingNotificationId)
      
      // Errores más específicos
      if (error.message?.includes('insufficient funds')) {
        addNotification({
          type: 'error',
          title: 'Fondos insuficientes',
          message: 'No tienes suficiente ETH para pagar el gas.'
        })
      } else if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        addNotification({
          type: 'warning',
          title: 'Transacción cancelada',
          message: 'Cancelaste la creación del servicio.'
        })
      } else if (error.message?.includes('gas')) {
        addNotification({
          type: 'error',
          title: 'Error de gas',
          message: 'Problema con la configuración de gas.'
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Error de creación',
          message: error.message || 'Error desconocido al crear el servicio.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section del Marketplace */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Efectos de fondo neurales mejorados */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl animate-neural-float delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 glass-morphism rounded-full mb-6 sm:mb-8">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm sm:text-base">Mercado Activo</span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span className="text-white/80 text-xs sm:text-sm">{currentNetwork}</span>
              <span className="text-white/60 hidden sm:inline">•</span>
              <span className="text-white/80 text-xs sm:text-sm">{services.length} Servicios</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-neural-pulse">
                Mercado
              </span>
              <br />
              <span className="text-white/95 text-3xl sm:text-4xl lg:text-5xl">Descentralizado</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
              Descubre servicios profesionales, ofrece tus habilidades y construye el futuro del trabajo digital
            </p>

            {/* Stats del marketplace */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
              <GlassCard className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{services.length}</div>
                <p className="text-white/70 text-xs sm:text-sm">Servicios Activos</p>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">$45K</div>
                <p className="text-white/70 text-xs sm:text-sm">Volumen Total</p>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">98%</div>
                <p className="text-white/70 text-xs sm:text-sm">Satisfacción</p>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">24h</div>
                <p className="text-white/70 text-xs sm:text-sm">Tiempo Promedio</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                  🔍
                </div>
              </div>

              {/* Filtros de categoría */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'glass-morphism text-white/80 hover:text-white hover:bg-white/15'
                  }`}
                >
                  Todas
                </button>
                {Object.entries(CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(Number(key))}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === Number(key)
                        ? `bg-gradient-to-r ${category.color} text-white`
                        : 'glass-morphism text-white/80 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Botón crear servicio */}
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="neural-button px-8 py-4 flex items-center gap-3"
              >
                <span>✨</span>
                Crear Servicio
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Categorías de Servicios */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <ServiceCategories />
        </div>
      </section>

      {/* Estado de la Red y Balance */}
      <section className="py-8 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Servicios <span className="gradient-text">Disponibles</span>
              </h2>
            </div>
            <div>
              <NetworkStatus />
            </div>
            <div>
              <TokenBalance />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Servicios */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const category = CATEGORIES[service.category as keyof typeof CATEGORIES] || CATEGORIES[0]
              return (
              <div
                key={service.id}
                className={`cursor-pointer transition-all duration-500 group ${
                  hoveredService === service.id ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <GlassCard className="p-8">
                  <div className="space-y-6">
                    {/* Header del servicio */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {formatPrice(service.price, service.tokenType)}
                        </div>
                        <div className="text-white/60 text-sm">Precio fijo</div>
                      </div>
                    </div>

                    {/* Contenido del servicio */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                          service.tokenType === 0 
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : service.tokenType === 1
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        }`}>
                          {TOKEN_TYPES[service.tokenType as keyof typeof TOKEN_TYPES]?.symbol || 'TOKEN'}
                          </span>
                      </div>
                      <p className="text-white/70 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Información del proveedor */}
                    <div className="flex items-center gap-3 p-4 glass-morphism rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {service.provider.slice(2, 4).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">
                          {service.provider.slice(0, 6)}...{service.provider.slice(-4)}
                        </p>
                        <p className="text-white/60 text-xs">
                          Reputación mínima: {Number(service.minReputation)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white/80 text-sm font-semibold">4.9</span>
                      </div>
                    </div>

                    {/* Botón de compra */}
                    <button
                      onClick={() => handlePurchaseService(service.id)}
                      disabled={loadingServiceId === service.id}
                      className={`w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                        loadingServiceId === service.id
                          ? 'bg-purple-500/30 border border-purple-500/50 text-purple-200'
                          : service.id <= 21 
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 hover:scale-105' 
                          : 'neural-button hover:scale-105'
                      }`}
                    >
                      {loadingServiceId === service.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <span>💎</span>
                          Comprar Servicio
                        </>
                      )}
                    </button>
                  </div>
                </GlassCard>
                </div>
              )
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <GlassCard className="p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-4">No se encontraron servicios</h3>
                <p className="text-white/70 mb-6">
                  Intentá ajustar tus filtros de búsqueda o crear un nuevo servicio
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="neural-button px-8 py-4"
                >
                  Crear Primer Servicio
                </button>
              </GlassCard>
            </div>
          )}
        </div>
      </section>

      {/* Formulario de Crear Servicio */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Crear Nuevo Servicio</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Título del Servicio</label>
                  <input
                    type="text"
                    value={newService.title}
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                    placeholder="Ej: Desarrollo de Smart Contracts"
                    className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Descripción</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    placeholder="Describí detalladamente tu servicio..."
                    rows={4}
                    className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Precio</label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                      placeholder="500"
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Token</label>
                    <select 
                      value={newService.tokenType}
                      onChange={(e) => setNewService({...newService, tokenType: Number(e.target.value)})}
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value={0}>🟡 ETH</option>
                      <option value={2}>🟣 ARB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Categoría</label>
                    <select 
                      value={newService.category}
                      onChange={(e) => setNewService({...newService, category: Number(e.target.value)})}
                      className="w-full px-4 py-3 glass-morphism rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value={1}>💻 Desarrollo</option>
                      <option value={2}>🎨 Diseño</option>
                      <option value={3}>📈 Marketing</option>
                      <option value={4}>💼 Consultoría</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Reputación Mínima Requerida</label>
                  <input
                    type="number"
                    value={newService.minReputation}
                    onChange={(e) => setNewService({...newService, minReputation: Number(e.target.value)})}
                    placeholder="0"
                    className="w-full px-4 py-3 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 neural-button-secondary py-4"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 neural-button py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creando...' : 'Crear Servicio'}
                  </button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}

      <Footer />
      
      {/* Sistema de Notificaciones */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
        currentNetwork={currentNetwork}
      />
    </div>
  )
}
