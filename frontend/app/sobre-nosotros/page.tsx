'use client'

import { useState, useEffect } from 'react'
import GlassCard from '@/app/components/GlassCard'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { NeuralParticles } from '@/app/components/NeuralParticles'

export default function SobreNosotrosPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const teamMembers = [
    {
      name: "Lorena Erbure",
      role: "Founder & Business Strategist",
      description: "Fundadora y estratega de negocios de ActivaChain. Visionaria que lidera la misión de empoderar a las mujeres en Web3 y construye partnerships estratégicos.",
      avatar: "👑",
      skills: ["Business Strategy", "Partnerships", "Leadership", "Web3 Vision"],
      gradient: "from-purple-500 to-pink-500",
      isFounder: true
    },
    {
      name: "M0nsxx",
      role: "Co-Founder & UX/UI Designer",
      description: "Co-fundadora y diseñadora UX/UI especializada en crear interfaces intuitivas y accesibles. Diseña experiencias que hacen la tecnología blockchain accesible para todos.",
      avatar: "🎨",
      skills: ["UX/UI Design", "User Research", "Accessibility", "Design Systems"],
      gradient: "from-red-500 to-orange-500",
      isFounder: false
    },
    {
      name: "Marian",
      role: "Co-Founder & Pitch & Storytelling Expert",
      description: "Co-fundadora experta en pitch, storytelling y comunicación. Transforma ideas complejas en narrativas convincentes que conectan con audiencias globales.",
      avatar: "🎤",
      skills: ["Pitch", "Storytelling", "Communication", "Presentation"],
      gradient: "from-green-500 to-emerald-500",
      isFounder: false
    },
    {
      name: "Noemi",
      role: "Co-Founder & Community Manager",
      description: "Co-fundadora y gestora de comunidad especializada en construir conexiones auténticas. Fomenta un ecosistema inclusivo donde cada miembro se siente valorado y empoderado.",
      avatar: "🤝",
      skills: ["Community Management", "Social Media", "Event Planning", "Networking"],
      gradient: "from-pink-500 to-rose-500",
      isFounder: false
    },
    {
      name: "Vaiosx",
      role: "Co-Founder & Blockchain Developer",
      description: "Co-fundador y desarrollador blockchain especializado en arquitectura descentralizada. Construye la infraestructura técnica que hace posible el ecosistema ActivaChain.",
      avatar: "⚡",
      skills: ["Blockchain Development", "DeFi", "Architecture", "Web3"],
      gradient: "from-indigo-500 to-purple-500",
      isFounder: false
    }
  ]


  const projectStats = [
    { number: "1", label: "Founder", icon: "👑" },
    { number: "4", label: "Co-Founders", icon: "👥" },
    { number: "48h", label: "Tiempo de Desarrollo", icon: "⏰" },
    { number: "100%", label: "Open Source", icon: "🔓" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <h1 className="text-6xl font-bold text-white mb-6">
              Sobre <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Nosotros</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Somos un equipo apasionado de desarrolladores blockchain que se unió para crear 
              <span className="text-purple-400 font-semibold"> ActivaChain</span>, 
              una plataforma revolucionaria que empodera a las mujeres en la nueva economía digital.
            </p>
          </div>


          {/* Project Stats */}
          <div className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {projectStats.map((stat, index) => (
                <GlassCard key={index} className="p-8 text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <p className="text-white/70 text-lg">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">
                Nuestro <span className="gradient-text">Equipo</span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Conocé a los desarrolladores detrás de ActivaChain, unidos por la pasión de crear un futuro más inclusivo en Web3
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <GlassCard 
                  key={index} 
                  className="p-8 hover:scale-105 transition-all duration-500 group"
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {member.avatar}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                      {member.isFounder && (
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-bold text-xs mb-2">
                          👑 FOUNDER
                        </div>
                      )}
                      <div className={`inline-block px-4 py-2 bg-gradient-to-r ${member.gradient} rounded-full text-white font-semibold text-sm`}>
                        {member.role}
                      </div>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed text-center">
                      {member.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold text-center">Habilidades</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <GlassCard gradient className="p-16 text-center">
              <div className="space-y-8">
                <h2 className="text-5xl font-bold text-white mb-6">
                  Nuestra <span className="gradient-text">Misión</span>
                </h2>
                
                <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Creemos que la tecnología blockchain debe ser accesible para todos. 
                  <span className="text-purple-400 font-semibold"> ActivaChain</span> nace de la convicción 
                  de que las mujeres tienen un papel fundamental en el futuro de Web3.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="space-y-4">
                    <div className="text-4xl">🎓</div>
                    <h3 className="text-xl font-bold text-white">Educación Inclusiva</h3>
                    <p className="text-white/70">Cursos diseñados para eliminar barreras de entrada en blockchain</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-4xl">💼</div>
                    <h3 className="text-xl font-bold text-white">Oportunidades Reales</h3>
                    <p className="text-white/70">Marketplace que conecta talento femenino con oportunidades globales</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-4xl">🏛️</div>
                    <h3 className="text-xl font-bold text-white">Gobernanza Democrática</h3>
                    <p className="text-white/70">Sistema de votación que da voz a cada miembro de la comunidad</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-white/60 text-lg">
                    🌟 <strong>Unite a nosotros</strong> en esta revolución digital que está transformando el mundo
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
