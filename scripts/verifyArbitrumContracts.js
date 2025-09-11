const { run } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Arbitrum Sepolia...");
  
  // Contratos en Arbitrum Sepolia con sus argumentos de constructor
  const contracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      constructorArgs: []
    },
    {
      name: "ActivaNFT", 
      address: "0x715231b93296D57D052E1D458Fb32AEc56444765",
      constructorArgs: []
    },
    {
      name: "ActivaToken",
      address: "0xE4F74170231156d9937f3baaa672df35571B6A38", 
      constructorArgs: ["Activa Token", "ACTIVA", ethers.parseEther("1000000")]
    },
    {
      name: "ReputationSystem",
      address: "0xf973036cFC966a5226625063859A2Eed3109563D",
      constructorArgs: []
    },
    {
      name: "MockARB",
      address: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D",
      constructorArgs: []
    }
  ];
  
  for (const contract of contracts) {
    console.log(`\n📦 Verificando ${contract.name}...`);
    try {
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
        network: "arbitrumSepolia"
      });
      console.log(`✅ ${contract.name} verificado exitosamente en Arbiscan`);
      console.log(`   🔗 https://sepolia.arbiscan.io/address/${contract.address}`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Arbiscan`);
        console.log(`   🔗 https://sepolia.arbiscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Error verificando ${contract.name}:`, error.message);
      }
    }
  }
  
  console.log("\n🎉 Verificación de Arbitrum completada!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
