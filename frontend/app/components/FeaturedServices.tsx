'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'

interface FeaturedService {
  id: number
  title: string
  description: string
  price: string
  category: string
  icon: string
  provider: string
  rating: number
  reviews: number
  isTrending?: boolean
  isNew?: boolean
  color: string
}

export function FeaturedServices() {
  const [services, setServices] = useState<FeaturedService[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const featuredServices: FeaturedService[] = [
      {
        id: 1,
        title: 'Desarrollo de Smart Contracts Avanzados',
        description: 'Creación de contratos inteligentes complejos con funcionalidades DeFi, NFTs y gobernanza descentralizada',
        price: '$2,500',
        category: 'Desarrollo',
        icon: '💻',
        provider: 'TechGuru',
        rating: 4.9,
        reviews: 127,
        isTrending: true,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 2,
        title: 'Diseño de UI/UX para Web3',
        description: 'Interfaces modernas y accesibles para aplicaciones descentralizadas con enfoque en experiencia de usuario',
        price: '$1,800',
        category: 'Diseño',
        icon: '🎨',
        provider: 'DesignPro',
        rating: 4.8,
        reviews: 89,
        isNew: true,
        color: 'from-pink-500 to-rose-500'
      },
      {
        id: 3,
        title: 'Estrategia de Marketing DeFi',
        description: 'Plan completo de marketing para proyectos DeFi incluyendo community building y tokenomics',
        price: '$3,200',
        category: 'Marketing',
        icon: '📈',
        provider: 'CryptoMarketer',
        rating: 4.9,
        reviews: 156,
        isTrending: true,
        color: 'from-green-500 to-emerald-500'
      }
    ]

    setServices(featuredServices)
  }, [])

  useEffect(() => {
    if (services.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [services.length])

  const currentService = services[currentIndex]

  if (!currentService) return null

  return (
    <div className="relative">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${currentService.color} opacity-10 rounded-full blur-3xl animate-pulse-glow`}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <GlassCard className="p-8 relative overflow-hidden">
        {/* Badges */}
        <div className="flex gap-3 mb-6">
          {currentService.isTrending && (
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold animate-pulse">
              🔥 Trending
            </div>
          )}
          {currentService.isNew && (
            <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold">
              ✨ Nuevo
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Contenido principal */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentService.color} text-white text-3xl`}>
                {currentService.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentService.title}</h3>
                <p className="text-white/60">{currentService.category}</p>
              </div>
            </div>

            <p className="text-white/80 leading-relaxed text-lg">
              {currentService.description}
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(currentService.rating) ? 'text-yellow-400' : 'text-white/30'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-white/80 text-sm">
                  {currentService.rating} ({currentService.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white">{currentService.price}</div>
                <p className="text-white/60 text-sm">Precio fijo</p>
              </div>
              <button className="neural-button px-8 py-4 flex items-center gap-3">
                <span>💎</span>
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Visualización del servicio */}
          <div className="relative">
            <div className={`p-8 rounded-3xl bg-gradient-to-br ${currentService.color} opacity-20`}>
              <div className="space-y-4">
                <div className="h-4 bg-white/30 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse delay-100"></div>
                <div className="h-4 bg-white/30 rounded w-1/2 animate-pulse delay-200"></div>
                <div className="h-4 bg-white/20 rounded w-5/6 animate-pulse delay-300"></div>
              </div>
            </div>
            
            {/* Efectos flotantes */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full animate-float delay-1000"></div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-8">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
