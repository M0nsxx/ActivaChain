const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando Contratos Principales de ActivaChains en Sepolia...");
  
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
    reputation: 0
  };

  try {
    // 1. Desplegar ActivaToken
    console.log("\n1️⃣ Desplegando ActivaToken...");
    const ActivaToken = await hre.ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy("Activa Token", "ACTIVA", hre.ethers.parseEther("1000000"));
    await activaToken.waitForDeployment();
    const tokenAddress = await activaToken.getAddress();
    console.log("✅ ActivaToken desplegado en:", tokenAddress);
    deploymentInfo.contracts.activaToken = tokenAddress;

    // 2. Desplegar ActivaNFT
    console.log("\n2️⃣ Desplegando ActivaNFT...");
    const ActivaNFT = await hre.ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const nftAddress = await activaNFT.getAddress();
    console.log("✅ ActivaNFT desplegado en:", nftAddress);
    deploymentInfo.contracts.activaNFT = nftAddress;

    // 3. Desplegar ReputationSystem
    console.log("\n3️⃣ Desplegando ReputationSystem...");
    const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    deploymentInfo.contracts.reputation = reputationAddress;

    // 4. Desplegar ActivaMarketplaceMultiToken (sin MockARB, solo ETH)
    console.log("\n4️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await hre.ethers.getContractFactory("ActivaMarketplaceMultiToken");
    // Usar address(0) para ARB ya que no lo necesitamos
    const marketplace = await ActivaMarketplaceMultiToken.deploy("0x0000000000000000000000000000000000000000");
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;

    // 5. Configurar reputación inicial
    console.log("\n5️⃣ Configurando reputación inicial...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación configurada: 100 puntos");
    deploymentInfo.reputation = 100;

    // 6. Crear servicios de ejemplo (solo ETH)
    console.log("\n6️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contracts",
        description: "Creación de contratos inteligentes personalizados para DeFi",
        price: hre.ethers.parseEther("0.5"), // 0.5 ETH
        paymentToken: 0, // ETH
        category: 1,
        minReputation: 0
      },
      {
        title: "Diseño UI/UX Web3",
        description: "Diseño moderno para aplicaciones descentralizadas",
        price: hre.ethers.parseEther("0.3"), // 0.3 ETH
        paymentToken: 0, // ETH
        category: 2,
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain",
        description: "Asesoramiento estratégico para implementar blockchain",
        price: hre.ethers.parseEther("1.0"), // 1.0 ETH
        paymentToken: 0, // ETH
        category: 4,
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

    // 7. Guardar información de deployment
    const filename = `deployment-info-main-contracts.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Información guardada en: ${filename}`);

    // 8. Mostrar resumen
    console.log("\n🎉 DEPLOYMENT PRINCIPAL EXITOSO!");
    console.log("=" * 50);
    console.log(`📍 Red: ${network}`);
    console.log(`🔑 Deployer: ${deployer.address}`);
    console.log(`📅 Timestamp: ${deploymentInfo.timestamp}`);
    console.log("\n📋 Contratos desplegados:");
    console.log(`   ✅ ActivaToken: ${tokenAddress}`);
    console.log(`   ✅ ActivaNFT: ${nftAddress}`);
    console.log(`   ✅ ReputationSystem: ${reputationAddress}`);
    console.log(`   ✅ ActivaMarketplaceMultiToken: ${marketplaceAddress}`);
    console.log(`\n🎯 Servicios creados: ${deploymentInfo.services}`);
    console.log(`⭐ Reputación del deployer: ${deploymentInfo.reputation}`);

    console.log(`\n🌐 Verificar en Etherscan:`);
    console.log(`   ActivaToken: https://sepolia.etherscan.io/address/${tokenAddress}`);
    console.log(`   ActivaNFT: https://sepolia.etherscan.io/address/${nftAddress}`);
    console.log(`   Reputation: https://sepolia.etherscan.io/address/${reputationAddress}`);
    console.log(`   Marketplace: https://sepolia.etherscan.io/address/${marketplaceAddress}`);

    console.log("\n🚀 Sistema principal funcional (solo ETH)");

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
