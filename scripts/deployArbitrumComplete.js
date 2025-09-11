const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando ActivaChains COMPLETO en Arbitrum Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Desplegando con la cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  const deploymentInfo = {
    network: network,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {},
    services: 0,
    reputation: 0,
    supportedTokens: ["ETH", "ARB"]
  };

  try {
    // 1. Desplegar MockARB
    console.log("\n1️⃣ Desplegando MockARB...");
    const MockARB = await hre.ethers.getContractFactory("MockARB");
    const mockARB = await MockARB.deploy();
    await mockARB.waitForDeployment();
    const arbAddress = await mockARB.getAddress();
    console.log("✅ MockARB desplegado en:", arbAddress);
    deploymentInfo.contracts.arb = arbAddress;

    // 2. Desplegar ActivaToken
    console.log("\n2️⃣ Desplegando ActivaToken...");
    const ActivaToken = await hre.ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy("Activa Token", "ACTIVA", hre.ethers.parseEther("1000000"));
    await activaToken.waitForDeployment();
    const tokenAddress = await activaToken.getAddress();
    console.log("✅ ActivaToken desplegado en:", tokenAddress);
    deploymentInfo.contracts.activaToken = tokenAddress;

    // 3. Desplegar ActivaNFT
    console.log("\n3️⃣ Desplegando ActivaNFT...");
    const ActivaNFT = await hre.ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const nftAddress = await activaNFT.getAddress();
    console.log("✅ ActivaNFT desplegado en:", nftAddress);
    deploymentInfo.contracts.activaNFT = nftAddress;

    // 4. Desplegar ReputationSystem
    console.log("\n4️⃣ Desplegando ReputationSystem...");
    const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    deploymentInfo.contracts.reputation = reputationAddress;

    // 5. Desplegar AdvancedReputationSystem
    console.log("\n5️⃣ Desplegando AdvancedReputationSystem...");
    const AdvancedReputationSystem = await hre.ethers.getContractFactory("AdvancedReputationSystem");
    const advancedReputation = await AdvancedReputationSystem.deploy();
    await advancedReputation.waitForDeployment();
    const advancedReputationAddress = await advancedReputation.getAddress();
    console.log("✅ AdvancedReputationSystem desplegado en:", advancedReputationAddress);
    deploymentInfo.contracts.advancedReputation = advancedReputationAddress;

    // 6. Desplegar ActivaMarketplaceMultiToken
    console.log("\n6️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await hre.ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(arbAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;

    // 7. Desplegar GamificationSystem
    console.log("\n7️⃣ Desplegando GamificationSystem...");
    const GamificationSystem = await hre.ethers.getContractFactory("GamificationSystem");
    const gamification = await GamificationSystem.deploy();
    await gamification.waitForDeployment();
    const gamificationAddress = await gamification.getAddress();
    console.log("✅ GamificationSystem desplegado en:", gamificationAddress);
    deploymentInfo.contracts.gamificationSystem = gamificationAddress;

    // 8. Desplegar CommunitySystem
    console.log("\n8️⃣ Desplegando CommunitySystem...");
    const CommunitySystem = await hre.ethers.getContractFactory("CommunitySystem");
    const community = await CommunitySystem.deploy();
    await community.waitForDeployment();
    const communityAddress = await community.getAddress();
    console.log("✅ CommunitySystem desplegado en:", communityAddress);
    deploymentInfo.contracts.communitySystem = communityAddress;

    // 9. Desplegar IPFSIntegration
    console.log("\n9️⃣ Desplegando IPFSIntegration...");
    const IPFSIntegration = await hre.ethers.getContractFactory("IPFSIntegration");
    const ipfs = await IPFSIntegration.deploy();
    await ipfs.waitForDeployment();
    const ipfsAddress = await ipfs.getAddress();
    console.log("✅ IPFSIntegration desplegado en:", ipfsAddress);
    deploymentInfo.contracts.ipfsIntegration = ipfsAddress;

    // 10. Desplegar PushNotificationSystem
    console.log("\n🔟 Desplegando PushNotificationSystem...");
    const PushNotificationSystem = await hre.ethers.getContractFactory("PushNotificationSystem");
    const notifications = await PushNotificationSystem.deploy();
    await notifications.waitForDeployment();
    const notificationsAddress = await notifications.getAddress();
    console.log("✅ PushNotificationSystem desplegado en:", notificationsAddress);
    deploymentInfo.contracts.pushNotificationSystem = notificationsAddress;

    // 11. Desplegar ExternalAPIIntegration
    console.log("\n1️⃣1️⃣ Desplegando ExternalAPIIntegration...");
    const ExternalAPIIntegration = await hre.ethers.getContractFactory("ExternalAPIIntegration");
    const externalAPI = await ExternalAPIIntegration.deploy();
    await externalAPI.waitForDeployment();
    const externalAPIAddress = await externalAPI.getAddress();
    console.log("✅ ExternalAPIIntegration desplegado en:", externalAPIAddress);
    deploymentInfo.contracts.externalAPIIntegration = externalAPIAddress;

    // 12. Configurar reputación inicial
    console.log("\n1️⃣2️⃣ Configurando reputación inicial...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación configurada: 100 puntos");
    deploymentInfo.reputation = 100;

    // 13. Crear servicios de ejemplo (ETH y ARB)
    console.log("\n1️⃣3️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contracts Arbitrum",
        description: "Creación de contratos inteligentes optimizados para Arbitrum",
        price: hre.ethers.parseEther("0.5"), // 0.5 ETH
        paymentToken: 0, // ETH
        category: 1,
        minReputation: 0
      },
      {
        title: "Diseño UI/UX Web3 Layer 2",
        description: "Diseño moderno para aplicaciones descentralizadas en L2",
        price: hre.ethers.parseEther("300"), // 300 ARB
        paymentToken: 1, // ARB
        category: 2,
        minReputation: 0
      },
      {
        title: "Consultoría Arbitrum",
        description: "Asesoramiento estratégico para migrar a Arbitrum",
        price: hre.ethers.parseEther("1.0"), // 1.0 ETH
        paymentToken: 0, // ETH
        category: 4,
        minReputation: 0
      },
      {
        title: "Optimización de Gas",
        description: "Optimización de contratos para reducir costos de gas",
        price: hre.ethers.parseEther("500"), // 500 ARB
        paymentToken: 1, // ARB
        category: 1,
        minReputation: 0
      },
      {
        title: "Bridge Development",
        description: "Desarrollo de bridges cross-chain para Arbitrum",
        price: hre.ethers.parseEther("2.0"), // 2.0 ETH
        paymentToken: 0, // ETH
        category: 1,
        minReputation: 0
      }
    ];

    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      console.log(`   Creando servicio ${i + 1}: ${service.title}...`);
      
      const tx = await marketplace.createService(
        service.title,
        service.description,
        service.price,
        service.paymentToken,
        service.category,
        service.minReputation
      );
      await tx.wait();
    }
    
    deploymentInfo.services = services.length;
    console.log(`✅ ${services.length} servicios creados`);

    // 14. Mintear tokens ARB para el deployer
    console.log("\n1️⃣4️⃣ Minteando tokens ARB...");
    const mintTx = await mockARB.mint(deployer.address, hre.ethers.parseUnits("10000", 18)); // 10,000 ARB
    await mintTx.wait();
    console.log("✅ 10,000 ARB minteados para el deployer");

    // 15. Guardar información de deployment
    const filename = `deployment-info-arbitrum-complete.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Información guardada en: ${filename}`);

    // 16. Mostrar resumen
    console.log("\n🎉 DEPLOYMENT COMPLETO EN ARBITRUM EXITOSO!");
    console.log("=" * 50);
    console.log(`📍 Red: ${network}`);
    console.log(`🔑 Deployer: ${deployer.address}`);
    console.log(`📅 Timestamp: ${deploymentInfo.timestamp}`);
    console.log("\n📋 Contratos desplegados:");
    console.log(`   ✅ MockARB: ${arbAddress}`);
    console.log(`   ✅ ActivaToken: ${tokenAddress}`);
    console.log(`   ✅ ActivaNFT: ${nftAddress}`);
    console.log(`   ✅ ReputationSystem: ${reputationAddress}`);
    console.log(`   ✅ AdvancedReputationSystem: ${advancedReputationAddress}`);
    console.log(`   ✅ ActivaMarketplaceMultiToken: ${marketplaceAddress}`);
    console.log(`   ✅ GamificationSystem: ${gamificationAddress}`);
    console.log(`   ✅ CommunitySystem: ${communityAddress}`);
    console.log(`   ✅ IPFSIntegration: ${ipfsAddress}`);
    console.log(`   ✅ PushNotificationSystem: ${notificationsAddress}`);
    console.log(`   ✅ ExternalAPIIntegration: ${externalAPIAddress}`);
    console.log(`\n🎯 Servicios creados: ${deploymentInfo.services}`);
    console.log(`⭐ Reputación del deployer: ${deploymentInfo.reputation}`);
    console.log(`💰 Tokens soportados: ${deploymentInfo.supportedTokens.join(', ')}`);

    console.log(`\n🌐 Verificar en Arbiscan:`);
    console.log(`   ARB: https://sepolia.arbiscan.io/address/${arbAddress}`);
    console.log(`   ActivaToken: https://sepolia.arbiscan.io/address/${tokenAddress}`);
    console.log(`   ActivaNFT: https://sepolia.arbiscan.io/address/${nftAddress}`);
    console.log(`   Reputation: https://sepolia.arbiscan.io/address/${reputationAddress}`);
    console.log(`   AdvancedReputation: https://sepolia.arbiscan.io/address/${advancedReputationAddress}`);
    console.log(`   Marketplace: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    console.log(`   Gamification: https://sepolia.arbiscan.io/address/${gamificationAddress}`);
    console.log(`   Community: https://sepolia.arbiscan.io/address/${communityAddress}`);
    console.log(`   IPFS: https://sepolia.arbiscan.io/address/${ipfsAddress}`);
    console.log(`   Notifications: https://sepolia.arbiscan.io/address/${notificationsAddress}`);
    console.log(`   ExternalAPI: https://sepolia.arbiscan.io/address/${externalAPIAddress}`);

    console.log("\n🚀 Sistema completo funcional en Arbitrum (ETH, ARB)");

  } catch (error) {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
