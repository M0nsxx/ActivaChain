const { ethers } = require("hardhat");

async function main() {
  console.log("🛒 Desplegando ActivaMarketplaceMultiToken...");
  
  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Desplegar ActivaMarketplaceMultiToken
  const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
  const activaTokenAddress = "0x11a16814c7E8079Cc010a1603C15b818c3411FC4"; // Token existente
  const reputationSystemAddress = "0xd427D9ED996fbF78B202c4D783823e161d264E67"; // Sistema unificado nuevo
  
  const marketplace = await ActivaMarketplaceMultiToken.deploy(activaTokenAddress, reputationSystemAddress);
  await marketplace.waitForDeployment();
  const address = await marketplace.getAddress();
  
  console.log("✅ ActivaMarketplaceMultiToken deployed to:", address);
  
  // Verificar configuración inicial
  console.log("⚙️ Configuración inicial:");
  console.log("   - ActivaToken:", activaTokenAddress);
  console.log("   - Reputation System:", reputationSystemAddress);
  console.log("   - Platform Fee:", (await marketplace.platformFee()).toString());
  console.log("   - Owner:", await marketplace.owner());
  
  // Guardar información de deployment
  const deploymentInfo = {
    network: "sepolia",
    marketplace: address,
    activaToken: activaTokenAddress,
    reputationSystem: reputationSystemAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasUsed: "TBD"
  };
  
  console.log("📋 Información de deployment:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Guardar en archivo
  const fs = require('fs');
  const filename = `deployment-info-marketplace-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Información guardada en: ${filename}`);
  
  console.log("\n🎉 ¡Deployment completado exitosamente!");
  console.log("📖 Próximos pasos:");
  console.log("   1. Verificar contrato en el explorador");
  console.log("   2. Probar funcionalidades del marketplace");
  console.log("   3. Integrar con frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  });