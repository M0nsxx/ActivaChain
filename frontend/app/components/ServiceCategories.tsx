'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'

interface Category {
  id: number
  name: string
  icon: string
  description: string
  color: string
  services: number
  avgPrice: string
  trending: boolean
}

export function ServiceCategories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const categories: Category[] = [
    {
      id: 1,
      name: 'Desarrollo',
      icon: '💻',
      description: 'Smart Contracts, DApps, Protocolos DeFi',
      color: 'from-blue-500 to-cyan-500',
      services: 24,
      avgPrice: '$800',
      trending: true
    },
    {
      id: 2,
      name: 'Diseño',
      icon: '🎨',
      description: 'UI/UX, Branding, NFTs, Arte Digital',
      color: 'from-pink-500 to-rose-500',
      services: 18,
      avgPrice: '$450',
      trending: false
    },
    {
      id: 3,
      name: 'Marketing',
      icon: '📈',
      description: 'Estrategias DeFi, Community Building',
      color: 'from-green-500 to-emerald-500',
      services: 15,
      avgPrice: '$650',
      trending: true
    },
    {
      id: 4,
      name: 'Consultoría',
      icon: '💼',
      description: 'Blockchain Strategy, Tokenomics',
      color: 'from-purple-500 to-violet-500',
      services: 12,
      avgPrice: '$1,200',
      trending: false
    },
    {
      id: 5,
      name: 'Auditoría',
      icon: '🔍',
      description: 'Smart Contract Security, Code Review',
      color: 'from-orange-500 to-red-500',
      services: 8,
      avgPrice: '$2,000',
      trending: true
    },
    {
      id: 6,
      name: 'Educación',
      icon: '🎓',
      description: 'Cursos, Mentoring, Workshops',
      color: 'from-indigo-500 to-blue-500',
      services: 20,
      avgPrice: '$300',
      trending: false
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Explorá por <span className="gradient-text">Categorías</span>
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Descubrí servicios especializados en diferentes áreas del ecosistema Web3
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <GlassCard
            key={category.id}
            className={`p-6 cursor-pointer transition-all duration-500 group ${
              selectedCategory === category.id 
                ? 'scale-105 bg-gradient-to-br from-white/15 to-white/5' 
                : 'hover:scale-102'
            }`}
            onClick={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
          >
            <div className="space-y-4">
              {/* Header de la categoría */}
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} text-white text-2xl`}>
                  {category.icon}
                </div>
                {category.trending && (
                  <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                    🔥 Trending
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-xs">Servicios</p>
                  <p className="text-white font-bold">{category.services}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Precio Promedio</p>
                  <p className="text-white font-bold">{category.avgPrice}</p>
                </div>
              </div>

              {/* Efecto de hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Categoría seleccionada - Vista expandida */}
      {selectedCategory && (
        <div className="mt-8">
          <GlassCard className="p-8">
            {(() => {
              const category = categories.find(c => c.id === selectedCategory)
              if (!category) return null

              return (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} text-white text-3xl`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                      <p className="text-white/70 text-lg">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 glass-morphism rounded-xl text-center">
                      <div className="text-2xl font-bold text-white mb-1">{category.services}</div>
                      <p className="text-white/70 text-sm">Servicios Disponibles</p>
                    </div>
                    <div className="p-4 glass-morphism rounded-xl text-center">
                      <div className="text-2xl font-bold text-white mb-1">{category.avgPrice}</div>
                      <p className="text-white/70 text-sm">Precio Promedio</p>
                    </div>
                    <div className="p-4 glass-morphism rounded-xl text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {category.trending ? '🔥' : '📈'}
                      </div>
                      <p className="text-white/70 text-sm">
                        {category.trending ? 'En Tendencia' : 'Crecimiento Estable'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="neural-button px-8 py-4 flex items-center gap-3">
                      <span>🔍</span>
                      Ver Todos los Servicios
                    </button>
                    <button className="neural-button-secondary px-8 py-4 flex items-center gap-3">
                      <span>📊</span>
                      Ver Estadísticas
                    </button>
                  </div>
                </div>
              )
            })()}
          </GlassCard>
        </div>
      )}
    </div>
  )
}
