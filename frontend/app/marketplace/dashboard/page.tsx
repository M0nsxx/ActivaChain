'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import GlassCard from '../../components/GlassCard'
import { NeuralParticles } from '../../components/NeuralParticles'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { MarketplaceStats } from '../../components/MarketplaceStats'
import { FeaturedServices } from '../../components/FeaturedServices'
import { LiveTransactions } from '../../components/LiveTransactions'
import { NeuralConnections } from '../../components/NeuralConnections'
import { ReputationCard } from '../../components/ReputationCard'

export default function MarketplaceDashboard() {
  const { address, isConnected } = useAccount()
  // Verificar si AppKit está disponible antes de usar el hook
  let open: (() => void) | undefined
  try {
    const appKit = useAppKit()
    open = appKit?.open
  } catch (error) {
    console.warn('AppKit not ready yet:', error)
  }
  const [activeTab, setActiveTab] = useState('overview')

  // Datos para las conexiones neurales
  const [neuralNodes, setNeuralNodes] = useState([
    { id: 'dev', x: 100, y: 100, type: 'category' as const, data: { name: 'Desarrollo' } },
    { id: 'design', x: 300, y: 150, type: 'category' as const, data: { name: 'Diseño' } },
    { id: 'marketing', x: 500, y: 120, type: 'category' as const, data: { name: 'Marketing' } },
    { id: 'consulting', x: 200, y: 300, type: 'category' as const, data: { name: 'Consultoría' } },
    { id: 'user1', x: 150, y: 200, type: 'user' as const, data: { name: 'Usuario 1' } },
    { id: 'user2', x: 400, y: 250, type: 'user' as const, data: { name: 'Usuario 2' } },
    { id: 'service1', x: 120, y: 180, type: 'service' as const, data: { name: 'Smart Contract Dev' } },
    { id: 'service2', x: 320, y: 200, type: 'service' as const, data: { name: 'UI/UX Design' } }
  ])

  const [neuralConnections, setNeuralConnections] = useState([
    { from: 'dev', to: 'service1', strength: 0.8 },
    { from: 'design', to: 'service2', strength: 0.9 },
    { from: 'user1', to: 'service1', strength: 0.7 },
    { from: 'user2', to: 'service2', strength: 0.6 },
    { from: 'dev', to: 'user1', strength: 0.5 },
    { from: 'design', to: 'user2', strength: 0.4 }
  ])

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'services', label: 'Servicios', icon: '💼' },
    { id: 'analytics', label: 'Analíticas', icon: '📈' },
    { id: 'transactions', label: 'Transacciones', icon: '💎' }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen relative">
        <NeuralParticles />
        <Header />
        
        <div className="flex items-center justify-center min-h-screen pt-20">
          <GlassCard className="p-12 text-center max-w-md">
            <div className="space-y-6">
              <div className="text-6xl">🔐</div>
              <h2 className="text-3xl font-bold text-white">Conecta tu Wallet</h2>
              <p className="text-white/70">
                Necesitas conectar tu wallet para acceder al dashboard del marketplace
              </p>
              <button
                onClick={() => open?.()}
                className="neural-button px-8 py-4"
              >
                Conectar Wallet
              </button>
            </div>
          </GlassCard>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section del Dashboard */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Efectos de fondo neurales */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-morphism rounded-full mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Dashboard Activo</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80">Bienvenida, {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            
            <h1 className="text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-neural-pulse">
                Dashboard
              </span>
              <br />
              <span className="text-white/95 text-4xl">Marketplace</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Gestiona tus servicios, analiza el rendimiento y conecta con la comunidad
            </p>
          </div>

          {/* Tabs de navegación */}
          <div className="flex justify-center mb-12">
            <div className="glass-morphism p-2 rounded-2xl">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido del Dashboard */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Estadísticas principales y reputación */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Estadísticas del <span className="gradient-text">Marketplace</span>
                  </h2>
                  <MarketplaceStats />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    Mi <span className="gradient-text">Reputación</span>
                  </h2>
                  <ReputationCard />
                </div>
              </div>

              {/* Servicios destacados */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Servicios <span className="gradient-text">Destacados</span>
                </h2>
                <FeaturedServices />
              </div>

              {/* Transacciones en vivo */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Actividad en <span className="gradient-text">Tiempo Real</span>
                </h2>
                <LiveTransactions />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Mis <span className="gradient-text">Servicios</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl">
                        💻
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Desarrollo Web3</h3>
                        <p className="text-white/60">Smart Contracts & DApps</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Precio:</span>
                        <span className="text-white font-bold">$500 USDC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Ventas:</span>
                        <span className="text-white font-bold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Rating:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white font-bold">4.9</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 neural-button py-3">
                        Editar
                      </button>
                      <button className="flex-1 neural-button-secondary py-3">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-2xl">
                        🎨
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Diseño UI/UX</h3>
                        <p className="text-white/60">Interfaces Web3</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Precio:</span>
                        <span className="text-white font-bold">$300 USDC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Ventas:</span>
                        <span className="text-white font-bold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Rating:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white font-bold">4.8</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 neural-button py-3">
                        Editar
                      </button>
                      <button className="flex-1 neural-button-secondary py-3">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="text-center">
                <button className="neural-button px-8 py-4">
                  + Crear Nuevo Servicio
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                <span className="gradient-text">Analíticas</span> Avanzadas
              </h2>
              
              <div className="relative h-96">
                <NeuralConnections 
                  nodes={neuralNodes} 
                  connections={neuralConnections}
                  className="rounded-2xl"
                />
                <GlassCard className="absolute inset-0 bg-black/20 backdrop-blur-sm">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Red de Conexiones</h3>
                      <p className="text-white/70">
                        Visualización de la red de servicios y usuarios en tiempo real
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-bold text-white mb-2">Crecimiento</h3>
                  <p className="text-3xl font-bold text-green-400 mb-2">+25%</p>
                  <p className="text-white/60 text-sm">Este mes</p>
                </GlassCard>
                
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-white mb-2">Usuarios Activos</h3>
                  <p className="text-3xl font-bold text-blue-400 mb-2">1,250</p>
                  <p className="text-white/60 text-sm">Últimos 30 días</p>
                </GlassCard>
                
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-white mb-2">Ingresos</h3>
                  <p className="text-3xl font-bold text-purple-400 mb-2">$12.5K</p>
                  <p className="text-white/60 text-sm">Este mes</p>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Historial de <span className="gradient-text">Transacciones</span>
              </h2>
              
              <LiveTransactions />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Resumen Financiero</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Ingresos Totales:</span>
                      <span className="text-white font-bold">$45,230 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Comisiones Pagadas:</span>
                      <span className="text-white font-bold">$1,130 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Ganancias Netas:</span>
                      <span className="text-green-400 font-bold">$44,100 USDC</span>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 glass-morphism rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">Servicio Completado</p>
                        <p className="text-white/60 text-xs">Hace 2 horas</p>
                      </div>
                      <span className="text-green-400 font-bold">+$500</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 glass-morphism rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        💎
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">Nueva Compra</p>
                        <p className="text-white/60 text-xs">Hace 5 horas</p>
                      </div>
                      <span className="text-blue-400 font-bold">+$300</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
