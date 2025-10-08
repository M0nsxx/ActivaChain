'use client'

import { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se implementaría la lógica de envío
    console.log('Formulario enviado:', formData)
    alert('¡Mensaje enviado! Te responderemos pronto.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
              Contacto
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            ¿Tienes preguntas? ¡Estamos aquí para ayudarte!
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-white/80 mb-2">
                    Tipo de Consulta *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="general">Consulta General</option>
                    <option value="technical">Soporte Técnico</option>
                    <option value="business">Oportunidades de Negocio</option>
                    <option value="partnership">Partnership</option>
                    <option value="media">Prensa y Medios</option>
                    <option value="legal">Asuntos Legales</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Resumen de tu consulta"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full neural-button py-3 px-6 text-center font-semibold"
                >
                  Enviar Mensaje
                </button>
              </form>
            </GlassCard>

            {/* Contact Information */}
            <div className="space-y-6">
              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Información de Contacto</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <p className="text-white/80">contacto@activachain.com</p>
                      <p className="text-white/80 text-sm">Respuesta en 24-48 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Discord</h3>
                      <p className="text-white/80">ActivaChain Community</p>
                      <p className="text-white/80 text-sm">Soporte en tiempo real</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🐦</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">X (Twitter)</h3>
                      <p className="text-white/80">@activachain</p>
                      <p className="text-white/80 text-sm">Actualizaciones y noticias</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🌐</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Website</h3>
                      <p className="text-white/80">activachain.com</p>
                      <p className="text-white/80 text-sm">Documentación completa</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Horarios de Atención</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Lunes - Viernes</span>
                    <span className="text-white">9:00 - 18:00 UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Sábados</span>
                    <span className="text-white">10:00 - 16:00 UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Domingos</span>
                    <span className="text-white">Solo emergencias</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  * Los horarios pueden variar durante eventos especiales y hackathons
                </p>
              </GlassCard>

              <GlassCard className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Tipos de Consultas</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Soporte técnico y bugs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Consultas sobre funcionalidades</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Problemas con transacciones</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Sugerencias y feedback</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Partnerships y colaboraciones</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white/80">Prensa y medios</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <GlassCard className="p-6 sm:p-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                ¿Preguntas Frecuentes?
              </h2>
              <p className="text-white/80 mb-6">
                Revisa nuestra sección de FAQs antes de contactarnos
              </p>
              <a 
                href="/faqs"
                className="neural-button px-6 py-3 inline-flex items-center gap-2"
              >
                <span>❓</span>
                <span>Ver FAQs</span>
              </a>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
