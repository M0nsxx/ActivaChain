'use client'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'

export default function CookiesPage() {
  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Política de Cookies
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Última actualización: Octubre 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">1. ¿Qué son las Cookies?</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita ActivaChain. Nos ayudan a mejorar su experiencia y proporcionar funcionalidades esenciales de la plataforma.
              </p>
              <p className="text-white/80 leading-relaxed">
                ActivaChain utiliza un enfoque minimalista de cookies, priorizando su privacidad y la funcionalidad descentralizada.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">2. Tipos de Cookies que Utilizamos</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">🍪 Cookies Esenciales</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    Estas cookies son necesarias para el funcionamiento básico de la plataforma:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                    <li><strong>Autenticación:</strong> Mantener su sesión de wallet conectada</li>
                    <li><strong>Seguridad:</strong> Detectar actividades sospechosas</li>
                    <li><strong>Preferencias:</strong> Recordar su red blockchain preferida</li>
                    <li><strong>Funcionalidad:</strong> Habilitar características básicas de la plataforma</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">⚙️ Cookies de Funcionalidad</h3>
                  <p className="text-white/80 leading-relaxed mb-3">
                    Mejoran su experiencia personalizada:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                    <li><strong>Configuraciones:</strong> Recordar sus preferencias de interfaz</li>
                    <li><strong>Progreso:</strong> Guardar su avance en cursos</li>
                    <li><strong>Notificaciones:</strong> Gestionar sus preferencias de alertas</li>
                    <li><strong>Idioma:</strong> Mantener su idioma preferido</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">3. Cookies que NO Utilizamos</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain NO utiliza los siguientes tipos de cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>❌ Cookies de Publicidad:</strong> No mostramos anuncios ni rastreamos para marketing</li>
                  <li><strong>❌ Cookies de Análisis de Terceros:</strong> No utilizamos Google Analytics ni similares</li>
                  <li><strong>❌ Cookies de Redes Sociales:</strong> No integramos botones de compartir que rastreen</li>
                  <li><strong>❌ Cookies de Seguimiento:</strong> No rastreamos su comportamiento en otros sitios</li>
                  <li><strong>❌ Cookies de Retargeting:</strong> No seguimos sus visitas para mostrar anuncios</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">4. Duración de las Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cookies de Sesión</h3>
                  <p className="text-white/80 leading-relaxed">
                    Se eliminan automáticamente cuando cierra su navegador. Incluyen autenticación y preferencias temporales.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cookies Persistentes</h3>
                  <p className="text-white/80 leading-relaxed">
                    Permanecen en su dispositivo por un período específico (máximo 1 año). Incluyen configuraciones de interfaz y preferencias de red.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">5. Gestión de Cookies</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">Configuración en ActivaChain</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Puede gestionar sus preferencias de cookies desde su perfil:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Ir a "Panel de Control" → "Configuración" → "Privacidad"</li>
                  <li>Activar/desactivar cookies de funcionalidad</li>
                  <li>Eliminar todas las cookies almacenadas</li>
                  <li>Exportar sus datos de cookies</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Configuración del Navegador</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  También puede gestionar cookies desde su navegador:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                  <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                  <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                  <li><strong>Edge:</strong> Configuración → Cookies y permisos de sitio</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">6. Impacto de Deshabilitar Cookies</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Si deshabilita cookies esenciales:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>No podrá mantener su sesión de wallet conectada</li>
                  <li>La plataforma no recordará sus preferencias</li>
                  <li>Algunas funcionalidades pueden no funcionar correctamente</li>
                  <li>Su experiencia será menos personalizada</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mb-2 mt-4">Si deshabilita cookies de funcionalidad:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>No se recordarán sus configuraciones de interfaz</li>
                  <li>Su progreso en cursos no se guardará automáticamente</li>
                  <li>Las notificaciones pueden no funcionar correctamente</li>
                  <li>La experiencia será menos personalizada</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">7. Cookies de Terceros</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain utiliza servicios mínimos de terceros que pueden establecer cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>IPFS:</strong> Para almacenamiento descentralizado (sin cookies de seguimiento)</li>
                  <li><strong>Blockchain Networks:</strong> Para transacciones (sin cookies de seguimiento)</li>
                  <li><strong>Wallet Providers:</strong> Para conexión de wallets (cookies de sesión únicamente)</li>
                </ul>
                <p className="text-white/80 leading-relaxed mt-4">
                  No utilizamos servicios de análisis, publicidad o seguimiento de terceros.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">8. Actualizaciones de esta Política</h2>
              <p className="text-white/80 leading-relaxed">
                Esta política de cookies puede actualizarse ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales. Los cambios significativos serán notificados a través de la plataforma.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">9. Contacto</h2>
              <p className="text-white/80 leading-relaxed">
                Si tiene preguntas sobre nuestra política de cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4 mt-4">
                <li>Email: privacy@activachain.com</li>
                <li>Discord: ActivaChain Community</li>
                <li>X: @activachain</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
