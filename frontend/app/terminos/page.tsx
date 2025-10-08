'use client'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'

export default function TerminosPage() {
  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Términos de Servicio
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">1. Aceptación de los Términos</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Al acceder y utilizar ActivaChain, usted acepta estar sujeto a estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestra plataforma.
              </p>
              <p className="text-white/80 leading-relaxed">
                ActivaChain es una plataforma descentralizada construida en blockchain que conecta a mujeres con oportunidades de aprendizaje y trabajo en Web3.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">2. Descripción del Servicio</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain proporciona los siguientes servicios:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Plataforma de aprendizaje con cursos de blockchain y Web3</li>
                  <li>Mercado descentralizado para servicios profesionales</li>
                  <li>Sistema de reputación basado en ZK proofs</li>
                  <li>Creación y gestión de NFTs (ERC721 y ERC1155)</li>
                  <li>Sistema de gamificación con logros y badges</li>
                  <li>Comunidad de mentoría y workshops</li>
                  <li>Gobernanza descentralizada (DAO)</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">3. Uso Aceptable</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">Usted se compromete a:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Respetar a otros usuarios y mantener un ambiente inclusivo</li>
                  <li>No utilizar la plataforma para actividades ilegales</li>
                  <li>No intentar hackear o comprometer la seguridad</li>
                  <li>Respetar los derechos de propiedad intelectual</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Está prohibido:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Discriminación por género, raza, religión u orientación sexual</li>
                  <li>Spam o contenido no solicitado</li>
                  <li>Actividades fraudulentas o engañosas</li>
                  <li>Violación de derechos de autor</li>
                  <li>Manipulación del sistema de reputación</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">4. Propiedad Intelectual</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Los usuarios mantienen todos los derechos sobre su contenido creado, incluyendo NFTs, certificados y servicios ofrecidos. ActivaChain no reclama propiedad sobre el contenido generado por los usuarios.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Los contratos inteligentes, la interfaz de usuario y el código de la plataforma están protegidos por derechos de autor y licencias de código abierto apropiadas.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">5. Transacciones y Pagos</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Todas las transacciones se procesan a través de contratos inteligentes en blockchain. Los usuarios son responsables de:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Gestionar sus propias wallets y claves privadas</li>
                  <li>Pagar las comisiones de gas de la red blockchain</li>
                  <li>Verificar las transacciones antes de confirmarlas</li>
                  <li>Entender los riesgos asociados con las criptomonedas</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">6. Limitación de Responsabilidad</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain se proporciona "tal como está" sin garantías de ningún tipo. No garantizamos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Disponibilidad continua del servicio</li>
                  <li>Ausencia de errores o interrupciones</li>
                  <li>Resultados específicos de aprendizaje o ganancias</li>
                  <li>Compatibilidad con todas las wallets</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Los usuarios utilizan la plataforma bajo su propio riesgo y responsabilidad.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">7. Modificaciones</h2>
              <p className="text-white/80 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma y entrarán en vigor inmediatamente. El uso continuado de la plataforma constituye aceptación de los nuevos términos.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">8. Terminación</h2>
              <p className="text-white/80 leading-relaxed">
                Podemos suspender o terminar su acceso a la plataforma por violación de estos términos. Los usuarios pueden discontinuar el uso en cualquier momento. La terminación no afecta los derechos y obligaciones que hayan surgido antes de la terminación.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">9. Contacto</h2>
              <p className="text-white/80 leading-relaxed">
                Para preguntas sobre estos términos, contacte a través de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4 mt-4">
                <li>Email: legal@activachain.com</li>
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
