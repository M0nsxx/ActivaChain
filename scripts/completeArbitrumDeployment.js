const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Completando despliegue en Arbitrum Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Desplegando con la cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  // Direcciones ya desplegadas (del output anterior)
  const deployedContracts = {
    activaToken: "0xE4F74170231156d9937f3baaa672df35571B6A38",
    activaNFT: "0x715231b93296D57D052E1D458Fb32AEc56444765",
    reputation: "0x98f60Fc67C6eEf622A514b684164bBf31d25Bf52",
    advancedReputation: "0xf973036cFC966a5226625063859A2Eed3109563D",
    marketplace: "0x624d15B024a707E5c0295A790763f192289301B2",
    gamificationSystem: "0x5Eb409cB1bF3f97e88cE9038a531B59Ad994fC45",
    communitySystem: "0xb27AEF60ECAa4f0c9b7040c0C513CECbF2753fFD",
    ipfsIntegration: "0x4100faaA3f3bB8CD17AF2295Dd5A0724aBCB6927",
    pushNotificationSystem: "0x0Be3cC96475c95527D09842a877608316c5B148d"
  };

  try {
    // Desplegar el último contrato que faltó
    console.log("\n🔟 Desplegando ExternalAPIIntegration...");
    const ExternalAPIIntegration = await hre.ethers.getContractFactory("ExternalAPIIntegration");
    const externalAPI = await ExternalAPIIntegration.deploy();
    await externalAPI.waitForDeployment();
    const externalAPIAddress = await externalAPI.getAddress();
    console.log("✅ ExternalAPIIntegration desplegado en:", externalAPIAddress);
    deployedContracts.externalAPIIntegration = externalAPIAddress;

    // ARB token real de Arbitrum Sepolia
    const arbTokenAddress = "0x912CE59144191C1204E64559FE8253a0e49E6548";
    deployedContracts.arb = arbTokenAddress;

    // Configurar reputación y crear servicios
    console.log("\n1️⃣1️⃣ Configurando reputación y servicios...");
    const marketplace = await hre.ethers.getContractAt("ActivaMarketplaceMultiToken", deployedContracts.marketplace);
    
    // Dar reputación
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación configurada: 100 puntos");

    // Crear servicios
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
    
    console.log(`✅ ${services.length} servicios creados`);

    // Crear información de deployment
    const deploymentInfo = {
      network: network,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: deployedContracts,
      services: services.length,
      reputation: 100,
      supportedTokens: ["ETH", "ARB"]
    };

    // Guardar información
    const filename = `deployment-info-arbitrum-real.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Información guardada en: ${filename}`);

    // Mostrar resumen
    console.log("\n🎉 DEPLOYMENT EN ARBITRUM COMPLETADO!");
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

    console.log(`\n🌐 Verificar en Arbiscan:`);
    Object.entries(deployedContracts).forEach(([name, address]) => {
      console.log(`   ${name}: https://sepolia.arbiscan.io/address/${address}`);
    });

    console.log("\n🚀 Sistema completo funcional en Arbitrum (ETH + ARB REAL)");

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
