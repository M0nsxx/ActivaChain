const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Desplegando ActivaChain desde cero...");
  
  // Obtener la cuenta deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta deployer:", deployer.address);
  
  // 1. Desplegar MockUSDC
  console.log("\n1️⃣ Desplegando MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("✅ MockUSDC desplegado en:", usdcAddress);
  
  // 2. Desplegar ActivaNFT
  console.log("\n2️⃣ Desplegando ActivaNFT...");
  const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
  const activaNFT = await ActivaNFT.deploy();
  await activaNFT.waitForDeployment();
  const activaNFTAddress = await activaNFT.getAddress();
  console.log("✅ ActivaNFT desplegado en:", activaNFTAddress);
  
  // 3. Desplegar ReputationSystem
  console.log("\n3️⃣ Desplegando ReputationSystem...");
  const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
  const reputation = await ReputationSystem.deploy(activaNFTAddress);
  await reputation.waitForDeployment();
  const reputationAddress = await reputation.getAddress();
  console.log("✅ ReputationSystem desplegado en:", reputationAddress);
  
  // 4. Desplegar ActivaToken
  console.log("\n4️⃣ Desplegando ActivaToken...");
  const ActivaToken = await ethers.getContractFactory("ActivaToken");
  const activaToken = await ActivaToken.deploy(
    "ActivaChain Token",
    "ACTIVA",
    ethers.parseEther("1000000") // 1M tokens
  );
  await activaToken.waitForDeployment();
  const activaTokenAddress = await activaToken.getAddress();
  console.log("✅ ActivaToken desplegado en:", activaTokenAddress);
  
  // 5. Desplegar ActivaMarketplace
  console.log("\n5️⃣ Desplegando ActivaMarketplace...");
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = await ActivaMarketplace.deploy(usdcAddress, activaNFTAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
  
  // 6. Crear servicios de prueba
  console.log("\n6️⃣ Creando servicios de prueba...");
  
  const services = [
    {
      title: "Servicio de Prueba Sepolia",
      description: "Servicio de prueba con costo mínimo para testing en Sepolia. Ideal para probar transacciones.",
      priceInUSDC: BigInt(1), // 0.000001 USDC
      category: 1,
      minReputation: 0
    },
    {
      title: "Desarrollo Smart Contract Básico",
      description: "Creación de smart contracts simples para proyectos DeFi",
      priceInUSDC: BigInt(100 * 1e6), // $100 USDC
      category: 1,
      minReputation: 0
    },
    {
      title: "Auditoría de Seguridad",
      description: "Revisión de seguridad para contratos inteligentes",
      priceInUSDC: BigInt(500 * 1e6), // $500 USDC
      category: 1,
      minReputation: 0
    },
    {
      title: "UI/UX para DApps",
      description: "Diseño de interfaces para aplicaciones descentralizadas",
      priceInUSDC: BigInt(200 * 1e6), // $200 USDC
      category: 2,
      minReputation: 0
    },
    {
      title: "Marketing Web3",
      description: "Estrategias de marketing para proyectos blockchain",
      priceInUSDC: BigInt(150 * 1e6), // $150 USDC
      category: 3,
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
  console.log(`\n📊 Total de servicios creados: ${serviceCounter}`);
  
  // Guardar direcciones
  const deploymentInfo = {
    network: "sepolia",
    deployer: deployer.address,
    contracts: {
      usdc: usdcAddress,
      activaNFT: activaNFTAddress,
      reputation: reputationAddress,
      activaToken: activaTokenAddress,
      marketplace: marketplaceAddress
    },
    servicesCreated: Number(serviceCounter),
    timestamp: new Date().toISOString()
  };
  
  const deploymentPath = path.join(__dirname, "..", "deployment-sepolia.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Información de despliegue guardada en:", deploymentPath);
  
  console.log("\n🎉 ¡Despliegue completo exitoso!");
  console.log("📍 Direcciones de contratos:");
  console.log("   USDC:", usdcAddress);
  console.log("   ActivaNFT:", activaNFTAddress);
  console.log("   ReputationSystem:", reputationAddress);
  console.log("   ActivaToken:", activaTokenAddress);
  console.log("   Marketplace:", marketplaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
