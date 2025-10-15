const { ethers } = require("hardhat");

async function main() {
  console.log("🎨 Desplegando ActivaNFT...");
  
  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Desplegar ActivaNFT
  const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
  const reputationSystemAddress = "0xd427D9ED996fbF78B202c4D783823e161d264E67"; // Sistema unificado nuevo
  
  const nft = await ActivaNFT.deploy(reputationSystemAddress);
  await nft.waitForDeployment();
  const address = await nft.getAddress();
  
  console.log("✅ ActivaNFT deployed to:", address);
  
  // Verificar configuración inicial
  console.log("⚙️ Configuración inicial:");
  console.log("   - Reputation System:", reputationSystemAddress);
  console.log("   - Name:", await nft.name());
  console.log("   - Symbol:", await nft.symbol());
  console.log("   - Owner:", await nft.owner());
  
  // Guardar información de deployment
  const deploymentInfo = {
    network: "sepolia",
    activaNFT: address,
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
  const filename = `deployment-info-nft-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Información guardada en: ${filename}`);
  
  console.log("\n🎉 ¡Deployment completado exitosamente!");
  console.log("📖 Próximos pasos:");
  console.log("   1. Verificar contrato en el explorador");
  console.log("   2. Probar funcionalidades de NFT");
  console.log("   3. Integrar con frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  });
