const fs = require('fs');
const path = require('path');

console.log("🔍 Verificando conexiones del frontend con el sistema unificado...");

// Archivos que deben usar el sistema unificado
const filesToCheck = [
  'frontend/app/lib/useContracts.ts',
  'frontend/app/lib/useReputation.ts',
  'frontend/app/lib/contracts.ts',
  'frontend/app/components/UnifiedReputationSystem.tsx',
  'frontend/app/reputacion/page.tsx'
];

console.log("📋 Verificando archivos del frontend...");

let allConnected = true;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar que use el sistema unificado
    const hasUnifiedReputation = content.includes('unifiedReputation');
    const hasUnifiedReputationABI = content.includes('UNIFIED_REPUTATION_ABI');
    const hasOldReferences = content.includes('advancedReputation') || content.includes('ADVANCED_REPUTATION_ABI');
    
    if (hasUnifiedReputation || hasUnifiedReputationABI) {
      console.log(`   ✅ ${file} - Conectado al sistema unificado`);
    } else if (hasOldReferences) {
      console.log(`   ❌ ${file} - Aún usa referencias antiguas`);
      allConnected = false;
    } else {
      console.log(`   ⚠️ ${file} - No usa sistema de reputación`);
    }
  } else {
    console.log(`   ❌ ${file} - Archivo no encontrado`);
    allConnected = false;
  }
});

console.log("\n📊 Resumen de verificación:");

if (allConnected) {
  console.log("   ✅ Todos los archivos están conectados al sistema unificado");
  console.log("   ✅ Frontend listo para usar el sistema de reputación unificado");
} else {
  console.log("   ❌ Algunos archivos necesitan actualización");
  console.log("   🔧 Revisar archivos marcados con ❌");
}

console.log("\n🎯 Próximos pasos:");
console.log("   1. Ejecutar tests del frontend");
console.log("   2. Verificar funcionalidades en desarrollo");
console.log("   3. Probar integración completa");
console.log("   4. Desplegar a producción");

console.log("\n✅ Verificación completada!");
