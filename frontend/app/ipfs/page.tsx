'use client'

import IPFSUploadSystem from '../components/IPFSUploadSystem'
import { NeuralParticles } from '../components/NeuralParticles'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function IPFSPage() {
  return (
    <div className="min-h-screen relative">
      <NeuralParticles />
      <Header />
      
      <main className="relative z-10 pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <IPFSUploadSystem />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
