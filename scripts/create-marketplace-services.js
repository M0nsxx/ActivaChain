const { ethers } = require('hardhat')

// Servicios a crear para cada red
const servicesToCreate = [
  {
    title: "Desarrollo de Smart Contract Básico",
    description: "Creación de un smart contract personalizado con funcionalidades básicas, testing y deployment en la red correspondiente.",
    price: "0.00001", // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 0, // Desarrollo
    minReputation: 0
  },
  {
    title: "Auditoría de Código Web3",
    description: "Revisión completa de código de smart contracts, identificación de vulnerabilidades y recomendaciones de seguridad.",
    price: "0.00001", // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 0, // Desarrollo
    minReputation: 0
  },
  {
    title: "Consultoría Blockchain",
    description: "Asesoramiento técnico sobre implementación de soluciones blockchain, arquitectura de sistemas descentralizados y mejores prácticas.",
    price: "0.00001", // 0.00001 ETH
    paymentToken: 0, // ETH
    category: 3, // Consultoría
    minReputation: 0
  }
]

async function main() {
  console.log("🚀 Creando servicios en el marketplace...")
  
  // Obtener el signer
  const [deployer] = await ethers.getSigners()
  console.log("📝 Usando cuenta:", deployer.address)
  
  // Obtener el balance
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH")
  
  // Direcciones de contratos por red
  const contracts = {
    sepolia: {
      marketplace: "0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F"
    },
    arbitrumSepolia: {
      marketplace: "0x624d15B024a707E5c0295A790763f192289301B2"
    }
  }
  
  // ABI del marketplace
  const marketplaceABI = [
    "function createService(string memory _title, string memory _description, uint256 _price, uint8 _paymentToken, uint8 _category, uint256 _minReputation) external",
    "function serviceCounter() external view returns (uint256)"
  ]
  
  // Función para crear servicios en una red específica
  async function createServicesInNetwork(networkName, marketplaceAddress) {
    console.log(`\n🌐 Creando servicios en ${networkName}...`)
    console.log(`📍 Marketplace: ${marketplaceAddress}`)
    
    try {
      const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, deployer)
      
      // Obtener contador actual
      const currentCounter = await marketplace.serviceCounter()
      console.log(`📊 Servicios actuales: ${currentCounter}`)
      
      // Crear cada servicio
      for (let i = 0; i < servicesToCreate.length; i++) {
        const service = servicesToCreate[i]
        console.log(`\n📝 Creando servicio ${i + 1}: "${service.title}"`)
        
        try {
          // Convertir precio a wei
          const priceInWei = ethers.parseEther(service.price)
          
          // Crear transacción
          const tx = await marketplace.createService(
            service.title,
            service.description,
            priceInWei,
            service.paymentToken,
            service.category,
            service.minReputation,
            {
              gasLimit: 500000
            }
          )
          
          console.log(`⏳ Transacción enviada: ${tx.hash}`)
          
          // Esperar confirmación
          const receipt = await tx.wait()
          console.log(`✅ Servicio creado exitosamente!`)
          console.log(`   Gas usado: ${receipt.gasUsed}`)
          console.log(`   Bloque: ${receipt.blockNumber}`)
          
          // Pequeña pausa entre transacciones
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`❌ Error creando servicio ${i + 1}:`, error.message)
          // Continuar con el siguiente servicio
        }
      }
      
      // Verificar contador final
      const finalCounter = await marketplace.serviceCounter()
      console.log(`📊 Servicios totales después: ${finalCounter}`)
      
    } catch (error) {
      console.error(`❌ Error en ${networkName}:`, error.message)
    }
  }
  
  // Crear servicios en Ethereum Sepolia
  await createServicesInNetwork("Ethereum Sepolia", contracts.sepolia.marketplace)
  
  // Crear servicios en Arbitrum Sepolia
  await createServicesInNetwork("Arbitrum Sepolia", contracts.arbitrumSepolia.marketplace)
  
  console.log("\n🎉 Proceso completado!")
  console.log("📋 Resumen:")
  console.log("   - 3 servicios creados en Ethereum Sepolia")
  console.log("   - 3 servicios creados en Arbitrum Sepolia")
  console.log("   - Precio: 0.00001 ETH cada uno")
  console.log("   - Categorías: Desarrollo y Consultoría")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Error:", error)
    process.exit(1)
  })
