const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando nuevos contratos en Arbitrum Sepolia...");
  
  // Nuevas direcciones desplegadas
  const contracts = [
    { name: "UnifiedReputationSystem", address: "0x74d7e25B0A42e76a2a9e106e3F45D12752836c8a" },
    { name: "ActivaToken", address: "0x0E660759b190fd22DA58c9b36E98934bA847bA0c" },
    { name: "ActivaNFT", address: "0x07B3CE7A9355B2dbb7f5C00c8aFE243438a6c828" },
    { name: "ActivaMarketplaceMultiToken", address: "0x8083dc18681D0f2148268Bd37EB37B59d651C413" },
    { name: "ActivaGovernance", address: "0x8C2010aE5e64c2a0884F00978e69cf11Ca1FC3c9" },
    { name: "GamificationSystem", address: "0x97816BdD1E663Ee1E24F597Fed82E5019c297CCf" },
    { name: "CommunitySystem", address: "0xF42aE39CE7c762cddE752D869de8e21C9Cd3ea5A" },
    { name: "IPFSIntegration", address: "0xa8F5E0156Fa15b86f50719eCD1466d308947c7c6" },
    { name: "PushNotificationSystem", address: "0xB9742668B5f231EfA594A6055CD2e778E1bf6E61" },
    { name: "ExternalAPIIntegration", address: "0x3C4060F9aBa183dc3eadf8e6Cc1681352b6f8162" }
  ];
  
  console.log(`📋 Verificando ${contracts.length} contratos...`);
  
  const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
  
  for (const contract of contracts) {
    console.log(`\n🔍 Verificando ${contract.name}...`);
    console.log(`📍 Dirección: ${contract.address}`);
    
    try {
      const code = await provider.getCode(contract.address);
      
      if (code && code !== "0x") {
        console.log(`✅ ${contract.name} está desplegado y funcionando`);
        console.log(`📊 Bytecode length: ${code.length} caracteres`);
        console.log(`🔗 Arbiscan: https://sepolia.arbiscan.io/address/${contract.address}`);
      } else {
        console.log(`❌ No se encontró bytecode en ${contract.address}`);
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
    console.error("❌ Error:", error);
    process.exit(1);
  });
