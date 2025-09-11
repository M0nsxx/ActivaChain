'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { sepolia, arbitrumSepolia } from '@reown/appkit/networks'

export function WalletButton() {
  // Verificar si AppKit está disponible antes de usar el hook
  let open: (() => void) | undefined
  try {
    const appKit = useAppKit()
    open = appKit?.open
  } catch (error) {
    console.warn('AppKit not ready yet:', error)
  }
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleDisconnect = () => {
    disconnect()
    setIsDropdownOpen(false)
  }

  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChain({ chainId })
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Error switching chain:', error)
    }
  }

  const getNetworkName = (chainId?: number) => {
    switch (chainId) {
      case 11155111:
        return 'Ethereum Sepolia'
      case 421614:
        return 'Arbitrum Sepolia'
      default:
        return 'Red Desconocida'
    }
  }

  const getNetworkColor = (chainId?: number) => {
    switch (chainId) {
      case 11155111:
        return 'text-blue-400'
      case 421614:
        return 'text-cyan-400'
      default:
        return 'text-gray-400'
    }
  }

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
            Conectado
          </div>
          <div className="text-white/70 text-xs font-mono hidden sm:block">
            {address.slice(0, 4)}...{address.slice(-4)}
          </div>
          <div className={`text-xs ${getNetworkColor(chain?.id)} hidden lg:block`}>
            {getNetworkName(chain?.id)}
          </div>
          <svg 
            className={`w-3 h-3 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50">
            <div className="p-3 sm:p-4">
              <div className="mb-3 sm:mb-4">
                <div className="text-white/70 text-xs mb-1">Dirección</div>
                <div className="text-white font-mono text-xs sm:text-sm break-all">
                  {address}
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <div className="text-white/70 text-xs mb-2">Red Actual</div>
                <div className={`text-xs sm:text-sm font-medium ${getNetworkColor(chain?.id)}`}>
                  {getNetworkName(chain?.id)}
                </div>
              </div>

              <div className="mb-3 sm:mb-4">
                <div className="text-white/70 text-xs mb-2">Cambiar Red</div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSwitchChain(11155111)}
                    className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors ${
                      chain?.id === 11155111 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs sm:text-sm">Ethereum Sepolia</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleSwitchChain(421614)}
                    className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors ${
                      chain?.id === 421614 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-xs sm:text-sm">Arbitrum Sepolia</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm font-medium"
                >
                  Desconectar Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => open?.()}
      className="neural-button text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
    >
      <span className="hidden sm:inline">Conectar Wallet</span>
      <span className="sm:hidden">Conectar</span>
    </button>
  )
}
