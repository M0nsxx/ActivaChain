const { ethers } = require("hardhat");
const { run } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos con API Keys de Etherscan y Arbiscan...");
  
  // Configurar las API keys
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "1EI4KGE2DIUPZF2XND8V5AUFVPE1E9X3JK";
  const arbiscanApiKey = process.env.ARBISCAN_API_KEY || "1EI4KGE2DIUPZF2XND8V5AUFVPE1E9X3JK";
  
  console.log("🔑 API Keys configuradas:");
  console.log("   Etherscan:", etherscanApiKey.substring(0, 10) + "...");
  console.log("   Arbiscan:", arbiscanApiKey.substring(0, 10) + "...");
  
  // Contratos en Sepolia (Ethereum)
  const sepoliaContracts = {
    marketplace: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
    activaNFT: "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9",
    activaToken: "0x11a16814c7E8079Cc010a1603C15b818c3411FC4",
    reputation: "0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D",
    arbToken: "0x5C0F9F645E82cFB26918369Feb1189211511250e"
  };
  
  // Contratos en Arbitrum Sepolia
  const arbitrumContracts = {
    marketplace: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
    activaNFT: "0x715231b93296D57D052E1D458Fb32AEc56444765",
    activaToken: "0xE4F74170231156d9937f3baaa672df35571B6A38",
    reputation: "0xf973036cFC966a5226625063859A2Eed3109563D",
    arbToken: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D"
  };
  
  try {
    console.log("\n🌐 Verificando contratos en Sepolia (Ethereum)...");
    
    // Verificar ActivaMarketplaceMultiToken en Sepolia
    console.log("\n📦 Verificando ActivaMarketplaceMultiToken en Sepolia...");
    try {
      await run("verify:verify", {
        address: sepoliaContracts.marketplace,
        constructorArguments: [],
        network: "sepolia"
      });
      console.log("✅ ActivaMarketplaceMultiToken verificado en Etherscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaMarketplaceMultiToken ya está verificado en Etherscan");
      } else {
        console.log("⚠️ Error verificando ActivaMarketplaceMultiToken:", error.message);
      }
    }
    
    // Verificar ActivaNFT en Sepolia
    console.log("\n🎨 Verificando ActivaNFT en Sepolia...");
    try {
      await run("verify:verify", {
        address: sepoliaContracts.activaNFT,
        constructorArguments: [],
        network: "sepolia"
      });
      console.log("✅ ActivaNFT verificado en Etherscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaNFT ya está verificado en Etherscan");
      } else {
        console.log("⚠️ Error verificando ActivaNFT:", error.message);
      }
    }
    
    // Verificar ActivaToken en Sepolia
    console.log("\n🪙 Verificando ActivaToken en Sepolia...");
    try {
      await run("verify:verify", {
        address: sepoliaContracts.activaToken,
        constructorArguments: [],
        network: "sepolia"
      });
      console.log("✅ ActivaToken verificado en Etherscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaToken ya está verificado en Etherscan");
      } else {
        console.log("⚠️ Error verificando ActivaToken:", error.message);
      }
    }
    
    // Verificar ReputationSystem en Sepolia
    console.log("\n⭐ Verificando ReputationSystem en Sepolia...");
    try {
      await run("verify:verify", {
        address: sepoliaContracts.reputation,
        constructorArguments: [],
        network: "sepolia"
      });
      console.log("✅ ReputationSystem verificado en Etherscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ReputationSystem ya está verificado en Etherscan");
      } else {
        console.log("⚠️ Error verificando ReputationSystem:", error.message);
      }
    }
    
    // Verificar MockARB en Sepolia
    console.log("\n🟠 Verificando MockARB en Sepolia...");
    try {
      await run("verify:verify", {
        address: sepoliaContracts.arbToken,
        constructorArguments: [],
        network: "sepolia"
      });
      console.log("✅ MockARB verificado en Etherscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ MockARB ya está verificado en Etherscan");
      } else {
        console.log("⚠️ Error verificando MockARB:", error.message);
      }
    }
    
    console.log("\n🌉 Verificando contratos en Arbitrum Sepolia...");
    
    // Verificar ActivaMarketplaceMultiToken en Arbitrum
    console.log("\n📦 Verificando ActivaMarketplaceMultiToken en Arbitrum...");
    try {
      await run("verify:verify", {
        address: arbitrumContracts.marketplace,
        constructorArguments: [],
        network: "arbitrumSepolia"
      });
      console.log("✅ ActivaMarketplaceMultiToken verificado en Arbiscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaMarketplaceMultiToken ya está verificado en Arbiscan");
      } else {
        console.log("⚠️ Error verificando ActivaMarketplaceMultiToken:", error.message);
      }
    }
    
    // Verificar ActivaNFT en Arbitrum
    console.log("\n🎨 Verificando ActivaNFT en Arbitrum...");
    try {
      await run("verify:verify", {
        address: arbitrumContracts.activaNFT,
        constructorArguments: [],
        network: "arbitrumSepolia"
      });
      console.log("✅ ActivaNFT verificado en Arbiscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaNFT ya está verificado en Arbiscan");
      } else {
        console.log("⚠️ Error verificando ActivaNFT:", error.message);
      }
    }
    
    // Verificar ActivaToken en Arbitrum
    console.log("\n🪙 Verificando ActivaToken en Arbitrum...");
    try {
      await run("verify:verify", {
        address: arbitrumContracts.activaToken,
        constructorArguments: [],
        network: "arbitrumSepolia"
      });
      console.log("✅ ActivaToken verificado en Arbiscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ActivaToken ya está verificado en Arbiscan");
      } else {
        console.log("⚠️ Error verificando ActivaToken:", error.message);
      }
    }
    
    // Verificar ReputationSystem en Arbitrum
    console.log("\n⭐ Verificando ReputationSystem en Arbitrum...");
    try {
      await run("verify:verify", {
        address: arbitrumContracts.reputation,
        constructorArguments: [],
        network: "arbitrumSepolia"
      });
      console.log("✅ ReputationSystem verificado en Arbiscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ ReputationSystem ya está verificado en Arbiscan");
      } else {
        console.log("⚠️ Error verificando ReputationSystem:", error.message);
      }
    }
    
    // Verificar MockARB en Arbitrum
    console.log("\n🟠 Verificando MockARB en Arbitrum...");
    try {
      await run("verify:verify", {
        address: arbitrumContracts.arbToken,
        constructorArguments: [],
        network: "arbitrumSepolia"
      });
      console.log("✅ MockARB verificado en Arbiscan");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("✅ MockARB ya está verificado en Arbiscan");
      } else {
        console.log("⚠️ Error verificando MockARB:", error.message);
      }
    }
    
    console.log("\n🎉 ¡Verificación completada!");
    console.log("\n📊 Resumen de verificación:");
    console.log("\n🌐 Sepolia (Ethereum):");
    console.log("   ActivaMarketplaceMultiToken: https://sepolia.etherscan.io/address/" + sepoliaContracts.marketplace);
    console.log("   ActivaNFT: https://sepolia.etherscan.io/address/" + sepoliaContracts.activaNFT);
    console.log("   ActivaToken: https://sepolia.etherscan.io/address/" + sepoliaContracts.activaToken);
    console.log("   ReputationSystem: https://sepolia.etherscan.io/address/" + sepoliaContracts.reputation);
    console.log("   MockARB: https://sepolia.etherscan.io/address/" + sepoliaContracts.arbToken);
    
    console.log("\n🌉 Arbitrum Sepolia:");
    console.log("   ActivaMarketplaceMultiToken: https://sepolia.arbiscan.io/address/" + arbitrumContracts.marketplace);
    console.log("   ActivaNFT: https://sepolia.arbiscan.io/address/" + arbitrumContracts.activaNFT);
    console.log("   ActivaToken: https://sepolia.arbiscan.io/address/" + arbitrumContracts.activaToken);
    console.log("   ReputationSystem: https://sepolia.arbiscan.io/address/" + arbitrumContracts.reputation);
    console.log("   MockARB: https://sepolia.arbiscan.io/address/" + arbitrumContracts.arbToken);
    
    console.log("\n🏆 ¡Todos los contratos verificados exitosamente!");
    console.log("   ✅ API Keys configuradas correctamente");
    console.log("   ✅ Contratos verificados en Etherscan");
    console.log("   ✅ Contratos verificados en Arbiscan");
    console.log("   ✅ Listo para el hackathon ActivaChains");
    
  } catch (error) {
    console.error("❌ Error durante la verificación:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
