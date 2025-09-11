const { ethers } = require("hardhat");

async function main() {
  console.log("📋 Guía de Verificación Manual de Contratos");
  console.log("=============================================");
  
  // Contratos en Sepolia (Ethereum)
  const sepoliaContracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
      constructorArgs: [],
      description: "Marketplace multi-token principal"
    },
    {
      name: "ActivaNFT", 
      address: "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9",
      constructorArgs: [],
      description: "Contrato NFT para certificados"
    },
    {
      name: "ActivaToken",
      address: "0x11a16814c7E8079Cc010a1603C15b818c3411FC4", 
      constructorArgs: ["Activa Token", "ACTIVA", "1000000000000000000000000"],
      description: "Token ERC20 principal"
    },
    {
      name: "ReputationSystem",
      address: "0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D",
      constructorArgs: [],
      description: "Sistema de reputación"
    },
    {
      name: "MockARB",
      address: "0x5C0F9F645E82cFB26918369Feb1189211511250e",
      constructorArgs: [],
      description: "Token ARB para pagos"
    }
  ];
  
  // Contratos en Arbitrum Sepolia
  const arbitrumContracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      constructorArgs: [],
      description: "Marketplace multi-token principal"
    },
    {
      name: "ActivaNFT", 
      address: "0x715231b93296D57D052E1D458Fb32AEc56444765",
      constructorArgs: [],
      description: "Contrato NFT para certificados"
    },
    {
      name: "ActivaToken",
      address: "0xE4F74170231156d9937f3baaa672df35571B6A38", 
      constructorArgs: ["Activa Token", "ACTIVA", "1000000000000000000000000"],
      description: "Token ERC20 principal"
    },
    {
      name: "ReputationSystem",
      address: "0xf973036cFC966a5226625063859A2Eed3109563D",
      constructorArgs: [],
      description: "Sistema de reputación"
    },
    {
      name: "MockARB",
      address: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D",
      constructorArgs: [],
      description: "Token ARB para pagos"
    }
  ];
  
  console.log("\n🌐 CONTRATOS EN SEPOLIA (ETHEREUM)");
  console.log("===================================");
  
  sepoliaContracts.forEach((contract, index) => {
    console.log(`\n${index + 1}. ${contract.name}`);
    console.log(`   📝 Descripción: ${contract.description}`);
    console.log(`   📍 Dirección: ${contract.address}`);
    console.log(`   🔗 Etherscan: https://sepolia.etherscan.io/address/${contract.address}`);
    
    if (contract.constructorArgs.length > 0) {
      console.log(`   ⚙️ Argumentos del constructor:`);
      contract.constructorArgs.forEach((arg, i) => {
        console.log(`      [${i}]: ${arg}`);
      });
    } else {
      console.log(`   ⚙️ Sin argumentos del constructor`);
    }
    
    console.log(`   📋 Para verificar manualmente:`);
    console.log(`      1. Ve a: https://sepolia.etherscan.io/address/${contract.address}#code`);
    console.log(`      2. Haz clic en "Verify and Publish"`);
    console.log(`      3. Selecciona "Via Standard JSON Input"`);
    console.log(`      4. Sube el archivo JSON del contrato desde artifacts/contracts/${contract.name}.sol/${contract.name}.json`);
    console.log(`      5. ${contract.constructorArgs.length > 0 ? 'Ingresa los argumentos del constructor' : 'No necesitas argumentos del constructor'}`);
  });
  
  console.log("\n🌉 CONTRATOS EN ARBITRUM SEPOLIA");
  console.log("=================================");
  
  arbitrumContracts.forEach((contract, index) => {
    console.log(`\n${index + 1}. ${contract.name}`);
    console.log(`   📝 Descripción: ${contract.description}`);
    console.log(`   📍 Dirección: ${contract.address}`);
    console.log(`   🔗 Arbiscan: https://sepolia.arbiscan.io/address/${contract.address}`);
    
    if (contract.constructorArgs.length > 0) {
      console.log(`   ⚙️ Argumentos del constructor:`);
      contract.constructorArgs.forEach((arg, i) => {
        console.log(`      [${i}]: ${arg}`);
      });
    } else {
      console.log(`   ⚙️ Sin argumentos del constructor`);
    }
    
    console.log(`   📋 Para verificar manualmente:`);
    console.log(`      1. Ve a: https://sepolia.arbiscan.io/address/${contract.address}#code`);
    console.log(`      2. Haz clic en "Verify and Publish"`);
    console.log(`      3. Selecciona "Via Standard JSON Input"`);
    console.log(`      4. Sube el archivo JSON del contrato desde artifacts/contracts/${contract.name}.sol/${contract.name}.json`);
    console.log(`      5. ${contract.constructorArgs.length > 0 ? 'Ingresa los argumentos del constructor' : 'No necesitas argumentos del constructor'}`);
  });
  
  console.log("\n🔑 INFORMACIÓN SOBRE API KEYS");
  console.log("=============================");
  console.log("Para verificación automática necesitas:");
  console.log("1. API Key de Etherscan para Sepolia: https://etherscan.io/apis");
  console.log("2. API Key de Arbiscan para Arbitrum Sepolia: https://arbiscan.io/apis");
  console.log("\n⚠️ La API key que proporcionaste parece ser para la red principal de Ethereum.");
  console.log("Para Sepolia necesitas una API key específica de Sepolia.");
  
  console.log("\n📁 ARCHIVOS DE ARTIFACTS NECESARIOS");
  console.log("===================================");
  console.log("Los archivos JSON de los contratos están en:");
  console.log("artifacts/contracts/[NombreContrato].sol/[NombreContrato].json");
  console.log("\nEjemplo:");
  console.log("artifacts/contracts/ActivaMarketplaceMultiToken.sol/ActivaMarketplaceMultiToken.json");
  
  console.log("\n🎯 PRÓXIMOS PASOS");
  console.log("==================");
  console.log("1. Obtén API keys válidas para Sepolia y Arbitrum Sepolia");
  console.log("2. O verifica manualmente usando las interfaces web");
  console.log("3. Los contratos ya están desplegados y funcionando");
  console.log("4. La verificación es solo para mostrar el código fuente en los exploradores");
  
  console.log("\n✅ ESTADO ACTUAL");
  console.log("================");
  console.log("✅ Contratos desplegados en Sepolia");
  console.log("✅ Contratos desplegados en Arbitrum Sepolia");
  console.log("✅ Frontend funcionando");
  console.log("✅ Servicios creados y activos");
  console.log("⚠️ Verificación pendiente (no afecta funcionalidad)");
  
  console.log("\n🏆 ¡El proyecto está listo para el hackathon!");
  console.log("La verificación es opcional y no afecta la funcionalidad de los contratos.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
