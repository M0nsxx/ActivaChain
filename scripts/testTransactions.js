const { ethers } = require('hardhat')

async function main() {
  console.log('🧪 Probando transacciones en ambas redes...\n')

  try {
    // Configurar provider para Sepolia
    const sepoliaProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7')
    
    // Configurar provider para Arbitrum Sepolia
    const arbitrumProvider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc')
    
    // Direcciones de contratos
    const SEPOLIA_MARKETPLACE = '0xd7458887a104a6F7505b86fAab960eF1834491e4'
    const ARBITRUM_MARKETPLACE = '0x91f2522Fba8AD5520556D94fca100520D7d2e48c'
    
    console.log('📡 Probando conectividad a las redes...')
    
    // Verificar Sepolia
    const sepoliaNetwork = await sepoliaProvider.getNetwork()
    console.log(`✅ Ethereum Sepolia: ${sepoliaNetwork.name} (Chain ID: ${sepoliaNetwork.chainId})`)
    
    // Verificar Arbitrum Sepolia
    const arbitrumNetwork = await arbitrumProvider.getNetwork()
    console.log(`✅ Arbitrum Sepolia: ${arbitrumNetwork.name} (Chain ID: ${arbitrumNetwork.chainId})`)
    
    console.log('\n🔍 Verificando contratos...')
    
    // ABI básico para verificar contratos
    const basicABI = [
      "function serviceCounter() view returns (uint256)",
      "function services(uint256) view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
    ]
    
    // Verificar contrato en Sepolia
    try {
      const sepoliaContract = new ethers.Contract(SEPOLIA_MARKETPLACE, basicABI, sepoliaProvider)
      const sepoliaCounter = await sepoliaContract.serviceCounter()
      console.log(`✅ Sepolia Marketplace: ${sepoliaCounter} servicios`)
    } catch (error) {
      console.log(`❌ Error en Sepolia: ${error.message}`)
    }
    
    // Verificar contrato en Arbitrum
    try {
      const arbitrumContract = new ethers.Contract(ARBITRUM_MARKETPLACE, basicABI, arbitrumProvider)
      const arbitrumCounter = await arbitrumContract.serviceCounter()
      console.log(`✅ Arbitrum Marketplace: ${arbitrumCounter} servicios`)
    } catch (error) {
      console.log(`❌ Error en Arbitrum: ${error.message}`)
    }
    
    console.log('\n💰 Verificando tarifas de gas...')
    
    // Verificar tarifas de gas en Sepolia
    try {
      const sepoliaFeeData = await sepoliaProvider.getFeeData()
      console.log(`✅ Sepolia Gas Price: ${ethers.formatUnits(sepoliaFeeData.gasPrice, 'gwei')} Gwei`)
      console.log(`   Max Fee: ${sepoliaFeeData.maxFeePerGas ? ethers.formatUnits(sepoliaFeeData.maxFeePerGas, 'gwei') : 'N/A'} Gwei`)
    } catch (error) {
      console.log(`❌ Error obteniendo tarifas Sepolia: ${error.message}`)
    }
    
    // Verificar tarifas de gas en Arbitrum
    try {
      const arbitrumFeeData = await arbitrumProvider.getFeeData()
      console.log(`✅ Arbitrum Gas Price: ${ethers.formatUnits(arbitrumFeeData.gasPrice, 'gwei')} Gwei`)
      console.log(`   Max Fee: ${arbitrumFeeData.maxFeePerGas ? ethers.formatUnits(arbitrumFeeData.maxFeePerGas, 'gwei') : 'N/A'} Gwei`)
    } catch (error) {
      console.log(`❌ Error obteniendo tarifas Arbitrum: ${error.message}`)
    }
    
    console.log('\n🎯 Configuración recomendada para transacciones:')
    console.log('   Gas Limit: 500,000')
    console.log('   Max Fee Per Gas: 1 Gwei (1,000,000,000 wei)')
    console.log('   Max Priority Fee: 1 Gwei (1,000,000,000 wei)')
    
    console.log('\n✅ Verificación completada')
    console.log('🌐 Frontend: http://localhost:3004/marketplace')
    console.log('📱 Asegúrate de estar conectado a la red correcta')
    
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
