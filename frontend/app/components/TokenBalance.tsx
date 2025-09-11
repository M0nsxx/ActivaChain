'use client'

import { useAccount, useReadContract, useBalance } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import { useNetworkStatus } from '../lib/useNetworkStatus'
import GlassCard from './GlassCard'

const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function TokenBalance() {
  const { address, isConnected } = useAccount()
  const contracts = useContracts()
  const { networkData } = useNetworkStatus()
  
  // Obtener información de la red actual
  const currentNetwork = networkData.networkName
  const isArbitrum = networkData.networkName.includes('Arbitrum')

  // Balance de ETH nativo
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
    query: { enabled: !!address }
  })


  // Balance de ARB
  const { data: arbBalance } = useReadContract({
    address: contracts.arbToken,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: { enabled: !!address }
  })

  const formatBalance = (balance: bigint | undefined, decimals: number, symbol: string) => {
    if (!balance) return '0'
    const divisor = Math.pow(10, decimals)
    const formatted = Number(balance) / divisor
    return `${formatted.toFixed(decimals === 6 ? 2 : 4)} ${symbol}`
  }

  // Debug: mostrar información del token ARB
  console.log('TokenBalance Debug:', {
    address,
    arbAddress: contracts.arbToken,
    arbBalance
  })

  if (!isConnected) {
    return null
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        💰 Balance de Tokens
        <span className="text-sm font-normal text-white/60">(ActivaChain)</span>
      </h3>
      
      <div className="space-y-3">
        {/* ETH Balance - Siempre visible */}
        <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🟡</span>
            <span className="text-white font-semibold">ETH</span>
          </div>
          <span className="text-white/90 font-mono">
            {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)} ETH` : '0.0000 ETH'}
          </span>
        </div>


        {/* ARB Balance - Solo visible en Arbitrum */}
        {isArbitrum && (
          <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🟣</span>
              <span className="text-white font-semibold">ARB</span>
            </div>
            <span className="text-white/90 font-mono">
              {formatBalance(arbBalance, 18, 'ARB')}
            </span>
          </div>
        )}
      </div>

      {/* Faucet Links */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
        <p className="text-white/80 text-sm mb-2">💡 Obtén tokens de prueba:</p>
        <div className="space-y-1">
          {isArbitrum ? (
            <>
              <a 
                href="https://faucets.chain.link/arbitrum-sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-xs block transition-colors"
              >
                → Arbitrum Sepolia Faucet
              </a>
              <a 
                href="https://bridge.arbitrum.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs block transition-colors"
              >
                → Arbitrum Bridge
              </a>
            </>
          ) : (
            <>
              <a 
                href="https://faucets.chain.link/sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs block transition-colors"
              >
                → Sepolia ETH Faucet
              </a>
              <a 
                href="https://faucet.quicknode.com/ethereum/sepolia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-xs block transition-colors"
              >
                → QuickNode Sepolia Faucet
              </a>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  )
}