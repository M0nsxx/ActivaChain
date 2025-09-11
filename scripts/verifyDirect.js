const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function main() {
  console.log("🔍 Verificando contratos directamente con Hardhat...");
  
  // Contratos en Sepolia
  const sepoliaContracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
      args: ""
    },
    {
      name: "ActivaNFT", 
      address: "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9",
      args: ""
    },
    {
      name: "ActivaToken",
      address: "0x11a16814c7E8079Cc010a1603C15b818c3411FC4", 
      args: '"Activa Token" "ACTIVA" 1000000000000000000000000'
    },
    {
      name: "ReputationSystem",
      address: "0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D",
      args: ""
    },
    {
      name: "MockARB",
      address: "0x5C0F9F645E82cFB26918369Feb1189211511250e",
      args: ""
    }
  ];
  
  // Contratos en Arbitrum Sepolia
  const arbitrumContracts = [
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      args: ""
    },
    {
      name: "ActivaNFT", 
      address: "0x715231b93296D57D052E1D458Fb32AEc56444765",
      args: ""
    },
    {
      name: "ActivaToken",
      address: "0xE4F74170231156d9937f3baaa672df35571B6A38", 
      args: '"Activa Token" "ACTIVA" 1000000000000000000000000'
    },
    {
      name: "ReputationSystem",
      address: "0xf973036cFC966a5226625063859A2Eed3109563D",
      args: ""
    },
    {
      name: "MockARB",
      address: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D",
      args: ""
    }
  ];
  
  console.log("\n🌐 Verificando contratos en Sepolia...");
  
  for (const contract of sepoliaContracts) {
    console.log(`\n📦 Verificando ${contract.name} en Sepolia...`);
    try {
      const command = `npx hardhat verify --network sepolia ${contract.address} ${contract.args}`.trim();
      console.log(`   Ejecutando: ${command}`);
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stdout.includes("Successfully verified")) {
        console.log(`✅ ${contract.name} verificado exitosamente en Etherscan`);
        console.log(`   🔗 https://sepolia.etherscan.io/address/${contract.address}`);
      } else if (stdout.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Etherscan`);
        console.log(`   🔗 https://sepolia.etherscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Respuesta inesperada para ${contract.name}:`, stdout);
      }
    } catch (error) {
      if (error.stdout && error.stdout.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Etherscan`);
        console.log(`   🔗 https://sepolia.etherscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Error verificando ${contract.name}:`, error.message);
      }
    }
  }
  
  console.log("\n🌉 Verificando contratos en Arbitrum Sepolia...");
  
  for (const contract of arbitrumContracts) {
    console.log(`\n📦 Verificando ${contract.name} en Arbitrum...`);
    try {
      const command = `npx hardhat verify --network arbitrumSepolia ${contract.address} ${contract.args}`.trim();
      console.log(`   Ejecutando: ${command}`);
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stdout.includes("Successfully verified")) {
        console.log(`✅ ${contract.name} verificado exitosamente en Arbiscan`);
        console.log(`   🔗 https://sepolia.arbiscan.io/address/${contract.address}`);
      } else if (stdout.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Arbiscan`);
        console.log(`   🔗 https://sepolia.arbiscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Respuesta inesperada para ${contract.name}:`, stdout);
      }
    } catch (error) {
      if (error.stdout && error.stdout.includes("Already Verified")) {
        console.log(`✅ ${contract.name} ya está verificado en Arbiscan`);
        console.log(`   🔗 https://sepolia.arbiscan.io/address/${contract.address}`);
      } else {
        console.log(`⚠️ Error verificando ${contract.name}:`, error.message);
      }
    }
  }
  
  console.log("\n🎉 ¡Verificación completada!");
  console.log("\n📊 Resumen de enlaces:");
  console.log("\n🌐 Sepolia (Ethereum):");
  sepoliaContracts.forEach(contract => {
    console.log(`   ${contract.name}: https://sepolia.etherscan.io/address/${contract.address}`);
  });
  
  console.log("\n🌉 Arbitrum Sepolia:");
  arbitrumContracts.forEach(contract => {
    console.log(`   ${contract.name}: https://sepolia.arbiscan.io/address/${contract.address}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
