'use client'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'
import { NeuralParticles } from '../components/NeuralParticles'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Política de Privacidad
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">1. Introducción</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                En ActivaChain, respetamos profundamente su privacidad y nos comprometemos a proteger sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos su información en nuestra plataforma descentralizada.
              </p>
              <p className="text-white/80 leading-relaxed">
                ActivaChain está construida sobre principios de privacidad por diseño, utilizando tecnologías como ZK proofs para proteger su información personal.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">2. Información que Recopilamos</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">Información de Wallet:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Dirección de wallet pública (no claves privadas)</li>
                  <li>Historial de transacciones en la plataforma</li>
                  <li>Red blockchain utilizada</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Información de Perfil:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Nombre de usuario (opcional)</li>
                  <li>Biografía y habilidades (opcional)</li>
                  <li>Preferencias de aprendizaje</li>
                  <li>Certificados y logros obtenidos</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Información de Actividad:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Progreso en cursos</li>
                  <li>Interacciones en la comunidad</li>
                  <li>Servicios ofrecidos y contratados</li>
                  <li>Participación en gobernanza</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">3. Cómo Usamos su Información</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">Funcionalidades de la Plataforma:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Personalizar su experiencia de aprendizaje</li>
                  <li>Conectar con mentores y oportunidades</li>
                  <li>Calcular su reputación y habilidades</li>
                  <li>Procesar transacciones y pagos</li>
                  <li>Generar certificados NFT únicos</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Mejora del Servicio:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li>Analizar patrones de uso (anónimamente)</li>
                  <li>Desarrollar nuevas funcionalidades</li>
                  <li>Optimizar la experiencia del usuario</li>
                  <li>Detectar y prevenir fraudes</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">4. Protección de Datos con ZK Proofs</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain utiliza pruebas de conocimiento cero (ZK proofs) para proteger su privacidad:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Verificación sin revelación:</strong> Probamos sus habilidades sin exponer datos personales</li>
                  <li><strong>Reputación privada:</strong> Su reputación se calcula sin revelar información sensible</li>
                  <li><strong>Identidad verificada:</strong> Confirmamos su identidad sin almacenar datos biométricos</li>
                  <li><strong>Transacciones privadas:</strong> Las transacciones se procesan sin revelar montos específicos</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">5. Almacenamiento Descentralizado</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Utilizamos IPFS (InterPlanetary File System) para almacenar datos de forma descentralizada:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Sin servidores centrales:</strong> Sus datos no están en un solo lugar</li>
                  <li><strong>Resistente a censura:</strong> Imposible de eliminar o censurar</li>
                  <li><strong>Acceso global:</strong> Disponible desde cualquier parte del mundo</li>
                  <li><strong>Inmutable:</strong> Una vez almacenado, no se puede modificar</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">6. Compartir Información</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Con su consentimiento explícito</strong></li>
                  <li><strong>Para cumplir con obligaciones legales</strong></li>
                  <li><strong>Para proteger nuestros derechos y seguridad</strong></li>
                  <li><strong>En caso de fusión o adquisición (con notificación previa)</strong></li>
                </ul>
                <p className="text-white/80 leading-relaxed mt-4">
                  La información de su perfil público (nombre de usuario, habilidades) es visible para otros usuarios de la plataforma.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">7. Sus Derechos</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Usted tiene los siguientes derechos sobre sus datos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Acceso:</strong> Solicitar una copia de sus datos</li>
                  <li><strong>Rectificación:</strong> Corregir información inexacta</li>
                  <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos</li>
                  <li><strong>Portabilidad:</strong> Exportar sus datos a otra plataforma</li>
                  <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
                  <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">8. Seguridad</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  Implementamos múltiples capas de seguridad:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Cifrado end-to-end:</strong> Todos los datos sensibles están cifrados</li>
                  <li><strong>Contratos inteligentes auditados:</strong> Código verificado por expertos</li>
                  <li><strong>Autenticación descentralizada:</strong> Sin contraseñas centralizadas</li>
                  <li><strong>Monitoreo continuo:</strong> Detección de actividades sospechosas</li>
                </ul>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">9. Cookies y Tecnologías de Seguimiento</h2>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  ActivaChain utiliza cookies mínimas y solo para funcionalidad esencial:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                  <li><strong>Cookies de sesión:</strong> Para mantener su sesión activa</li>
                  <li><strong>Preferencias:</strong> Para recordar sus configuraciones</li>
                  <li><strong>Seguridad:</strong> Para detectar actividades sospechosas</li>
                </ul>
                <p className="text-white/80 leading-relaxed mt-4">
                  No utilizamos cookies de seguimiento, publicidad o análisis de terceros.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">10. Menores de Edad</h2>
              <p className="text-white/80 leading-relaxed">
                ActivaChain no está dirigida a menores de 18 años. No recopilamos conscientemente información de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">11. Cambios a esta Política</h2>
              <p className="text-white/80 leading-relaxed">
                Podemos actualizar esta política ocasionalmente. Los cambios significativos serán notificados a través de la plataforma y por email. Su uso continuado constituye aceptación de los cambios.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">12. Contacto</h2>
              <p className="text-white/80 leading-relaxed">
                Para preguntas sobre privacidad o ejercer sus derechos, contacte:
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
