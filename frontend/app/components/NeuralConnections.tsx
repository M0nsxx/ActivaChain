'use client'

import { useEffect, useRef } from 'react'

interface NeuralConnectionsProps {
  nodes: Array<{
    id: string
    x: number
    y: number
    type: 'service' | 'category' | 'user'
    data?: any
  }>
  connections: Array<{
    from: string
    to: string
    strength: number
  }>
  className?: string
}

export function NeuralConnections({ nodes, connections, className = '' }: NeuralConnectionsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Verificar que nodes y connections estén definidos
    if (!nodes || !connections || !Array.isArray(nodes) || !Array.isArray(connections)) {
      return
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dibujar conexiones
      connections.forEach(connection => {
        const fromNode = nodes.find(n => n.id === connection.from)
        const toNode = nodes.find(n => n.id === connection.to)
        
        if (!fromNode || !toNode) return

        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y)
        gradient.addColorStop(0, `rgba(147, 51, 234, ${connection.strength * 0.3})`)
        gradient.addColorStop(1, `rgba(236, 72, 153, ${connection.strength * 0.3})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = connection.strength * 2
        ctx.setLineDash([5, 5])
        
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Dibujar nodos
      nodes.forEach(node => {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20)
        
        switch (node.type) {
          case 'service':
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)')
            gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)')
            break
          case 'category':
            gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)')
            gradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)')
            break
          case 'user':
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)')
            break
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Efecto de pulso
        const pulseRadius = 8 + Math.sin(Date.now() * 0.003 + node.x * 0.01) * 4
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(Date.now() * 0.002 + node.y * 0.01) * 0.2})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, connections])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}