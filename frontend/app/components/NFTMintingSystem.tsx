'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para ActivaMultiToken (ERC1155)
const MULTI_TOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "uint256", "name": "maxSupply", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "season", "type": "uint256"},
      {"internalType": "string", "name": "uri", "type": "string"}
    ],
    "name": "createToken",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "mintToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "symbol", "type": "string"},
          {"internalType": "uint256", "name": "maxSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "currentSupply", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "season", "type": "uint256"}
        ],
        "internalType": "struct ActivaMultiToken.TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "season", "type": "uint256"}],
    "name": "getSeasonalTokens",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ABI para ActivaCollection (ERC721)
const COLLECTION_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "maxSupply", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "season", "type": "uint256"},
      {"internalType": "string", "name": "baseURI", "type": "string"}
    ],
    "name": "createCollection",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "collectionId", "type": "uint256"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mintFromCollection",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

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
  
  // Estados para crear tokens/colecciones
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    maxSupply: '',
    price: '',
    uri: ''
  })
  
  // Leer tokens estacionales
  const { data: seasonalTokens } = useReadContract({
    address: contracts.activaNFT,
    abi: MULTI_TOKEN_ABI,
    functionName: 'getSeasonalTokens',
    args: [BigInt(selectedSeason)],
    query: { enabled: !!contracts.activaNFT }
  })
  
  // Leer información de token seleccionado
  const { data: tokenInfo } = useReadContract({
    address: contracts.activaNFT,
    abi: MULTI_TOKEN_ABI,
    functionName: 'getTokenInfo',
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
    if (!address) return
    
    try {
      const hash = await writeMultiToken({
        address: contracts.activaNFT,
        abi: MULTI_TOKEN_ABI,
        functionName: 'createToken',
        args: [
          createForm.name,
          createForm.name.substring(0, 3).toUpperCase(),
          BigInt(createForm.maxSupply),
          BigInt(createForm.price),
          BigInt(selectedSeason),
          createForm.uri
        ]
      })
      
      addNotification({
        type: 'success',
        title: 'Token Creado',
        message: 'Tu token ha sido creado exitosamente'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear el token'
      })
    }
  }
  
  const handleMintToken = async () => {
    if (!address || !tokenInfo) return
    
    try {
      const totalPrice = tokenInfo.price * BigInt(mintingAmount)
      
      const hash = await writeMultiToken({
        address: contracts.activaNFT,
        abi: MULTI_TOKEN_ABI,
        functionName: 'mintToken',
        args: [BigInt(selectedToken), BigInt(mintingAmount)],
        value: totalPrice
      })
      
      addNotification({
        type: 'success',
        title: 'NFT Minteado',
        message: `Has minteado ${mintingAmount} ${tokenInfo.name}`
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
        abi: COLLECTION_ABI,
        functionName: 'createCollection',
        args: [
          createForm.name,
          createForm.description,
          BigInt(createForm.maxSupply),
          BigInt(createForm.price),
          BigInt(selectedSeason),
          createForm.uri
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
  
  if (!isConnected) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-xl font-bold text-white mb-2">Conecta tu Wallet</h3>
        <p className="text-white/70">Necesitas conectar tu wallet para mintear NFTs</p>
      </GlassCard>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Sistema de <span className="gradient-text">NFTs</span>
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Crea y mintea NFTs únicos con nuestro sistema ERC1155 y ERC721
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-morphism rounded-xl p-1">
          <button
            onClick={() => setActiveTab('multi')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'multi'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            ERC1155 Multi-Token
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'collection'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            ERC721 Colecciones
          </button>
        </div>
      </div>
      
      {/* Selección de Temporada */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            className={`p-4 rounded-xl transition-all duration-300 ${
              selectedSeason === season.id
                ? `bg-gradient-to-r ${season.color} scale-105`
                : 'glass-morphism hover:scale-102'
            }`}
          >
            <div className="text-3xl mb-2">{season.icon}</div>
            <div className="text-white font-semibold text-sm">{season.name}</div>
          </button>
        ))}
      </div>
      
      {activeTab === 'multi' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crear Token */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Crear Token ERC1155</h3>
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
              <button
                onClick={handleCreateToken}
                className="w-full neural-button py-3"
              >
                Crear Token
              </button>
            </div>
          </GlassCard>
          
          {/* Mintear Token */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mintear Token</h3>
            {tokenInfo && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <h4 className="text-white font-semibold">{tokenInfo.name}</h4>
                  <p className="text-white/70 text-sm">
                    Suministro: {tokenInfo.currentSupply.toString()} / {tokenInfo.maxSupply.toString()}
                  </p>
                  <p className="text-white/70 text-sm">
                    Precio: {Number(tokenInfo.price) / 1e18} ETH
                  </p>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    max={Number(tokenInfo.maxSupply - tokenInfo.currentSupply)}
                    value={mintingAmount}
                    onChange={(e) => setMintingAmount(Number(e.target.value))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  />
                </div>
                
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-white/70 text-sm">Total a pagar:</p>
                  <p className="text-white font-semibold">
                    {(Number(tokenInfo.price) * mintingAmount) / 1e18} ETH
                  </p>
                </div>
                
                <button
                  onClick={handleMintToken}
                  className="w-full neural-button py-3"
                  disabled={!tokenInfo.isActive || tokenInfo.currentSupply >= tokenInfo.maxSupply}
                >
                  Mintear NFT
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crear Colección */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Crear Colección ERC721</h3>
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
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mintear de Colección</h3>
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
    </div>
  )
}
