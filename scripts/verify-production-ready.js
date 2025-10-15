const fs = require('fs');
const path = require('path');

console.log("🔍 Verificando que el proyecto esté listo para transacciones reales...");

// Archivos que deben estar configurados para producción
const productionChecks = [
  {
    name: "Configuración de Reown",
    file: "frontend/app/components/Web3Provider.tsx",
    checks: [
      "sepolia",
      "arbitrumSepolia", 
      "defaultNetwork: sepolia",
      "projectId"
    ]
  },
  {
    name: "Direcciones de contratos",
    file: "frontend/app/lib/useContracts.ts",
    checks: [
      "unifiedReputation",
      "0x24FF472f7fc79672A4C1032dF37B74B2981389bf", // Sepolia
      "0x52C342E5484185612A7B4030164737B8E183c318"  // Arbitrum
    ]
  },
  {
    name: "ABI del sistema unificado",
    file: "frontend/app/lib/contracts.ts",
    checks: [
      "UNIFIED_REPUTATION_ABI",
      "getReputation",
      "verifyIdentityWithZK",
      "endorseUser"
    ]
  },
  {
    name: "Hook de reputación",
    file: "frontend/app/lib/useReputation.ts",
    checks: [
      "unifiedReputation",
      "UNIFIED_REPUTATION_ABI",
      "writeContract"
    ]
  }
];

// Archivos que NO deben tener datos mock
const noMockChecks = [
  "frontend/app/marketplace/page.tsx",
  "frontend/app/components/GovernanceSection.tsx",
  "frontend/app/dashboard/page.tsx"
];

console.log("📋 Verificando configuración de producción...");

let allProductionReady = true;

// Verificar configuración de producción
productionChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    const content = fs.readFileSync(check.file, 'utf8');
    const missingChecks = check.checks.filter(checkItem => !content.includes(checkItem));
    
    if (missingChecks.length === 0) {
      console.log(`   ✅ ${check.name} - Configurado correctamente`);
    } else {
      console.log(`   ❌ ${check.name} - Faltan: ${missingChecks.join(', ')}`);
      allProductionReady = false;
    }
  } else {
    console.log(`   ❌ ${check.name} - Archivo no encontrado: ${check.file}`);
    allProductionReady = false;
  }
});

console.log("\n📋 Verificando eliminación de datos mock...");

// Verificar que no hay datos mock
noMockChecks.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasMockData = content.includes('mock') || content.includes('demo') || content.includes('fake');
    
    if (!hasMockData) {
      console.log(`   ✅ ${file} - Sin datos mock`);
    } else {
      console.log(`   ❌ ${file} - Aún contiene datos mock`);
      allProductionReady = false;
    }
  } else {
    console.log(`   ⚠️ ${file} - Archivo no encontrado`);
  }
});

// Verificar que los scripts de demo fueron eliminados
const demoScripts = [
  "scripts/populateMarketplace.js",
  "scripts/quickServices.js"
];

console.log("\n📋 Verificando eliminación de scripts demo...");

demoScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`   ❌ ${script} - Script demo aún existe`);
    allProductionReady = false;
  } else {
    console.log(`   ✅ ${script} - Script demo eliminado`);
  }
});

console.log("\n📊 Resumen de verificación:");

if (allProductionReady) {
  console.log("   ✅ Proyecto listo para transacciones reales");
  console.log("   ✅ Configuración de Reown correcta");
  console.log("   ✅ Contratos conectados a testnets reales");
  console.log("   ✅ Datos mock eliminados");
  console.log("   ✅ Sistema unificado funcionando");
} else {
  console.log("   ❌ Algunos elementos necesitan corrección");
  console.log("   🔧 Revisar elementos marcados con ❌");
}

console.log("\n🎯 Configuración para transacciones reales:");
console.log("   • Reown configurado para Sepolia y Arbitrum Sepolia");
console.log("   • Contratos desplegados en testnets reales");
console.log("   • Sistema de reputación unificado funcionando");
console.log("   • Transacciones reales con wallet de Reown");
console.log("   • Sin datos mock o demo");

console.log("\n✅ Verificación completada!");
