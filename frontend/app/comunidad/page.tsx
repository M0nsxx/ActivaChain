'use client'

import { CommunitySystem } from '../components/CommunitySystem'
import { NeuralParticles } from '../components/NeuralParticles'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function ComunidadPage() {
  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      <main className="relative z-10 pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <CommunitySystem />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
