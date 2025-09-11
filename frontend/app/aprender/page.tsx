'use client'

import { useRouter } from 'next/navigation'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { NeuralParticles } from '../components/NeuralParticles'
import { LearnSection } from '../components/LearnSection'

export default function AprenderPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      {/* Botón de regreso */}
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-lg font-semibold">Volver al Inicio</span>
          </button>
        </div>
      </div>
      
      {/* Sección de Aprendizaje */}
      <LearnSection />
      
      <Footer />
    </div>
  )
}
