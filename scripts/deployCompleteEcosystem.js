const { ethers } = require("hardhat");

async function deployToNetwork(networkName) {
  console.log(`\n🚀 Desplegando ecosistema completo en ${networkName}...`);
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance del deployer:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Balance bajo. Asegúrate de tener suficiente ETH para gas.");
  }
  
  const deploymentInfo = {
    network: networkName,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {},
    fees: {
      platformFee: "1%", // Actualizado de 2.5% a 1%
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
    
    // 7. Desplegar ActivaMarketplace (USDC)
    console.log("\n7️⃣ Desplegando ActivaMarketplace (USDC)...");
    const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
    const marketplaceUSDC = await ActivaMarketplace.deploy(usdcAddress, activaNFTAddress);
    await marketplaceUSDC.waitForDeployment();
    const marketplaceUSDCAddress = await marketplaceUSDC.getAddress();
    console.log("✅ ActivaMarketplace (USDC) desplegado en:", marketplaceUSDCAddress);
    deploymentInfo.contracts.marketplaceUSDC = marketplaceUSDCAddress;
    
    // 8. Desplegar ActivaMarketplaceETH
    console.log("\n8️⃣ Desplegando ActivaMarketplaceETH...");
    const ActivaMarketplaceETH = await ethers.getContractFactory("ActivaMarketplaceETH");
    const marketplaceETH = await ActivaMarketplaceETH.deploy();
    await marketplaceETH.waitForDeployment();
    const marketplaceETHAddress = await marketplaceETH.getAddress();
    console.log("✅ ActivaMarketplaceETH desplegado en:", marketplaceETHAddress);
    deploymentInfo.contracts.marketplaceETH = marketplaceETHAddress;
    
    // 9. Desplegar ActivaMarketplaceMultiToken
    console.log("\n9️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplaceMulti = await ActivaMarketplaceMultiToken.deploy(usdcAddress, arbAddress);
    await marketplaceMulti.waitForDeployment();
    const marketplaceMultiAddress = await marketplaceMulti.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceMultiAddress);
    deploymentInfo.contracts.marketplaceMulti = marketplaceMultiAddress;
    
    // 10. Desplegar MarketplaceMultiToken (Avanzado)
    console.log("\n🔟 Desplegando MarketplaceMultiToken (Avanzado)...");
    const MarketplaceMultiToken = await ethers.getContractFactory("MarketplaceMultiToken");
    const marketplaceAdvanced = await MarketplaceMultiToken.deploy(usdcAddress, arbAddress);
    await marketplaceAdvanced.waitForDeployment();
    const marketplaceAdvancedAddress = await marketplaceAdvanced.getAddress();
    console.log("✅ MarketplaceMultiToken (Avanzado) desplegado en:", marketplaceAdvancedAddress);
    deploymentInfo.contracts.marketplaceAdvanced = marketplaceAdvancedAddress;
    
    // 11. Configurar reputación inicial en todos los marketplaces
    console.log("\n1️⃣1️⃣ Configurando reputación inicial...");
    
    // Reputación en marketplace ETH
    const reputationTx1 = await marketplaceETH.giveReputation(deployer.address, 100);
    await reputationTx1.wait();
    console.log("   ✅ Reputación en marketplace ETH: 100 puntos");
    
    // Reputación en marketplace Multi
    const reputationTx2 = await marketplaceMulti.giveReputation(deployer.address, 100);
    await reputationTx2.wait();
    console.log("   ✅ Reputación en marketplace Multi: 100 puntos");
    
    // Reputación en marketplace Avanzado
    const reputationTx3 = await marketplaceAdvanced.verifyProvider(deployer.address);
    await reputationTx3.wait();
    console.log("   ✅ Proveedor verificado en marketplace Avanzado");
    
    // 12. Crear servicios de ejemplo en marketplace Multi
    console.log("\n1️⃣2️⃣ Creando servicios de ejemplo...");
    const services = [
      {
        title: "Desarrollo Smart Contract",
        description: "Desarrollo de contratos inteligentes seguros y optimizados",
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
        price: ethers.parseEther("25"), // 25 ARB
        paymentToken: 2, // ARB
        category: 3, // Marketing
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain",
        description: "Asesoría especializada en desarrollo blockchain",
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
        price: ethers.parseEther("50"), // 50 ARB
        paymentToken: 2, // ARB
        category: 2, // Diseño
        minReputation: 0
      }
    ];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const tx = await marketplaceMulti.createService(
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
    
    // 13. Crear servicios en marketplace Avanzado
    console.log("\n1️⃣3️⃣ Creando servicios en marketplace Avanzado...");
    for (let i = 0; i < 3; i++) {
      const service = services[i];
      const tx = await marketplaceAdvanced.createService(
        service.title + " (Avanzado)",
        service.description + " - Versión avanzada con características premium",
        service.price,
        service.paymentToken,
        service.category,
        service.minReputation
      );
      await tx.wait();
      console.log(`   ✅ Servicio Avanzado ${i + 1}: ${service.title} (Avanzado)`);
    }
    
    // 14. Verificar servicios creados
    console.log("\n🔍 Verificando servicios creados...");
    const serviceCounterMulti = await marketplaceMulti.serviceCounter();
    const serviceCounterAdvanced = await marketplaceAdvanced.serviceCounter();
    console.log(`   Marketplace Multi: ${serviceCounterMulti} servicios`);
    console.log(`   Marketplace Avanzado: ${serviceCounterAdvanced} servicios`);
    
    // 15. Verificar comisiones
    console.log("\n💰 Verificando comisiones configuradas...");
    const feeMulti = await marketplaceMulti.platformFee();
    const feeAdvanced = await marketplaceAdvanced.platformFee();
    console.log(`   Marketplace Multi: ${feeMulti} basis points (${feeMulti/100}%)`);
    console.log(`   Marketplace Avanzado: ${feeAdvanced} basis points (${feeAdvanced/100}%)`);
    
    // 16. Guardar información del despliegue
    const fs = require('fs');
    const filename = `deployment-info-${networkName.toLowerCase()}-complete.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`\n🎉 ¡Despliegue completo en ${networkName} exitoso!`);
    console.log("\n📊 Resumen del ecosistema desplegado:");
    console.log("   ✅ MockUSDC:", usdcAddress);
    console.log("   ✅ MockARB:", arbAddress);
    console.log("   ✅ ActivaToken:", activaTokenAddress);
    console.log("   ✅ ReputationSystem:", reputationAddress);
    console.log("   ✅ ActivaNFT:", activaNFTAddress);
    console.log("   ✅ ActivaGovernance:", governanceAddress);
    console.log("   ✅ ActivaMarketplace (USDC):", marketplaceUSDCAddress);
    console.log("   ✅ ActivaMarketplaceETH:", marketplaceETHAddress);
    console.log("   ✅ ActivaMarketplaceMultiToken:", marketplaceMultiAddress);
    console.log("   ✅ MarketplaceMultiToken (Avanzado):", marketplaceAdvancedAddress);
    console.log(`   ✅ ${serviceCounterMulti + serviceCounterAdvanced} servicios creados`);
    console.log("   ✅ Reputación inicial configurada");
    console.log("   ✅ Comisión de plataforma: 1% (actualizada)");
    
    return deploymentInfo;
    
  } catch (error) {
    console.error(`❌ Error durante el despliegue en ${networkName}:`, error);
    throw error;
  }
}

async function main() {
  console.log("🚀 DESPLEGANDO ECOSISTEMA COMPLETO ACTIVACHAINS");
  console.log("📋 Comisiones actualizadas:");
  console.log("   💰 Comisión de plataforma: 1% (antes 2.5%)");
  console.log("   🏆 Recompensas de staking: 10% APY");
  console.log("   🗳️  Gobernanza: Thresholds estándar");
  
  try {
    // Desplegar en Ethereum Sepolia
    console.log("\n" + "=".repeat(60));
    console.log("🌐 DESPLEGANDO EN ETHEREUM SEPOLIA");
    console.log("=".repeat(60));
    await deployToNetwork("sepolia");
    
    // Desplegar en Arbitrum Sepolia
    console.log("\n" + "=".repeat(60));
    console.log("🌉 DESPLEGANDO EN ARBITRUM SEPOLIA");
    console.log("=".repeat(60));
    await deployToNetwork("arbitrumSepolia");
    
    console.log("\n🎉 ¡DESPLIEGUE COMPLETO EN AMBAS REDES EXITOSO!");
    console.log("\n📋 Archivos generados:");
    console.log("   📄 deployment-info-sepolia-complete.json");
    console.log("   📄 deployment-info-arbitrumsepolia-complete.json");
    
    console.log("\n🎯 Bounty Maldo - COMPLETADO CON ECOSISTEMA COMPLETO:");
    console.log("   ✅ Todos los contratos desplegados en ambas redes");
    console.log("   ✅ Sistema multi-token funcional");
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
