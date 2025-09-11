const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Redesplegando ActivaMarketplace...");
  
  // Obtener la cuenta deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);
  
  // Direcciones de contratos existentes (reemplaza con las tuyas)
  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // MockUSDC
  const ACTIVA_NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ActivaNFT
  
  console.log("📋 Direcciones de contratos:");
  console.log("   USDC:", USDC_ADDRESS);
  console.log("   ActivaNFT:", ACTIVA_NFT_ADDRESS);
  
  // Desplegar ActivaMarketplace
  console.log("\n📦 Desplegando ActivaMarketplace...");
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = await ActivaMarketplace.deploy(USDC_ADDRESS, ACTIVA_NFT_ADDRESS);
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
  
  // Crear algunos servicios de prueba
  console.log("\n🎯 Creando servicios de prueba...");
  
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
  
  console.log("\n🎉 ¡Marketplace redesplegado y poblado exitosamente!");
  console.log("📍 Dirección del marketplace:", marketplaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
