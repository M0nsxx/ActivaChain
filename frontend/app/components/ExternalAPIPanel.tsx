'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useContracts } from '../lib/useContracts'
import GlassCard from './GlassCard'
import { NotificationSystem, useNotifications } from './NotificationSystem'

// ABI para ExternalAPIIntegration
const EXTERNAL_API_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "apiName", "type": "string"},
      {"internalType": "string", "name": "endpoint", "type": "string"},
      {"internalType": "string", "name": "method", "type": "string"},
      {"internalType": "string", "name": "requestData", "type": "string"}
    ],
    "name": "makeAPICall",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transferUSDCViaCircle",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "cohortId", "type": "uint256"},
      {"internalType": "string", "name": "applicationData", "type": "string"}
    ],
    "name": "enrollInShefiCohort",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "profileData", "type": "string"}],
    "name": "createTalentProfile",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAPICalls",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "callId", "type": "uint256"}],
    "name": "getAPICall",
    "outputs": [
      {"internalType": "string", "name": "endpoint", "type": "string"},
      {"internalType": "string", "name": "method", "type": "string"},
      {"internalType": "string", "name": "requestData", "type": "string"},
      {"internalType": "string", "name": "responseData", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bool", "name": "success", "type": "bool"},
      {"internalType": "address", "name": "caller", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface APICall {
  id: number
  endpoint: string
  method: string
  requestData: string
  responseData: string
  timestamp: number
  success: boolean
  caller: string
}

interface APIService {
  name: string
  description: string
  icon: string
  color: string
  endpoint: string
  method: string
  fee: string
}

export default function ExternalAPIPanel() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  const { addNotification } = useNotifications()
  
  const contracts = useContracts()
  const [apiCalls, setApiCalls] = useState<APICall[]>([])
  const [selectedService, setSelectedService] = useState<APIService | null>(null)
  const [requestData, setRequestData] = useState('')
  const [loading, setLoading] = useState(false)

  const apiServices: APIService[] = [
    {
      name: 'Circle USDC',
      description: 'Transferir USDC usando Circle API',
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      endpoint: '/v1/transfers',
      method: 'POST',
      fee: '0.0001 ETH'
    },
    {
      name: 'Shefi Cohort',
      description: 'Inscribirse en cohorte de Shefi',
      icon: '👩‍💻',
      color: 'from-purple-500 to-pink-600',
      endpoint: '/v1/cohorts/enroll',
      method: 'POST',
      fee: '0.0001 ETH'
    },
    {
      name: 'Talent Protocol',
      description: 'Crear perfil en Talent Protocol',
      icon: '🎯',
      color: 'from-blue-500 to-cyan-600',
      endpoint: '/v1/profiles',
      method: 'POST',
      fee: '0.0001 ETH'
    }
  ]

  // Cargar llamadas API del usuario
  useEffect(() => {
    if (address && contracts.externalAPIIntegration) {
      loadAPICalls()
    }
  }, [address, contracts.externalAPIIntegration])

  const loadAPICalls = async () => {
    // Simular carga de llamadas API
    const mockCalls: APICall[] = [
      {
        id: 1,
        endpoint: '/v1/transfers',
        method: 'POST',
        requestData: '{"to":"0x123...","amount":1000}',
        responseData: '{"status":"success","transactionId":"0xabc123..."}',
        timestamp: Date.now() - 3600000,
        success: true,
        caller: address || ''
      },
      {
        id: 2,
        endpoint: '/v1/cohorts/enroll',
        method: 'POST',
        requestData: '{"cohortId":123,"data":"application"}',
        responseData: '{"status":"success","enrollmentId":"789"}',
        timestamp: Date.now() - 7200000,
        success: true,
        caller: address || ''
      }
    ]
    
    setApiCalls(mockCalls)
  }

  const makeAPICall = async (service: APIService) => {
    if (!isConnected || !contracts.externalAPIIntegration) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Conecta tu wallet primero'
      })
      return
    }

    setLoading(true)

    try {
      await writeContract({
        address: contracts.externalAPIIntegration,
        abi: EXTERNAL_API_ABI,
        functionName: 'makeAPICall',
        args: [
          service.name.toLowerCase().replace(' ', ''),
          service.endpoint,
          service.method,
          requestData || '{}'
        ],
        value: BigInt('100000000000000') // 0.0001 ETH fee
      })

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: `Llamada a ${service.name} iniciada`
      })
      setRequestData('')
    } catch (err) {
      console.error('Error making API call:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al realizar llamada API'
      })
    } finally {
      setLoading(false)
    }
  }

  const transferUSDC = async (to: string, amount: string) => {
    if (!isConnected || !contracts.externalAPIIntegration) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Conecta tu wallet primero'
      })
      return
    }

    setLoading(true)

    try {
      await writeContract({
        address: contracts.externalAPIIntegration,
        abi: EXTERNAL_API_ABI,
        functionName: 'transferUSDCViaCircle',
        args: [to as `0x${string}`, BigInt(amount)],
        value: BigInt('100000000000000') // 0.0001 ETH fee
      })

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: 'Transferencia USDC iniciada'
      })
    } catch (err) {
      console.error('Error transferring USDC:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al transferir USDC'
      })
    } finally {
      setLoading(false)
    }
  }

  const enrollInShefi = async (cohortId: string, applicationData: string) => {
    if (!isConnected || !contracts.externalAPIIntegration) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Conecta tu wallet primero'
      })
      return
    }

    setLoading(true)

    try {
      await writeContract({
        address: contracts.externalAPIIntegration,
        abi: EXTERNAL_API_ABI,
        functionName: 'enrollInShefiCohort',
        args: [BigInt(cohortId), applicationData],
        value: BigInt('100000000000000') // 0.0001 ETH fee
      })

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: 'Inscripción en Shefi iniciada'
      })
    } catch (err) {
      console.error('Error enrolling in Shefi:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al inscribirse en Shefi'
      })
    } finally {
      setLoading(false)
    }
  }

  const createTalentProfile = async (profileData: string) => {
    if (!isConnected || !contracts.externalAPIIntegration) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Conecta tu wallet primero'
      })
      return
    }

    setLoading(true)

    try {
      await writeContract({
        address: contracts.externalAPIIntegration,
        abi: EXTERNAL_API_ABI,
        functionName: 'createTalentProfile',
        args: [profileData],
        value: BigInt('100000000000000') // 0.0001 ETH fee
      })

      addNotification({
        type: 'success',
        title: 'Éxito',
        message: 'Perfil de Talent creado'
      })
    } catch (err) {
      console.error('Error creating talent profile:', err)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear perfil de Talent'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    return 'Ahora'
  }

  return (
    <div className="space-y-8">
      <NotificationSystem notifications={[]} onRemove={() => {}} />
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🔗 Integraciones Externas
        </h1>
        <p className="text-white/70 text-lg">
          Conecta con servicios externos a través de APIs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">🔗</div>
          <div className="text-2xl font-bold text-white">{apiCalls.length}</div>
          <div className="text-white/60">Llamadas API</div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-white">
            {apiCalls.filter(call => call.success).length}
          </div>
          <div className="text-white/60">Exitosas</div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-white/60">Servicios</div>
        </GlassCard>
        
        <GlassCard className="text-center p-6">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-white">Real-time</div>
          <div className="text-white/60">Integración</div>
        </GlassCard>
      </div>

      {/* API Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apiServices.map((service, index) => (
          <GlassCard
            key={index}
            gradient
            className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setSelectedService(service)}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {service.name}
              </h3>
              <p className="text-white/70 text-sm mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Fee: {service.fee}</span>
                <span className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${service.color} text-white`}>
                  {service.method}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Service Details */}
      {selectedService && (
        <GlassCard gradient className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {selectedService.icon} {selectedService.name}
            </h2>
            <button
              onClick={() => setSelectedService(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Endpoint
                </label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3 font-mono text-sm text-white/80">
                  {selectedService.endpoint}
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Método
                </label>
                <div className="bg-white/5 border border-white/20 rounded-lg p-3 font-mono text-sm text-white/80">
                  {selectedService.method}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Datos de la Solicitud (JSON)
              </label>
              <textarea
                value={requestData}
                onChange={(e) => setRequestData(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 font-mono text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                rows={4}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => makeAPICall(selectedService)}
                disabled={loading || isPending}
                className={`flex-1 bg-gradient-to-r ${selectedService.color} hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed`}
              >
                {loading ? 'Procesando...' : isPending ? 'Confirmando...' : 'Realizar Llamada API'}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Quick Actions */}
      <GlassCard gradient className="p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          ⚡ Acciones Rápidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circle USDC Transfer */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">💰 Transferir USDC</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Dirección destino"
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Cantidad (en wei)"
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              />
              <button
                onClick={() => transferUSDC('0x123...', '1000000')}
                disabled={loading || isPending}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Transferir USDC
              </button>
            </div>
          </div>

          {/* Shefi Enrollment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">👩‍💻 Inscribirse en Shefi</h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="ID del Cohort"
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
              />
              <textarea
                placeholder="Datos de aplicación"
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                rows={2}
              />
              <button
                onClick={() => enrollInShefi('123', 'application data')}
                disabled={loading || isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Inscribirse
              </button>
            </div>
          </div>

          {/* Talent Protocol */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">🎯 Crear Perfil Talent</h3>
            <div className="space-y-3">
              <textarea
                placeholder='{"name": "Tu Nombre", "skills": ["blockchain", "solidity"]}'
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:border-white/40 focus:outline-none"
                rows={3}
              />
              <button
                onClick={() => createTalentProfile('{"name": "Test", "skills": ["blockchain"]}')}
                disabled={loading || isPending}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Crear Perfil
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* API Calls History */}
      {apiCalls.length > 0 && (
        <GlassCard gradient className="p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            📊 Historial de Llamadas API
          </h2>
          
          <div className="space-y-4">
            {apiCalls.map((call) => (
              <div
                key={call.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      call.success ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-white font-medium">
                      {call.endpoint}
                    </span>
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                      {call.method}
                    </span>
                  </div>
                  <span className="text-white/50 text-sm">
                    {formatTime(call.timestamp)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Request:</span>
                    <div className="bg-white/5 rounded p-2 mt-1 font-mono text-xs text-white/80">
                      {call.requestData}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Response:</span>
                    <div className="bg-white/5 rounded p-2 mt-1 font-mono text-xs text-white/80">
                      {call.responseData}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
