const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando contratos avanzados de ActivaChain...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    const deploymentInfo = {
      network: network,
      chainId: hre.network.config.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {}
    };

    // 1. Desplegar ActivaMultiToken (ERC1155)
    console.log("\n1️⃣ Desplegando ActivaMultiToken...");
    const ActivaMultiToken = await hre.ethers.getContractFactory("ActivaMultiToken");
    const activaMultiToken = await ActivaMultiToken.deploy();
    await activaMultiToken.waitForDeployment();
    const multiTokenAddress = await activaMultiToken.getAddress();
    console.log("✅ ActivaMultiToken desplegado en:", multiTokenAddress);
    deploymentInfo.contracts.activaMultiToken = multiTokenAddress;

    // 2. Desplegar ActivaCollection (ERC721)
    console.log("\n2️⃣ Desplegando ActivaCollection...");
    const ActivaCollection = await hre.ethers.getContractFactory("ActivaCollection");
    const activaCollection = await ActivaCollection.deploy();
    await activaCollection.waitForDeployment();
    const collectionAddress = await activaCollection.getAddress();
    console.log("✅ ActivaCollection desplegado en:", collectionAddress);
    deploymentInfo.contracts.activaCollection = collectionAddress;

    // 3. Desplegar AdvancedReputationSystem
    console.log("\n3️⃣ Desplegando AdvancedReputationSystem...");
    const AdvancedReputationSystem = await hre.ethers.getContractFactory("AdvancedReputationSystem");
    const advancedReputation = await AdvancedReputationSystem.deploy();
    await advancedReputation.waitForDeployment();
    const reputationAddress = await advancedReputation.getAddress();
    console.log("✅ AdvancedReputationSystem desplegado en:", reputationAddress);
    deploymentInfo.contracts.advancedReputation = reputationAddress;

    // 4. Desplegar CommunitySystem
    console.log("\n4️⃣ Desplegando CommunitySystem...");
    const CommunitySystem = await hre.ethers.getContractFactory("CommunitySystem");
    const communitySystem = await CommunitySystem.deploy();
    await communitySystem.waitForDeployment();
    const communityAddress = await communitySystem.getAddress();
    console.log("✅ CommunitySystem desplegado en:", communityAddress);
    deploymentInfo.contracts.communitySystem = communityAddress;

    // 5. Desplegar GamificationSystem
    console.log("\n5️⃣ Desplegando GamificationSystem...");
    const GamificationSystem = await hre.ethers.getContractFactory("GamificationSystem");
    const gamificationSystem = await GamificationSystem.deploy();
    await gamificationSystem.waitForDeployment();
    const gamificationAddress = await gamificationSystem.getAddress();
    console.log("✅ GamificationSystem desplegado en:", gamificationAddress);
    deploymentInfo.contracts.gamificationSystem = gamificationAddress;

    // 6. Desplegar IPFSIntegration
    console.log("\n6️⃣ Desplegando IPFSIntegration...");
    const IPFSIntegration = await hre.ethers.getContractFactory("IPFSIntegration");
    const ipfsIntegration = await IPFSIntegration.deploy();
    await ipfsIntegration.waitForDeployment();
    const ipfsAddress = await ipfsIntegration.getAddress();
    console.log("✅ IPFSIntegration desplegado en:", ipfsAddress);
    deploymentInfo.contracts.ipfsIntegration = ipfsAddress;

    // 7. Desplegar PushNotificationSystem
    console.log("\n7️⃣ Desplegando PushNotificationSystem...");
    const PushNotificationSystem = await hre.ethers.getContractFactory("PushNotificationSystem");
    const pushNotificationSystem = await PushNotificationSystem.deploy();
    await pushNotificationSystem.waitForDeployment();
    const pushAddress = await pushNotificationSystem.getAddress();
    console.log("✅ PushNotificationSystem desplegado en:", pushAddress);
    deploymentInfo.contracts.pushNotificationSystem = pushAddress;

    // 8. Desplegar ExternalAPIIntegration
    console.log("\n8️⃣ Desplegando ExternalAPIIntegration...");
    const ExternalAPIIntegration = await hre.ethers.getContractFactory("ExternalAPIIntegration");
    const externalAPIIntegration = await ExternalAPIIntegration.deploy();
    await externalAPIIntegration.waitForDeployment();
    const apiAddress = await externalAPIIntegration.getAddress();
    console.log("✅ ExternalAPIIntegration desplegado en:", apiAddress);
    deploymentInfo.contracts.externalAPIIntegration = apiAddress;

    // 9. Configurar permisos iniciales
    console.log("\n9️⃣ Configurando permisos iniciales...");
    
    // Dar reputación inicial al deployer
    await advancedReputation.updateReputation(deployer.address, 1000, true);
    console.log("✅ Reputación inicial otorgada al deployer");

    // Registrar al deployer como mentor
    await communitySystem.registerMentor(
      "Deployer",
      "Desarrollador principal de ActivaChain",
      ["Blockchain", "Smart Contracts", "DeFi"],
      5,
      hre.ethers.parseEther("0.1"),
      { value: hre.ethers.parseEther("0.01") }
    );
    console.log("✅ Deployer registrado como mentor");

    // 10. Crear algunos tokens y colecciones de ejemplo
    console.log("\n🔟 Creando tokens y colecciones de ejemplo...");
    
    // Crear token de invierno
    const winterTokenId = await activaMultiToken.createToken(
      "Flores de Invierno",
      "WINTER",
      1000,
      hre.ethers.parseEther("0.01"),
      1, // Invierno
      "ipfs://winter-flowers-metadata"
    );
    console.log("✅ Token de invierno creado con ID:", Number(winterTokenId));

    // Crear colección de primavera
    const springCollectionId = await activaCollection.createCollection(
      "Hongos Mágicos de Primavera",
      "Una colección única de hongos mágicos para la temporada de primavera",
      100,
      hre.ethers.parseEther("0.05"),
      2, // Primavera
      "ipfs://spring-mushrooms-metadata"
    );
    console.log("✅ Colección de primavera creada con ID:", Number(springCollectionId));

    // 11. Guardar información de deployment
    const filename = `deployment-info-advanced-${network}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Información de deployment guardada en ${filename}`);

    // 12. Actualizar useContracts.ts
    console.log("\n1️⃣1️⃣ Actualizando frontend...");
    const useContractsPath = 'frontend/app/lib/useContracts.ts';
    let useContractsContent = fs.readFileSync(useContractsPath, 'utf8');
    
    // Agregar nuevas direcciones
    const newAddresses = `
        activaMultiToken: '${multiTokenAddress}' as \`0x\${string}\`,
        activaCollection: '${collectionAddress}' as \`0x\${string}\`,
        advancedReputation: '${reputationAddress}' as \`0x\${string}\`,
        communitySystem: '${communityAddress}' as \`0x\${string}\`,
        gamificationSystem: '${gamificationAddress}' as \`0x\${string}\`,
        ipfsIntegration: '${ipfsAddress}' as \`0x\${string}\`,
        pushNotificationSystem: '${pushAddress}' as \`0x\${string}\`,
        externalAPIIntegration: '${apiAddress}' as \`0x\${string}\`,`;
    
    // Insertar después de las direcciones existentes
    useContractsContent = useContractsContent.replace(
      /activaNFT: '0x0000000000000000000000000000000000000000' as `0x\${string}\`,/,
      `activaNFT: '0x0000000000000000000000000000000000000000' as \`0x\${string}\`,${newAddresses}`
    );
    
    fs.writeFileSync(useContractsPath, useContractsContent);
    console.log("✅ Frontend actualizado con nuevas direcciones");

    console.log("\n🎉 ¡TODOS LOS CONTRATOS AVANZADOS DESPLEGADOS EXITOSAMENTE!");
    console.log("=" * 80);
    console.log(`📍 Red: ${network}`);
    console.log(`🔗 ActivaMultiToken: ${multiTokenAddress}`);
    console.log(`🔗 ActivaCollection: ${collectionAddress}`);
    console.log(`🔗 AdvancedReputationSystem: ${reputationAddress}`);
    console.log(`🔗 CommunitySystem: ${communityAddress}`);
    console.log(`🔗 GamificationSystem: ${gamificationAddress}`);
    console.log(`🔗 IPFSIntegration: ${ipfsAddress}`);
    console.log(`🔗 PushNotificationSystem: ${pushAddress}`);
    console.log(`🔗 ExternalAPIIntegration: ${apiAddress}`);
    
    console.log("\n🌐 Verificar en explorer:");
    if (network === 'sepolia') {
      console.log(`   ActivaMultiToken: https://sepolia.etherscan.io/address/${multiTokenAddress}`);
      console.log(`   ActivaCollection: https://sepolia.etherscan.io/address/${collectionAddress}`);
      console.log(`   AdvancedReputationSystem: https://sepolia.etherscan.io/address/${reputationAddress}`);
      console.log(`   CommunitySystem: https://sepolia.etherscan.io/address/${communityAddress}`);
      console.log(`   GamificationSystem: https://sepolia.etherscan.io/address/${gamificationAddress}`);
      console.log(`   IPFSIntegration: https://sepolia.etherscan.io/address/${ipfsAddress}`);
      console.log(`   PushNotificationSystem: https://sepolia.etherscan.io/address/${pushAddress}`);
      console.log(`   ExternalAPIIntegration: https://sepolia.etherscan.io/address/${apiAddress}`);
    } else if (network === 'arbitrumSepolia') {
      console.log(`   ActivaMultiToken: https://sepolia.arbiscan.io/address/${multiTokenAddress}`);
      console.log(`   ActivaCollection: https://sepolia.arbiscan.io/address/${collectionAddress}`);
      console.log(`   AdvancedReputationSystem: https://sepolia.arbiscan.io/address/${reputationAddress}`);
      console.log(`   CommunitySystem: https://sepolia.arbiscan.io/address/${communityAddress}`);
      console.log(`   GamificationSystem: https://sepolia.arbiscan.io/address/${gamificationAddress}`);
      console.log(`   IPFSIntegration: https://sepolia.arbiscan.io/address/${ipfsAddress}`);
      console.log(`   PushNotificationSystem: https://sepolia.arbiscan.io/address/${pushAddress}`);
      console.log(`   ExternalAPIIntegration: https://sepolia.arbiscan.io/address/${apiAddress}`);
    }
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Verificar contratos en explorer");
    console.log("   2. Probar funcionalidades en frontend");
    console.log("   3. Configurar APIs externas");
    console.log("   4. Crear contenido inicial");
    console.log("   5. Lanzar a la comunidad");
    
  } catch (error) {
    console.error("❌ Error desplegando contratos avanzados:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
