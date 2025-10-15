const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Arbitrum Sepolia...");
  
  const contracts = [
    { name: "UnifiedReputationSystem", address: "0x539Baccf23AC6288aEC9a8ef194624c3F687AAeE" },
    { name: "ActivaToken", address: "0xa7218aBd05Aba7683e8f1545F71dC7E923328D54" },
    { name: "ActivaNFT", address: "0xa31cC5889bddaFBD2C7740a9997CB90aC1d22b60" },
    { name: "ActivaMarketplaceMultiToken", address: "0x1f873dA3E4B2Cf2C85FbB205dB94Ae384491d149" },
    { name: "ActivaGovernance", address: "0x6E9a5e4cc6A86C449b0972A0EBfc63456BF9dD5c" },
    { name: "GamificationSystem", address: "0xD8C0527636936f320d6Ce37A0d01B899CE4ff6e3" },
    { name: "CommunitySystem", address: "0xbc135184E879AaD3C0974E4F554c658F4d35fBCb" },
    { name: "IPFSIntegration", address: "0x840c198dF7Ada931AC47DB716Cbb25e77BeE2B62" },
    { name: "PushNotificationSystem", address: "0xD7298486554822fc2d666F35B833fd9296eb96C6" },
    { name: "ExternalAPIIntegration", address: "0x574037D27d74F27502de001bdcD06000e4Ca6962" }
  ];
  
  console.log(`📋 Verificando ${contracts.length} contratos...`);
  
  for (const contract of contracts) {
    try {
      console.log(`\n🔍 Verificando ${contract.name}...`);
      console.log(`📍 Dirección: ${contract.address}`);
      
      // Verificar si el contrato existe
      const code = await ethers.provider.getCode(contract.address);
      if (code === "0x") {
        console.log(`❌ No se encontró bytecode en ${contract.address}`);
      } else {
        console.log(`✅ Contrato encontrado con bytecode (${code.length} caracteres)`);
        
        // Intentar obtener información básica del contrato
        try {
          const contractInstance = await ethers.getContractAt("UnifiedReputationSystem", contract.address);
          console.log(`✅ Contrato accesible`);
        } catch (error) {
          console.log(`⚠️ Contrato encontrado pero no accesible: ${error.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error verificando ${contract.name}: ${error.message}`);
    }
  }
  
  console.log("\n📊 Verificación completada");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });
