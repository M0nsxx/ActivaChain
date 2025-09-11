'use client'

import { useEffect, useRef } from 'react'

export function GovernanceNeuralEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuración del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configuración de partículas
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

    const colors = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B']
    const particleCount = 80

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
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

    // Función de animación
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

        // Variar opacidad
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

        // Resetear conexiones
        particle.connections = []
      })

      // Dibujar conexiones
      particles.forEach((particle, i) => {
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              const opacity = (1 - distance / 150) * 0.3
              
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`
              ctx.lineWidth = 1
              ctx.stroke()

              // Efecto de pulso en las conexiones
              if (Math.random() < 0.1) {
                ctx.beginPath()
                ctx.moveTo(particle.x, particle.y)
                ctx.lineTo(otherParticle.x, otherParticle.y)
                ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * 2})`
                ctx.lineWidth = 2
                ctx.stroke()
              }
            }
          }
        })
      })

      // Efectos especiales para gobernanza
      const time = Date.now() * 0.001
      
      // Ondas de energía
      for (let i = 0; i < 3; i++) {
        const waveX = canvas.width / 2 + Math.sin(time + i * 2) * 200
        const waveY = canvas.height / 2 + Math.cos(time + i * 2) * 100
        
        ctx.beginPath()
        ctx.arc(waveX, waveY, 100 + Math.sin(time * 2 + i) * 50, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 + Math.sin(time + i) * 0.05})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Partículas de votación
      if (Math.random() < 0.3) {
        const voteX = Math.random() * canvas.width
        const voteY = Math.random() * canvas.height
        
        ctx.beginPath()
        ctx.arc(voteX, voteY, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.8)'
        ctx.fill()
        
        // Efecto de expansión
        ctx.beginPath()
        ctx.arc(voteX, voteY, 20, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

// Componente para efectos de partículas de votación
export function VotingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createVoteParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-green-400 rounded-full animate-ping'
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 2 + 's'
      
      container.appendChild(particle)

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 3000)
    }

    const interval = setInterval(createVoteParticle, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  )
}

// Componente para efectos de conexión neural
export function NeuralConnections() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Líneas de conexión animadas */}
        <path
          d="M100,100 Q300,50 500,200 T900,150"
          stroke="url(#neuralGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-neural-network"
        />
        <path
          d="M200,300 Q400,250 600,400 T1000,350"
          stroke="url(#neuralGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-neural-network"
          style={{ animationDelay: '1s' }}
        />
        <path
          d="M50,500 Q250,450 450,600 T850,550"
          stroke="url(#neuralGradient)"
          strokeWidth="1"
          fill="none"
          className="animate-neural-network"
          style={{ animationDelay: '2s' }}
        />
      </svg>
    </div>
  )
}
