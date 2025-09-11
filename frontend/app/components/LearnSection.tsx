'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'
import { NeuralParticles } from './NeuralParticles'
import { NeuralConnections } from './NeuralConnections'

interface Course {
  id: string
  title: string
  description: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  duration: string
  lessons: number
  progress: number
  icon: string
  color: string
  price: string
  features: string[]
  instructor: {
    name: string
    avatar: string
    rating: number
  }
}

interface LearningPath {
  id: string
  title: string
  description: string
  courses: number
  duration: string
  icon: string
  gradient: string
  benefits: string[]
}

export function LearnSection() {
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'certificates'>('courses')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const courses: Course[] = [
    {
      id: 'blockchain-basics',
      title: 'Blockchain para Principiantes',
      description: 'Aprendé los conceptos fundamentales de blockchain desde cero. Perfecto para mujeres que quieren entender la tecnología del futuro.',
      level: 'Principiante',
      duration: '4 semanas',
      lessons: 12,
      progress: 0,
      icon: '🔗',
      color: 'from-purple-500 to-pink-500',
      price: 'Gratis',
      features: ['Certificado NFT', 'Proyecto práctico', 'Comunidad de apoyo', 'Mentoría 1:1'],
      instructor: {
        name: 'Dr. María González',
        avatar: '👩‍💻',
        rating: 4.9
      }
    },
    {
      id: 'smart-contracts',
      title: 'Contratos Inteligentes',
      description: 'Dominá la creación de contratos inteligentes con Solidity. Aprendé a programar el futuro financiero.',
      level: 'Intermedio',
      duration: '6 semanas',
      lessons: 18,
      progress: 0,
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
      price: 'Gratis',
      features: ['Deploy en testnet', 'Auditoría básica', 'Proyecto final', 'Certificación'],
      instructor: {
        name: 'Ana Rodríguez',
        avatar: '👩‍🔬',
        rating: 4.8
      }
    },
    {
      id: 'defi-mastery',
      title: 'DeFi: Finanzas Descentralizadas',
      description: 'Explorá el ecosistema DeFi completo. Aprendé sobre yield farming, staking y protocolos de liquidez.',
      level: 'Avanzado',
      duration: '8 semanas',
      lessons: 24,
      progress: 0,
      icon: '🏦',
      color: 'from-green-500 to-emerald-500',
      price: 'Gratis',
      features: ['Protocolos reales', 'Estrategias avanzadas', 'Portfolio management', 'Certificación premium'],
      instructor: {
        name: 'Carmen Silva',
        avatar: '👩‍💼',
        rating: 4.9
      }
    },
    {
      id: 'nft-creation',
      title: 'Creación de NFTs',
      description: 'Aprendé a crear, mintear y vender NFTs. Desde el arte digital hasta la programación de colecciones.',
      level: 'Intermedio',
      duration: '5 semanas',
      lessons: 15,
      progress: 0,
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      price: 'Gratis',
      features: ['Colección completa', 'Marketplace setup', 'Marketing NFT', 'ROI tracking'],
      instructor: {
        name: 'Laura Martínez',
        avatar: '👩‍🎨',
        rating: 4.7
      }
    },
    {
      id: 'web3-development',
      title: 'Desarrollo Web3',
      description: 'Construí aplicaciones descentralizadas completas. Frontend, backend y blockchain integration.',
      level: 'Avanzado',
      duration: '10 semanas',
      lessons: 30,
      progress: 0,
      icon: '⚡',
      color: 'from-orange-500 to-red-500',
      price: 'Gratis',
      features: ['DApp completa', 'Deploy en mainnet', 'Tokenomics', 'Job placement'],
      instructor: {
        name: 'Sofia Chen',
        avatar: '👩‍🚀',
        rating: 4.9
      }
    },
    {
      id: 'dao-governance',
      title: 'Gobernanza DAO',
      description: 'Participá en la gobernanza descentralizada. Aprendé sobre votación, propuestas y toma de decisiones.',
      level: 'Intermedio',
      duration: '3 semanas',
      lessons: 9,
      progress: 0,
      icon: '🏛️',
      color: 'from-indigo-500 to-purple-500',
      price: 'Gratis',
      features: ['Voting strategies', 'Proposal writing', 'Community building', 'Leadership skills'],
      instructor: {
        name: 'Elena Vargas',
        avatar: '👩‍⚖️',
        rating: 4.8
      }
    }
  ]

  const learningPaths: LearningPath[] = [
    {
      id: 'blockchain-journey',
      title: 'Viaje Blockchain Completo',
      description: 'De principiante a experta en blockchain. El camino más completo para dominar Web3.',
      courses: 6,
      duration: '6 meses',
      icon: '🚀',
      gradient: 'from-purple-500 via-pink-500 to-blue-500',
      benefits: ['Certificación completa', 'Mentoría personalizada', 'Job placement', 'Red profesional']
    },
    {
      id: 'defi-specialist',
      title: 'Especialista DeFi',
      description: 'Convertite en experta en finanzas descentralizadas. Dominá yield farming y protocolos avanzados.',
      courses: 4,
      duration: '4 meses',
      icon: '💰',
      gradient: 'from-green-500 via-emerald-500 to-cyan-500',
      benefits: ['Estrategias avanzadas', 'Portfolio management', 'Risk assessment', 'Certificación premium']
    },
    {
      id: 'nft-entrepreneur',
      title: 'Emprendedora NFT',
      description: 'Crea y monetiza tu arte digital. Desde la creación hasta el marketplace y la comunidad.',
      courses: 3,
      duration: '3 meses',
      icon: '🎨',
      gradient: 'from-pink-500 via-rose-500 to-purple-500',
      benefits: ['Colección completa', 'Brand building', 'Marketing strategies', 'Revenue streams']
    }
  ]

  const certificates = [
    {
      id: 'blockchain-expert',
      title: 'Certificación Blockchain Expert',
      description: 'Demuestra tu dominio completo de blockchain y Web3',
      icon: '🏆',
      requirements: ['Completar 5 cursos', 'Proyecto final', 'Examen práctico'],
      benefits: ['Verificación on-chain', 'NFT único', 'Acceso a red profesional']
    },
    {
      id: 'defi-specialist',
      title: 'Certificación DeFi Specialist',
      description: 'Especialización en finanzas descentralizadas',
      icon: '💎',
      requirements: ['Cursos DeFi completos', 'Portfolio demostrable', 'Case study'],
      benefits: ['Certificación premium', 'Mentoría avanzada', 'Oportunidades laborales']
    }
  ]

  return (
    <section id="learn" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Efectos de fondo neurales */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-float"></div>
        <NeuralConnections 
          nodes={[
            { id: 'node1', x: 100, y: 100, type: 'service' },
            { id: 'node2', x: 200, y: 150, type: 'category' },
            { id: 'node3', x: 300, y: 200, type: 'user' }
          ]}
          connections={[
            { from: 'node1', to: 'node2', strength: 0.8 },
            { from: 'node2', to: 'node3', strength: 0.6 }
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl">🎓</div>
            <h2 className="text-6xl font-bold text-white">
              <span className="gradient-text">Aprende</span> el Futuro
            </h2>
          </div>
          <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Cursos interactivos diseñados específicamente para mujeres. 
            <span className="text-purple-400 font-semibold"> Sin conocimientos previos necesarios.</span>
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="flex justify-center mb-12">
          <div className="glass-morphism p-2 rounded-2xl">
            <div className="flex gap-2">
              {[
                { id: 'courses', label: 'Cursos', icon: '📚' },
                { id: 'paths', label: 'Rutas de Aprendizaje', icon: '🛤️' },
                { id: 'certificates', label: 'Certificaciones', icon: '🏆' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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

        {/* Contenido de las tabs */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`cursor-pointer transition-all duration-500 ${
                  hoveredCard === course.id ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setHoveredCard(course.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedCourse(course)}
              >
                <GlassCard className="p-6">
                <div className="space-y-4">
                  {/* Header del curso */}
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center text-2xl`}>
                      {course.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60">{course.level}</div>
                      <div className="text-lg font-bold text-white">{course.price}</div>
                    </div>
                  </div>

                  {/* Información del curso */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{course.description}</p>
                  </div>

                  {/* Stats del curso */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{course.lessons}</div>
                      <div className="text-white/60 text-sm">Lecciones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{course.duration}</div>
                      <div className="text-white/60 text-sm">Duración</div>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="text-2xl">{course.instructor.avatar}</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{course.instructor.name}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white/70 text-sm">{course.instructor.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <button className="w-full neural-button py-3 text-sm">
                    Comenzar Curso
                  </button>
                </div>
                </GlassCard>
                </div>
            ))}
          </div>
        )}

        {activeTab === 'paths' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <GlassCard
                key={path.id}
                className="p-8 cursor-pointer hover:scale-105 transition-all duration-500"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${path.gradient} flex items-center justify-center text-3xl mb-4`}>
                      {path.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{path.title}</h3>
                    <p className="text-white/70 leading-relaxed">{path.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{path.courses}</div>
                      <div className="text-white/60 text-sm">Cursos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{path.duration}</div>
                      <div className="text-white/60 text-sm">Duración</div>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="space-y-2">
                    {path.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botón */}
                  <button className="w-full neural-button py-4">
                    Iniciar Ruta
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.map((cert) => (
              <GlassCard
                key={cert.id}
                className="p-8 cursor-pointer hover:scale-105 transition-all duration-500"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{cert.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                      <p className="text-white/70">{cert.description}</p>
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Requisitos:</h4>
                    <div className="space-y-2">
                      {cert.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70">
                          <span className="text-purple-400">•</span>
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Beneficios:</h4>
                    <div className="space-y-2">
                      {cert.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70">
                          <span className="text-green-400">✓</span>
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón */}
                  <button className="w-full neural-button py-4">
                    Ver Detalles
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Modal de curso seleccionado */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <GlassCard className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="space-y-6">
                {/* Header del modal */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${selectedCourse.color} flex items-center justify-center text-3xl`}>
                      {selectedCourse.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedCourse.title}</h2>
                      <p className="text-purple-400 font-semibold">{selectedCourse.level}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-white/60 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Descripción */}
                <p className="text-white/80 text-lg leading-relaxed">{selectedCourse.description}</p>

                {/* Información del instructor */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="text-4xl">{selectedCourse.instructor.avatar}</div>
                  <div>
                    <div className="text-white font-semibold text-lg">{selectedCourse.instructor.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white/70">{selectedCourse.instructor.rating} Instructor Rating</span>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">¿Qué incluye este curso?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCourse.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-green-400">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedCourse.lessons}</div>
                    <div className="text-white/60">Lecciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedCourse.duration}</div>
                    <div className="text-white/60">Duración</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{selectedCourse.price}</div>
                    <div className="text-white/60">Precio</div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4">
                  <button className="flex-1 neural-button py-4 text-lg">
                    Comenzar Curso Ahora
                  </button>
                  <button className="px-8 py-4 neural-button-secondary">
                    Ver Preview
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20">
          <GlassCard gradient className="p-12 text-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white">
                ¿Lista para <span className="gradient-text">Transformar</span> tu Futuro?
              </h3>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Únete a miles de mujeres que ya están aprendiendo y ganando en Web3
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="neural-button text-lg px-8 py-4">
                  🚀 Comenzar Gratis
                </button>
                <button className="neural-button-secondary text-lg px-8 py-4">
                  📞 Hablar con Mentor
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
