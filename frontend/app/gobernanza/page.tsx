'use client'

import GovernanceSection from '@/app/components/GovernanceSection'
import { GovernanceNeuralEffects, VotingParticles, NeuralConnections } from '@/app/components/GovernanceNeuralEffects'
import { ScrollIndicator } from '@/app/components/ScrollIndicator'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'

export default function GobernanzaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <ScrollIndicator />
      
      {/* Sección de Gobernanza */}
      <section id="governance" className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <GovernanceNeuralEffects />
        <VotingParticles />
        <NeuralConnections />
        <GovernanceSection />
      </section>
      
      <Footer />
    </div>
  )
}
