const { execSync } = require('child_process');
const fs = require('fs');

async function main() {
  console.log("🚀 Actualizando servicios del marketplace en ambas redes...");
  console.log("=" * 60);
  
  try {
    // Verificar que tenemos los archivos de deployment
    if (!fs.existsSync('deployment-info-multitoken.json')) {
      console.log("❌ No se encontró deployment-info-multitoken.json");
      console.log("   Ejecuta primero: npm run deploy:multi-no-usdc:sepolia");
      process.exit(1);
    }
    
    if (!fs.existsSync('deployment-info-arbitrum.json')) {
      console.log("❌ No se encontró deployment-info-arbitrum.json");
      console.log("   Ejecuta primero: npm run deploy:multi-no-usdc:arbitrum");
      process.exit(1);
    }
    
    // Leer información de deployment
    const sepoliaInfo = JSON.parse(fs.readFileSync('deployment-info-multitoken.json', 'utf8'));
    const arbitrumInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
    
    console.log("📋 Información de deployment encontrada:");
    console.log(`   Sepolia Marketplace: ${sepoliaInfo.contracts.marketplace}`);
    console.log(`   Arbitrum Marketplace: ${arbitrumInfo.contracts.marketplace}`);
    
    // Actualizar servicios en Sepolia
    console.log("\n" + "=" * 60);
    console.log("🎯 ACTUALIZANDO SERVICIOS EN SEPOLIA");
    console.log("=" * 60);
    
    try {
      execSync('npx hardhat run scripts/updateServicesSepolia.js --network sepolia', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log("✅ Servicios de Sepolia actualizados exitosamente");
    } catch (error) {
      console.log("❌ Error actualizando servicios de Sepolia:", error.message);
    }
    
    // Actualizar servicios en Arbitrum Sepolia
    console.log("\n" + "=" * 60);
    console.log("🎯 ACTUALIZANDO SERVICIOS EN ARBITRUM SEPOLIA");
    console.log("=" * 60);
    
    try {
      execSync('npx hardhat run scripts/updateServicesArbitrum.js --network arbitrumSepolia', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log("✅ Servicios de Arbitrum Sepolia actualizados exitosamente");
    } catch (error) {
      console.log("❌ Error actualizando servicios de Arbitrum:", error.message);
    }
    
    // Resumen final
    console.log("\n" + "=" * 60);
    console.log("🎉 RESUMEN FINAL - SERVICIOS ACTUALIZADOS");
    console.log("=" * 60);
    
    // Leer información actualizada
    const updatedSepoliaInfo = JSON.parse(fs.readFileSync('deployment-info-multitoken.json', 'utf8'));
    const updatedArbitrumInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
    
    console.log("📊 SEPOLIA (Ethereum Testnet):");
    console.log(`   🎯 Servicios totales: ${updatedSepoliaInfo.services}`);
    console.log(`   💰 Tokens: ETH nativo`);
    console.log(`   🌐 Marketplace: ${updatedSepoliaInfo.contracts.marketplace}`);
    console.log(`   🔗 Etherscan: https://sepolia.etherscan.io/address/${updatedSepoliaInfo.contracts.marketplace}`);
    
    console.log("\n📊 ARBITRUM SEPOLIA (Layer 2 Testnet):");
    console.log(`   🎯 Servicios totales: ${updatedArbitrumInfo.services}`);
    console.log(`   💰 Tokens: ETH nativo, ARB`);
    console.log(`   🌐 Marketplace: ${updatedArbitrumInfo.contracts.marketplace}`);
    console.log(`   🔗 Arbiscan: https://sepolia.arbiscan.io/address/${updatedArbitrumInfo.contracts.marketplace}`);
    
    console.log("\n🚀 PRÓXIMOS PASOS:");
    console.log("   1. cd frontend");
    console.log("   2. npm run dev");
    console.log("   3. Conectar wallet a Sepolia o Arbitrum Sepolia");
    console.log("   4. Probar marketplace con servicios reales");
    console.log("   5. Verificar transacciones en exploradores");
    
    console.log("\n💡 SERVICIOS ESPECÍFICOS POR RED:");
    console.log("   📍 Sepolia: Servicios enfocados en Ethereum (DeFi, NFTs, Gas optimization)");
    console.log("   📍 Arbitrum: Servicios enfocados en Layer 2 (Rollups, Bridges, ARB integration)");
    
    console.log("\n✅ ¡Marketplace actualizado con servicios reales y funcionales!");
    
  } catch (error) {
    console.error("❌ Error en el proceso de actualización:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
