'use client'

import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
  hover?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export default function GlassCard({ 
  children, 
  className = '', 
  gradient = false,
  hover = true,
  onClick,
  style
}: GlassCardProps) {
  return (
    <div 
      className={clsx(
        'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl',
        'relative overflow-hidden',
        gradient && 'bg-gradient-to-br from-white/10 to-white/5',
        hover && 'hover:bg-white/15 hover:border-white/30 hover:shadow-3xl transition-all duration-500',
        onClick && 'cursor-pointer',
        'neural-glow hover:animate-neural-pulse-glow',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-out',
        className
      )}
      onClick={onClick}
      style={style}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
