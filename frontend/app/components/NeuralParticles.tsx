'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export function NeuralParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const animationRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const colors = ['#9333EA', '#EC4899', '#3B82F6', '#10B981']
    const newParticles: Particle[] = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    setParticles(newParticles)

    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4
        }))
      )
      animationRef.current = setTimeout(animate, 100) // Reducido la frecuencia para mejor performance
    }

    // Iniciar animación después de un breve delay
    animationRef.current = setTimeout(animate, 100)

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  )
}
