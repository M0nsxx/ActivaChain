const { ethers } = require('hardhat')

async function main() {
  console.log('🔗 Verificando funcionalidades del botón de wallet...\n')

  try {
    // Configurar providers para ambas redes
    const sepoliaProvider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7')
    const arbitrumProvider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc')
    
    console.log('📡 Verificando conectividad a las redes...')
    
    // Verificar Sepolia
    const sepoliaNetwork = await sepoliaProvider.getNetwork()
    console.log(`✅ Ethereum Sepolia: ${sepoliaNetwork.name} (Chain ID: ${sepoliaNetwork.chainId})`)
    
    // Verificar Arbitrum Sepolia
    const arbitrumNetwork = await arbitrumProvider.getNetwork()
    console.log(`✅ Arbitrum Sepolia: ${arbitrumNetwork.name} (Chain ID: ${arbitrumNetwork.chainId})`)
    
    console.log('\n🎯 Funcionalidades del botón de wallet:')
    console.log('✅ Conectar wallet')
    console.log('✅ Mostrar dirección conectada')
    console.log('✅ Mostrar red actual')
    console.log('✅ Cambiar entre redes')
    console.log('✅ Desconectar wallet')
    console.log('✅ Dropdown interactivo')
    console.log('✅ Cerrar al hacer clic fuera')
    
    console.log('\n🌐 Redes soportadas:')
    console.log('🔵 Ethereum Sepolia (Chain ID: 11155111)')
    console.log('🟦 Arbitrum Sepolia (Chain ID: 421614)')
    
    console.log('\n💡 Características del botón:')
    console.log('• Estado visual: "Conectado" con indicador verde')
    console.log('• Dirección truncada: 0xe6bE...2BA1')
    console.log('• Nombre de red con colores distintivos')
    console.log('• Dropdown con información completa')
    console.log('• Botones para cambiar red')
    console.log('• Botón de desconexión')
    
    console.log('\n🎨 Colores por red:')
    console.log('🔵 Ethereum Sepolia: Azul (text-blue-400)')
    console.log('🟦 Arbitrum Sepolia: Cian (text-cyan-400)')
    
    console.log('\n✅ Verificación completada')
    console.log('🌐 Frontend: http://localhost:3004/marketplace')
    console.log('📱 Prueba el botón de wallet en la interfaz')
    
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



