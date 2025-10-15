'use client'

import { useAccount } from 'wagmi'
import NotificationCenter from '../components/NotificationCenter'
import { NeuralParticles } from '../components/NeuralParticles'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import GlassCard from '../components/GlassCard'

export default function NotificacionesPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      <main className="relative z-10 pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!isConnected ? (
            <div className="text-center">
              <GlassCard className="p-8 max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🔗</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Conecta tu Wallet
                </h1>
                <p className="text-white/70 text-lg mb-6">
                  Las notificaciones están personalizadas para cada wallet conectada
                </p>
                <div className="bg-white/5 rounded-lg p-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    ¿Por qué necesito conectar mi wallet?
                  </h3>
                  <ul className="text-white/60 space-y-2">
                    <li>• Las notificaciones son específicas para tu wallet</li>
                    <li>• Acceso a tu historial de transacciones</li>
                    <li>• Notificaciones personalizadas de achievements</li>
                    <li>• Alertas de eventos comunitarios relevantes</li>
                    <li>• Configuraciones privadas y seguras</li>
                  </ul>
                </div>
                <div className="mt-6 text-white/50 text-sm">
                  <p>Conecta tu wallet usando el botón en la parte superior derecha</p>
                </div>
              </GlassCard>
            </div>
          ) : (
            <NotificationCenter />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
