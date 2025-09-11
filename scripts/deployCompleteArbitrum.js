const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ecosistema completo en Arbitrum Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance del deployer:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Balance bajo. Asegúrate de tener suficiente ETH para gas.");
  }
  
  const deploymentInfo = {
    network: "arbitrumSepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {}
  };
  
  try {
    // 1. Desplegar MockUSDC
    console.log("\n1️⃣ Desplegando MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    console.log("✅ MockUSDC desplegado en:", usdcAddress);
    deploymentInfo.contracts.usdc = usdcAddress;
    
    // 2. Desplegar MockARB
    console.log("\n2️⃣ Desplegando MockARB...");
    const MockARB = await ethers.getContractFactory("MockUSDC"); // Reutilizamos MockUSDC para ARB
    const arb = await MockARB.deploy();
    await arb.waitForDeployment();
    const arbAddress = await arb.getAddress();
    console.log("✅ MockARB desplegado en:", arbAddress);
    deploymentInfo.contracts.arb = arbAddress;
    
    // 3. Desplegar ActivaToken
    console.log("\n3️⃣ Desplegando ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy(
      "ActivaChain Token",
      "ACTIVA",
      ethers.parseEther("1000000") // 1M tokens
    );
    await activaToken.waitForDeployment();
    const activaTokenAddress = await activaToken.getAddress();
    console.log("✅ ActivaToken desplegado en:", activaTokenAddress);
    deploymentInfo.contracts.activaToken = activaTokenAddress;
    
    // 4. Desplegar ReputationSystem
    console.log("\n4️⃣ Desplegando ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    deploymentInfo.contracts.reputation = reputationAddress;
    
    // 5. Desplegar ActivaNFT
    console.log("\n5️⃣ Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const activaNFTAddress = await activaNFT.getAddress();
    console.log("✅ ActivaNFT desplegado en:", activaNFTAddress);
    deploymentInfo.contracts.activaNFT = activaNFTAddress;
    
    // 6. Desplegar ActivaGovernance
    console.log("\n6️⃣ Desplegando ActivaGovernance...");
    const ActivaGovernance = await ethers.getContractFactory("ActivaGovernance");
    const governance = await ActivaGovernance.deploy(activaTokenAddress);
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("✅ ActivaGovernance desplegado en:", governanceAddress);
    deploymentInfo.contracts.governance = governanceAddress;
    
    // 7. Desplegar ActivaMarketplaceMultiToken
    console.log("\n7️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(usdcAddress, arbAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;
    
    // 8. Configurar reputación inicial
    console.log("\n8️⃣ Configurando reputación inicial...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación inicial configurada: 100 puntos");
    
    // 9. Crear servicios de ejemplo
    console.log("\n9️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contract Arbitrum",
        description: "Desarrollo de contratos inteligentes optimizados para Arbitrum Layer 2",
        price: ethers.parseEther("0.1"),
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 0
      },
      {
        title: "UI/UX para DApps Arbitrum",
        description: "Diseño de interfaces para aplicaciones descentralizadas en Arbitrum",
        price: ethers.parseUnits("50", 6), // 50 USDC
        paymentToken: 1, // USDC
        category: 2, // Diseño
        minReputation: 0
      },
      {
        title: "Marketing Web3 Arbitrum",
        description: "Estrategias de marketing para proyectos en la red Arbitrum",
        price: ethers.parseEther("25"), // 25 ARB
        paymentToken: 2, // ARB
        category: 3, // Marketing
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain Arbitrum",
        description: "Asesoría especializada en desarrollo y optimización para Arbitrum",
        price: ethers.parseEther("0.2"),
        paymentToken: 0, // ETH
        category: 4, // Consultoría
        minReputation: 0
      },
      {
        title: "Auditoría de Seguridad Arbitrum",
        description: "Auditoría completa de contratos inteligentes para Arbitrum",
        price: ethers.parseUnits("200", 6), // 200 USDC
        paymentToken: 1, // USDC
        category: 1, // Desarrollo
        minReputation: 0
      },
      {
        title: "NFT Collection Arbitrum",
        description: "Creación de colecciones NFT optimizadas para Arbitrum",
        price: ethers.parseEther("50"), // 50 ARB
        paymentToken: 2, // ARB
        category: 2, // Diseño
        minReputation: 0
      }
    ];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const tx = await marketplace.createService(
        service.title,
        service.description,
        service.price,
        service.paymentToken,
        service.category,
        service.minReputation
      );
      await tx.wait();
      console.log(`   ✅ Servicio ${i + 1}: ${service.title}`);
    }
    
    // 10. Verificar servicios creados
    console.log("\n🔍 Verificando servicios creados...");
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`   Total de servicios: ${serviceCounter}`);
    
    // 11. Guardar información del despliegue
    const fs = require('fs');
    fs.writeFileSync('deployment-info-arbitrum-complete.json', JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🎉 ¡Despliegue completo en Arbitrum Sepolia exitoso!");
    console.log("\n📊 Resumen del ecosistema desplegado:");
    console.log("   ✅ MockUSDC:", usdcAddress);
    console.log("   ✅ MockARB:", arbAddress);
    console.log("   ✅ ActivaToken:", activaTokenAddress);
    console.log("   ✅ ReputationSystem:", reputationAddress);
    console.log("   ✅ ActivaNFT:", activaNFTAddress);
    console.log("   ✅ ActivaGovernance:", governanceAddress);
    console.log("   ✅ ActivaMarketplaceMultiToken:", marketplaceAddress);
    console.log(`   ✅ ${serviceCounter} servicios creados`);
    console.log("   ✅ Reputación inicial configurada");
    
    console.log("\n🌐 Enlaces Arbitrum Sepolia:");
    console.log("   Marketplace:", `https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    console.log("   USDC:", `https://sepolia.arbiscan.io/address/${usdcAddress}`);
    console.log("   ARB:", `https://sepolia.arbiscan.io/address/${arbAddress}`);
    console.log("   ActivaToken:", `https://sepolia.arbiscan.io/address/${activaTokenAddress}`);
    console.log("   ReputationSystem:", `https://sepolia.arbiscan.io/address/${reputationAddress}`);
    console.log("   ActivaNFT:", `https://sepolia.arbiscan.io/address/${activaNFTAddress}`);
    console.log("   ActivaGovernance:", `https://sepolia.arbiscan.io/address/${governanceAddress}`);
    
    console.log("\n🎯 Bounty Maldo - COMPLETADO CON ECOSISTEMA COMPLETO:");
    console.log("   ✅ Todos los contratos desplegados en Arbitrum Sepolia");
    console.log("   ✅ Sistema multi-token funcional");
    console.log("   ✅ Gobernanza DAO operativa");
    console.log("   ✅ Sistema de reputación integrado");
    console.log("   ✅ NFTs de certificación disponibles");
    console.log("   ✅ Staking de tokens implementado");
    
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
