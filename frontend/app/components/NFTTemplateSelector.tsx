'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'
import { NFTTemplate, NFT_CATEGORIES, NFT_LEVELS, NFT_TEMPLATES, getNFTTemplatesByCategory, getNFTTemplatesByLevel } from '../lib/templates'

interface NFTTemplateSelectorProps {
  onSelect: (template: NFTTemplate) => void
  onClose: () => void
}

export function NFTTemplateSelector({ onSelect, onClose }: NFTTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar plantillas
  let filteredTemplates = NFT_TEMPLATES

  if (selectedCategory !== 'all') {
    filteredTemplates = getNFTTemplatesByCategory(selectedCategory)
  }

  if (selectedLevel > 0) {
    filteredTemplates = filteredTemplates.filter((template: NFTTemplate) => template.level === selectedLevel)
  }

  if (searchTerm) {
    filteredTemplates = filteredTemplates.filter((template: NFTTemplate) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  const categories = ['all', ...Object.keys(NFT_CATEGORIES)]
  const levels = [0, 1, 2, 3, 4]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <GlassCard className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full max-h-[75vh] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">🎨 Plantillas de NFTs</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl sm:text-2xl p-1"
            >
              ×
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 glass-morphism rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </div>
            </div>

            {/* Filtros de categoría y nivel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categorías */}
              <div>
                <label className="block text-white font-semibold mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 glass-morphism rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="all">Todas las categorías</option>
                  {Object.entries(NFT_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niveles */}
              <div>
                <label className="block text-white font-semibold mb-2">Nivel</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full px-4 py-3 glass-morphism rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value={0}>Todos los niveles</option>
                  {Object.entries(NFT_LEVELS).map(([level, info]) => (
                    <option key={level} value={level}>
                      Nivel {level} - {info.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid de plantillas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template: NFTTemplate) => {
              const categoryInfo = NFT_CATEGORIES[template.category as keyof typeof NFT_CATEGORIES]
              const levelInfo = NFT_LEVELS[template.level as keyof typeof NFT_LEVELS]
              
              return (
                <div
                  key={template.id}
                  className="cursor-pointer group"
                  onClick={() => onSelect(template)}
                >
                  <GlassCard className="p-4 sm:p-6 hover:scale-105 transition-all duration-300">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${categoryInfo.color} text-white`}>
                          <span className="text-xl sm:text-2xl">{template.icon}</span>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${levelInfo.color} text-white`}>
                            Nivel {template.level}
                          </div>
                          <div className="text-white/60 text-xs sm:text-sm mt-1">{levelInfo.name}</div>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {template.name}
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {template.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {template.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-white">{template.score}</div>
                          <div className="text-xs text-white/60">Puntos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-purple-400">{categoryInfo.icon}</div>
                          <div className="text-xs text-white/60">{template.category}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-yellow-400">{levelInfo.rarity}%</div>
                          <div className="text-xs text-white/60">Rareza</div>
                        </div>
                      </div>

                      {/* Botón de selección */}
                      <button className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm sm:text-base">
                        Seleccionar Plantilla
                      </button>
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No se encontraron plantillas</h3>
              <p className="text-white/70">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 sm:pt-6 border-t border-white/10">
            <div className="text-white/60 text-xs sm:text-sm">
              {filteredTemplates.length} plantilla{filteredTemplates.length !== 1 ? 's' : ''} encontrada{filteredTemplates.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={onClose}
              className="neural-button-secondary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              Cancelar
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
