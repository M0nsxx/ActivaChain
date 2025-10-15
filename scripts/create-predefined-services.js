#!/usr/bin/env node

/**
 * Script para crear los servicios predefinidos en el contrato del marketplace
 * Esto permite que los servicios funcionen con transacciones reales on-chain
 */

const { createWalletClient, createPublicClient, http, parseEther } = require('viem')
const { sepolia, arbitrumSepolia } = require('viem/chains')
const { privateKeyToAccount } = require('viem/accounts')

// Configuración de redes
const networks = {
  sepolia: {
    chain: sepolia,
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id',
    contracts: {
      marketplace: '0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F'
    }
  },
  arbitrumSepolia: {
    chain: arbitrumSepolia,
    rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
    contracts: {
      marketplace: '0x624d15B024a707E5c0295A790763f192289301B2'
    }
  }
}

// ABI del marketplace
const MARKETPLACE_ABI = [
  {
    "inputs": [
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "price", "type": "uint256"},
      {"name": "paymentToken", "type": "uint8"},
      {"name": "category", "type": "uint8"},
      {"name": "minReputation", "type": "uint256"}
    ],
    "name": "createService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "serviceCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// Servicios predefinidos a crear
const predefinedServices = [
  {
    title: "Desarrollo de Smart Contract Básico",
    description: "Creación de un smart contract personalizado con funcionalidades básicas, testing y deployment en la red correspondiente.",
    price: parseEther("0.00001"), // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 0, // Desarrollo
    minReputation: 0
  },
  {
    title: "Auditoría de Código Web3",
    description: "Revisión completa de código de smart contracts, identificación de vulnerabilidades y recomendaciones de seguridad.",
    price: parseEther("0.00001"), // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 0, // Desarrollo
    minReputation: 0
  },
  {
    title: "Consultoría Blockchain",
    description: "Asesoramiento técnico sobre implementación de soluciones blockchain, arquitectura de sistemas descentralizados y mejores prácticas.",
    price: parseEther("0.00001"), // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 3, // Consultoría
    minReputation: 0
  }
]

async function createServicesOnNetwork(networkName, config) {
  console.log(`\n🔧 Creando servicios en ${networkName}...`)
  
  try {
    // Verificar que tenemos la clave privada
    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey) {
      console.log(`❌ PRIVATE_KEY no encontrada para ${networkName}`)
      console.log(`💡 Configura tu clave privada: export PRIVATE_KEY=0x...`)
      return false
    }

    const account = privateKeyToAccount(privateKey)
    
    const publicClient = createPublicClient({
      chain: config.chain,
      transport: http(config.rpcUrl)
    })

    const walletClient = createWalletClient({
      account,
      chain: config.chain,
      transport: http(config.rpcUrl)
    })

    // Verificar balance de ETH
    const balance = await publicClient.getBalance({ address: account.address })
    console.log(`💰 Balance: ${balance / BigInt(10**18)} ETH`)

    if (balance < parseEther("0.001")) {
      console.log(`⚠️  Balance bajo. Necesitas ETH para gas.`)
      console.log(`💡 Obtén ETH del faucet: https://sepoliafaucet.com/`)
      return false
    }

    // Verificar contador de servicios actual
    const serviceCounter = await publicClient.readContract({
      address: config.contracts.marketplace,
      abi: MARKETPLACE_ABI,
      functionName: 'serviceCounter'
    })
    console.log(`📊 Servicios actuales: ${serviceCounter}`)

    // Crear cada servicio
    for (let i = 0; i < predefinedServices.length; i++) {
      const service = predefinedServices[i]
      console.log(`\n🛍️  Creando servicio ${i + 1}: ${service.title}`)
      
      try {
        const hash = await walletClient.writeContract({
          address: config.contracts.marketplace,
          abi: MARKETPLACE_ABI,
          functionName: 'createService',
          args: [
            service.title,
            service.description,
            service.price,
            service.paymentToken,
            service.category,
            BigInt(service.minReputation)
          ]
        })

        console.log(`✅ Transacción enviada: ${hash}`)
        
        // Esperar confirmación
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log(`✅ Servicio creado en bloque: ${receipt.blockNumber}`)
        
        // Pequeña pausa entre transacciones
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.log(`❌ Error creando servicio ${i + 1}: ${error.message}`)
      }
    }

    // Verificar contador final
    const finalCounter = await publicClient.readContract({
      address: config.contracts.marketplace,
      abi: MARKETPLACE_ABI,
      functionName: 'serviceCounter'
    })
    console.log(`📊 Servicios finales: ${finalCounter}`)

    return true
  } catch (error) {
    console.log(`❌ Error en ${networkName}: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Creando servicios predefinidos en el marketplace...')
  console.log('=' * 60)

  console.log('\n📋 Servicios a crear:')
  predefinedServices.forEach((service, index) => {
    console.log(`${index + 1}. ${service.title} - ${service.price / BigInt(10**18)} ETH`)
  })

  console.log('\n⚠️  IMPORTANTE:')
  console.log('1. Asegúrate de tener ETH para gas')
  console.log('2. Configura tu PRIVATE_KEY: export PRIVATE_KEY=0x...')
  console.log('3. Los servicios se crearán en ambas redes')

  let allNetworksSuccess = true

  // Crear servicios en cada red
  for (const [networkName, config] of Object.entries(networks)) {
    const success = await createServicesOnNetwork(networkName, config)
    if (!success) {
      allNetworksSuccess = false
    }
  }

  console.log('\n' + '=' * 60)
  if (allNetworksSuccess) {
    console.log('✅ Servicios predefinidos creados exitosamente')
    console.log('🎉 Ahora los servicios funcionarán con transacciones reales')
  } else {
    console.log('⚠️  Algunos servicios no se pudieron crear')
    console.log('🔧 Revisa la configuración y balance de ETH')
  }

  console.log('\n📝 Próximos pasos:')
  console.log('1. Los servicios ahora existen en el contrato')
  console.log('2. Las compras generarán transacciones reales')
  console.log('3. Los hashes serán verificables en el scanner')
  console.log('4. Reown funcionará correctamente')
}

main().catch(console.error)
