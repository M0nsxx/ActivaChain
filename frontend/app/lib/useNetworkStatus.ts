import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient, useBlockNumber } from 'wagmi'
import { formatUnits } from 'viem'

interface NetworkData {
  blockNumber: number
  gasPrice: string
  isOnline: boolean
  networkName: string
  networkIcon: string
  networkColor: string
  lastUpdate: number
}

export function useNetworkStatus() {
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: blockNumber } = useBlockNumber({
    watch: true
  })
  
  const [networkData, setNetworkData] = useState<NetworkData>({
    blockNumber: 0,
    gasPrice: '0',
    isOnline: true,
    networkName: 'No conectado',
    networkIcon: '❌',
    networkColor: 'from-gray-500 to-gray-600',
    lastUpdate: Date.now()
  })

  // Función para obtener información de la red
  const getNetworkInfo = useCallback((chainId?: number) => {
    switch (chainId) {
      case 11155111:
        return {
          name: 'Ethereum Sepolia',
          color: 'from-blue-500 to-cyan-500',
          icon: '🔷'
        }
      case 421614:
        return {
          name: 'Red Arbitrum',
          color: 'from-purple-500 to-pink-500',
          icon: '🔶'
        }
      case 1:
        return {
          name: 'Ethereum Mainnet',
          color: 'from-blue-600 to-blue-800',
          icon: '🔷'
        }
      case 42161:
        return {
          name: 'Arbitrum One',
          color: 'from-purple-600 to-purple-800',
          icon: '🔶'
        }
      default:
        return {
          name: 'No conectado',
          color: 'from-gray-500 to-gray-600',
          icon: '❌'
        }
    }
  }, [])

  // Función para obtener el precio del gas
  const getGasPrice = useCallback(async () => {
    try {
      if (!publicClient) return '0'
      
      const gasPrice = await publicClient.getGasPrice()
      return formatUnits(gasPrice, 9) // 9 decimals for gwei
    } catch (error) {
      console.error('Error getting gas price:', error)
      return '0'
    }
  }, [publicClient])

  // Función para verificar el estado de la red
  const checkNetworkStatus = useCallback(async () => {
    try {
      const networkInfo = getNetworkInfo(chainId)
      const gasPrice = await getGasPrice()
      
      setNetworkData(prev => ({
        ...prev,
        blockNumber: Number(blockNumber || 0),
        gasPrice: gasPrice,
        isOnline: true,
        networkName: networkInfo.name,
        networkIcon: networkInfo.icon,
        networkColor: networkInfo.color,
        lastUpdate: Date.now()
      }))
    } catch (error) {
      console.error('Error checking network status:', error)
      setNetworkData(prev => ({
        ...prev,
        isOnline: false,
        lastUpdate: Date.now()
      }))
    }
  }, [chainId, blockNumber, getNetworkInfo, getGasPrice])

  // Actualizar datos de red periódicamente
  useEffect(() => {
    if (!isConnected || !publicClient) return

    // Actualización inicial
    checkNetworkStatus()

    // Actualizar cada 5 segundos
    const interval = setInterval(checkNetworkStatus, 5000)

    return () => clearInterval(interval)
  }, [isConnected, publicClient, checkNetworkStatus])

  // Actualizar cuando cambie el block number
  useEffect(() => {
    if (blockNumber && isConnected) {
      setNetworkData(prev => ({
        ...prev,
        blockNumber: Number(blockNumber),
        lastUpdate: Date.now()
      }))
    }
  }, [blockNumber, isConnected])

  // Función para formatear el número de bloque
  const formatBlockNumber = useCallback((blockNum: number) => {
    return blockNum.toLocaleString()
  }, [])

  // Función para formatear el precio del gas
  const formatGasPrice = useCallback((gasPrice: string) => {
    const price = parseFloat(gasPrice)
    return isNaN(price) ? '0' : price.toFixed(2)
  }, [])

  // Función para obtener el estado de conexión
  const getConnectionStatus = useCallback(() => {
    if (!isConnected) {
      return {
        status: 'disconnected',
        message: 'No conectado',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
      }
    }

    if (!networkData.isOnline) {
      return {
        status: 'error',
        message: 'Error de red',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
      }
    }

    return {
      status: 'connected',
      message: 'Conectado',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  }, [isConnected, networkData.isOnline])

  // Función para obtener estadísticas de la red
  const getNetworkStats = useCallback(() => {
    const now = Date.now()
    const timeSinceUpdate = now - networkData.lastUpdate
    
    return {
      blockNumber: formatBlockNumber(networkData.blockNumber),
      gasPrice: `${formatGasPrice(networkData.gasPrice)} gwei`,
      timeSinceUpdate: timeSinceUpdate < 1000 ? 'Ahora' : `${Math.floor(timeSinceUpdate / 1000)}s`,
      isStale: timeSinceUpdate > 10000 // Considerar stale si no se actualiza en 10s
    }
  }, [networkData, formatBlockNumber, formatGasPrice])

  return {
    networkData,
    isConnected,
    connectionStatus: getConnectionStatus(),
    networkStats: getNetworkStats(),
    refreshNetworkData: checkNetworkStatus
  }
}
