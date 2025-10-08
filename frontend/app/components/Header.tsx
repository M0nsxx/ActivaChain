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
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false)
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

  // Cerrar menú de ayuda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isHelpMenuOpen) {
        const target = event.target as Element
        if (!target.closest('[data-help-menu]')) {
          setIsHelpMenuOpen(false)
        }
      }
    }

    if (isHelpMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHelpMenuOpen])

  const navigationItems = [
    { icon: '🏠', label: 'INICIO', action: () => router.push('/') },
    { icon: '🎓', label: 'APRENDER', action: navigateToLearn },
    { icon: '💼', label: 'MERCADO', action: () => router.push('/marketplace') },
    { icon: '🎨', label: 'NFTS', action: navigateToNFTs },
    { icon: '⭐', label: 'REPUTACIÓN', action: navigateToReputacion },
    { icon: '🤝', label: 'COMUNIDAD', action: navigateToComunidad },
    { icon: '🏛️', label: 'GOBERNANZA', action: () => scrollToSection('governance'), special: true }
  ]

  const helpSubmenuItems = [
    { icon: '👥', label: 'SOBRE NOSOTROS', action: () => router.push('/sobre-nosotros') },
    { icon: '🔔', label: 'NOTIFICACIONES', action: () => router.push('/notificaciones') },
    { icon: '🔗', label: 'APIS', action: () => router.push('/apis') },
    { icon: '❓', label: 'FAQS', action: () => router.push('/faqs') },
    { icon: '🌐', label: 'IPFS', action: () => router.push('/ipfs') }
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
              
              {/* Ayuda Dropdown */}
              <div className="relative" data-help-menu>
                <button 
                  onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                  className="px-2 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <span>❓</span>
                  <span className="hidden 2xl:inline">AYUDA</span>
                  <span className={`transition-transform duration-200 ${isHelpMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                
                {/* Dropdown Menu */}
                {isHelpMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass-morphism rounded-xl border border-white/10 p-2 z-50">
                    {helpSubmenuItems.map((item, index) => (
                      <button 
                        key={index}
                        onClick={() => {
                          item.action()
                          setIsHelpMenuOpen(false)
                        }}
                        className="w-full px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            <div className="lg:hidden mt-4 p-4 glass-morphism rounded-xl border border-white/10 max-h-[80vh] overflow-y-auto">
              {/* Navegación Principal */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-semibold text-purple-400 mb-3 px-1">NAVEGACIÓN</div>
                <div className="grid grid-cols-2 gap-2">
                  {navigationItems.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        item.action()
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-2 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 text-xs ${
                        item.special && activeSection === 'governance'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sección Ayuda */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-semibold text-purple-400 mb-3 px-1">AYUDA</div>
                <div className="grid grid-cols-2 gap-2">
                  {helpSubmenuItems.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        item.action()
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-2 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 text-xs text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-xs leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Network Badge */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Red:</span>
                  <NetworkBadge />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
