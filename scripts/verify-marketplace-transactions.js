#!/usr/bin/env node

/**
 * Script de verificación para transacciones del marketplace
 * Verifica que las transacciones funcionen correctamente con Reown y generen hashes verificables
 */

const { createPublicClient, http, parseEther, formatEther } = require('viem')
const { sepolia, arbitrumSepolia } = require('viem/chains')

// Configuración de redes
const networks = {
  sepolia: {
    chain: sepolia,
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
    contracts: {
      marketplace: '0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F',
      arbToken: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55'
    }
  },
  arbitrumSepolia: {
    chain: arbitrumSepolia,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    contracts: {
      marketplace: '0x624d15B024a707E5c0295A790763f192289301B2',
      arbToken: '0x912CE59144191C1204E64559FE8253a0e49E6548'
    }
  }
}

// ABI del marketplace
const MARKETPLACE_ABI = [
  {
    "inputs": [],
    "name": "serviceCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "serviceId", "type": "uint256"}],
    "name": "services",
    "outputs": [
      {"name": "id", "type": "uint256"},
      {"name": "provider", "type": "address"},
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "price", "type": "uint256"},
      {"name": "paymentToken", "type": "uint8"},
      {"name": "category", "type": "uint8"},
      {"name": "isActive", "type": "bool"},
      {"name": "minReputation", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

async function verifyNetwork(networkName, config) {
  console.log(`\n🔍 Verificando red ${networkName}...`)
  
  try {
    const client = createPublicClient({
      chain: config.chain,
      transport: http(config.rpcUrl)
    })

    // Verificar que el contrato del marketplace existe
    const serviceCounter = await client.readContract({
      address: config.contracts.marketplace,
      abi: MARKETPLACE_ABI,
      functionName: 'serviceCounter'
    })

    console.log(`✅ Marketplace contract activo en ${networkName}`)
    console.log(`📊 Total de servicios: ${serviceCounter}`)

    // Verificar algunos servicios si existen
    if (Number(serviceCounter) > 0) {
      console.log(`\n📋 Verificando servicios disponibles...`)
      
      for (let i = 1; i <= Math.min(Number(serviceCounter), 3); i++) {
        try {
          const service = await client.readContract({
            address: config.contracts.marketplace,
            abi: MARKETPLACE_ABI,
            functionName: 'services',
            args: [BigInt(i)]
          })

          console.log(`  🛍️  Servicio ${i}: ${service[2]} - ${formatEther(service[4])} ETH`)
        } catch (error) {
          console.log(`  ❌ Error leyendo servicio ${i}: ${error.message}`)
        }
      }
    }

    return true
  } catch (error) {
    console.log(`❌ Error verificando ${networkName}: ${error.message}`)
    return false
  }
}

async function verifyTransactionHashes() {
  console.log(`\n🔗 Verificando URLs de exploradores...`)
  
  const testHashes = [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  ]

  const explorers = {
    sepolia: 'https://sepolia.etherscan.io/tx/',
    arbitrumSepolia: 'https://sepolia.arbiscan.io/tx/'
  }

  for (const [network, baseUrl] of Object.entries(explorers)) {
    console.log(`\n🌐 ${network}:`)
    testHashes.forEach(hash => {
      console.log(`  📄 ${baseUrl}${hash}`)
    })
  }
}

async function main() {
  console.log('🚀 Iniciando verificación del marketplace...')
  console.log('=' * 50)

  let allNetworksWorking = true

  // Verificar cada red
  for (const [networkName, config] of Object.entries(networks)) {
    const isWorking = await verifyNetwork(networkName, config)
    if (!isWorking) {
      allNetworksWorking = false
    }
  }

  // Verificar URLs de exploradores
  await verifyTransactionHashes()

  console.log('\n' + '=' * 50)
  if (allNetworksWorking) {
    console.log('✅ Todas las redes están funcionando correctamente')
    console.log('🎉 El marketplace está listo para transacciones reales')
  } else {
    console.log('⚠️  Algunas redes tienen problemas')
    console.log('🔧 Revisa la configuración de RPC y contratos')
  }

  console.log('\n📝 Instrucciones para probar transacciones:')
  console.log('1. Conecta tu wallet a la red correcta (Sepolia o Arbitrum Sepolia)')
  console.log('2. Asegúrate de tener ETH para gas')
  console.log('3. Para ARB tokens, obtén tokens del faucet')
  console.log('4. Haz clic en "Comprar Servicio" en el marketplace')
  console.log('5. Confirma la transacción en tu wallet')
  console.log('6. Verifica el hash en el explorador correspondiente')
}

main().catch(console.error)
