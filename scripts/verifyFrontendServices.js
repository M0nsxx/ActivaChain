const { ethers } = require('hardhat')

async function main() {
  console.log('🔍 Verificando servicios que debe mostrar el frontend...\n')

  try {
    // Usar Sepolia network
    const sepoliaProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7')
    
    // Configuración de red
    const network = await sepoliaProvider.getNetwork()
    console.log(`📡 Red: ${network.name} (Chain ID: ${network.chainId})`)

    // Direcciones de contratos (Ethereum Sepolia)
    const MARKETPLACE_ADDRESS = '0xd7458887a104a6F7505b86fAab960eF1834491e4'

    console.log(`🏪 Marketplace: ${MARKETPLACE_ADDRESS}\n`)

    // ABI simplificado para testing
    const marketplaceABI = [
      "function serviceCounter() view returns (uint256)",
      "function services(uint256) view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
    ]

    const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceABI, sepoliaProvider)

    // Verificar contador de servicios
    const serviceCounter = await marketplace.serviceCounter()
    console.log(`📊 Total de servicios: ${serviceCounter}`)

    if (Number(serviceCounter) === 0) {
      console.log('❌ No hay servicios en el marketplace')
      return
    }

    console.log('\n🎯 Servicios que debe mostrar el frontend:\n')

    // Leer todos los servicios
    for (let i = 1; i <= Number(serviceCounter); i++) {
      try {
        const service = await marketplace.services(i)
        
        const tokenTypes = {
          0: { name: 'ETH', symbol: 'ETH', decimals: 18, color: '🟡' },
          1: { name: 'USDC', symbol: 'USDC', decimals: 6, color: '🔵' }, 
          2: { name: 'ARB', symbol: 'ARB', decimals: 18, color: '🟣' }
        }

        const categories = {
          1: '💻 Desarrollo',
          2: '🎨 Diseño',
          3: '📈 Marketing',
          4: '💼 Consultoría'
        }

        const token = tokenTypes[service.tokenType] || { name: 'UNKNOWN', symbol: 'UNKNOWN', decimals: 18, color: '❓' }
        const category = categories[service.category] || '❓ Desconocida'
        
        // Formatear precio según el tipo de token
        let priceFormatted
        if (service.tokenType === 0) { // ETH
          priceFormatted = `${ethers.formatEther(service.price)} ETH`
        } else if (service.tokenType === 1) { // USDC
          priceFormatted = `$${(Number(service.price) / 1e6).toFixed(0)} USDC`
        } else if (service.tokenType === 2) { // ARB
          priceFormatted = `${ethers.formatEther(service.price)} ARB`
        } else {
          priceFormatted = `${service.price} UNKNOWN`
        }

        console.log(`${i}. ${service.title}`)
        console.log(`   📝 ${service.description}`)
        console.log(`   💰 Precio: ${priceFormatted}`)
        console.log(`   🪙 Token: ${token.color} ${token.symbol}`)
        console.log(`   📂 Categoría: ${category}`)
        console.log(`   ⭐ Reputación mínima: ${service.minReputation}`)
        console.log(`   ✅ Estado: ${service.isActive ? 'Activo' : 'Inactivo'}`)
        console.log(`   👤 Proveedor: ${service.provider}`)
        console.log('')

      } catch (error) {
        console.log(`❌ Error leyendo servicio ${i}:`, error.message)
      }
    }

    console.log('✅ El frontend debe mostrar estos servicios con precios multi-token')
    console.log('\n🌐 Verifica en: http://localhost:3005/marketplace')
    console.log('📱 Asegúrate de estar conectado a Sepolia (Chain ID: 11155111)')

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
