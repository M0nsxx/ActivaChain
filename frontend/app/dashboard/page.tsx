'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import GlassCard from '@/app/components/GlassCard'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { NeuralParticles } from '@/app/components/NeuralParticles'
import { DashboardNeuralEffects } from '@/app/components/DashboardNeuralEffects'
import { DashboardStats } from '@/app/components/DashboardStats'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
      return
    }
    setIsVisible(true)
  }, [isConnected, router])

  // Datos de ejemplo para el dashboard
  const userProfile = {
    name: "Lorena Erbure",
    avatar: "👩‍💻",
    level: "Intermedio",
    reputation: 85,
    totalEarnings: 1250,
    servicesCompleted: 12,
    coursesCompleted: 3,
    joinDate: "Septiembre 2025"
  }

  const purchasedServices = [
    {
      id: 1,
      title: "Curso de Solidity Básico",
      provider: "Lorena Erbure",
      price: 50,
      status: "Completado",
      progress: 100,
      date: "15 Ene 2024",
      type: "curso"
    },
    {
      id: 2,
      title: "Desarrollo de Smart Contract",
      provider: "M0nsxx",
      price: 200,
      status: "En Progreso",
      progress: 65,
      date: "20 Ene 2024",
      type: "servicio"
    },
    {
      id: 3,
      title: "Auditoría de Contrato",
      provider: "Vai0sx",
      price: 150,
      status: "Pendiente",
      progress: 0,
      date: "25 Ene 2024",
      type: "servicio"
    }
  ]

  const courseProgress = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      progress: 100,
      lessons: 12,
      completed: 12,
      nextLesson: null
    },
    {
      id: 2,
      title: "Smart Contracts con Solidity",
      progress: 75,
      lessons: 16,
      completed: 12,
      nextLesson: "Herencia y Modificadores"
    },
    {
      id: 3,
      title: "DeFi Protocols",
      progress: 30,
      lessons: 20,
      completed: 6,
      nextLesson: "Liquidity Pools"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "course_completed",
      title: "Completaste el curso 'Blockchain Fundamentals'",
      date: "Hace 2 horas",
      icon: "🎓"
    },
    {
      id: 2,
      type: "service_purchased",
      title: "Compraste el servicio 'Desarrollo de Smart Contract'",
      date: "Hace 1 día",
      icon: "💼"
    },
    {
      id: 3,
      type: "reputation_earned",
      title: "Ganaste 10 puntos de reputación",
      date: "Hace 3 días",
      icon: "⭐"
    }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
          <p className="text-white/70 mb-6">Necesitás conectar tu wallet para acceder al Panel de Control</p>
          <button 
            onClick={() => router.push('/')}
            className="neural-button"
          >
            Ir al Inicio
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NeuralParticles />
      <DashboardNeuralEffects active={isVisible} />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Mi <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Panel de Control</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Bienvenida a tu centro de control personal en ActivaChain. Acá podés gestionar tu perfil, 
              ver el progreso de tus cursos y servicios, y acceder a todas tus actividades.
            </p>
          </div>

          {/* Profile Overview */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <GlassCard gradient className="p-4 sm:p-6 lg:p-8 profile-card animate-dashboard-glow">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="text-6xl sm:text-7xl lg:text-8xl animate-dashboard-float">
                  {userProfile.avatar}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{userProfile.name}</h2>
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start mb-4">
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full text-xs sm:text-sm font-semibold border border-cyan-500/30 animate-dashboard-pulse">
                      Nivel {userProfile.level}
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-full text-xs sm:text-sm font-semibold border border-purple-500/30 animate-dashboard-pulse">
                      Reputación: {userProfile.reputation}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center dashboard-hover">
                      <div className="text-xl sm:text-2xl font-bold text-white">${userProfile.totalEarnings}</div>
                      <div className="text-white/70 text-xs sm:text-sm">Ganancias</div>
                    </div>
                    <div className="text-center dashboard-hover">
                      <div className="text-xl sm:text-2xl font-bold text-white">{userProfile.servicesCompleted}</div>
                      <div className="text-white/70 text-xs sm:text-sm">Servicios</div>
                    </div>
                    <div className="text-center dashboard-hover">
                      <div className="text-xl sm:text-2xl font-bold text-white">{userProfile.coursesCompleted}</div>
                      <div className="text-white/70 text-xs sm:text-sm">Cursos</div>
                    </div>
                    <div className="text-center dashboard-hover">
                      <div className="text-xl sm:text-2xl font-bold text-white">{userProfile.joinDate}</div>
                      <div className="text-white/70 text-xs sm:text-sm">Miembro desde</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Dashboard Stats */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <DashboardStats />
          </div>

          {/* Navigation Tabs */}
          <div className={`mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { id: 'profile', label: 'Perfil', icon: '👤' },
                { id: 'services', label: 'Servicios', icon: '💼' },
                { id: 'courses', label: 'Cursos', icon: '🎓' },
                { id: 'activity', label: 'Actividad', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 dashboard-tab ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25 animate-tab-glow active'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'animate-dashboard-float' : ''}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 profile-card">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="animate-dashboard-float">👤</span>
                    Información Personal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10 dashboard-hover">
                      <span className="text-white/70">Dirección Wallet</span>
                      <span className="text-white font-mono text-sm">{address?.slice(0, 10)}...{address?.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10 dashboard-hover">
                      <span className="text-white/70">Nivel Actual</span>
                      <span className="text-cyan-400 font-semibold animate-dashboard-pulse">{userProfile.level}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10 dashboard-hover">
                      <span className="text-white/70">Puntos de Reputación</span>
                      <span className="text-purple-400 font-semibold animate-dashboard-pulse">{userProfile.reputation}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-3 dashboard-hover">
                      <span className="text-white/70">Miembro desde</span>
                      <span className="text-white">{userProfile.joinDate}</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8 stats-card">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="animate-dashboard-float">📊</span>
                    Estadísticas
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Progreso General</span>
                        <span className="text-white font-semibold">78%</span>
                      </div>
                      <div className="progress-bar h-3">
                        <div className="progress-fill w-3/4"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Servicios Completados</span>
                        <span className="text-white font-semibold">{userProfile.servicesCompleted}/15</span>
                      </div>
                      <div className="progress-bar h-3">
                        <div className="progress-fill w-4/5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Cursos Completados</span>
                        <span className="text-white font-semibold">{userProfile.coursesCompleted}/8</span>
                      </div>
                      <div className="progress-bar h-3">
                        <div className="progress-fill w-3/8 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <GlassCard className="p-8 service-card-dashboard">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="animate-dashboard-float">💼</span>
                    Servicios Comprados
                  </h3>
                  <div className="space-y-4">
                    {purchasedServices.map((service) => (
                      <div key={service.id} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 dashboard-hover">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
                            <p className="text-white/70 mb-2">Proveedor: {service.provider}</p>
                            <p className="text-white/70">Fecha: {service.date}</p>
                          </div>
                          <div className="flex flex-col md:items-end gap-2">
                            <span className="text-2xl font-bold text-cyan-400 animate-dashboard-pulse">${service.price}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              service.status === 'Completado' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-dashboard-pulse'
                                : service.status === 'En Progreso'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-dashboard-pulse'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {service.status}
                            </span>
                            {service.progress > 0 && (
                              <div className="progress-bar w-32 h-2">
                                <div 
                                  className="progress-fill"
                                  style={{ width: `${service.progress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <GlassCard className="p-8 course-card">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="animate-dashboard-float">🎓</span>
                    Progreso de Cursos
                  </h3>
                  <div className="space-y-6">
                    {courseProgress.map((course) => (
                      <div key={course.id} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 dashboard-hover">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                            <p className="text-white/70">
                              {course.completed}/{course.lessons} lecciones completadas
                            </p>
                            {course.nextLesson && (
                              <p className="text-cyan-400 text-sm mt-1 animate-dashboard-pulse">
                                Próxima: {course.nextLesson}
                              </p>
                            )}
                          </div>
                          <div className="text-2xl font-bold text-purple-400 animate-dashboard-pulse">
                            {course.progress}%
                          </div>
                        </div>
                        <div className="progress-bar h-3">
                          <div 
                            className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <GlassCard className="p-8 activity-card">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="animate-dashboard-float">📈</span>
                    Actividad Reciente
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 dashboard-hover">
                        <div className="text-3xl animate-dashboard-float">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{activity.title}</h4>
                          <p className="text-white/70 text-sm">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
