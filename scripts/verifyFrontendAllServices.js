const { ethers } = require('ethers')

async function main() {
  console.log('🔍 Verificando todos los servicios que debe mostrar el frontend...\n')

  try {
    // Configurar provider para Sepolia
    const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7')
    
    // Direcciones de contratos
    const MARKETPLACE_ADDRESS = '0xd7458887a104a6F7505b86fAab960eF1834491e4'
    
    console.log(`📡 Red: sepolia (Chain ID: 11155111)`)
    console.log(`🏪 Marketplace: ${MARKETPLACE_ADDRESS}\n`)

    // ABI del marketplace
    const marketplaceABI = [
      "function serviceCounter() view returns (uint256)",
      "function services(uint256) view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
    ]

    const marketplace = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceABI, provider)

    // Obtener contador de servicios
    const serviceCounter = await marketplace.serviceCounter()
    console.log(`📊 Total de servicios: ${serviceCounter}`)

    // Mapeo de tokens
    const TOKEN_TYPES = {
      0: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      1: { name: 'USDC', symbol: 'USDC', decimals: 6 },
      2: { name: 'ARB', symbol: 'ARB', decimals: 18 }
    }

    // Mapeo de categorías
    const CATEGORIES = {
      1: '💻 Desarrollo',
      2: '🎨 Diseño', 
      3: '📈 Marketing',
      4: '💼 Consultoría'
    }

    console.log(`\n🎯 Servicios que debe mostrar el frontend:\n`)

    // Leer todos los servicios disponibles
    const services = []
    for (let i = 1; i <= Number(serviceCounter); i++) {
      try {
        const service = await marketplace.services(i)
        services.push(service)
      } catch (error) {
        console.log(`⚠️  Error leyendo servicio ${i}: ${error.message}`)
      }
    }

    // Mostrar servicios con formato
    services.forEach((service, index) => {
      const tokenType = Number(service[5])
      const category = Number(service[6])
      const token = TOKEN_TYPES[tokenType]
      const categoryName = CATEGORIES[category]
      
      let priceFormatted
      if (tokenType === 0) { // ETH
        priceFormatted = `${(Number(service[4]) / 1e18).toFixed(4)} ETH`
      } else if (tokenType === 1) { // USDC
        priceFormatted = `$${(Number(service[4]) / 1e6).toFixed(0)} USDC`
      } else if (tokenType === 2) { // ARB
        priceFormatted = `${(Number(service[4]) / 1e18).toFixed(4)} ARB`
      } else {
        priceFormatted = `${Number(service[4])} UNKNOWN`
      }

      console.log(`${index + 1}. ${service[2]}`)
      console.log(`   📝 ${service[3]}`)
      console.log(`   💰 Precio: ${priceFormatted}`)
      console.log(`   🪙 Token: ${token ? token.symbol : 'UNKNOWN'}`)
      console.log(`   📂 Categoría: ${categoryName || 'Desconocida'}`)
      console.log(`   ⭐ Reputación mínima: ${service[8]}`)
      console.log(`   ✅ Estado: ${service[7] ? 'Activo' : 'Inactivo'}`)
      console.log(`   👤 Proveedor: ${service[1]}`)
      console.log('')
    })

    // Estadísticas por token
    const tokenStats = {}
    services.forEach(service => {
      const tokenType = Number(service[5])
      const tokenName = TOKEN_TYPES[tokenType]?.symbol || 'UNKNOWN'
      tokenStats[tokenName] = (tokenStats[tokenName] || 0) + 1
    })

    console.log('📈 Distribución por Token:')
    Object.entries(tokenStats).forEach(([token, count]) => {
      const percentage = ((count / services.length) * 100).toFixed(1)
      console.log(`   ${token}: ${count} servicios (${percentage}%)`)
    })

    console.log('\n✅ El frontend debe mostrar estos servicios con precios multi-token')
    console.log('🌐 Verifica en: http://localhost:3006/marketplace')
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
