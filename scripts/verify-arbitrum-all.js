const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando todos los contratos en Arbitrum Sepolia...");
  
  // Contratos desplegados en Arbitrum Sepolia
  const contracts = [
    {
      name: "UnifiedReputationSystem",
      address: "0x539Baccf23AC6288aEC9a8ef194624c3F687AAeE",
      constructorArgs: []
    },
    {
      name: "ActivaToken",
      address: "0xa7218aBd05Aba7683e8f1545F71dC7E923328D54",
      constructorArgs: ["ActivaChain Token", "ACTIVA", "1000000000000000000000000"]
    },
    {
      name: "ActivaNFT",
      address: "0xa31cC5889bddaFBD2C7740a9997CB90aC1d22b60",
      constructorArgs: ["0x539Baccf23AC6288aEC9a8ef194624c3F687AAeE"]
    },
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0x1f873dA3E4B2Cf2C85FbB205dB94Ae384491d149",
      constructorArgs: ["0xa7218aBd05Aba7683e8f1545F71dC7E923328D54", "0x539Baccf23AC6288aEC9a8ef194624c3F687AAeE"]
    },
    {
      name: "ActivaGovernance",
      address: "0x6E9a5e4cc6A86C449b0972A0EBfc63456BF9dD5c",
      constructorArgs: ["0xa7218aBd05Aba7683e8f1545F71dC7E923328D54"]
    },
    {
      name: "GamificationSystem",
      address: "0xD8C0527636936f320d6Ce37A0d01B899CE4ff6e3",
      constructorArgs: []
    },
    {
      name: "CommunitySystem",
      address: "0xbc135184E879AaD3C0974E4F554c658F4d35fBCb",
      constructorArgs: []
    },
    {
      name: "IPFSIntegration",
      address: "0x840c198dF7Ada931AC47DB716Cbb25e77BeE2B62",
      constructorArgs: []
    },
    {
      name: "PushNotificationSystem",
      address: "0xD7298486554822fc2d666F35B833fd9296eb96C6",
      constructorArgs: []
    },
    {
      name: "ExternalAPIIntegration",
      address: "0x574037D27d74F27502de001bdcD06000e4Ca6962",
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
          arbiscan: `https://sepolia.arbiscan.io/address/${contract.address}#code`
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
      console.log(`  ✅ ${contract.name}: ${contract.arbiscan}`);
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
  const filename = `verification-results-arbitrum-all-${Date.now()}.json`;
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
