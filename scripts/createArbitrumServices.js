const { ethers } = require('hardhat')

async function main() {
  console.log('🚀 Creando 10 servicios adicionales en Arbitrum Sepolia...\n')

  try {
    // Configuración de red
    const network = await ethers.provider.getNetwork()
    console.log(`📡 Red: ${network.name} (Chain ID: ${network.chainId})`)

    // Verificar que estamos en Arbitrum Sepolia
    if (network.chainId !== 421614n) {
      console.log('❌ Error: Este script debe ejecutarse en Arbitrum Sepolia')
      console.log('💡 Usa: npx hardhat run scripts/createArbitrumServices.js --network arbitrumSepolia')
      return
    }

    // Configurar el signer con la clave privada del deployer
    const privateKey = process.env.PRIVATE_KEY || 'a664aeeb847952b84144df7b9fdecec732e834fc89487b9e0db11deb26fcceba'
    const deployer = new ethers.Wallet(privateKey, ethers.provider)
    
    console.log(`👤 Deployer: ${deployer.address}`)
    
    // Verificar balance
    const balance = await ethers.provider.getBalance(deployer.address)
    console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`)
    
    if (balance < ethers.parseEther("0.01")) {
      console.log('⚠️  Balance bajo, asegúrate de tener suficiente ETH para gas')
    }

    // Direcciones de contratos (Arbitrum Sepolia)
    const MARKETPLACE_ADDRESS = '0x91f2522Fba8AD5520556D94fca100520D7d2e48c'
    const USDC_ADDRESS = '0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086'
    const ARB_ADDRESS = '0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D'

    console.log(`🏪 Marketplace: ${MARKETPLACE_ADDRESS}`)
    console.log(`💰 USDC: ${USDC_ADDRESS}`)
    console.log(`🪙 ARB: ${ARB_ADDRESS}\n`)

    // ABI del marketplace
    const marketplaceABI = [
      "function createService(string title, string description, uint256 price, uint8 tokenType, uint8 category, uint256 minReputation) external",
      "function serviceCounter() view returns (uint256)"
    ]

    const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceABI, deployer)

    // Verificar contador actual
    const currentCounter = await marketplace.serviceCounter()
    console.log(`📊 Servicios actuales: ${currentCounter}`)

    // Servicios a crear (10 servicios adicionales)
    const newServices = [
      {
        title: "Arbitrum DeFi Yield Farming",
        description: "Estrategias avanzadas de yield farming en protocolos DeFi de Arbitrum con optimización de gas",
        price: ethers.parseEther("0.025"), // 0.025 ETH
        tokenType: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 15
      },
      {
        title: "Arbitrum Smart Contract Audit",
        description: "Auditoría completa de seguridad para contratos inteligentes desplegados en Arbitrum",
        price: ethers.parseUnits("75", 6), // 75 USDC
        tokenType: 1, // USDC
        category: 1, // Desarrollo
        minReputation: 20
      },
      {
        title: "Arbitrum ARB Token Staking",
        description: "Configuración y optimización de estrategias de staking para tokens ARB en Arbitrum",
        price: ethers.parseEther("0.5"), // 0.5 ARB
        tokenType: 2, // ARB
        category: 4, // Consultoría
        minReputation: 10
      },
      {
        title: "Arbitrum Layer 2 Analytics",
        description: "Análisis de datos y métricas para aplicaciones desplegadas en la red Arbitrum",
        price: ethers.parseUnits("40", 6), // 40 USDC
        tokenType: 1, // USDC
        category: 3, // Marketing
        minReputation: 5
      },
      {
        title: "Arbitrum Cross-Chain Integration",
        description: "Integración de puentes cross-chain entre Ethereum y Arbitrum para aplicaciones DeFi",
        price: ethers.parseEther("0.03"), // 0.03 ETH
        tokenType: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 25
      },
      {
        title: "Arbitrum NFT Collection Launch",
        description: "Lanzamiento completo de colecciones NFT en Arbitrum con metadata optimizada",
        price: ethers.parseUnits("60", 6), // 60 USDC
        tokenType: 1, // USDC
        category: 2, // Diseño
        minReputation: 8
      },
      {
        title: "Arbitrum Gas Optimization",
        description: "Optimización avanzada de gas para contratos inteligentes en Arbitrum",
        price: ethers.parseEther("0.02"), // 0.02 ETH
        tokenType: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 18
      },
      {
        title: "Arbitrum DAO Governance",
        description: "Implementación de sistemas de gobernanza DAO específicos para Arbitrum",
        price: ethers.parseEther("0.8"), // 0.8 ARB
        tokenType: 2, // ARB
        category: 4, // Consultoría
        minReputation: 12
      },
      {
        title: "Arbitrum DeFi Protocol Design",
        description: "Diseño y arquitectura de protocolos DeFi nativos para Arbitrum",
        price: ethers.parseUnits("100", 6), // 100 USDC
        tokenType: 1, // USDC
        category: 1, // Desarrollo
        minReputation: 30
      },
      {
        title: "Arbitrum Community Management",
        description: "Gestión de comunidades Web3 específicas para proyectos en Arbitrum",
        price: ethers.parseEther("0.015"), // 0.015 ETH
        tokenType: 0, // ETH
        category: 3, // Marketing
        minReputation: 6
      }
    ]

    console.log(`🎯 Creando ${newServices.length} servicios adicionales...\n`)

    // Crear cada servicio
    for (let i = 0; i < newServices.length; i++) {
      const service = newServices[i]
      
      try {
        console.log(`📝 Creando servicio ${i + 1}: ${service.title}`)
        
        const tx = await marketplace.createService(
          service.title,
          service.description,
          service.price,
          service.tokenType,
          service.category,
          service.minReputation
        )
        
        console.log(`   ⏳ Transacción enviada: ${tx.hash}`)
        await tx.wait()
        console.log(`   ✅ Servicio creado exitosamente`)
        
        // Mostrar detalles del servicio
        const tokenNames = { 0: 'ETH', 1: 'USDC', 2: 'ARB' }
        const categoryNames = { 1: 'Desarrollo', 2: 'Diseño', 3: 'Marketing', 4: 'Consultoría' }
        
        let priceFormatted
        if (service.tokenType === 0) {
          priceFormatted = `${ethers.formatEther(service.price)} ETH`
        } else if (service.tokenType === 1) {
          priceFormatted = `$${(Number(service.price) / 1e6).toFixed(0)} USDC`
        } else {
          priceFormatted = `${ethers.formatEther(service.price)} ARB`
        }
        
        console.log(`   💰 Precio: ${priceFormatted}`)
        console.log(`   📂 Categoría: ${categoryNames[service.category]}`)
        console.log(`   ⭐ Reputación mínima: ${service.minReputation}`)
        console.log('')
        
        // Pequeña pausa entre transacciones
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.log(`   ❌ Error creando servicio ${i + 1}:`, error.message)
      }
    }

    // Verificar contador final
    const finalCounter = await marketplace.serviceCounter()
    console.log(`\n🎉 ¡Servicios creados exitosamente!`)
    console.log(`📊 Total de servicios en Arbitrum Sepolia: ${finalCounter}`)
    console.log(`🆕 Servicios nuevos creados: ${Number(finalCounter) - Number(currentCounter)}`)
    
    console.log('\n🌐 Verificar en Arbiscan:')
    console.log(`   https://sepolia.arbiscan.io/address/${MARKETPLACE_ADDRESS}`)
    
    console.log('\n🏆 ¡Arbitrum Sepolia está listo para el Bounty Maldo!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
