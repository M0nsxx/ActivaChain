const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Creando servicios reales en el marketplace...");
  
  // Obtener la cuenta deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);
  
  // Dirección del marketplace desplegado
  const MARKETPLACE_ADDRESS = "0x721aE67eC40BA624486CF9a2fE64309bB11536F3";
  
  // Conectar al contrato
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = ActivaMarketplace.attach(MARKETPLACE_ADDRESS);
  
  // Verificar servicios existentes
  const serviceCounter = await marketplace.serviceCounter();
  console.log("📊 Servicios existentes:", Number(serviceCounter));
  
  // Crear servicios reales
  const services = [
    {
      title: "Servicio de Prueba Sepolia",
      description: "Servicio de prueba con costo mínimo para testing en Sepolia. Ideal para probar transacciones reales.",
      priceInUSDC: BigInt(1), // 0.000001 USDC
      category: 1,
      minReputation: 0
    },
    {
      title: "Desarrollo Smart Contract Básico",
      description: "Creación de smart contracts simples para proyectos DeFi. Incluye testing y deployment.",
      priceInUSDC: BigInt(100 * 1e6), // $100 USDC
      category: 1,
      minReputation: 0
    },
    {
      title: "Auditoría de Seguridad",
      description: "Revisión completa de seguridad para contratos inteligentes. Análisis de vulnerabilidades.",
      priceInUSDC: BigInt(500 * 1e6), // $500 USDC
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
  
  console.log("\n🎯 Creando servicios...");
  
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
  const finalServiceCounter = await marketplace.serviceCounter();
  console.log(`\n📊 Total de servicios en el contrato: ${finalServiceCounter}`);
  
  console.log("\n🎉 ¡Servicios reales creados exitosamente!");
  console.log("📍 Marketplace:", MARKETPLACE_ADDRESS);
  console.log("🌐 Ahora puedes comprar servicios reales en el frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
