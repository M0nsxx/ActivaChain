const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando contratos avanzados en Ethereum Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Desplegando con la cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  // Cargar direcciones ya desplegadas
  let existingDeployment = {};
  try {
    const existingData = fs.readFileSync('deployment-info-main-contracts.json', 'utf8');
    existingDeployment = JSON.parse(existingData);
    console.log("📋 Cargando contratos ya desplegados...");
  } catch (error) {
    console.log("⚠️ No se encontró archivo de deployment previo, creando nuevo...");
  }

  const deployedContracts = {
    // Contratos ya desplegados
    activaToken: existingDeployment.contracts?.activaToken || "0x11a16814c7E8079Cc010a1603C15b818c3411FC4",
    activaNFT: existingDeployment.contracts?.activaNFT || "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9",
    reputation: existingDeployment.contracts?.reputation || "0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D",
    marketplace: existingDeployment.contracts?.marketplace || "0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F"
  };

  try {
    // 1. Desplegar AdvancedReputationSystem
    console.log("\n1️⃣ Desplegando AdvancedReputationSystem...");
    const AdvancedReputationSystem = await hre.ethers.getContractFactory("AdvancedReputationSystem");
    const advancedReputation = await AdvancedReputationSystem.deploy();
    await advancedReputation.waitForDeployment();
    const advancedReputationAddress = await advancedReputation.getAddress();
    console.log("✅ AdvancedReputationSystem desplegado en:", advancedReputationAddress);
    deployedContracts.advancedReputation = advancedReputationAddress;

    // 2. Desplegar GamificationSystem
    console.log("\n2️⃣ Desplegando GamificationSystem...");
    const GamificationSystem = await hre.ethers.getContractFactory("GamificationSystem");
    const gamificationSystem = await GamificationSystem.deploy();
    await gamificationSystem.waitForDeployment();
    const gamificationSystemAddress = await gamificationSystem.getAddress();
    console.log("✅ GamificationSystem desplegado en:", gamificationSystemAddress);
    deployedContracts.gamificationSystem = gamificationSystemAddress;

    // 3. Desplegar CommunitySystem
    console.log("\n3️⃣ Desplegando CommunitySystem...");
    const CommunitySystem = await hre.ethers.getContractFactory("CommunitySystem");
    const communitySystem = await CommunitySystem.deploy();
    await communitySystem.waitForDeployment();
    const communitySystemAddress = await communitySystem.getAddress();
    console.log("✅ CommunitySystem desplegado en:", communitySystemAddress);
    deployedContracts.communitySystem = communitySystemAddress;

    // 4. Desplegar IPFSIntegration
    console.log("\n4️⃣ Desplegando IPFSIntegration...");
    const IPFSIntegration = await hre.ethers.getContractFactory("IPFSIntegration");
    const ipfsIntegration = await IPFSIntegration.deploy();
    await ipfsIntegration.waitForDeployment();
    const ipfsIntegrationAddress = await ipfsIntegration.getAddress();
    console.log("✅ IPFSIntegration desplegado en:", ipfsIntegrationAddress);
    deployedContracts.ipfsIntegration = ipfsIntegrationAddress;

    // 5. Desplegar PushNotificationSystem
    console.log("\n5️⃣ Desplegando PushNotificationSystem...");
    const PushNotificationSystem = await hre.ethers.getContractFactory("PushNotificationSystem");
    const pushNotificationSystem = await PushNotificationSystem.deploy();
    await pushNotificationSystem.waitForDeployment();
    const pushNotificationSystemAddress = await pushNotificationSystem.getAddress();
    console.log("✅ PushNotificationSystem desplegado en:", pushNotificationSystemAddress);
    deployedContracts.pushNotificationSystem = pushNotificationSystemAddress;

    // 6. Desplegar ExternalAPIIntegration
    console.log("\n6️⃣ Desplegando ExternalAPIIntegration...");
    const ExternalAPIIntegration = await hre.ethers.getContractFactory("ExternalAPIIntegration");
    const externalAPIIntegration = await ExternalAPIIntegration.deploy();
    await externalAPIIntegration.waitForDeployment();
    const externalAPIIntegrationAddress = await externalAPIIntegration.getAddress();
    console.log("✅ ExternalAPIIntegration desplegado en:", externalAPIIntegrationAddress);
    deployedContracts.externalAPIIntegration = externalAPIIntegrationAddress;

    // Crear información de deployment completa
    const deploymentInfo = {
      network: network,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: deployedContracts,
      services: existingDeployment.services || 3,
      reputation: existingDeployment.reputation || 100,
      supportedTokens: ["ETH"]
    };

    // Guardar información
    const filename = `deployment-info-sepolia-complete.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Información guardada en: ${filename}`);

    // Mostrar resumen
    console.log("\n🎉 DEPLOYMENT COMPLETO EN SEPOLIA!");
    console.log("=" * 50);
    console.log(`📍 Red: ${network}`);
    console.log(`🔑 Deployer: ${deployer.address}`);
    console.log(`📅 Timestamp: ${deploymentInfo.timestamp}`);
    console.log("\n📋 Contratos desplegados:");
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`   ✅ ${name}: ${address}`);
    });
    console.log(`\n🎯 Servicios creados: ${deploymentInfo.services}`);
    console.log(`⭐ Reputación del deployer: ${deploymentInfo.reputation}`);
    console.log(`💰 Tokens soportados: ${deploymentInfo.supportedTokens.join(', ')}`);

    console.log(`\n🌐 Verificar en Etherscan:`);
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`   ${name}: https://sepolia.etherscan.io/address/${address}`);
    });

    console.log("\n🚀 Sistema completo funcional en Sepolia (ETH)");

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
