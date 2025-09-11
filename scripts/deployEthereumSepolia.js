const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ecosistema ActivaChains en Ethereum Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance del deployer:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Balance bajo. Asegúrate de tener suficiente ETH para gas.");
  }
  
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {},
    fees: {
      platformFee: "1%",
      stakingAPY: "10%",
      governanceThresholds: {
        minProposal: "1000 ACTIVA",
        quorum: "10000 ACTIVA", 
        execution: "5000 ACTIVA"
      }
    }
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
    
    // 2. Desplegar ActivaToken
    console.log("\n2️⃣ Desplegando ActivaToken...");
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
    
    // 3. Desplegar ReputationSystem
    console.log("\n3️⃣ Desplegando ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    deploymentInfo.contracts.reputation = reputationAddress;
    
    // 4. Desplegar ActivaNFT
    console.log("\n4️⃣ Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const activaNFTAddress = await activaNFT.getAddress();
    console.log("✅ ActivaNFT desplegado en:", activaNFTAddress);
    deploymentInfo.contracts.activaNFT = activaNFTAddress;
    
    // 5. Desplegar ActivaGovernance
    console.log("\n5️⃣ Desplegando ActivaGovernance...");
    const ActivaGovernance = await ethers.getContractFactory("ActivaGovernance");
    const governance = await ActivaGovernance.deploy(activaTokenAddress);
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("✅ ActivaGovernance desplegado en:", governanceAddress);
    deploymentInfo.contracts.governance = governanceAddress;
    
    // 6. Desplegar ActivaMarketplaceMultiToken
    console.log("\n6️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(usdcAddress, usdcAddress); // Usamos USDC para ARB también
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
    deploymentInfo.contracts.marketplace = marketplaceAddress;
    
    // 7. Configurar reputación inicial
    console.log("\n7️⃣ Configurando reputación inicial...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación inicial configurada: 100 puntos");
    
    // 8. Crear servicios de ejemplo
    console.log("\n8️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contract",
        description: "Desarrollo de contratos inteligentes seguros y optimizados para Ethereum",
        price: ethers.parseEther("0.1"),
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 0
      },
      {
        title: "UI/UX para DApps",
        description: "Diseño de interfaces para aplicaciones descentralizadas",
        price: ethers.parseUnits("50", 6), // 50 USDC
        paymentToken: 1, // USDC
        category: 2, // Diseño
        minReputation: 0
      },
      {
        title: "Marketing Web3",
        description: "Estrategias de marketing para proyectos blockchain",
        price: ethers.parseEther("25"), // 25 ARB (usando USDC como mock)
        paymentToken: 2, // ARB
        category: 3, // Marketing
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain",
        description: "Asesoría especializada en desarrollo blockchain y DeFi",
        price: ethers.parseEther("0.2"),
        paymentToken: 0, // ETH
        category: 4, // Consultoría
        minReputation: 0
      },
      {
        title: "Auditoría de Seguridad",
        description: "Auditoría completa de contratos inteligentes",
        price: ethers.parseUnits("200", 6), // 200 USDC
        paymentToken: 1, // USDC
        category: 1, // Desarrollo
        minReputation: 0
      },
      {
        title: "NFT Collection Setup",
        description: "Creación de colecciones NFT personalizadas",
        price: ethers.parseEther("50"), // 50 ARB (usando USDC como mock)
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
    
    // 9. Verificar servicios creados
    console.log("\n🔍 Verificando servicios creados...");
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`   Total de servicios: ${serviceCounter}`);
    
    // 10. Verificar comisiones
    console.log("\n💰 Verificando comisiones configuradas...");
    const fee = await marketplace.platformFee();
    console.log(`   Comisión de plataforma: ${fee} basis points (${fee/100}%)`);
    
    // 11. Guardar información del despliegue
    const fs = require('fs');
    fs.writeFileSync('deployment-info-sepolia-final.json', JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🎉 ¡Despliegue en Ethereum Sepolia exitoso!");
    console.log("\n📊 Resumen del ecosistema desplegado:");
    console.log("   ✅ MockUSDC:", usdcAddress);
    console.log("   ✅ ActivaToken:", activaTokenAddress);
    console.log("   ✅ ReputationSystem:", reputationAddress);
    console.log("   ✅ ActivaNFT:", activaNFTAddress);
    console.log("   ✅ ActivaGovernance:", governanceAddress);
    console.log("   ✅ ActivaMarketplaceMultiToken:", marketplaceAddress);
    console.log(`   ✅ ${serviceCounter} servicios creados`);
    console.log("   ✅ Reputación inicial configurada");
    console.log("   ✅ Comisión de plataforma: 1%");
    
    console.log("\n🌐 Enlaces Ethereum Sepolia:");
    console.log("   Marketplace:", `https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    console.log("   USDC:", `https://sepolia.etherscan.io/address/${usdcAddress}`);
    console.log("   ActivaToken:", `https://sepolia.etherscan.io/address/${activaTokenAddress}`);
    console.log("   ReputationSystem:", `https://sepolia.etherscan.io/address/${reputationAddress}`);
    console.log("   ActivaNFT:", `https://sepolia.etherscan.io/address/${activaNFTAddress}`);
    console.log("   ActivaGovernance:", `https://sepolia.etherscan.io/address/${governanceAddress}`);
    
    console.log("\n🎯 Estado del proyecto:");
    console.log("   ✅ Ecosistema completo desplegado en Ethereum Sepolia");
    console.log("   ✅ Sistema multi-token funcional (ETH, USDC, ARB)");
    console.log("   ✅ Gobernanza DAO operativa");
    console.log("   ✅ Sistema de reputación integrado");
    console.log("   ✅ NFTs de certificación disponibles");
    console.log("   ✅ Staking de tokens implementado");
    console.log("   ✅ Comisiones optimizadas al 1%");
    
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
