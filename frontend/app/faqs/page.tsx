'use client'

import { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'

export default function FAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      category: "🚀 Inicio y Conexión",
      questions: [
        {
          question: "¿Cómo me conecto a ActivaChain?",
          answer: "Simplemente haz clic en 'Conectar Wallet' en la esquina superior derecha. ActivaChain es compatible con MetaMask, WalletConnect y otras wallets populares. No necesitas crear una cuenta separada."
        },
        {
          question: "¿Es gratis usar ActivaChain?",
          answer: "¡Sí! ActivaChain es 100% gratuito. Solo necesitas pagar las comisiones de gas de la red blockchain (Ethereum Sepolia o Red Arbitrum) para las transacciones."
        },
        {
          question: "¿Qué redes blockchain soporta ActivaChain?",
          answer: "ActivaChain funciona en Ethereum Sepolia (testnet) y Red Arbitrum (testnet). Puedes cambiar entre redes fácilmente desde el menú de tu wallet."
        }
      ]
    },
    {
      category: "🎓 Aprendizaje y Cursos",
      questions: [
        {
          question: "¿Necesito conocimientos previos de blockchain?",
          answer: "¡Para nada! ActivaChain está diseñado para principiantes. Nuestros cursos te enseñan desde cero, con explicaciones simples y ejemplos prácticos."
        },
        {
          question: "¿Cómo funcionan los certificados NFT?",
          answer: "Al completar un curso, recibes un certificado NFT único que verifica tu conocimiento. Este certificado es tuyo para siempre y puedes mostrarlo en tu perfil profesional."
        },
        {
          question: "¿Puedo acceder a los cursos sin conectar mi wallet?",
          answer: "Puedes explorar el contenido, pero para recibir certificados NFT y participar en la gamificación necesitas conectar tu wallet."
        }
      ]
    },
    {
      category: "💼 Mercado y Servicios",
      questions: [
        {
          question: "¿Cómo puedo ganar dinero en ActivaChain?",
          answer: "Puedes ofrecer servicios en nuestro mercado descentralizado: consultoría, diseño, desarrollo, mentoría, etc. Los pagos se procesan automáticamente a través de contratos inteligentes."
        },
        {
          question: "¿Cómo funciona el sistema de reputación?",
          answer: "Tu reputación se basa en ZK proofs (pruebas de conocimiento cero) que verifican tus habilidades sin revelar información privada. Mejores calificaciones = mayor reputación = más oportunidades."
        },
        {
          question: "¿Qué comisiones cobra ActivaChain?",
          answer: "ActivaChain no cobra comisiones. Solo pagas las comisiones de gas de la red blockchain, que van directamente a los mineros/validadores."
        }
      ]
    },
    {
      category: "🎨 NFTs y Colecciones",
      questions: [
        {
          question: "¿Qué tipos de NFTs puedo crear?",
          answer: "Puedes crear certificados de cursos, badges de logros, arte digital, y colecciones estacionales. ActivaChain soporta tanto ERC721 (NFTs únicos) como ERC1155 (colecciones múltiples)."
        },
        {
          question: "¿Dónde se almacenan mis NFTs?",
          answer: "Los metadatos de tus NFTs se almacenan en IPFS (InterPlanetary File System), una red descentralizada que garantiza que tus archivos nunca se pierdan."
        },
        {
          question: "¿Puedo vender mis NFTs?",
          answer: "¡Sí! Puedes vender tus NFTs en cualquier marketplace compatible con los estándares ERC721/ERC1155, incluyendo OpenSea, Rarible, y otros."
        }
      ]
    },
    {
      category: "🏆 Gamificación y Logros",
      questions: [
        {
          question: "¿Cómo funciona el sistema de gamificación?",
          answer: "Ganas puntos por completar cursos, ayudar a otros, crear contenido, y participar en la comunidad. Hay 16 achievements únicos y 8 badges de raridad diferentes."
        },
        {
          question: "¿Qué son los streaks de actividad?",
          answer: "Los streaks son rachas consecutivas de actividad diaria. Mantener un streak te da bonificaciones de puntos y acceso a contenido exclusivo."
        },
        {
          question: "¿Cómo veo mi progreso?",
          answer: "Puedes ver tu progreso en el Panel de Control, donde encontrarás tus estadísticas, logros desbloqueados, y posición en los leaderboards comunitarios."
        }
      ]
    },
    {
      category: "👥 Comunidad y Mentoría",
      questions: [
        {
          question: "¿Cómo me convierto en mentora?",
          answer: "Después de completar ciertos cursos y demostrar conocimiento, puedes postularte para ser mentora. La comunidad vota para aprobar nuevas mentoras basándose en su reputación y contribuciones."
        },
        {
          question: "¿Cómo funcionan los workshops?",
          answer: "Los workshops son sesiones en vivo donde las mentoras enseñan temas específicos. Puedes inscribirte gratuitamente y participar en tiempo real con preguntas y ejercicios."
        },
        {
          question: "¿Puedo crear mi propio grupo de estudio?",
          answer: "¡Absolutamente! Puedes crear grupos de estudio, organizar eventos comunitarios, y colaborar con otras usuarias en proyectos conjuntos."
        }
      ]
    },
    {
      category: "🏛️ Gobernanza y DAO",
      questions: [
        {
          question: "¿Qué es la gobernanza descentralizada?",
          answer: "La gobernanza permite que todas las usuarias voten en decisiones importantes de la plataforma: nuevas funcionalidades, cambios en las reglas, presupuesto comunitario, etc."
        },
        {
          question: "¿Cómo obtengo tokens de gobernanza?",
          answer: "Los tokens de gobernanza se obtienen por participación activa: completar cursos, ayudar a otros, crear contenido valioso, y contribuir al desarrollo de la plataforma."
        },
        {
          question: "¿Qué decisiones puedo votar?",
          answer: "Puedes votar en propuestas sobre nuevas funcionalidades, cambios en el sistema de reputación, eventos comunitarios, integraciones con otras plataformas, y más."
        }
      ]
    },
    {
      category: "🔐 Seguridad y Privacidad",
      questions: [
        {
          question: "¿Es seguro conectar mi wallet?",
          answer: "Sí, ActivaChain nunca tiene acceso a tus fondos privados. Solo interactúa con tu wallet para firmar transacciones que tú apruebas explícitamente."
        },
        {
          question: "¿Qué son los ZK proofs?",
          answer: "Los ZK proofs (pruebas de conocimiento cero) permiten verificar tu identidad y habilidades sin revelar información personal. Es la tecnología más avanzada en privacidad."
        },
        {
          question: "¿Puedo usar ActivaChain de forma anónima?",
          answer: "Sí, puedes participar completamente de forma anónima. Solo necesitas una wallet, no información personal ni verificación de identidad."
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre ActivaChain
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex
                    return (
                      <GlassCard key={faqIndex} className="p-0 overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full p-4 sm:p-6 text-left transition-all duration-300 hover:bg-white/5"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-white pr-4">
                              {faq.question}
                            </h3>
                            <div className={`transition-transform duration-300 ${openFAQ === globalIndex ? 'rotate-180' : ''}`}>
                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                        
                        {openFAQ === globalIndex && (
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-white/10">
                            <p className="text-white/80 leading-relaxed text-sm sm:text-base pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </GlassCard>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16">
            <GlassCard gradient className="p-6 sm:p-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                ¿No encontraste tu respuesta?
              </h2>
              <p className="text-white/80 mb-6">
                Nuestro equipo de soporte está aquí para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/comunidad"
                  className="neural-button px-6 py-3 flex items-center justify-center gap-2"
                >
                  <span>🤝</span>
                  <span>Unirse a la Comunidad</span>
                </a>
                <a 
                  href="/sobre-nosotros"
                  className="neural-button-secondary px-6 py-3 flex items-center justify-center gap-2"
                >
                  <span>📧</span>
                  <span>Contactar Soporte</span>
                </a>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
