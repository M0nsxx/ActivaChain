'use client'

import { createAppKit } from '@reown/appkit/react'
import { arbitrumSepolia, sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode, useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Función para crear AppKit de forma segura
function createSafeAppKit() {
  try {
    const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'c2b93e3f5a3a9b146ef83026c4d17a67'
    
    const metadata = {
      name: 'ActivaChain',
      description: 'Web3 Platform for Women',
      url: 'https://activachain.io',
      icons: ['https://activachain.io/icon.png']
    }

    const wagmiAdapter = new WagmiAdapter({
      networks: [sepolia, arbitrumSepolia],
      projectId
    })

    createAppKit({
      adapters: [wagmiAdapter],
      networks: [sepolia, arbitrumSepolia],
      defaultNetwork: sepolia,
      metadata,
      projectId,
      features: {
        analytics: true,
        email: true,
        socials: ['google', 'facebook', 'github'],
        emailShowWallets: true
      },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-color-mix': '#7B3FF2',
        '--w3m-color-mix-strength': 20,
        '--w3m-font-family': 'Inter, sans-serif',
        '--w3m-border-radius-master': '12px',
        '--w3m-accent': '#9333EA'
      }
    })

    return wagmiAdapter
  } catch (error) {
    console.warn('Error creating AppKit:', error)
    return null
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [wagmiAdapter, setWagmiAdapter] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const adapter = createSafeAppKit()
      setWagmiAdapter(adapter)
    } catch (error) {
      console.error('Failed to initialize Web3:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A0B2E] to-[#0F0F23] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold mb-4">ActivaChain</h1>
          <p className="text-white/70 mb-4">Inicializando Web3...</p>
        </div>
      </div>
    )
  }

  if (!wagmiAdapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A0B2E] to-[#0F0F23] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">ActivaChain</h1>
          <p className="text-white/70 mb-4">Error de configuración Web3</p>
          <p className="text-sm text-white/50">
            Verifica tu conexión a internet y recarga la página
          </p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
