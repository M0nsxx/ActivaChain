const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaMarketplace con Hardhat...");
  
  // Obtener el deployer desde Hardhat
  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta deployer:", deployer.address);
  
  // Verificar balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Sin balance para desplegar");
    return;
  }
  
  // Direcciones de contratos existentes
  const USDC_ADDRESS = "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953";
  const ACTIVA_NFT_ADDRESS = "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28";
  
  console.log("📋 Usando contratos existentes:");
  console.log("   USDC:", USDC_ADDRESS);
  console.log("   ActivaNFT:", ACTIVA_NFT_ADDRESS);
  
  // Desplegar ActivaMarketplace
  console.log("\n📦 Desplegando ActivaMarketplace...");
  
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  
  // Desplegar sin configuración de gas específica
  const marketplace = await ActivaMarketplace.deploy(USDC_ADDRESS, ACTIVA_NFT_ADDRESS);
  
  console.log("⏳ Esperando confirmación...");
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
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
  
  // Actualizar deployment-info.json
  const fs = require("fs");
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"));
  deploymentInfo.contracts.marketplace = marketplaceAddress;
  deploymentInfo.services.total = Number(serviceCounter);
  deploymentInfo.services.created = Number(serviceCounter);
  deploymentInfo.timestamp = new Date().toISOString();
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 deployment-info.json actualizado");
  
  console.log("\n🎉 ¡Marketplace desplegado exitosamente!");
  console.log("📍 Nueva dirección del marketplace:", marketplaceAddress);
  console.log("🌐 Verificar en: https://sepolia.etherscan.io/address/" + marketplaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
