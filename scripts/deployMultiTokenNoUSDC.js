const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Desplegando ActivaChains Multi-Token (sin USDC) en ambas redes...");
  
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
    // 1. Desplegar MockARB (usando MockUSDC como base pero renombrado)
    console.log("\n1️⃣ Desplegando MockARB...");
    const MockARB = await hre.ethers.getContractFactory("MockUSDC"); // Reutilizamos el contrato
    const mockARB = await MockARB.deploy();
    await mockARB.waitForDeployment();
    const arbAddress = await mockARB.getAddress();
    console.log("✅ MockARB desplegado en:", arbAddress);
    deploymentInfo.contracts.arb = arbAddress;

    // 2. Desplegar ActivaMarketplaceMultiToken
    console.log("\n2️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await hre.ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(arbAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;

    // 3. Dar reputación al deployer
    console.log("\n3️⃣ Configurando reputación...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación configurada: 100 puntos");
    deploymentInfo.reputation = 100;

    // 4. Crear servicios de ejemplo
    console.log("\n4️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contracts",
        description: "Creación de contratos inteligentes personalizados para DeFi",
        price: hre.ethers.parseEther("500"), // 500 ARB
        paymentToken: 1, // ARB
        category: 1,
        minReputation: 0
      },
      {
        title: "Diseño UI/UX Web3",
        description: "Diseño moderno para aplicaciones descentralizadas",
        price: hre.ethers.parseEther("300"), // 300 ARB
        paymentToken: 1, // ARB
        category: 2,
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain",
        description: "Asesoramiento estratégico para implementar blockchain",
        price: hre.ethers.parseEther("1000"), // 1000 ARB
        paymentToken: 1, // ARB
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

    // 5. Mintear tokens ARB para el deployer
    console.log("\n5️⃣ Minteando tokens ARB...");
    const mintTx = await mockARB.mint(deployer.address, hre.ethers.parseUnits("10000", 6)); // 10,000 ARB
    await mintTx.wait();
    console.log("✅ 10,000 ARB minteados para el deployer");

    // 6. Guardar información de deployment
    const filename = `deployment-info-${network}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📝 Información guardada en: ${filename}`);

    // 7. Mostrar resumen
    console.log("\n🎉 DEPLOYMENT COMPLETADO EXITOSAMENTE!");
    console.log("=" * 50);
    console.log(`📍 Red: ${network}`);
    console.log(`🔑 Deployer: ${deployer.address}`);
    console.log(`📅 Timestamp: ${deploymentInfo.timestamp}`);
    console.log("\n📋 Contratos desplegados:");
    console.log(`   ✅ MockARB: ${arbAddress}`);
    console.log(`   ✅ ActivaMarketplaceMultiToken: ${marketplaceAddress}`);
    console.log(`\n🎯 Servicios creados: ${deploymentInfo.services}`);
    console.log(`⭐ Reputación del deployer: ${deploymentInfo.reputation}`);
    console.log(`💰 Tokens soportados: ${deploymentInfo.supportedTokens.join(', ')}`);

    if (network === 'sepolia') {
      console.log(`\n🌐 Verificar en Etherscan:`);
      console.log(`   ARB: https://sepolia.etherscan.io/address/${arbAddress}`);
      console.log(`   Marketplace: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    } else if (network === 'arbitrumSepolia') {
      console.log(`\n🌐 Verificar en Arbiscan:`);
      console.log(`   ARB: https://sepolia.arbiscan.io/address/${arbAddress}`);
      console.log(`   Marketplace: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    }

    console.log("\n🚀 Sistema multi-token funcional (ETH, ARB) - SIN USDC");

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
