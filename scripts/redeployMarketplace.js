const { ethers } = require("hardhat");
const fs = require("fs");

// Direcciones de contratos existentes
const EXISTING_CONTRACTS = {
  usdc: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
  reputation: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
  activaToken: "0x031acF11ade235b00196A0605e8CF136a115F168"
};

// Servicios demo
const DEMO_SERVICES = [
  {
    title: "Desarrollo Smart Contracts DeFi",
    description: "Creación de contratos inteligentes para protocolos DeFi. Solidity, OpenZeppelin, auditorías de seguridad.",
    priceInUSDC: 2500,
    category: 1,
    minReputation: 0
  },
  {
    title: "DApps con Next.js y Web3",
    description: "Aplicaciones descentralizadas con frontend moderno. Next.js 15, TypeScript, Wagmi, Tailwind CSS.",
    priceInUSDC: 1800,
    category: 1,
    minReputation: 0
  },
  {
    title: "Auditoría Smart Contracts",
    description: "Auditoría completa de seguridad para contratos inteligentes. Análisis de vulnerabilidades y gas optimization.",
    priceInUSDC: 3500,
    category: 1,
    minReputation: 0
  },
  {
    title: "Desarrollo NFTs Avanzados",
    description: "Creación de colecciones NFT con metadata dinámica, traits raros y marketplace personalizado.",
    priceInUSDC: 1200,
    category: 1,
    minReputation: 0
  },
  {
    title: "Bridge Cross-Chain",
    description: "Implementación de bridge para transferencias entre Ethereum, Arbitrum y Polygon con validación multicapa.",
    priceInUSDC: 5000,
    category: 1,
    minReputation: 0
  },
  {
    title: "UI/UX para Aplicaciones Web3",
    description: "Diseño completo de interfaces para DApps. Wireframes, prototipos interactivos y guías de diseño.",
    priceInUSDC: 800,
    category: 2,
    minReputation: 0
  },
  {
    title: "Branding y Identidad DeFi",
    description: "Desarrollo de identidad visual para proyectos DeFi. Logo, paleta de colores y tipografías.",
    priceInUSDC: 600,
    category: 2,
    minReputation: 0
  },
  {
    title: "Arte Digital para NFTs",
    description: "Creación de arte digital para colecciones NFT. Estilos únicos, traits personalizados y arte generativo.",
    priceInUSDC: 400,
    category: 2,
    minReputation: 0
  },
  {
    title: "Landing Pages para ICOs",
    description: "Landing pages optimizadas para lanzamientos de tokens. Diseño responsive y integración Web3.",
    priceInUSDC: 700,
    category: 2,
    minReputation: 0
  },
  {
    title: "Interfaces para DAOs",
    description: "Diseño de interfaces para gobernanza descentralizada. Dashboards de votación y propuestas.",
    priceInUSDC: 1000,
    category: 2,
    minReputation: 0
  },
  {
    title: "Estrategia Marketing DeFi",
    description: "Estrategia integral de marketing para proyectos DeFi. Community building y partnerships.",
    priceInUSDC: 1500,
    category: 3,
    minReputation: 0
  },
  {
    title: "Community Management Web3",
    description: "Gestión completa de comunidades Web3 en Discord, Telegram y Twitter con engagement.",
    priceInUSDC: 500,
    category: 3,
    minReputation: 0
  },
  {
    title: "Content Marketing Blockchain",
    description: "Creación de contenido educativo sobre blockchain y DeFi. Artículos, videos e infografías.",
    priceInUSDC: 800,
    category: 3,
    minReputation: 0
  },
  {
    title: "Influencer Marketing Web3",
    description: "Conexión con influencers del ecosistema crypto. Partnerships y campañas pagadas.",
    priceInUSDC: 1200,
    category: 3,
    minReputation: 0
  },
  {
    title: "Growth Hacking para DApps",
    description: "Estrategias de crecimiento para aplicaciones descentralizadas. Viral loops y conversión.",
    priceInUSDC: 1000,
    category: 3,
    minReputation: 0
  },
  {
    title: "Consultoría Blockchain",
    description: "Asesoramiento estratégico para implementación de blockchain. Análisis de casos de uso y ROI.",
    priceInUSDC: 2000,
    category: 4,
    minReputation: 0
  },
  {
    title: "Tokenomics y Economía",
    description: "Diseño de tokenomics para proyectos Web3. Distribución, vesting y modelos económicos.",
    priceInUSDC: 1800,
    category: 4,
    minReputation: 0
  },
  {
    title: "Consultoría Legal Web3",
    description: "Asesoramiento legal para proyectos blockchain. Compliance y regulaciones.",
    priceInUSDC: 3000,
    category: 4,
    minReputation: 0
  },
  {
    title: "Seguridad Blockchain",
    description: "Auditoría y consultoría de seguridad. Análisis de riesgos y mejores prácticas.",
    priceInUSDC: 2500,
    category: 4,
    minReputation: 0
  },
  {
    title: "Gobernanza DAO",
    description: "Diseño e implementación de sistemas de gobernanza para DAOs. Votación y propuestas.",
    priceInUSDC: 1500,
    category: 4,
    minReputation: 0
  }
];

