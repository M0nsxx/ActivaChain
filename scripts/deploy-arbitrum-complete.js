const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando contratos completos en Arbitrum Sepolia...");
  
  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const deploymentInfo = {
    network: "arbitrumSepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {}
  };

  try {
    // 1. Desplegar UnifiedReputationSystem
    console.log("\n🏆 Desplegando UnifiedReputationSystem...");
    const UnifiedReputationSystem = await ethers.getContractFactory("UnifiedReputationSystem");
    const reputationSystem = await UnifiedReputationSystem.deploy();
    await reputationSystem.waitForDeployment();
    const reputationAddress = await reputationSystem.getAddress();
    console.log("✅ UnifiedReputationSystem deployed to:", reputationAddress);
    deploymentInfo.contracts.unifiedReputation = reputationAddress;

    // 2. Desplegar ActivaToken
    console.log("\n💰 Desplegando ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy("ActivaChain Token", "ACTIVA", ethers.parseEther("1000000"));
    await activaToken.waitForDeployment();
    const tokenAddress = await activaToken.getAddress();
    console.log("✅ ActivaToken deployed to:", tokenAddress);
    deploymentInfo.contracts.activaToken = tokenAddress;

    // 3. Desplegar ActivaNFT
    console.log("\n🎨 Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const nft = await ActivaNFT.deploy(reputationAddress);
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("✅ ActivaNFT deployed to:", nftAddress);
    deploymentInfo.contracts.activaNFT = nftAddress;

    // 4. Desplegar ActivaMarketplaceMultiToken
    console.log("\n🛒 Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(tokenAddress, reputationAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken deployed to:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;

    // 5. Desplegar ActivaGovernance
    console.log("\n🏛️ Desplegando ActivaGovernance...");
    const ActivaGovernance = await ethers.getContractFactory("ActivaGovernance");
    const governance = await ActivaGovernance.deploy(tokenAddress);
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("✅ ActivaGovernance deployed to:", governanceAddress);
    deploymentInfo.contracts.governance = governanceAddress;

    // 6. Desplegar GamificationSystem
    console.log("\n🎮 Desplegando GamificationSystem...");
    const GamificationSystem = await ethers.getContractFactory("GamificationSystem");
    const gamification = await GamificationSystem.deploy();
    await gamification.waitForDeployment();
    const gamificationAddress = await gamification.getAddress();
    console.log("✅ GamificationSystem deployed to:", gamificationAddress);
    deploymentInfo.contracts.gamification = gamificationAddress;

    // 7. Desplegar CommunitySystem
    console.log("\n👥 Desplegando CommunitySystem...");
    const CommunitySystem = await ethers.getContractFactory("CommunitySystem");
    const community = await CommunitySystem.deploy();
    await community.waitForDeployment();
    const communityAddress = await community.getAddress();
    console.log("✅ CommunitySystem deployed to:", communityAddress);
    deploymentInfo.contracts.community = communityAddress;

    // 8. Desplegar IPFSIntegration
    console.log("\n📁 Desplegando IPFSIntegration...");
    const IPFSIntegration = await ethers.getContractFactory("IPFSIntegration");
    const ipfs = await IPFSIntegration.deploy();
    await ipfs.waitForDeployment();
    const ipfsAddress = await ipfs.getAddress();
    console.log("✅ IPFSIntegration deployed to:", ipfsAddress);
    deploymentInfo.contracts.ipfs = ipfsAddress;

    // 9. Desplegar PushNotificationSystem
    console.log("\n🔔 Desplegando PushNotificationSystem...");
    const PushNotificationSystem = await ethers.getContractFactory("PushNotificationSystem");
    const notifications = await PushNotificationSystem.deploy();
    await notifications.waitForDeployment();
    const notificationsAddress = await notifications.getAddress();
    console.log("✅ PushNotificationSystem deployed to:", notificationsAddress);
    deploymentInfo.contracts.notifications = notificationsAddress;

    // 10. Desplegar ExternalAPIIntegration
    console.log("\n🔗 Desplegando ExternalAPIIntegration...");
    const ExternalAPIIntegration = await ethers.getContractFactory("ExternalAPIIntegration");
    const externalAPI = await ExternalAPIIntegration.deploy();
    await externalAPI.waitForDeployment();
    const externalAPIAddress = await externalAPI.getAddress();
    console.log("✅ ExternalAPIIntegration deployed to:", externalAPIAddress);
    deploymentInfo.contracts.externalAPI = externalAPIAddress;

    // Guardar información de deployment
    deploymentInfo.blockNumber = await ethers.provider.getBlockNumber();
    deploymentInfo.gasUsed = "TBD";
    
    console.log("\n📋 Información de deployment:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    // Guardar en archivo
    const fs = require('fs');
    const filename = `deployment-info-arbitrum-complete-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Información guardada en: ${filename}`);
    
    console.log("\n🎉 ¡Deployment completado exitosamente en Arbitrum Sepolia!");
    console.log("📖 Próximos pasos:");
    console.log("   1. Verificar contratos en Arbiscan");
    console.log("   2. Probar funcionalidades");
    console.log("   3. Integrar con frontend");

  } catch (error) {
    console.error("❌ Error durante el deployment:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  });
