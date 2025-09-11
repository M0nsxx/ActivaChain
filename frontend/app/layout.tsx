import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from './components/Web3Provider'
import { ErrorBoundary } from './components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'ActivaChain - Plataforma Web3 para Mujeres',
  description: 'Cerrando la brecha de género en blockchain a través de educación y oportunidades económicas reales',
  keywords: 'blockchain, web3, mujeres, educación, nft, defi, uruguay, latam',
  authors: [{ name: 'Equipo ActivaChain' }],
  openGraph: {
    title: 'ActivaChain - Plataforma Web3 para Mujeres',
    description: 'Plataforma descentralizada que empodera a mujeres en Uruguay y LATAM',
    type: 'website',
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ActivaChain - Plataforma Web3 para Mujeres',
    description: 'Cerrando la brecha de género en blockchain',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9333EA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ErrorBoundary>
          <Web3Provider>
            {children}
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
