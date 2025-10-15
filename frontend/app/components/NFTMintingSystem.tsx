'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'
import { NFTTemplateSelector } from './NFTTemplateSelector'
import { NFTTemplate, NFT_CATEGORIES, NFT_LEVELS } from '../lib/templates'
import { ACTIVA_NFT_ABI } from '../lib/contracts'

// ABI para ActivaNFT (ERC721) - Usando el ABI real del contrato
const MULTI_TOKEN_ABI = ACTIVA_NFT_ABI

interface TokenInfo {
  name: string
  symbol: string
  maxSupply: bigint
  currentSupply: bigint
  isActive: boolean
  price: bigint
  creator: string
  season: bigint
}

interface CollectionInfo {
  name: string
  description: string
  maxSupply: bigint
  currentSupply: bigint
  price: bigint
  creator: string
  season: bigint
  isActive: boolean
}

export function NFTMintingSystem() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const { addNotification } = useNotifications()
  
  const [activeTab, setActiveTab] = useState<'multi' | 'collection'>('multi')
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [mintingAmount, setMintingAmount] = useState<number>(1)
  const [selectedToken, setSelectedToken] = useState<number>(0)
  const [selectedCollection, setSelectedCollection] = useState<number>(0)
  
  // Estados para plantillas
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<NFTTemplate | null>(null)
  
  // Estados para crear tokens/colecciones
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    maxSupply: '',
    price: '',
    uri: '',
    category: '',
    level: 1,
    score: 0
  })
  
  // Leer certificaciones del usuario
  const { data: userCertifications } = useReadContract({
    address: contracts.activaNFT,
    abi: MULTI_TOKEN_ABI,
    functionName: 'getUserCertifications',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!contracts.activaNFT && !!address }
  })
  
  // Leer detalles de certificación seleccionada
  const { data: certificationDetails } = useReadContract({
    address: contracts.activaNFT,
    abi: MULTI_TOKEN_ABI,
    functionName: 'getCertificationDetails',
    args: [BigInt(selectedToken)],
    query: { enabled: !!contracts.activaNFT && selectedToken >= 0 }
  })
  
  // Contratos de escritura
  const { writeContract: writeMultiToken } = useWriteContract()
  const { writeContract: writeCollection } = useWriteContract()
  
  const seasons = [
    { id: 1, name: 'Invierno 2025', icon: '❄️', color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Primavera 2025', icon: '🌸', color: 'from-pink-500 to-rose-500' },
    { id: 3, name: 'Verano 2025', icon: '☀️', color: 'from-yellow-500 to-orange-500' },
    { id: 4, name: 'Otoño 2025', icon: '🍂', color: 'from-orange-500 to-red-500' }
  ]
  
  const handleCreateToken = async () => {
    if (!address) {
      addNotification({
        type: 'warning',
        title: 'Wallet no conectado',
        message: 'Por favor conecta tu wallet para crear tokens'
      })
      return
    }

    if (!createForm.name || !createForm.maxSupply || !createForm.price) {
      addNotification({
        type: 'warning',
        title: 'Campos incompletos',
        message: 'Por favor completa todos los campos obligatorios'
      })
      return
    }
    
    try {
      // Mostrar notificación de inicio
      const loadingNotificationId = addNotification({
        type: 'loading',
        title: 'Creando token...',
        message: `"${createForm.name}"`,
        autoClose: false
      })

      // Configuración de gas optimizada
      const gasConfig = {
        gas: BigInt(500000),
        maxFeePerGas: BigInt(50000000000), // 50 Gwei
        maxPriorityFeePerGas: BigInt(2000000000), // 2 Gwei
      }

      const hash = await writeMultiToken({
        address: contracts.activaNFT,
        abi: MULTI_TOKEN_ABI,
        functionName: 'mintCertification',
        args: [
          address, // learner
          createForm.name, // courseName
          createForm.level, // level
          BigInt(createForm.score), // score
          createForm.uri // tokenURI
        ],
        ...gasConfig
      }) as `0x${string}` | undefined

      if (hash) {
        addNotification({
          type: 'success',
          title: 'Transacción enviada',
          message: 'Esperando confirmación de la red...',
          hash
        })
      }

      // Limpiar formulario después de éxito
      setCreateForm({
        name: '',
        description: '',
        maxSupply: '',
        price: '',
        uri: '',
        category: '',
        level: 1,
        score: 0
      })
      setSelectedTemplate(null)

      // Notificación de éxito final
      addNotification({
        type: 'success',
        title: '¡Token Creado! 🎉',
        message: `"${createForm.name}" creado exitosamente`,
        hash: hash || undefined,
        duration: 8000
      })
      
    } catch (error: any) {
      console.error('Error creating token:', error)
      
      // Errores más específicos
      if (error.message?.includes('insufficient funds')) {
        addNotification({
          type: 'error',
          title: 'Fondos insuficientes',
          message: 'No tienes suficiente ETH para pagar el gas'
        })
      } else if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        addNotification({
          type: 'warning',
          title: 'Transacción cancelada',
          message: 'Cancelaste la creación del token'
        })
      } else if (error.message?.includes('gas')) {
        addNotification({
          type: 'error',
          title: 'Error de gas',
          message: 'Problema con la configuración de gas'
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Error de creación',
          message: error.message || 'Error desconocido al crear el token'
        })
      }
    }
  }
  
  const handleMintToken = async () => {
    if (!address) return
    
    try {
      // Precio fijo por ahora - se puede ajustar según la lógica del negocio
      const pricePerToken = BigInt("10000000000000000") // 0.01 ETH
      const totalPrice = pricePerToken * BigInt(mintingAmount)
      
      const hash = await writeMultiToken({
        address: contracts.activaNFT,
        abi: MULTI_TOKEN_ABI,
        functionName: 'mintCertification',
        args: [
          address, // learner
          `Certificación ${selectedToken}`, // courseName
          1, // level (básico)
          BigInt(100), // score
          `https://ipfs.io/ipfs/QmExample${selectedToken}` // tokenURI
        ]
      })
      
      addNotification({
        type: 'success',
        title: 'NFT Minteado',
        message: `Has minteado ${mintingAmount} certificaciones`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al mintear el NFT'
      })
    }
  }
  
  const handleCreateCollection = async () => {
    if (!address) return
    
    try {
      const hash = await writeCollection({
        address: contracts.activaNFT,
        abi: MULTI_TOKEN_ABI,
        functionName: 'mintCertification',
        args: [
          address, // learner
          createForm.name, // courseName
          createForm.level, // level
          BigInt(createForm.score), // score
          createForm.uri // tokenURI
        ]
      })
      
      addNotification({
        type: 'success',
        title: 'Colección Creada',
        message: 'Tu colección ha sido creada exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear la colección'
      })
    }
  }

  // Funciones para manejar plantillas
  const handleTemplateSelect = (template: NFTTemplate) => {
    setSelectedTemplate(template)
    setCreateForm({
      name: template.name,
      description: template.description,
      maxSupply: '1000', // Valor por defecto
      price: '0.01', // Valor por defecto en ETH
      uri: template.metadata.image,
      category: template.category,
      level: template.level,
      score: template.score
    })
    setShowTemplateSelector(false)
    
    addNotification({
      type: 'success',
      title: 'Plantilla Seleccionada',
      message: `"${template.name}" cargada exitosamente`
    })
  }

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) return
    
    setCreateForm({
      name: selectedTemplate.name,
      description: selectedTemplate.description,
      maxSupply: '1000',
      price: '0.01',
      uri: selectedTemplate.metadata.image,
      category: selectedTemplate.category,
      level: selectedTemplate.level,
      score: selectedTemplate.score
    })
  }

  const handleCreateFromScratch = () => {
    setSelectedTemplate(null)
    setCreateForm({
      name: '',
      description: '',
      maxSupply: '',
      price: '',
      uri: '',
      category: '',
      level: 1,
      score: 0
    })
  }
  
  if (!isConnected) {
    return (
      <GlassCard className="p-6 sm:p-8 text-center">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔗</div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Conectá tu Wallet</h3>
        <p className="text-white/70 text-sm sm:text-base">Necesitás conectar tu wallet para mintear NFTs</p>
      </GlassCard>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
          Sistema de <span className="gradient-text">NFTs</span>
        </h2>
        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto px-4">
          Crea y mintea NFTs únicos con nuestro sistema ERC1155 y ERC721
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center px-4">
        <div className="glass-morphism rounded-xl p-1 w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-1">
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'multi'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">ERC1155 Multi-Token</span>
              <span className="sm:hidden">Multi-Token</span>
            </button>
            <button
              onClick={() => setActiveTab('collection')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'collection'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">ERC721 Colecciones</span>
              <span className="sm:hidden">Colecciones</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Selección de Temporada */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            className={`p-3 sm:p-4 rounded-xl transition-all duration-300 ${
              selectedSeason === season.id
                ? `bg-gradient-to-r ${season.color} scale-105`
                : 'glass-morphism hover:scale-102'
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{season.icon}</div>
            <div className="text-white font-semibold text-xs sm:text-sm">{season.name}</div>
          </button>
        ))}
      </div>
      
      {activeTab === 'multi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Crear Token */}
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Crear Token ERC1155</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  🎨 Plantillas
                </button>
                <button
                  onClick={handleCreateFromScratch}
                  className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  ✨ Desde Cero
                </button>
              </div>
            </div>
            
            {/* Plantilla seleccionada */}
            {selectedTemplate && (
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedTemplate.icon}</div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedTemplate.name}</h4>
                    <p className="text-white/70 text-sm">{selectedTemplate.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                        {selectedTemplate.category}
                      </span>
                      <span className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                        Nivel {selectedTemplate.level}
                      </span>
                      <span className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                        {selectedTemplate.score} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Nombre del Token</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Ej: Flores de Invierno"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Suministro Máximo</label>
                <input
                  type="number"
                  value={createForm.maxSupply}
                  onChange={(e) => setCreateForm({...createForm, maxSupply: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Precio (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={createForm.price}
                  onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="0.01"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">URI de Metadatos</label>
                <input
                  type="text"
                  value={createForm.uri}
                  onChange={(e) => setCreateForm({...createForm, uri: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="ipfs://..."
                />
              </div>
              
              {/* Campos adicionales para plantillas */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Categoría</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Seleccionar...</option>
                    {Object.entries(NFT_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nivel</label>
                  <select
                    value={createForm.level}
                    onChange={(e) => setCreateForm({...createForm, level: Number(e.target.value)})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {Object.entries(NFT_LEVELS).map(([level, info]) => (
                      <option key={level} value={level}>
                        Nivel {level} - {info.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Puntuación</label>
                  <input
                    type="number"
                    value={createForm.score}
                    onChange={(e) => setCreateForm({...createForm, score: Number(e.target.value)})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <button
                onClick={handleCreateToken}
                className="w-full neural-button py-3"
              >
                Crear Token
              </button>
            </div>
          </GlassCard>
          
          {/* Mintear Token */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Mintear Token</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <h4 className="text-white font-semibold">Certificación ActivaChain</h4>
                <p className="text-white/70 text-sm">
                  Certificación NFT de completación de curso
                </p>
                <p className="text-white/70 text-sm">
                  Precio: 0.01 ETH por certificación
                </p>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mintingAmount}
                  onChange={(e) => setMintingAmount(Number(e.target.value))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                />
              </div>
              
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-white/70 text-sm">Total a pagar:</p>
                <p className="text-white font-semibold">
                  {(0.01 * mintingAmount).toFixed(2)} ETH
                </p>
              </div>
              
              <button
                onClick={handleMintToken}
                className="w-full neural-button py-3"
                disabled={!isConnected}
              >
                Mintear Certificación
              </button>
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Crear Colección */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Crear Colección ERC721</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Nombre de la Colección</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Ej: Hongos Mágicos"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Descripción</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 h-20"
                  placeholder="Describe tu colección..."
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Suministro Máximo</label>
                <input
                  type="number"
                  value={createForm.maxSupply}
                  onChange={(e) => setCreateForm({...createForm, maxSupply: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Precio (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={createForm.price}
                  onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="0.05"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Base URI</label>
                <input
                  type="text"
                  value={createForm.uri}
                  onChange={(e) => setCreateForm({...createForm, uri: e.target.value})}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="ipfs://..."
                />
              </div>
              <button
                onClick={handleCreateCollection}
                className="w-full neural-button py-3"
              >
                Crear Colección
              </button>
            </div>
          </GlassCard>
          
          {/* Mintear de Colección */}
          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Mintear de Colección</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">ID de Colección</label>
                <input
                  type="number"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(Number(e.target.value))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Token URI</label>
                <input
                  type="text"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="ipfs://..."
                />
              </div>
              <button
                onClick={() => {}}
                className="w-full neural-button py-3"
              >
                Mintear NFT
              </button>
            </div>
          </GlassCard>
        </div>
      )}
      
      {/* Selector de Plantillas */}
      {showTemplateSelector && (
        <NFTTemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  )
}
