'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useSearchParams } from 'next/navigation'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para CommunitySystem
const COMMUNITY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "bio", "type": "string"},
      {"internalType": "string[]", "name": "specializations", "type": "string[]"},
      {"internalType": "uint256", "name": "experience", "type": "uint256"},
      {"internalType": "uint256", "name": "hourlyRate", "type": "uint256"}
    ],
    "name": "registerMentor",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "goals", "type": "string"},
      {"internalType": "uint256", "name": "level", "type": "uint256"}
    ],
    "name": "registerMentee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "uint256", "name": "maxParticipants", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "createWorkshop",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "uint256", "name": "maxParticipants", "type": "uint256"}
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "workshopId", "type": "uint256"}],
    "name": "joinWorkshop",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "eventId", "type": "uint256"}],
    "name": "joinEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "workshopId", "type": "uint256"}],
    "name": "getWorkshopInfo",
    "outputs": [
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "uint256", "name": "maxParticipants", "type": "uint256"},
      {"internalType": "uint256", "name": "currentParticipants", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "eventId", "type": "uint256"}],
    "name": "getEventInfo",
    "outputs": [
      {"internalType": "address", "name": "organizer", "type": "address"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "uint256", "name": "maxParticipants", "type": "uint256"},
      {"internalType": "uint256", "name": "currentParticipants", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveWorkshops",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveEvents",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface WorkshopInfo {
  organizer: string
  title: string
  description: string
  startTime: bigint
  endTime: bigint
  maxParticipants: bigint
  currentParticipants: bigint
  price: bigint
  isActive: boolean
}

interface EventInfo {
  organizer: string
  title: string
  description: string
  startTime: bigint
  endTime: bigint
  location: string
  maxParticipants: bigint
  currentParticipants: bigint
  isActive: boolean
}

export function CommunitySystem() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const { addNotification } = useNotifications()
  const searchParams = useSearchParams()
  
  const [activeTab, setActiveTab] = useState<'mentors' | 'workshops' | 'events' | 'create'>('workshops')
  const [selectedWorkshop, setSelectedWorkshop] = useState<number>(1)
  const [selectedEvent, setSelectedEvent] = useState<number>(1)

  // Detectar parámetro de URL para establecer tab activo
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['mentors', 'workshops', 'events', 'create'].includes(tab)) {
      setActiveTab(tab as 'mentors' | 'workshops' | 'events' | 'create')
    }
  }, [searchParams])
  
  // Estados para formularios
  const [mentorForm, setMentorForm] = useState({
    name: '',
    bio: '',
    specializations: [''],
    experience: '',
    hourlyRate: ''
  })
  
  const [menteeForm, setMenteeForm] = useState({
    name: '',
    goals: '',
    level: 1
  })
  
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    price: ''
  })
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    maxParticipants: ''
  })
  
  // Leer workshops activos
  const { data: activeWorkshops } = useReadContract({
    address: contracts.community,
    abi: COMMUNITY_ABI,
    functionName: 'getActiveWorkshops',
    query: { enabled: !!contracts.community }
  })
  
  // Leer eventos activos
  const { data: activeEvents } = useReadContract({
    address: contracts.community,
    abi: COMMUNITY_ABI,
    functionName: 'getActiveEvents',
    query: { enabled: !!contracts.community }
  })
  
  // Leer información de workshop seleccionado
  const { data: workshopInfo } = useReadContract({
    address: contracts.community,
    abi: COMMUNITY_ABI,
    functionName: 'getWorkshopInfo',
    args: [BigInt(selectedWorkshop)],
    query: { enabled: !!contracts.community && selectedWorkshop > 0 }
  })
  
  // Leer información de evento seleccionado
  const { data: eventInfo } = useReadContract({
    address: contracts.community,
    abi: COMMUNITY_ABI,
    functionName: 'getEventInfo',
    args: [BigInt(selectedEvent)],
    query: { enabled: !!contracts.community && selectedEvent > 0 }
  })
  
  const { writeContract } = useWriteContract()
  
  // Workshops de ejemplo para mostrar cuando no hay workshops del contrato
  const exampleWorkshops = [
    {
      id: 1,
      title: "Introducción a Smart Contracts",
      description: "Aprende los fundamentos de los contratos inteligentes, desde conceptos básicos hasta implementación práctica con Solidity.",
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2 horas
      maxParticipants: 25,
      currentParticipants: 12,
      price: 0.05,
      isActive: true,
      organizer: "0x1234...5678"
    },
    {
      id: 2,
      title: "DeFi para Principiantes",
      description: "Explora el mundo de las finanzas descentralizadas: yield farming, liquidity pools, y protocolos DeFi más populares.",
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3 horas
      maxParticipants: 30,
      currentParticipants: 8,
      price: 0.08,
      isActive: true,
      organizer: "0x9876...5432"
    },
    {
      id: 3,
      title: "NFTs y Mercados Digitales",
      description: "Crea, mintea y comercializa NFTs. Aprende sobre estándares ERC721/ERC1155 y plataformas de mercado.",
      startTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 días desde ahora
      endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // +2.5 horas
      maxParticipants: 20,
      currentParticipants: 15,
      price: 0.06,
      isActive: true,
      organizer: "0x4567...8901"
    },
    {
      id: 4,
      title: "Seguridad en Web3",
      description: "Mejores prácticas de seguridad, auditorías de contratos, y protección de activos digitales.",
      startTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 días desde ahora
      endTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +4 horas
      maxParticipants: 15,
      currentParticipants: 3,
      price: 0.1,
      isActive: true,
      organizer: "0x2468...1357"
    }
  ]
  
  // Eventos de ejemplo para mostrar cuando no hay eventos del contrato
  const exampleEvents = [
    {
      id: 1,
      title: "Meetup Web3 Uruguay",
      description: "Encuentro presencial para la comunidad Web3 de Uruguay. Networking, charlas técnicas y oportunidades de colaboración.",
      startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días desde ahora
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +4 horas
      location: "Montevideo, Uruguay",
      maxParticipants: 50,
      currentParticipants: 23,
      isActive: true,
      organizer: "0x1111...2222"
    },
    {
      id: 2,
      title: "Hackathon Blockchain 2025",
      description: "Competencia de desarrollo blockchain de 48 horas. Premios en ETH y oportunidades de trabajo en Web3.",
      startTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 días desde ahora
      endTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 48 * 60 * 60 * 1000), // +48 horas
      location: "Online",
      maxParticipants: 100,
      currentParticipants: 67,
      isActive: true,
      organizer: "0x3333...4444"
    },
    {
      id: 3,
      title: "Workshop de Seguridad en DeFi",
      description: "Sesión práctica sobre auditoría de contratos inteligentes y mejores prácticas de seguridad en protocolos DeFi.",
      startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días desde ahora
      endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3 horas
      location: "Buenos Aires, Argentina",
      maxParticipants: 30,
      currentParticipants: 18,
      isActive: true,
      organizer: "0x5555...6666"
    },
    {
      id: 4,
      title: "Conferencia NFT Art & Culture",
      description: "Explorando el arte digital, colecciones NFT y el futuro de la creatividad en Web3. Incluye exposición de arte digital.",
      startTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 días desde ahora
      endTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // +6 horas
      location: "Santiago, Chile",
      maxParticipants: 75,
      currentParticipants: 42,
      isActive: true,
      organizer: "0x7777...8888"
    }
  ]
  
  const handleRegisterMentor = async () => {
    if (!address) return
    
    try {
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'registerMentor',
        args: [
          mentorForm.name,
          mentorForm.bio,
          mentorForm.specializations.filter(s => s.trim() !== ''),
          BigInt(mentorForm.experience),
          BigInt(mentorForm.hourlyRate)
        ],
        value: BigInt(0.01 * 1e18) // 0.01 ETH registration fee
      })
      
      addNotification({
        type: 'success',
        title: 'Mentor Registrado',
        message: 'Te has registrado como mentor exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al registrarse como mentor'
      })
    }
  }
  
  const handleRegisterMentee = async () => {
    if (!address) return
    
    try {
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'registerMentee',
        args: [
          menteeForm.name,
          menteeForm.goals,
          BigInt(menteeForm.level)
        ]
      })
      
      addNotification({
        type: 'success',
        title: 'Mentoreada Registrada',
        message: 'Te has registrado como mentoreada exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al registrarse como mentoreada'
      })
    }
  }
  
  const handleCreateWorkshop = async () => {
    if (!address) return
    
    try {
      const startTime = Math.floor(new Date(workshopForm.startTime).getTime() / 1000)
      const endTime = Math.floor(new Date(workshopForm.endTime).getTime() / 1000)
      
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'createWorkshop',
        args: [
          workshopForm.title,
          workshopForm.description,
          BigInt(startTime),
          BigInt(endTime),
          BigInt(workshopForm.maxParticipants),
          BigInt(workshopForm.price)
        ],
        value: BigInt(0.005 * 1e18) // 0.005 ETH creation fee
      })
      
      addNotification({
        type: 'success',
        title: 'Workshop Creado',
        message: 'Tu workshop ha sido creado exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear workshop'
      })
    }
  }
  
  const handleCreateEvent = async () => {
    if (!address) return
    
    try {
      const startTime = Math.floor(new Date(eventForm.startTime).getTime() / 1000)
      const endTime = Math.floor(new Date(eventForm.endTime).getTime() / 1000)
      
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'createEvent',
        args: [
          eventForm.title,
          eventForm.description,
          BigInt(startTime),
          BigInt(endTime),
          eventForm.location,
          BigInt(eventForm.maxParticipants)
        ],
        value: BigInt(0.002 * 1e18) // 0.002 ETH creation fee
      })
      
      addNotification({
        type: 'success',
        title: 'Evento Creado',
        message: 'Tu evento ha sido creado exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear evento'
      })
    }
  }
  
  const handleJoinWorkshop = async () => {
    if (!address || !workshopInfo) return
    
    try {
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'joinWorkshop',
        args: [BigInt(selectedWorkshop)],
        value: workshopInfo[7] // price is at index 7
      })
      
      addNotification({
        type: 'success',
        title: 'Workshop Unido',
        message: 'Te has unido al workshop exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al unirse al workshop'
      })
    }
  }
  
  const handleJoinEvent = async () => {
    if (!address) return
    
    try {
      await writeContract({
        address: contracts.community,
        abi: COMMUNITY_ABI,
        functionName: 'joinEvent',
        args: [BigInt(selectedEvent)]
      })
      
      addNotification({
        type: 'success',
        title: 'Evento Unido',
        message: 'Te has unido al evento exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al unirse al evento'
      })
    }
  }
  
  if (!isConnected) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-bold text-white mb-2">Conecta tu Wallet</h3>
        <p className="text-white/70">Necesitas conectar tu wallet para acceder a la comunidad</p>
      </GlassCard>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Sistema de <span className="gradient-text">Comunidad</span>
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Conecta con mentores, participa en workshops y únete a eventos de la comunidad
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-morphism rounded-xl p-1">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'mentors'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Mentores
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'workshops'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Crear
          </button>
        </div>
      </div>
      
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registro como Mentor */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Registrarse como Mentor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({...mentorForm, name: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Biografía</label>
                <textarea
                  value={mentorForm.bio}
                  onChange={(e) => setMentorForm({...mentorForm, bio: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                  placeholder="Cuéntanos sobre tu experiencia..."
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Especializaciones</label>
                {mentorForm.specializations.map((spec, index) => (
                  <input
                    key={index}
                    type="text"
                    value={spec}
                    onChange={(e) => {
                      const newSpecs = [...mentorForm.specializations]
                      newSpecs[index] = e.target.value
                      setMentorForm({...mentorForm, specializations: newSpecs})
                    }}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-2"
                    placeholder="Ej: Smart Contracts, DeFi, NFTs"
                  />
                ))}
                <button
                  onClick={() => setMentorForm({...mentorForm, specializations: [...mentorForm.specializations, '']})}
                  className="text-purple-400 text-sm hover:text-purple-300"
                >
                  + Agregar especialización
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Experiencia (años)</label>
                  <input
                    type="number"
                    value={mentorForm.experience}
                    onChange={(e) => setMentorForm({...mentorForm, experience: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Tarifa por hora (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={mentorForm.hourlyRate}
                    onChange={(e) => setMentorForm({...mentorForm, hourlyRate: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="0.05"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  💰 Costo de registro: 0.01 ETH
                </p>
              </div>
              
              <button
                onClick={handleRegisterMentor}
                className="w-full neural-button py-3"
              >
                Registrarse como Mentor
              </button>
            </div>
          </GlassCard>
          
          {/* Registro como Mentoreada */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Registrarse como Mentoreada</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={menteeForm.name}
                  onChange={(e) => setMenteeForm({...menteeForm, name: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Objetivos</label>
                <textarea
                  value={menteeForm.goals}
                  onChange={(e) => setMenteeForm({...menteeForm, goals: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                  placeholder="¿Qué quieres aprender?"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Nivel</label>
                <select
                  value={menteeForm.level}
                  onChange={(e) => setMenteeForm({...menteeForm, level: Number(e.target.value)})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value={1}>Principiante</option>
                  <option value={2}>Intermedio</option>
                  <option value={3}>Avanzado</option>
                </select>
              </div>
              
              <div className="p-4 bg-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Registro gratuito para mentoreadas
                </p>
              </div>
              
              <button
                onClick={handleRegisterMentee}
                className="w-full neural-button py-3"
              >
                Registrarse como Mentoreada
              </button>
            </div>
          </GlassCard>
        </div>
      )}
      
      {activeTab === 'workshops' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Workshops */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Workshops Disponibles</h3>
            <div className="space-y-4">
              {(() => {
                console.log('activeWorkshops:', activeWorkshops);
                console.log('activeWorkshops type:', typeof activeWorkshops);
                console.log('activeWorkshops isArray:', Array.isArray(activeWorkshops));
                console.log('activeWorkshops length:', activeWorkshops?.length);
                return activeWorkshops && Array.isArray(activeWorkshops) && activeWorkshops!.length > 0;
              })() ? (
                activeWorkshops?.map((workshopId) => (
                  <button
                    key={Number(workshopId)}
                    onClick={() => setSelectedWorkshop(Number(workshopId))}
                    className={`w-full p-4 rounded-lg transition-all duration-300 ${
                      selectedWorkshop === Number(workshopId)
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="text-white font-semibold">Workshop #{Number(workshopId)}</h4>
                      <p className="text-white/70 text-sm">Haz clic para ver detalles</p>
                    </div>
                  </button>
                ))
              ) : (
                exampleWorkshops.map((workshop) => (
                  <button
                    key={workshop.id}
                    onClick={() => setSelectedWorkshop(workshop.id)}
                    className={`w-full p-4 rounded-lg transition-all duration-300 ${
                      selectedWorkshop === workshop.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="text-white font-semibold">{workshop.title}</h4>
                      <p className="text-white/70 text-sm">{workshop.description.substring(0, 80)}...</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-purple-400 text-xs">
                          {workshop.currentParticipants}/{workshop.maxParticipants} participantes
                        </span>
                        <span className="text-green-400 text-xs font-semibold">
                          {workshop.price} ETH
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
          
          {/* Detalles del Workshop */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Detalles del Workshop</h3>
            {workshopInfo ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <h4 className="text-white font-semibold text-lg">{workshopInfo[1]}</h4>
                  <p className="text-white/70 mt-2">{workshopInfo[2]}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Inicio:</p>
                    <p className="text-white font-semibold">
                      {new Date(Number(workshopInfo[3]) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Fin:</p>
                    <p className="text-white font-semibold">
                      {new Date(Number(workshopInfo[4]) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Participantes:</p>
                    <p className="text-white font-semibold">
                      {Number(workshopInfo[5])} / {Number(workshopInfo[6])}
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Precio:</p>
                    <p className="text-white font-semibold">
                      {Number(workshopInfo[7]) / 1e18} ETH
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleJoinWorkshop}
                  className="w-full neural-button py-3"
                  disabled={!workshopInfo[8] || workshopInfo[5] >= workshopInfo[6]}
                >
                  Unirse al Workshop
                </button>
              </div>
            ) : selectedWorkshop > 0 && exampleWorkshops.find(w => w.id === selectedWorkshop) ? (
              (() => {
                console.log('Selected workshop:', selectedWorkshop)
                console.log('Available workshops:', exampleWorkshops.map(w => w.id))
                const workshop = exampleWorkshops.find(w => w.id === selectedWorkshop)!
                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <h4 className="text-white font-semibold text-lg">{workshop.title}</h4>
                      <p className="text-white/70 mt-2">{workshop.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Inicio:</p>
                        <p className="text-white font-semibold">
                          {workshop.startTime.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Fin:</p>
                        <p className="text-white font-semibold">
                          {workshop.endTime.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Participantes:</p>
                        <p className="text-white font-semibold">
                          {workshop.currentParticipants} / {workshop.maxParticipants}
                        </p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Precio:</p>
                        <p className="text-white font-semibold">
                          {workshop.price} ETH
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-white/70 text-sm">Organizador:</p>
                      <p className="text-white font-semibold">{workshop.organizer}</p>
                    </div>
                    
                    <button
                      className="w-full neural-button py-3"
                      disabled={workshop.currentParticipants >= workshop.maxParticipants}
                    >
                      {workshop.currentParticipants >= workshop.maxParticipants ? 'Workshop Lleno' : 'Unirse al Workshop'}
                    </button>
                  </div>
                )
              })()
            ) : (
              <p className="text-white/70 text-center py-8">Selecciona un workshop para ver detalles</p>
            )}
          </GlassCard>
        </div>
      )}
      
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Eventos */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Eventos Disponibles</h3>
            <div className="space-y-4">
              {(() => {
                console.log('activeEvents:', activeEvents);
                console.log('activeEvents type:', typeof activeEvents);
                console.log('activeEvents isArray:', Array.isArray(activeEvents));
                console.log('activeEvents length:', activeEvents?.length);
                return activeEvents && Array.isArray(activeEvents) && activeEvents!.length > 0;
              })() ? (
                activeEvents?.map((eventId) => (
                  <button
                    key={Number(eventId)}
                    onClick={() => setSelectedEvent(Number(eventId))}
                    className={`w-full p-4 rounded-lg transition-all duration-300 ${
                      selectedEvent === Number(eventId)
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="text-white font-semibold">Evento #{Number(eventId)}</h4>
                      <p className="text-white/70 text-sm">Haz clic para ver detalles</p>
                    </div>
                  </button>
                ))
              ) : (
                exampleEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`w-full p-4 rounded-lg transition-all duration-300 ${
                      selectedEvent === event.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="text-white font-semibold">{event.title}</h4>
                      <p className="text-white/70 text-sm">{event.description.substring(0, 80)}...</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-purple-400 text-xs">
                          {event.currentParticipants}/{event.maxParticipants} participantes
                        </span>
                        <span className="text-blue-400 text-xs font-semibold">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
          
          {/* Detalles del Evento */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Detalles del Evento</h3>
            {eventInfo ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <h4 className="text-white font-semibold text-lg">{eventInfo[1]}</h4>
                  <p className="text-white/70 mt-2">{eventInfo[2]}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Inicio:</p>
                    <p className="text-white font-semibold">
                      {new Date(Number(eventInfo[3]) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <p className="text-white/70 text-sm">Fin:</p>
                    <p className="text-white font-semibold">
                      {new Date(Number(eventInfo[4]) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-white/70 text-sm">Ubicación:</p>
                  <p className="text-white font-semibold">{eventInfo[5]}</p>
                </div>
                
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-white/70 text-sm">Participantes:</p>
                  <p className="text-white font-semibold">
                    {Number(eventInfo[6])} / {Number(eventInfo[7])}
                  </p>
                </div>
                
                <button
                  onClick={handleJoinEvent}
                  className="w-full neural-button py-3"
                  disabled={!eventInfo[8] || eventInfo[6] >= eventInfo[7]}
                >
                  Unirse al Evento
                </button>
              </div>
            ) : selectedEvent > 0 && exampleEvents.find(e => e.id === selectedEvent) ? (
              (() => {
                console.log('Selected event:', selectedEvent)
                console.log('Available events:', exampleEvents.map(e => e.id))
                const event = exampleEvents.find(e => e.id === selectedEvent)!
                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <h4 className="text-white font-semibold text-lg">{event.title}</h4>
                      <p className="text-white/70 mt-2">{event.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Inicio:</p>
                        <p className="text-white font-semibold">
                          {event.startTime.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm">Fin:</p>
                        <p className="text-white font-semibold">
                          {event.endTime.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-white/70 text-sm">Ubicación:</p>
                      <p className="text-white font-semibold">{event.location}</p>
                    </div>
                    
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-white/70 text-sm">Participantes:</p>
                      <p className="text-white font-semibold">
                        {event.currentParticipants} / {event.maxParticipants}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-white/70 text-sm">Organizador:</p>
                      <p className="text-white font-semibold">{event.organizer}</p>
                    </div>
                    
                    <button
                      className="w-full neural-button py-3"
                      disabled={event.currentParticipants >= event.maxParticipants}
                    >
                      {event.currentParticipants >= event.maxParticipants ? 'Evento Lleno' : 'Unirse al Evento'}
                    </button>
                  </div>
                )
              })()
            ) : (
              <p className="text-white/70 text-center py-8">Selecciona un evento para ver detalles</p>
            )}
          </GlassCard>
        </div>
      )}
      
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crear Workshop */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Crear Workshop</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Título</label>
                <input
                  type="text"
                  value={workshopForm.title}
                  onChange={(e) => setWorkshopForm({...workshopForm, title: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Ej: Introducción a Smart Contracts"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Descripción</label>
                <textarea
                  value={workshopForm.description}
                  onChange={(e) => setWorkshopForm({...workshopForm, description: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                  placeholder="Describe el contenido del workshop..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Fecha de Inicio</label>
                  <input
                    type="datetime-local"
                    value={workshopForm.startTime}
                    onChange={(e) => setWorkshopForm({...workshopForm, startTime: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Fecha de Fin</label>
                  <input
                    type="datetime-local"
                    value={workshopForm.endTime}
                    onChange={(e) => setWorkshopForm({...workshopForm, endTime: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Máx. Participantes</label>
                  <input
                    type="number"
                    value={workshopForm.maxParticipants}
                    onChange={(e) => setWorkshopForm({...workshopForm, maxParticipants: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Precio (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={workshopForm.price}
                    onChange={(e) => setWorkshopForm({...workshopForm, price: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="0.05"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  💰 Costo de creación: 0.005 ETH
                </p>
              </div>
              
              <button
                onClick={handleCreateWorkshop}
                className="w-full neural-button py-3"
              >
                Crear Workshop
              </button>
            </div>
          </GlassCard>
          
          {/* Crear Evento */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Crear Evento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Título</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Ej: Meetup Web3 Uruguay"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Descripción</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                  placeholder="Describe el evento..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Fecha de Inicio</label>
                  <input
                    type="datetime-local"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({...eventForm, startTime: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Fecha de Fin</label>
                  <input
                    type="datetime-local"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Ubicación</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Ej: Montevideo, Uruguay o 'online'"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Máx. Participantes</label>
                <input
                  type="number"
                  value={eventForm.maxParticipants}
                  onChange={(e) => setEventForm({...eventForm, maxParticipants: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="50"
                />
              </div>
              
              <div className="p-4 bg-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  💰 Costo de creación: 0.002 ETH
                </p>
              </div>
              
              <button
                onClick={handleCreateEvent}
                className="w-full neural-button py-3"
              >
                Crear Evento
              </button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  )
}
