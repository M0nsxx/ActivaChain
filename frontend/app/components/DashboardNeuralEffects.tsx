'use client'

import { useEffect, useRef } from 'react'

interface DashboardNeuralEffectsProps {
  active?: boolean
}

export function DashboardNeuralEffects({ active = false }: DashboardNeuralEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configuración de partículas neurales
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      connections: number[]
    }> = []

    const colors = ['#06B6D4', '#9333EA', '#EC4899', '#10B981', '#F59E0B']
    
    // Crear partículas
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: []
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      particles.forEach((particle, i) => {
        // Actualizar posición
        particle.x += particle.vx
        particle.y += particle.vy

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Mantener dentro del canvas
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Actualizar opacidad
        particle.opacity = Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.4

        // Dibujar partícula
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Efecto de glow
        ctx.shadowBlur = 20
        ctx.shadowColor = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 100).toString(16).padStart(2, '0')
        ctx.fill()
        ctx.shadowBlur = 0

        // Conectar partículas cercanas
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              const opacity = (1 - distance / 150) * 0.2
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      })

      // Efectos adicionales cuando está activo
      if (active) {
        // Ondas de energía
        for (let i = 0; i < 3; i++) {
          const wave = (Date.now() * 0.001 + i * 2) % (Math.PI * 2)
          const radius = 50 + Math.sin(wave) * 30
          const centerX = canvas.width / 2 + Math.cos(wave) * 100
          const centerY = canvas.height / 2 + Math.sin(wave) * 100

          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 - i * 0.1})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Partículas de energía
        for (let i = 0; i < 10; i++) {
          const angle = (Date.now() * 0.002 + i * 0.5) % (Math.PI * 2)
          const radius = 200 + Math.sin(angle * 2) * 50
          const x = canvas.width / 2 + Math.cos(angle) * radius
          const y = canvas.height / 2 + Math.sin(angle) * radius

          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(236, 72, 153, ${0.8})`
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
