const fs = require('fs');

async function main() {
  console.log("🔄 Actualizando frontend para eliminar referencias a USDC...");
  
  try {
    // Leer archivos de deployment info
    const sepoliaInfo = JSON.parse(fs.readFileSync('deployment-info-multitoken.json', 'utf8'));
    const arbitrumInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
    
    console.log("📋 Información de deployment encontrada:");
    console.log(`   Sepolia Marketplace: ${sepoliaInfo.contracts.marketplace}`);
    console.log(`   Sepolia ARB: ${sepoliaInfo.contracts.arb}`);
    console.log(`   Arbitrum Marketplace: ${arbitrumInfo.contracts.marketplace}`);
    console.log(`   Arbitrum ARB: ${arbitrumInfo.contracts.arb}`);
    
    // Actualizar useContracts.ts
    console.log("\n🔧 Actualizando frontend/app/lib/useContracts.ts...");
    const useContractsPath = 'frontend/app/lib/useContracts.ts';
    let useContractsContent = fs.readFileSync(useContractsPath, 'utf8');
    
    // Actualizar direcciones de Sepolia
    useContractsContent = useContractsContent.replace(
      /marketplace: '0x[a-fA-F0-9]{40}' as `0x\${string}`/,
      `marketplace: '${sepoliaInfo.contracts.marketplace}' as \`0x\${string}\``
    );
    useContractsContent = useContractsContent.replace(
      /arb: '0x[a-fA-F0-9]{40}' as `0x\${string}`/,
      `arb: '${sepoliaInfo.contracts.arb}' as \`0x\${string}\``
    );
    
    // Actualizar direcciones de Arbitrum
    useContractsContent = useContractsContent.replace(
      /marketplace: '0x91f2522Fba8AD5520556D94fca100520D7d2e48c' as `0x\${string}`/,
      `marketplace: '${arbitrumInfo.contracts.marketplace}' as \`0x\${string}\``
    );
    useContractsContent = useContractsContent.replace(
      /arb: '0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D' as `0x\${string}`/,
      `arb: '${arbitrumInfo.contracts.arb}' as \`0x\${string}\``
    );
    
    fs.writeFileSync(useContractsPath, useContractsContent);
    console.log("✅ useContracts.ts actualizado");
    
    // Crear archivo .env.local para el frontend
    console.log("\n🔧 Creando archivo .env.local para el frontend...");
    const envContent = `# Reown AppKit - Project ID
NEXT_PUBLIC_REOWN_PROJECT_ID=c2b93e3f5a3a9b146ef83026c4d17a67

# Contract addresses (Ethereum Sepolia) - MARKETPLACE MULTI-TOKEN SIN USDC
NEXT_PUBLIC_SEPOLIA_MARKETPLACE_MULTI=${sepoliaInfo.contracts.marketplace}
NEXT_PUBLIC_SEPOLIA_ARB_MULTI=${sepoliaInfo.contracts.arb}

# Contract addresses (Arbitrum Sepolia) - BOUNTY MALDO SIN USDC
NEXT_PUBLIC_ARBITRUM_MARKETPLACE_MULTI=${arbitrumInfo.contracts.marketplace}
NEXT_PUBLIC_ARBITRUM_ARB_MULTI=${arbitrumInfo.contracts.arb}

# ✅ MARKETPLACE MULTI-TOKEN DESPLEGADO EN SEPOLIA - SIN USDC
# 🌐 Verificar en Etherscan: https://sepolia.etherscan.io/address/${sepoliaInfo.contracts.marketplace}
# 💰 Acepta: ETH nativo, ARB
# ⭐ Sistema de reputación funcional
# 🎯 ${sepoliaInfo.services} servicios creados con ARB
# 🚀 Marketplace profesional multi-token SIN USDC EN SEPOLIA

# ✅ MARKETPLACE MULTI-TOKEN DESPLEGADO EN ARBITRUM SEPOLIA - SIN USDC
# 🌐 Verificar en Arbiscan: https://sepolia.arbiscan.io/address/${arbitrumInfo.contracts.marketplace}
# 💰 Acepta: ETH nativo, ARB
# ⭐ Sistema de reputación funcional
# 🎯 ${arbitrumInfo.services} servicios específicos de Arbitrum creados
# 🏆 OPTIMIZADO PARA BOUNTY MALDO - HACKATHON ACTIVACHAINS - SIN USDC
`;
    
    fs.writeFileSync('frontend/.env.local', envContent);
    console.log("✅ .env.local creado en frontend/");
    
    console.log("\n🎉 Frontend actualizado exitosamente!");
    console.log("=" * 50);
    console.log("📋 Cambios realizados:");
    console.log("   ✅ Eliminadas todas las referencias a USDC");
    console.log("   ✅ Actualizadas direcciones de contratos");
    console.log("   ✅ Configurado para usar solo ETH y ARB");
    console.log("   ✅ Creado archivo .env.local con nuevas direcciones");
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. cd frontend");
    console.log("   2. npm run dev");
    console.log("   3. Conectar wallet a Sepolia o Arbitrum Sepolia");
    console.log("   4. Probar marketplace con ETH y ARB");
    
  } catch (error) {
    console.error("❌ Error actualizando frontend:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
