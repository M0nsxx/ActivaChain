'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WalletButton } from './WalletButton'
import { NetworkBadge } from './NetworkBadge'
import { HeaderParticles } from './HeaderParticles'

export function Header() {
  const [activeSection, setActiveSection] = useState<string>('')
  const [governanceClicked, setGovernanceClicked] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    
    // Efecto especial para gobernanza
    if (sectionId === 'governance') {
      setGovernanceClicked(true)
      setTimeout(() => setGovernanceClicked(false), 2000)
      // Navegar a la página de gobernanza
      router.push('/gobernanza')
      return
    }
    
    if (typeof window === 'undefined') return
    
    const element = document.getElementById(sectionId)
    if (element) {
      // Calcular posición considerando el header fijo
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const navigateToLearn = () => {
    router.push('/aprender')
  }

  const navigateToNFTs = () => {
    router.push('/nfts')
  }

  const navigateToReputacion = () => {
    router.push('/reputacion')
  }

  const navigateToComunidad = () => {
    router.push('/comunidad')
  }

  // Detectar sección activa basada en scroll
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const sections = ['governance']
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            return
          }
        }
      }
      setActiveSection('')
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const navigationItems = [
    { icon: '🏠', label: 'Inicio', action: () => router.push('/') },
    { icon: '🎓', label: 'Aprender', action: navigateToLearn },
    { icon: '💼', label: 'Mercado', action: () => router.push('/marketplace') },
    { icon: '🎨', label: 'NFTs', action: navigateToNFTs },
    { icon: '⭐', label: 'Reputación', action: navigateToReputacion },
    { icon: '🤝', label: 'Comunidad', action: navigateToComunidad },
    { icon: '👥', label: 'Sobre Nosotros', action: () => router.push('/sobre-nosotros') },
    { icon: '🏛️', label: 'Gobernanza', action: () => scrollToSection('governance'), special: true },
    { icon: '📊', label: 'Panel de Control', action: () => router.push('/dashboard') }
  ]

  return (
    <>
      <HeaderParticles active={governanceClicked} />
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo y Network Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">
                ActivaChain
              </h1>
              <div className="hidden sm:block">
                <NetworkBadge />
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-2">
              {navigationItems.map((item, index) => (
                <button 
                  key={index}
                  onClick={item.action}
                  className={`px-2 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs ${
                    item.special && activeSection === 'governance'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 animate-neural-pulse-glow' 
                      : item.special && governanceClicked
                      ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/30 animate-pulse'
                      : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10'
                  }`}
                >
                  <span className={item.special && governanceClicked ? 'animate-bounce' : ''}>{item.icon}</span>
                  <span className="hidden 2xl:inline">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Tablet Navigation (simplified) */}
            <nav className="hidden lg:flex xl:hidden items-center gap-1">
              {navigationItems.slice(0, 6).map((item, index) => (
                <button 
                  key={index}
                  onClick={item.action}
                  className={`px-2 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 text-xs ${
                    item.special && activeSection === 'governance'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.icon}</span>
                </button>
              ))}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="px-2 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 text-white/70 hover:text-white hover:bg-white/10 text-xs"
              >
                <span>⋯</span>
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Wallet Button */}
            <div className="ml-2 sm:ml-4">
              <WalletButton />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 p-3 sm:p-4 glass-morphism rounded-xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navigationItems.map((item, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      item.action()
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm ${
                      item.special && activeSection === 'governance'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Network Badge en mobile */}
              <div className="mt-4 pt-4 border-t border-white/10 sm:hidden">
                <NetworkBadge />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
