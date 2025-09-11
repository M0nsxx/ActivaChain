const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Desplegando ActivaChains en red local para testing...");
  
  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta deployer:", deployer.address);
  
  // Verificar balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  const deploymentInfo = {
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    contracts: {},
    services: {
      total: 0,
      created: 0
    },
    timestamp: new Date().toISOString()
  };
  
  try {
    // 1. Desplegar MockUSDC
    console.log("\n📦 1/5 Desplegando MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    deploymentInfo.contracts.usdc = usdcAddress;
    console.log("✅ MockUSDC desplegado en:", usdcAddress);
    
    // 2. Desplegar ActivaToken
    console.log("\n📦 2/5 Desplegando ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy("Activa Token", "ACTIVA", ethers.parseEther("1000000"));
    await activaToken.waitForDeployment();
    const activaTokenAddress = await activaToken.getAddress();
    deploymentInfo.contracts.activaToken = activaTokenAddress;
    console.log("✅ ActivaToken desplegado en:", activaTokenAddress);
    
    // 3. Desplegar ReputationSystem
    console.log("\n📦 3/5 Desplegando ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    deploymentInfo.contracts.reputation = reputationAddress;
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    
    // 4. Desplegar ActivaNFT
    console.log("\n📦 4/5 Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const activaNFTAddress = await activaNFT.getAddress();
    deploymentInfo.contracts.activaNFT = activaNFTAddress;
    console.log("✅ ActivaNFT desplegado en:", activaNFTAddress);
    
    // 5. Desplegar ActivaMarketplace
    console.log("\n📦 5/5 Desplegando ActivaMarketplace...");
    const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
    const marketplace = await ActivaMarketplace.deploy(usdcAddress, activaNFTAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    deploymentInfo.contracts.marketplace = marketplaceAddress;
    console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
    
    // Crear servicios de prueba
    console.log("\n🎯 Creando servicios de prueba...");
    
    const services = [
      {
        title: "Desarrollo Smart Contract Básico",
        description: "Creación de smart contracts simples para proyectos DeFi. Incluye testing y deployment.",
        priceInUSDC: BigInt(100 * 1e6), // $100 USDC
        category: 1,
        minReputation: 0
      },
      {
        title: "UI/UX para DApps",
        description: "Diseño de interfaces modernas para aplicaciones descentralizadas con glassmorphism.",
        priceInUSDC: BigInt(200 * 1e6), // $200 USDC
        category: 2,
        minReputation: 0
      },
      {
        title: "Marketing Web3",
        description: "Estrategias de marketing digital para proyectos blockchain y DeFi.",
        priceInUSDC: BigInt(150 * 1e6), // $150 USDC
        category: 3,
        minReputation: 0
      },
      {
        title: "Consultoría Blockchain",
        description: "Asesoría técnica para implementación de soluciones blockchain empresariales.",
        priceInUSDC: BigInt(300 * 1e6), // $300 USDC
        category: 4,
        minReputation: 0
      }
    ];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      try {
        console.log(`   ${i + 1}/${services.length}: ${service.title}`);
        const tx = await marketplace.createService(
          service.title,
          service.description,
          service.priceInUSDC,
          service.category,
          service.minReputation
        );
        await tx.wait();
        console.log(`   ✅ Creado exitosamente`);
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Verificar servicios creados
    const serviceCounter = await marketplace.serviceCounter();
    deploymentInfo.services.total = Number(serviceCounter);
    deploymentInfo.services.created = Number(serviceCounter);
    console.log(`\n📊 Total de servicios creados: ${serviceCounter}`);
    
    // Guardar información de despliegue
    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 deployment-info.json actualizado");
    
    // Mostrar resumen
    console.log("\n🎉 ¡Despliegue completo exitoso en localhost!");
    console.log("📋 Resumen de contratos:");
    console.log("   USDC:", usdcAddress);
    console.log("   ActivaToken:", activaTokenAddress);
    console.log("   ReputationSystem:", reputationAddress);
    console.log("   ActivaNFT:", activaNFTAddress);
    console.log("   ActivaMarketplace:", marketplaceAddress);
    console.log("\n💡 Para desplegar en Sepolia, necesitas una API key de Alchemy o QuickNode");
    
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
