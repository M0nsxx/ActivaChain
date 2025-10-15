const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Arbitrum Sepolia...");
  
  // Configurar API key para Arbitrum
  const apiKey = "Q8EG2XBFE3GC8MXAVSD326T6TNVQXJ85BG";
  
  // Contratos desplegados en Arbitrum Sepolia
  const contracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      constructorArgs: []
    },
    {
      name: "UnifiedReputationSystem", 
      address: "0x0eBdB4cf4b72E806A0c55059B301797aE6629f6D",
      constructorArgs: []
    }
  ];
  
  console.log(`📋 Verificando ${contracts.length} contratos en Arbitrum Sepolia...`);
  
  const results = [];
  
  for (const contract of contracts) {
    try {
      console.log(`\n🔍 Verificando ${contract.name}...`);
      console.log(`📍 Dirección: ${contract.address}`);
      
      // Verificar si el contrato existe
      const code = await ethers.provider.getCode(contract.address);
      if (code === "0x") {
        console.log(`❌ No se encontró bytecode en ${contract.address}`);
        results.push({
          name: contract.name,
          address: contract.address,
          status: "NO_DEPLOYED",
          error: "No bytecode found"
        });
        continue;
      }
      
      console.log(`✅ Contrato encontrado con bytecode`);
      
      // Intentar verificación
      try {
        const verifyCommand = `npx hardhat verify --network arbitrumSepolia ${contract.address} ${contract.constructorArgs.join(" ")}`;
        console.log(`🚀 Ejecutando: ${verifyCommand}`);
        
        // Ejecutar verificación
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        const result = await execAsync(verifyCommand);
        console.log(`✅ ${contract.name} verificado exitosamente!`);
        console.log(`🔗 https://sepolia.arbiscan.io/address/${contract.address}#code`);
        
        results.push({
          name: contract.name,
          address: contract.address,
          status: "VERIFIED",
          etherscan: `https://sepolia.arbiscan.io/address/${contract.address}#code`
        });
        
      } catch (verifyError) {
        console.log(`❌ Error verificando ${contract.name}:`);
        console.log(verifyError.message);
        
        results.push({
          name: contract.name,
          address: contract.address,
          status: "VERIFICATION_FAILED",
          error: verifyError.message
        });
      }
      
    } catch (error) {
      console.log(`❌ Error con ${contract.name}: ${error.message}`);
      results.push({
        name: contract.name,
        address: contract.address,
        status: "ERROR",
        error: error.message
      });
    }
  }
  
  // Resumen de resultados
  console.log("\n📊 RESUMEN DE VERIFICACIÓN ARBITRUM SEPOLIA:");
  console.log("=" * 50);
  
  const verified = results.filter(r => r.status === "VERIFIED");
  const failed = results.filter(r => r.status !== "VERIFIED");
  
  console.log(`✅ Verificados: ${verified.length}`);
  console.log(`❌ Fallidos: ${failed.length}`);
  
  if (verified.length > 0) {
    console.log("\n🎉 CONTRATOS VERIFICADOS:");
    verified.forEach(contract => {
      console.log(`  ✅ ${contract.name}: ${contract.etherscan}`);
    });
  }
  
  if (failed.length > 0) {
    console.log("\n❌ CONTRATOS CON PROBLEMAS:");
    failed.forEach(contract => {
      console.log(`  ❌ ${contract.name}: ${contract.error || contract.status}`);
    });
  }
  
  // Guardar resultados
  const fs = require('fs');
  const filename = `verification-results-arbitrum-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify({
    network: "arbitrumSepolia",
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      total: results.length,
      verified: verified.length,
      failed: failed.length
    }
  }, null, 2));
  
  console.log(`\n💾 Resultados guardados en: ${filename}`);
  
  if (verified.length === results.length) {
    console.log("\n🎉 ¡TODOS LOS CONTRATOS VERIFICADOS EXITOSAMENTE EN ARBITRUM SEPOLIA!");
  } else {
    console.log("\n⚠️ Algunos contratos necesitan atención manual.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });
