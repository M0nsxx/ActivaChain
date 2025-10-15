const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("🔄 Verificando contratos en Arbitrum Sepolia con reintentos...");
  
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
    console.log(`\n🔄 Verificando ${contract.name}...`);
    
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!success && attempts < maxAttempts) {
      attempts++;
      console.log(`   Intento ${attempts}/${maxAttempts}...`);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
        
        await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: contract.constructorArgs
        });
        
        console.log(`   ✅ ${contract.name} verificado exitosamente!`);
        success = true;
        results.push({
          name: contract.name,
          address: contract.address,
          status: "VERIFICADO",
          attempts: attempts
        });
        
      } catch (error) {
        console.log(`   ❌ Error en intento ${attempts}: ${error.message}`);
        
        if (attempts < maxAttempts) {
          console.log(`   ⏳ Esperando 10 segundos antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        } else {
          console.log(`   ⚠️  ${contract.name} no pudo ser verificado después de ${maxAttempts} intentos`);
          results.push({
            name: contract.name,
            address: contract.address,
            status: "FALLO",
            attempts: attempts,
            error: error.message
          });
        }
      }
    }
  }
  
  console.log("\n📊 RESUMEN DE VERIFICACIÓN:");
  console.log("=".repeat(50));
  
  const verified = results.filter(r => r.status === "VERIFICADO");
  const failed = results.filter(r => r.status === "FALLO");
  
  console.log(`✅ Verificados: ${verified.length}/${contracts.length}`);
  console.log(`❌ Fallidos: ${failed.length}/${contracts.length}`);
  
  if (verified.length > 0) {
    console.log("\n🎉 CONTRATOS VERIFICADOS:");
    verified.forEach(contract => {
      console.log(`   ✅ ${contract.name}: ${contract.address}`);
    });
  }
  
  if (failed.length > 0) {
    console.log("\n⚠️  CONTRATOS NO VERIFICADOS:");
    failed.forEach(contract => {
      console.log(`   ❌ ${contract.name}: ${contract.address}`);
      console.log(`      Error: ${contract.error}`);
    });
  }
  
  console.log("\n🔗 Enlaces Arbiscan:");
  results.forEach(contract => {
    const status = contract.status === "VERIFICADO" ? "✅" : "❌";
    console.log(`   ${status} ${contract.name}: https://sepolia.arbiscan.io/address/${contract.address}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
