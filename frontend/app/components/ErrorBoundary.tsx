'use client'

import React from 'react'
import GlassCard from './GlassCard'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <GlassCard className="p-8 max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Error de Carga</h2>
            <p className="text-white/70 mb-6">
              Hubo un problema al cargar la aplicación. Esto puede ser temporal.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full neural-button py-3"
              >
                Recargar Página
              </button>
              <button
                onClick={this.resetError}
                className="w-full neural-button-secondary py-3"
              >
                Intentar Nuevamente
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-white/50 cursor-pointer text-sm">
                  Detalles del error
                </summary>
                <pre className="text-xs text-red-400 mt-2 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para manejar errores de chunks
export function useChunkErrorHandler() {
  React.useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.message?.includes('Loading chunk') || event.message?.includes('ChunkLoadError')) {
        console.warn('Chunk load error detected, reloading page...')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    window.addEventListener('error', handleChunkError)
    return () => window.removeEventListener('error', handleChunkError)
  }, [])
}
