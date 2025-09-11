'use client'

import GlassCard from './GlassCard'
import { useNetworkStatus } from '../lib/useNetworkStatus'

export function NetworkStatus() {
  const { 
    networkData, 
    isConnected, 
    connectionStatus, 
    networkStats, 
    refreshNetworkData 
  } = useNetworkStatus()

  return (
    <GlassCard className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Estado de la Red</h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${connectionStatus.bgColor} ${connectionStatus.color}`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus.status === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`}></div>
            {connectionStatus.message.toUpperCase()}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${networkData.networkColor} text-white`}>
              {networkData.networkIcon}
            </div>
            <div>
              <p className="text-white font-semibold">{networkData.networkName}</p>
              <p className="text-white/60 text-sm">
                {isConnected ? 'Red activa' : 'No conectado'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
            <div>
              <p className="text-white/60 text-sm">Block actual</p>
              <p className="text-white font-bold text-lg">
                {networkStats.blockNumber}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Gas Price</p>
              <p className="text-white font-bold text-lg">
                {networkStats.gasPrice}
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Última actualización</span>
                <span className={`text-white/80 ${networkStats.isStale ? 'text-yellow-400' : ''}`}>
                  {networkStats.timeSinceUpdate}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
