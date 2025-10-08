'use client'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Efectos de partículas neurales avanzados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Partículas flotantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 bg-purple-300 rounded-full animate-bounce opacity-35"></div>
        
        {/* Líneas neurales animadas */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-purple-500 to-transparent animate-pulse opacity-40"></div>
          <div className="absolute top-40 right-20 w-px h-24 bg-gradient-to-b from-pink-500 to-transparent animate-pulse opacity-30 delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-px h-40 bg-gradient-to-b from-blue-500 to-transparent animate-pulse opacity-25 delay-2000"></div>
          <div className="absolute top-60 right-1/3 w-px h-28 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse opacity-35 delay-3000"></div>
        </div>
        
        {/* Ondas neurales */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 w-64 h-64 border border-purple-500/20 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 border border-pink-500/15 rounded-full animate-ping opacity-15 delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-blue-500/25 rounded-full animate-ping opacity-20 delay-2000"></div>
        </div>
        
        {/* Efectos de resplandor neural */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/10 via-pink-500/5 to-transparent rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-radial from-blue-500/8 via-cyan-500/4 to-transparent rounded-full animate-pulse opacity-25 delay-1500"></div>
      </div>
      
      <Header />
      
      {/* Spacer para el header fijo */}
      <div className="h-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header de Pricing */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Modelo de Negocio <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ActivaChains</span>
            </h1>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Un modelo híbrido innovador que combina educación blockchain con gestión de eventos, 
              ofreciendo flexibilidad y valor único en el mercado Web3.
            </p>
          </div>

          {/* Planes de Suscripción */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Gratuito */}
            <GlassCard className="p-8 relative overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"></div>
              {/* Efectos neurales para el plan gratuito */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-2 w-px h-16 bg-gradient-to-b from-blue-500 to-transparent animate-pulse"></div>
              </div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Gratuito</h3>
                  <div className="text-4xl font-bold text-white mb-2">$0</div>
                  <p className="text-white/70">Para empezar en Web3</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Cursos básicos de blockchain
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Workshops comunitarios
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    2 eventos por mes
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Acceso a comunidad
                  </li>
                </ul>
                
                <button className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20">
                  Empezar Gratis
                </button>
              </div>
            </GlassCard>

            {/* Plan Pro */}
            <GlassCard className="p-8 relative overflow-hidden border-2 border-purple-500/50 group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 animate-neural-pulse-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg"></div>
              {/* Efectos neurales hiper avanzados para el plan Pro */}
              <div className="absolute inset-0">
                {/* Partículas neurales flotantes */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
                <div className="absolute top-1/2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
                
                {/* Líneas neurales animadas */}
                <div className="absolute top-8 left-2 w-px h-20 bg-gradient-to-b from-purple-500 to-transparent animate-pulse opacity-30"></div>
                <div className="absolute bottom-8 right-2 w-px h-16 bg-gradient-to-b from-pink-500 to-transparent animate-pulse opacity-25 delay-1000"></div>
                
                {/* Ondas neurales concéntricas */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-500/20 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-pink-500/15 rounded-full animate-ping opacity-15 delay-500"></div>
                
                {/* Resplandor neural central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent rounded-full animate-pulse opacity-30"></div>
              </div>
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                Más Popular
              </div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-2">$29.99<span className="text-lg text-white/70">/mes</span></div>
                  <p className="text-white/70">Para profesionales Web3</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Todo lo del plan Gratuito
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Cursos premium ilimitados
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Workshops premium
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Certificaciones incluidas
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Marketplace NFTs con descuentos
                  </li>
                </ul>
                
                <button className="w-full neural-button py-3">
                  Suscribirse Pro
                </button>
              </div>
            </GlassCard>

            {/* Plan Enterprise */}
            <GlassCard className="p-8 relative overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-lg"></div>
              {/* Efectos neurales para el plan Enterprise */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-2 w-px h-16 bg-gradient-to-b from-pink-500 to-transparent animate-pulse"></div>
                {/* Ondas neurales para Enterprise */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-pink-500/20 rounded-full animate-ping opacity-15"></div>
              </div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-white mb-2">$99.99<span className="text-lg text-white/70">/mes</span></div>
                  <p className="text-white/70">Para organizaciones</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    Todo lo del plan Pro
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    Eventos corporativos privados
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    Análisis avanzados y reportes
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    Soporte prioritario 24/7
                  </li>
                  <li className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    API personalizada
                  </li>
                </ul>
                
                <button className="w-full py-3 px-6 bg-gradient-to-r from-pink-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30 text-white rounded-lg transition-all duration-300 border border-pink-500/30">
                  Contactar Ventas
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Modelo de Transacciones */}
          <GlassCard className="p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
            {/* Efectos neurales para la sección de transacciones */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-2 w-px h-20 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse"></div>
              <div className="absolute top-1/2 right-2 w-px h-16 bg-gradient-to-b from-blue-500 to-transparent animate-pulse delay-1000"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center relative z-10">Modelo de Transacciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">$25-150</div>
                <div className="text-white/80 mb-2">Workshops Premium</div>
                <div className="text-white/60 text-sm">Por workshop especializado</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-pink-400 mb-2">$75-200</div>
                <div className="text-white/80 mb-2">Certificaciones</div>
                <div className="text-white/60 text-sm">Por certificado emitido</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">3%</div>
                <div className="text-white/80 mb-2">Marketplace NFTs</div>
                <div className="text-white/60 text-sm">Comisión por venta</div>
              </div>
              
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">$5-15</div>
                <div className="text-white/80 mb-2">Eventos Privados</div>
                <div className="text-white/60 text-sm">Por participante</div>
              </div>
            </div>
          </GlassCard>

          {/* Tokenomics */}
          <GlassCard className="p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
            {/* Efectos neurales hiper avanzados para Tokenomics */}
            <div className="absolute inset-0">
              {/* Partículas neurales flotantes */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-emerald-400 rounded-full animate-bounce opacity-50"></div>
              <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
              
              {/* Líneas neurales animadas */}
              <div className="absolute top-8 left-2 w-px h-24 bg-gradient-to-b from-green-500 to-transparent animate-pulse opacity-30"></div>
              <div className="absolute bottom-8 right-2 w-px h-20 bg-gradient-to-b from-emerald-500 to-transparent animate-pulse opacity-25 delay-1000"></div>
              
              {/* Ondas neurales concéntricas */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-green-500/20 rounded-full animate-ping opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-emerald-500/15 rounded-full animate-ping opacity-15 delay-500"></div>
              
              {/* Resplandor neural central */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-radial from-green-500/20 via-emerald-500/10 to-transparent rounded-full animate-pulse opacity-30"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center relative z-10">Tokenomics $ACTIVA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <div className="text-4xl mb-4">🪙</div>
                <div className="text-xl font-bold text-white mb-2">Staking</div>
                <div className="text-white/80">Recompensas por mantener tokens</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                <div className="text-4xl mb-4">🗳️</div>
                <div className="text-xl font-bold text-white mb-2">Governance</div>
                <div className="text-white/80">Votación para decisiones</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                <div className="text-4xl mb-4">🎁</div>
                <div className="text-xl font-bold text-white mb-2">Recompensas</div>
                <div className="text-white/80">Por participación activa</div>
              </div>
            </div>
          </GlassCard>

          {/* Ventajas Competitivas */}
          <GlassCard className="p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500">
            {/* Efectos neurales para Ventajas Competitivas */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-2 w-px h-20 bg-gradient-to-b from-yellow-500 to-transparent animate-pulse"></div>
              <div className="absolute top-1/2 right-2 w-px h-16 bg-gradient-to-b from-orange-500 to-transparent animate-pulse delay-1000"></div>
              {/* Ondas neurales para ventajas */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-yellow-500/15 rounded-full animate-ping opacity-10"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center relative z-10">Ventajas Competitivas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Único en el mercado</div>
                    <div className="text-white/70">Combina educación blockchain + gestión de eventos</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Precio accesible</div>
                    <div className="text-white/70">Más económico que Cvent/Bizzabo</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Modelo flexible</div>
                    <div className="text-white/70">Freemium + suscripciones + transacciones</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Tokenomics único</div>
                    <div className="text-white/70">Sistema de recompensas innovador</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Web3 nativo</div>
                    <div className="text-white/70">Integración completa con blockchain</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-400 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-semibold mb-1">Escalabilidad</div>
                    <div className="text-white/70">Adaptable a cualquier tamaño de organización</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
