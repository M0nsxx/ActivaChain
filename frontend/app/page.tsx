'use client'

import { useState, useEffect } from 'react'
import GlassCard from './components/GlassCard'
import { useAppKit } from '@reown/appkit/react'
import { NetworkBadge } from './components/NetworkBadge'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { NeuralParticles } from './components/NeuralParticles'
import { FAQ } from './components/FAQ'

export default function HomePage() {
  // Verificar si AppKit está disponible antes de usar el hook
  let open: (() => void) | undefined
  try {
    const appKit = useAppKit()
    open = appKit?.open
  } catch (error) {
    console.warn('AppKit not ready yet:', error)
  }
  const [particles, setParticles] = useState([])
  const [currentFeature, setCurrentFeature] = useState(0)
  
  // Estadísticas reales del proyecto actualizadas
  const stats = {
    usuarias: '2,500+',
    servicios: '42',
    transacciones: '$125K',
    nfts: '1,200+',
    mentores: '85',
    workshops: '156'
  }

  // Características con explicaciones simples - ACTUALIZADAS
  const features = [
    {
      icon: '🎓',
      title: 'Aprende Blockchain',
      subtitle: 'Sin conocimientos previos',
      description: 'Cursos interactivos que te enseñan desde cero. Como aprender a usar una computadora, pero para el futuro del dinero digital.',
      benefits: ['Certificados NFT únicos', 'Progreso gamificado', 'Mentores expertos', 'Workshops en vivo']
    },
    {
      icon: '💼',
      title: 'Mercado Descentralizado',
      subtitle: 'Ganá dinero real',
      description: 'Un mercado digital donde podés vender tus habilidades y recibir pagos seguros. Como MercadoLibre, pero con tecnología blockchain.',
      benefits: ['Pagos instantáneos', 'Sin intermediarios', 'Reputación con ZK proofs', '42+ servicios activos']
    },
    {
      icon: '🏆',
      title: 'Sistema de Gamificación',
      subtitle: 'Logros y reconocimientos',
      description: 'Ganá achievements, badges y subí de nivel mientras aprendés. Como un videojuego, pero para tu carrera profesional.',
      benefits: ['16 achievements únicos', '8 badges de raridad', 'Leaderboards comunitarios', 'Streaks de actividad']
    },
    {
      icon: '👥',
      title: 'Comunidad Activa',
      subtitle: 'Conectá con mentores',
      description: 'Unite a una comunidad de mujeres expertas que te guían en tu camino. Como LinkedIn, pero con mentoría real.',
      benefits: ['85+ mentores verificados', '156+ workshops', 'Eventos comunitarios', 'Sistema de ratings']
    },
    {
      icon: '🎨',
      title: 'NFTs y Colecciones',
      subtitle: 'Crea arte digital único',
      description: 'Mintea NFTs únicos, crea colecciones estacionales y certifica tus logros. Como Instagram, pero con propiedad real.',
      benefits: ['ERC1155 + ERC721', 'Colecciones estacionales', '1,200+ NFTs minteados', 'Metadatos en IPFS']
    },
    {
      icon: '🏛️',
      title: 'Gobernanza Descentralizada',
      subtitle: 'Tu voz cuenta',
      description: 'Votá en decisiones importantes de la plataforma. Como una cooperativa digital donde todos tienen voz y voto.',
      benefits: ['Democracia digital', 'Transparencia total', 'Impacto real', 'Tokens de gobernanza']
    }
  ]

  // Tecnologías explicadas de forma simple - ACTUALIZADAS
  const technologies = [
    {
      name: 'Blockchain',
      description: 'Una base de datos súper segura que nadie puede hackear o modificar',
      icon: '🔗',
      benefit: 'Tus datos están 100% protegidos'
    },
    {
      name: 'NFTs (ERC1155 + ERC721)',
      description: 'Certificados digitales únicos que no se pueden copiar o falsificar',
      icon: '🎫',
      benefit: 'Tus logros son únicos y verificables'
    },
    {
      name: 'ZK Proofs',
      description: 'Pruebas criptográficas que verifican tu identidad sin revelar datos privados',
      icon: '🔐',
      benefit: 'Privacidad total con verificación'
    },
    {
      name: 'IPFS',
      description: 'Almacenamiento descentralizado que nunca se puede eliminar',
      icon: '🌐',
      benefit: 'Tus archivos son permanentes'
    },
    {
      name: 'Contratos Inteligentes',
      description: 'Contratos que se ejecutan automáticamente sin necesidad de abogados',
      icon: '📋',
      benefit: 'Transacciones justas y automáticas'
    },
    {
      name: 'DeFi',
      description: 'Servicios financieros sin bancos tradicionales',
      icon: '🏦',
      benefit: 'Acceso financiero para todos'
    },
    {
      name: 'Gamificación',
      description: 'Sistema de logros y niveles que hace el aprendizaje divertido',
      icon: '🎮',
      benefit: 'Aprende jugando y gana recompensas'
    },
    {
      name: 'Gobernanza DAO',
      description: 'Democracia digital donde todos pueden votar en decisiones importantes',
      icon: '🗳️',
      benefit: 'Tu voz tiene poder real'
    }
  ]

  // Rotar características automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section Mejorada */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-8 overflow-hidden">
        {/* Efectos de fondo neurales */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10 mt-4">
          {/* Contenido Principal */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <NetworkBadge />
              <div className="px-3 sm:px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm font-bold animate-pulse">
                🏆 Ganadores ETH Uruguay 2025 - 1er Lugar
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-neural-pulse">
                  ActivaChain
                </span>
              </h1>
              
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 font-semibold">
                  La plataforma Web3 más completa para mujeres
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed">
                  Aprende, gana, crea NFTs, conecta con mentores y lidera en la nueva economía digital. 
                  <span className="text-purple-400 font-semibold"> Todo en una sola plataforma descentralizada.</span>
                </p>
              </div>
            </div>

            {/* Beneficios clave - ACTUALIZADOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">🎓</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Aprende desde cero</p>
                  <p className="text-white/70 text-xs sm:text-sm">Cursos + Mentores</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">💰</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Ganá dinero real</p>
                  <p className="text-white/70 text-xs sm:text-sm">42+ servicios activos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">🎨</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Crea NFTs únicos</p>
                  <p className="text-white/70 text-xs sm:text-sm">ERC1155 + ERC721</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">🏆</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Sistema de logros</p>
                  <p className="text-white/70 text-xs sm:text-sm">16 achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">👥</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Comunidad activa</p>
                  <p className="text-white/70 text-xs sm:text-sm">85+ mentores</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 glass-morphism rounded-xl">
                <div className="text-xl sm:text-2xl">🔐</div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Reputación ZK</p>
                  <p className="text-white/70 text-xs sm:text-sm">Verificación privada</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => open?.()}
                className="neural-button text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3"
              >
                <span>🚀</span>
                Comenzar Gratis
              </button>
              
              <a 
                href="/marketplace"
                className="neural-button-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              >
                <span>💎</span>
                <span className="hidden sm:inline">Explorar </span>Mercado
              </a>
              
              <a 
                href="/nfts"
                className="neural-button-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              >
                <span>🎨</span>
                Crear NFTs
              </a>
            </div>

            {/* Trust indicators - ACTUALIZADOS */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/60 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="hidden sm:inline">Sin conocimientos previos</span>
                <span className="sm:hidden">Sin conocimientos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>ZK Proofs</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="hidden sm:inline">IPFS Descentralizado</span>
                <span className="sm:hidden">IPFS</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>85+ Mentores</span>
              </div>
            </div>
          </div>
          
          {/* Dashboard Interactivo */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            <GlassCard gradient className="p-4 sm:p-6 lg:p-8 animate-float relative z-10">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Mi Progreso</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs sm:text-sm font-semibold">Activa</span>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {['Blockchain Básico', 'NFTs y Colecciones', 'DeFi para Principiantes', 'ZK Proofs'].map((course, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium text-sm sm:text-base">{course}</p>
                        <span className="text-purple-400 font-bold text-sm sm:text-base">{90 - i * 10}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 sm:h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${90 - i * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 sm:pt-6 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">8</div>
                      <p className="text-white/70 text-xs sm:text-sm">NFTs Creados</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$1,250</div>
                      <p className="text-white/70 text-xs sm:text-sm">Ganado este mes</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Reputación ZK</p>
                      <p className="text-white/70 text-xs sm:text-sm">Nivel: Experta (1,250 pts)</p>
                    </div>
                    <div className="text-xl sm:text-2xl">🔐</div>
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">Achievements</p>
                      <p className="text-white/70 text-xs sm:text-sm">12/16 completados</p>
                    </div>
                    <div className="text-xl sm:text-2xl">🏆</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Sección de Premio - Ganadores ETH Uruguay 2025 */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <GlassCard gradient className="p-6 sm:p-8 lg:p-12 text-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="text-6xl sm:text-7xl lg:text-8xl animate-bounce">🏆</div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  ¡Ganadores del 1er Lugar!
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-semibold">
                ETH Uruguay 2025 - Hackathon
              </p>
              <p className="text-base sm:text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
                ActivaChain fue reconocida como la mejor plataforma Web3 para mujeres, 
                destacando por su innovación en gamificación, NFTs, ZK proofs y su impacto 
                real en la comunidad femenina de Uruguay y Latinoamérica.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-white/70 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Innovación en Web3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Impacto Social</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Implementación Completa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Comunidad Activa</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Stats Section Mejorada */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Impacto Real en <span className="gradient-text">Números</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto">
              Más de 2,500 mujeres ya están transformando sus vidas con ActivaChain
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Object.entries(stats).map(([key, value], index) => (
              <GlassCard key={key} gradient className="p-4 sm:p-6 lg:p-8 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{value}</div>
                  <p className="text-white/70 capitalize text-sm sm:text-base lg:text-lg">{key}</p>
                  <div className="mt-3 sm:mt-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Características Interactivas */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              ¿Cómo Funciona <span className="gradient-text">ActivaChain</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto">
              Seis funcionalidades completas para transformar tu futuro digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {features.map((feature, index) => (
              <GlassCard 
                key={index} 
                className={`p-4 sm:p-6 lg:p-8 cursor-pointer transition-all duration-500 ${
                  currentFeature === index 
                    ? 'scale-105 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'hover:scale-102'
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-purple-400 font-semibold text-sm sm:text-base">{feature.subtitle}</p>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                        <span className="text-green-400">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Indicadores de progreso */}
          <div className="flex justify-center gap-4">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentFeature === index 
                    ? 'bg-purple-500 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Tecnologías Explicadas */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Tecnologías del <span className="gradient-text">Futuro</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto">
              Las tecnologías más avanzadas del Web3, explicadas de forma simple
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {technologies.map((tech, index) => (
              <GlassCard key={index} className="p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{tech.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{tech.name}</h3>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">{tech.description}</p>
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <p className="text-purple-300 font-semibold text-xs sm:text-sm">{tech.benefit}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Historias de <span className="gradient-text">Éxito</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto">
              Mujeres reales que transformaron sus vidas con ActivaChain y sus nuevas funcionalidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "María González",
                role: "Desarrolladora Web3 + NFT Artist",
                location: "Montevideo, Uruguay",
                story: "Empecé sin saber nada de blockchain. Ahora gano $5,000/mes desarrollando contratos inteligentes y vendiendo NFTs.",
                earnings: "$5,000/mes",
                avatar: "👩‍💻"
              },
              {
                name: "Ana Rodríguez",
                role: "Mentora UX + Workshop Leader",
                location: "Buenos Aires, Argentina",
                story: "ActivaChain me dio las herramientas para crear mi estudio de diseño y ahora soy mentora de 15+ mujeres.",
                earnings: "$4,200/mes",
                avatar: "👩‍🎨"
              },
              {
                name: "Carmen Silva",
                role: "Consultora DeFi + ZK Expert",
                location: "Santiago, Chile",
                story: "De ama de casa a consultora financiera con reputación ZK verificada. Mi familia no puede creer el cambio.",
                earnings: "$6,500/mes",
                avatar: "👩‍💼"
              }
            ].map((testimonial, index) => (
              <GlassCard key={index} className="p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300">
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{testimonial.avatar}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{testimonial.name}</h3>
                    <p className="text-purple-400 font-semibold text-sm sm:text-base">{testimonial.role}</p>
                    <p className="text-white/60 text-xs sm:text-sm">{testimonial.location}</p>
                  </div>
                  
                  <p className="text-white/80 leading-relaxed italic text-sm sm:text-base">"{testimonial.story}"</p>
                  
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                    <p className="text-green-400 font-bold text-base sm:text-lg text-center">{testimonial.earnings}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Mejorada */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <GlassCard gradient className="p-6 sm:p-8 lg:p-16 text-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  ¿Lista para <span className="gradient-text">Revolucionar</span> tu Futuro?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Unite a más de 2,500 mujeres que ya están construyendo el futuro del trabajo digital con NFTs, ZK proofs y gamificación
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 my-8 sm:my-12">
                <div className="space-y-3">
                  <div className="text-3xl sm:text-4xl">🚀</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Comenzá Gratis</h3>
                  <p className="text-white/70 text-sm sm:text-base">Sin costo inicial, sin compromisos</p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl sm:text-4xl">🎨</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Crea NFTs</h3>
                  <p className="text-white/70 text-sm sm:text-base">ERC1155 + ERC721 desde el primer día</p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl sm:text-4xl">👥</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">85+ Mentores</h3>
                  <p className="text-white/70 text-sm sm:text-base">Acceso a workshops y mentoría</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <button
                  onClick={() => open?.()}
                  className="neural-button text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 flex items-center justify-center gap-3 sm:gap-4"
                >
                  <span>🚀</span>
                  <span className="hidden sm:inline">Comenzar Ahora - Es Gratis</span>
                  <span className="sm:hidden">Comenzar Gratis</span>
                </button>
                
                <button className="neural-button-secondary text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 flex items-center justify-center gap-3 sm:gap-4">
                  <span>📹</span>
                  <span className="hidden sm:inline">Ver Demo Completo</span>
                  <span className="sm:hidden">Ver Demo</span>
                </button>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-white/20">
                <p className="text-white/60 text-xs sm:text-sm">
                  🔒 100% Seguro • ✅ Sin spam • 🎯 Resultados garantizados • 🔐 ZK Proofs • 🌐 IPFS
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  )
}