async function main() {
  console.log("🚀 Redesplegando ActivaMarketplace modificado...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // 1. Redesplegar ActivaMarketplace
  console.log("\n1️⃣ Redesplegando ActivaMarketplace...");
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = await ActivaMarketplace.deploy(
    EXISTING_CONTRACTS.usdc,
    EXISTING_CONTRACTS.activaNFT
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplace redesplegado a:", marketplaceAddress);

  // 2. Crear servicios demo
  console.log("\n2️⃣ Creando servicios demo...");
  let servicesCreated = 0;

  for (let i = 0; i < DEMO_SERVICES.length; i++) {
    const service = DEMO_SERVICES[i];
    
    try {
      console.log(`   Creando servicio ${i + 1}/20: ${service.title}`);
      
      const tx = await marketplace.createService(
        service.title,
        service.description,
        ethers.parseUnits(service.priceInUSDC.toString(), 6),
        service.category,
        service.minReputation
      );
      
      await tx.wait();
      servicesCreated++;
      console.log(`   ✅ Creado: ${service.title}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // 3. Verificar servicios creados
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`\n📊 Total de servicios creados: ${serviceCounter}`);

  // 4. Mostrar algunos servicios
  console.log("\n📋 Servicios disponibles:");
  for (let i = 1; i <= Math.min(Number(serviceCounter), 5); i++) {
    const service = await marketplace.services(i);
    console.log(`   ${i}. ${service.title} - $${Number(service.priceInUSDC) / 1e6} USDC`);
  }

  // 5. Guardar información actualizada
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    contracts: {
      ...EXISTING_CONTRACTS,
      marketplace: marketplaceAddress
    },
    services: {
      total: Number(serviceCounter),
      created: servicesCreated
    },
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Deployment info actualizada");

  // 6. Actualizar variables de entorno
  console.log("\n6️⃣ Actualizando variables de entorno...");
  const { updateEnvFile } = require("./updateEnv");
  updateEnvFile(deploymentInfo);

  console.log("\n🎉 ¡MARKETPLACE REDESPLEGADO CON SERVICIOS!");
  console.log("=" * 50);
  console.log("📋 Contratos actualizados:");
  console.log(`   Marketplace: ${marketplaceAddress}`);
  console.log(`   USDC: ${EXISTING_CONTRACTS.usdc}`);
  console.log(`   ActivaNFT: ${EXISTING_CONTRACTS.activaNFT}`);
  console.log(`   ActivaToken: ${EXISTING_CONTRACTS.activaToken}`);
  console.log(`\n📊 Servicios: ${serviceCounter}`);
  console.log("\n🌐 Próximos pasos:");
  console.log("   1. cd frontend && npm run dev");
  console.log("   2. http://localhost:3000/marketplace");
  console.log("   3. ¡Los servicios ya están visibles!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
