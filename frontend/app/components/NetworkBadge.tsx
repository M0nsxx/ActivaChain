'use client'

import { useAccount, useChainId } from 'wagmi'

export function NetworkBadge() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  
  const getNetworkInfo = () => {
    switch (chainId) {
      case 11155111:
        return {
          name: 'Ethereum Sepolia',
          color: 'bg-purple-500/20 text-purple-400'
        }
      case 421614:
        return {
          name: 'Arbitrum Sepolia',
          color: 'bg-blue-500/20 text-blue-400'
        }
      default:
        return {
          name: 'Red desconocida',
          color: 'bg-gray-500/20 text-gray-400'
        }
    }
  }
  
  if (!isConnected) {
    return (
      <div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400">
        No conectado
      </div>
    )
  }
  
  const networkInfo = getNetworkInfo()
  
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-bold ${networkInfo.color}`}>
      {networkInfo.name}
      {chainId === 421614 && ' (Maldo Bounty)'}
    </div>
  )
}
