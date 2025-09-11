const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Sepolia...");
  
  // Configuración con Alchemy
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  // Direcciones de los contratos
  const contracts = {
    marketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    usdc: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    arb: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  };
  
  try {
    console.log("\n📋 Verificando contratos...");
    
    for (const [name, address] of Object.entries(contracts)) {
      try {
        const code = await provider.getCode(address);
        if (code === "0x") {
          console.log(`   ❌ ${name}: No desplegado en Sepolia (${address})`);
        } else {
          console.log(`   ✅ ${name}: Desplegado en Sepolia (${address})`);
        }
      } catch (error) {
        console.log(`   ❌ ${name}: Error verificando (${address})`);
      }
    }
    
    // Verificar balance del deployer
    console.log("\n💰 Verificando balance del deployer...");
    const deployerAddress = "0xe6bE36A435c3BecAd922ddD9Ede2Fc1DbB632BA1";
    const balance = await provider.getBalance(deployerAddress);
    console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
    
    // Verificar si las direcciones son de localhost
    console.log("\n🔍 Análisis de direcciones...");
    for (const [name, address] of Object.entries(contracts)) {
      if (address.startsWith("0x5FbDB2315678afecb367f032d93F642f64180aa3") || 
          address.startsWith("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512") ||
          address.startsWith("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")) {
        console.log(`   ⚠️ ${name}: Dirección de localhost (${address})`);
      } else {
        console.log(`   ✅ ${name}: Dirección de red real (${address})`);
      }
    }
    
    console.log("\n💡 Recomendación:");
    console.log("   Las direcciones parecen ser de localhost.");
    console.log("   Necesitamos desplegar en Sepolia real.");
    
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
