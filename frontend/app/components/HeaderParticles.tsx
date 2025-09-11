'use client'

import { useEffect, useRef } from 'react'

interface HeaderParticlesProps {
  active: boolean
}

export function HeaderParticles({ active }: HeaderParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = 100 // Solo la altura del header
      }
    }
    
    resizeCanvas()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }

    // Partículas para el efecto de gobernanza
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      life: number
    }> = []

    const colors = ['#9333EA', '#EC4899', '#3B82F6']

    // Crear partículas cuando se activa
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.02

        // Reducir opacidad
        particle.opacity = particle.life

        // Dibujar partícula
        if (particle.life > 0) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
          ctx.fill()

          // Efecto de glow
          ctx.shadowBlur = 10
          ctx.shadowColor = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = particle.color + Math.floor(particle.opacity * 100).toString(16).padStart(2, '0')
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          // Remover partícula muerta
          particles.splice(index, 1)
        }
      })

      // Continuar animación si hay partículas
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
      }
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-40"
      style={{ background: 'transparent' }}
    />
  )
}
