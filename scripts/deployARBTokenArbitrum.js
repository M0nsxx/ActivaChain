const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando token ARB mock en Arbitrum Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  if (network !== 'arbitrumSepolia') {
    console.log("❌ Este script debe ejecutarse en Arbitrum Sepolia");
    process.exit(1);
  }
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    // 1. Desplegar MockARB
    console.log("\n1️⃣ Desplegando MockARB...");
    const MockARB = await hre.ethers.getContractFactory("MockARB");
    const mockARB = await MockARB.deploy();
    await mockARB.waitForDeployment();
    const arbAddress = await mockARB.getAddress();
    console.log("✅ MockARB desplegado en:", arbAddress);

    // 2. Mintear tokens para el deployer
    console.log("\n2️⃣ Minteando tokens ARB...");
    const mintTx = await mockARB.mint(deployer.address, hre.ethers.parseEther("1000")); // 1000 ARB
    await mintTx.wait();
    console.log("✅ 1000 ARB minteados para el deployer");

    // 3. Verificar balance
    const balance = await mockARB.balanceOf(deployer.address);
    console.log(`✅ Balance verificado: ${hre.ethers.formatEther(balance)} ARB`);

    // 4. Actualizar deployment info
    const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
    deploymentInfo.contracts.arb = arbAddress;
    deploymentInfo.arbMock = true;
    deploymentInfo.lastUpdate = new Date().toISOString();
    
    fs.writeFileSync('deployment-info-arbitrum.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("✅ Información de deployment actualizada");

    console.log("\n🎉 TOKEN ARB MOCK DESPLEGADO EXITOSAMENTE!");
    console.log("=" * 60);
    console.log(`📍 Red: Arbitrum Sepolia`);
    console.log(`🔗 Token ARB: ${arbAddress}`);
    console.log(`💰 Balance del deployer: ${hre.ethers.formatEther(balance)} ARB`);
    
    console.log("\n🌐 Verificar en Arbiscan:");
    console.log(`   ARB Token: https://sepolia.arbiscan.io/address/${arbAddress}`);
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Actualizar frontend con nueva dirección de ARB");
    console.log("   2. Probar marketplace con tokens ARB mock");
    console.log("   3. Verificar que los precios se muestren correctamente");
    
  } catch (error) {
    console.error("❌ Error desplegando token ARB:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
