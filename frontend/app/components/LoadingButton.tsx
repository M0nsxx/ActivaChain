'use client'

import { motion } from 'framer-motion'

interface LoadingButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function LoadingButton({ 
  isLoading, 
  onClick, 
  disabled = false, 
  children, 
  loadingText = 'Procesando...',
  className = '',
  variant = 'primary' 
}: LoadingButtonProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'neural-button'
      case 'secondary':
        return 'neural-button-secondary'
      case 'ghost':
        return 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
      default:
        return 'neural-button'
    }
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative overflow-hidden py-4 flex items-center justify-center gap-3 
        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
        ${getVariantClasses()}
        ${className}
      `}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
    >
      {/* Loading overlay */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "linear" 
          }}
        />
      )}
      
      {/* Button content */}
      <div className="relative z-10 flex items-center gap-3">
        {isLoading ? (
          <>
            <motion.div 
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </div>

      {/* Pulse effect when loading */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-purple-400/50"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}
    </motion.button>
  )
}