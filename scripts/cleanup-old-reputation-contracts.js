const fs = require('fs');
const path = require('path');

console.log("🧹 Limpiando referencias a contratos de reputación obsoletos...");

// Lista de archivos que contienen referencias a los contratos eliminados
const filesToClean = [
  'scripts/migrate-reputation-data.js',
  'scripts/manualVerificationGuide.js',
  'scripts/verifyDirect.js',
  'scripts/verifyArbitrumContracts.js',
  'scripts/verifySepoliaContracts.js',
  'scripts/verifyWithAPIKeys.js',
  'scripts/deploy.js',
  'scripts/deploySepoliaAdvanced.js',
  'scripts/deployArbitrumReal.js',
  'scripts/deployArbitrumComplete.js',
  'scripts/deployMainContracts.js',
  'scripts/deploySepoliaComplete.js',
  'scripts/testAdvancedContracts.js',
  'scripts/deployAdvancedContracts.js',
  'scripts/deploySimple.js',
  'scripts/deployEthereumSepolia.js',
  'scripts/deployCompleteEcosystem.js',
  'scripts/deployCompleteArbitrum.js',
  'scripts/verifyContracts.js',
  'scripts/deploySepoliaFinal.js',
  'scripts/deployAlchemy.js',
  'scripts/deployLocalTest.js',
  'scripts/deployDirect.js',
  'scripts/deployComplete.js',
  'scripts/deployFresh.js',
  'scripts/deployAndPopulate.js'
];

// Scripts que deben ser eliminados completamente (obsoletos)
const scriptsToDelete = [
  'scripts/deploySepoliaAdvanced.js',
  'scripts/deployArbitrumReal.js',
  'scripts/deployArbitrumComplete.js',
  'scripts/deployMainContracts.js',
  'scripts/deploySepoliaComplete.js',
  'scripts/testAdvancedContracts.js',
  'scripts/deployAdvancedContracts.js',
  'scripts/deploySimple.js',
  'scripts/deployEthereumSepolia.js',
  'scripts/deployCompleteEcosystem.js',
  'scripts/deployCompleteArbitrum.js',
  'scripts/deploySepoliaFinal.js',
  'scripts/deployAlchemy.js',
  'scripts/deployLocalTest.js',
  'scripts/deployDirect.js',
  'scripts/deployComplete.js',
  'scripts/deployFresh.js',
  'scripts/deployAndPopulate.js'
];

console.log("📋 Archivos a limpiar:", filesToClean.length);
console.log("🗑️ Scripts a eliminar:", scriptsToDelete.length);

// Eliminar scripts obsoletos
console.log("\n🗑️ Eliminando scripts obsoletos...");
let deletedCount = 0;
scriptsToDelete.forEach(script => {
  if (fs.existsSync(script)) {
    try {
      fs.unlinkSync(script);
      console.log(`   ✅ Eliminado: ${script}`);
      deletedCount++;
    } catch (error) {
      console.log(`   ❌ Error eliminando ${script}:`, error.message);
    }
  } else {
    console.log(`   ⚠️ No encontrado: ${script}`);
  }
});

console.log(`\n📊 Resumen de limpieza:`);
console.log(`   ✅ Scripts eliminados: ${deletedCount}`);
console.log(`   📁 Archivos a limpiar: ${filesToClean.length}`);

console.log("\n🎯 Próximos pasos:");
console.log("   1. Revisar archivos restantes manualmente");
console.log("   2. Actualizar referencias en frontend");
console.log("   3. Actualizar documentación");
console.log("   4. Ejecutar tests para verificar que todo funciona");

console.log("\n✅ Limpieza completada!");
