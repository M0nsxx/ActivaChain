'use client'

import { useState, useEffect } from 'react'

export function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isInGovernance, setIsInGovernance] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const governanceElement = document.getElementById('governance')
      if (!governanceElement) return

      const { offsetTop, offsetHeight } = governanceElement
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Verificar si estamos en la sección de gobernanza
      const isInSection = scrollPosition >= offsetTop - 100 && 
                         scrollPosition < offsetTop + offsetHeight - 100
      setIsInGovernance(isInSection)

      // Calcular progreso de scroll en la sección de gobernanza
      if (isInSection) {
        const sectionStart = offsetTop - 100
        const sectionEnd = offsetTop + offsetHeight - 100
        const sectionProgress = (scrollPosition - sectionStart) / (sectionEnd - sectionStart)
        setScrollProgress(Math.max(0, Math.min(1, sectionProgress)))
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  if (!isInGovernance) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/20">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  )
}
