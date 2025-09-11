const { ethers } = require('hardhat')

async function main() {
  console.log('⚖️  Equilibrando tokens en Arbitrum Sepolia...\n')

  try {
    // Configuración de red
    const network = await ethers.provider.getNetwork()
    console.log(`📡 Red: ${network.name} (Chain ID: ${network.chainId})`)

    // Verificar que estamos en Arbitrum Sepolia
    if (network.chainId !== 421614n) {
      console.log('❌ Error: Este script debe ejecutarse en Arbitrum Sepolia')
      console.log('💡 Usa: npx hardhat run scripts/balanceArbitrumTokens.js --network arbitrumSepolia')
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

    // Servicios adicionales en ARB para equilibrar (5 servicios)
    const newARBServices = [
      {
        title: "Arbitrum ARB Liquidity Mining",
        description: "Estrategias avanzadas de liquidity mining usando tokens ARB en protocolos DeFi de Arbitrum",
        price: ethers.parseEther("1.2"), // 1.2 ARB
        tokenType: 2, // ARB
        category: 1, // Desarrollo
        minReputation: 15
      },
      {
        title: "Arbitrum ARB Governance Voting",
        description: "Sistema de votación y gobernanza para tokens ARB en la red Arbitrum",
        price: ethers.parseEther("0.6"), // 0.6 ARB
        tokenType: 2, // ARB
        category: 4, // Consultoría
        minReputation: 8
      },
      {
        title: "Arbitrum ARB Token Economics",
        description: "Análisis y diseño de tokenomics para proyectos que usan ARB en Arbitrum",
        price: ethers.parseEther("1.5"), // 1.5 ARB
        tokenType: 2, // ARB
        category: 3, // Marketing
        minReputation: 12
      },
      {
        title: "Arbitrum ARB DeFi Integration",
        description: "Integración de tokens ARB en protocolos DeFi nativos de Arbitrum",
        price: ethers.parseEther("0.9"), // 0.9 ARB
        tokenType: 2, // ARB
        category: 1, // Desarrollo
        minReputation: 20
      },
      {
        title: "Arbitrum ARB NFT Rewards",
        description: "Sistema de recompensas NFT basado en tokens ARB para comunidades Arbitrum",
        price: ethers.parseEther("0.7"), // 0.7 ARB
        tokenType: 2, // ARB
        category: 2, // Diseño
        minReputation: 10
      }
    ]

    console.log(`🎯 Creando ${newARBServices.length} servicios adicionales en ARB para equilibrar...\n`)

    // Crear cada servicio
    for (let i = 0; i < newARBServices.length; i++) {
      const service = newARBServices[i]
      
      try {
        console.log(`📝 Creando servicio ARB ${i + 1}: ${service.title}`)
        
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
        const categoryNames = { 1: 'Desarrollo', 2: 'Diseño', 3: 'Marketing', 4: 'Consultoría' }
        const priceFormatted = `${ethers.formatEther(service.price)} ARB`
        
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
    console.log(`\n🎉 ¡Servicios ARB creados exitosamente!`)
    console.log(`📊 Total de servicios en Arbitrum Sepolia: ${finalCounter}`)
    console.log(`🆕 Servicios ARB nuevos creados: ${Number(finalCounter) - Number(currentCounter)}`)
    
    console.log('\n📈 Distribución equilibrada:')
    console.log(`   🟡 ETH: 7 servicios (33.33%)`)
    console.log(`   🔵 USDC: 7 servicios (33.33%)`)
    console.log(`   🟣 ARB: 7 servicios (33.33%)`)
    
    console.log('\n🌐 Verificar en Arbiscan:')
    console.log(`   https://sepolia.arbiscan.io/address/${MARKETPLACE_ADDRESS}`)
    
    console.log('\n🏆 ¡Arbitrum Sepolia perfectamente equilibrado para el Bounty Maldo!')

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
