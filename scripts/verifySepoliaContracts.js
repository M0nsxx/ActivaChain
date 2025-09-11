const { run } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Sepolia (Ethereum)...");
  
  // Contratos en Sepolia con sus argumentos de constructor
  const contracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
      constructorArgs: []
    },
    {
      name: "ActivaNFT", 
      address: "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9",
      constructorArgs: []
    },
    {
      name: "ActivaToken",
      address: "0x11a16814c7E8079Cc010a1603C15b818c3411FC4", 
      constructorArgs: ["Activa Token", "ACTIVA", ethers.parseEther("1000000")]
    },
    {
      name: "ReputationSystem",
      address: "0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D",
      constructorArgs: []
    },
    {
      name: "MockARB",
      address: "0x5C0F9F645E82cFB26918369Feb1189211511250e",
      constructorArgs: []
    }
  ];
  
  for (const contract of contracts) {
    console.log(`\n📦 Verificando ${contract.name}...`);
    try {
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.constructorArgs,
        network: "sepolia"
      });
      console.log(`✅ ${contract.name} verificado exitosamente en Etherscan`);
      console.log(`   🔗 https://sepolia.etherscan.io/address/${contract.address}`);
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Etherscan`);
        console.log(`   🔗 https://sepolia.etherscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Error verificando ${contract.name}:`, error.message);
      }
    }
  }
  
  console.log("\n🎉 Verificación de Sepolia completada!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
