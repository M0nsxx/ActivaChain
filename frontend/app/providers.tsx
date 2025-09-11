'use client'

import { createAppKit } from '@reown/appkit/react'
import { arbitrumSepolia, sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState } from 'react'

const queryClient = new QueryClient()
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'demo_project_id'

const metadata = {
  name: 'ActivaChain',
  description: 'Web3 Platform for Women',
  url: 'https://activachain.io',
  icons: ['https://activachain.io/icon.png']
}

// Support BOTH networks
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia, arbitrumSepolia],
  projectId
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia, arbitrumSepolia],
  defaultNetwork: sepolia, // Start with Sepolia
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
