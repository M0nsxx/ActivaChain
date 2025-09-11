const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Direcciones de contratos desplegados
const CONTRACTS = {
  usdc: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
  reputation: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
  marketplace: "0x721aE67eC40BA624486CF9a2fE64309bB11536F3",
  activaToken: "0x031acF11ade235b00196A0605e8CF136a115F168"
};

// Servicios demo simplificados
const DEMO_SERVICES = [
  {
    title: "Desarrollo Smart Contracts DeFi",
    description: "Creación de contratos inteligentes para protocolos DeFi. Solidity, OpenZeppelin, auditorías.",
    priceInUSDC: 2500,
    category: 1,
    minReputation: 50
  },
  {
    title: "DApps con Next.js y Web3",
    description: "Aplicaciones descentralizadas con frontend moderno. Next.js 15, TypeScript, Wagmi.",
    priceInUSDC: 1800,
    category: 1,
    minReputation: 50
  },
  {
    title: "Auditoría Smart Contracts",
    description: "Auditoría de seguridad para contratos inteligentes. Análisis de vulnerabilidades.",
    priceInUSDC: 3500,
    category: 1,
    minReputation: 50
  },
  {
    title: "Desarrollo NFTs",
    description: "Creación de colecciones NFT con metadata dinámica y marketplace personalizado.",
    priceInUSDC: 1200,
    category: 1,
    minReputation: 50
  },
  {
    title: "Bridge Cross-Chain",
    description: "Implementación de bridge para transferencias entre Ethereum, Arbitrum, Polygon.",
    priceInUSDC: 5000,
    category: 1,
    minReputation: 50
  },
  {
    title: "UI/UX Web3",
    description: "Diseño de interfaces para DApps. Wireframes, prototipos, guías de diseño.",
    priceInUSDC: 800,
    category: 2,
    minReputation: 30
  },
  {
    title: "Branding DeFi",
    description: "Identidad visual para proyectos DeFi. Logo, colores, tipografías.",
    priceInUSDC: 600,
    category: 2,
    minReputation: 30
  },
  {
    title: "Arte Digital NFTs",
    description: "Creación de arte digital para colecciones NFT. Estilos únicos, traits personalizados.",
    priceInUSDC: 400,
    category: 2,
    minReputation: 30
  },
  {
    title: "Landing Pages ICOs",
    description: "Landing pages para lanzamientos de tokens. Responsive, animaciones, Web3.",
    priceInUSDC: 700,
    category: 2,
    minReputation: 30
  },
  {
    title: "Interfaces DAOs",
    description: "Diseño de interfaces para gobernanza descentralizada. Dashboards, votación.",
    priceInUSDC: 1000,
    category: 2,
    minReputation: 30
  },
  {
    title: "Marketing DeFi",
    description: "Estrategia de marketing para proyectos DeFi. Community, partnerships, influencers.",
    priceInUSDC: 1500,
    category: 3,
    minReputation: 40
  },
  {
    title: "Community Management",
    description: "Gestión de comunidades Web3. Discord, Telegram, Twitter, engagement.",
    priceInUSDC: 500,
    category: 3,
    minReputation: 20
  },
  {
    title: "Content Marketing",
    description: "Contenido educativo blockchain/DeFi. Artículos, videos, infografías, SEO.",
    priceInUSDC: 800,
    category: 3,
    minReputation: 30
  },
  {
    title: "Influencer Marketing",
    description: "Conexión con influencers crypto/DeFi. Partnerships, campañas, ROI.",
    priceInUSDC: 1200,
    category: 3,
    minReputation: 40
  },
  {
    title: "Growth Hacking DApps",
    description: "Estrategias de crecimiento para DApps. Viral loops, referrals, conversión.",
    priceInUSDC: 1000,
    category: 3,
    minReputation: 30
  },
  {
    title: "Consultoría Blockchain",
    description: "Asesoramiento estratégico blockchain. Casos de uso, ROI, roadmap.",
    priceInUSDC: 2000,
    category: 4,
    minReputation: 50
  },
  {
    title: "Tokenomics",
    description: "Diseño de tokenomics Web3. Distribución, vesting, utilidad, modelos.",
    priceInUSDC: 1800,
    category: 4,
    minReputation: 50
  },
  {
    title: "Consultoría Legal Web3",
    description: "Asesoramiento legal blockchain. Compliance, regulaciones, DAOs, tokens.",
    priceInUSDC: 3000,
    category: 4,
    minReputation: 50
  },
  {
    title: "Seguridad Blockchain",
    description: "Auditoría y consultoría seguridad. Riesgos, mejores prácticas, medidas.",
    priceInUSDC: 2500,
    category: 4,
    minReputation: 50
  },
  {
    title: "Gobernanza DAO",
    description: "Diseño de sistemas gobernanza DAOs. Votación, propuestas, decisiones.",
    priceInUSDC: 1500,
    category: 4,
    minReputation: 50
  }
];

async function main() {
  console.log("🚀 Creando servicios demo rápidamente...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);

  // Conectar a contratos
  const activaNFT = await ethers.getContractAt("ActivaNFT", CONTRACTS.activaNFT);
  const marketplace = await ethers.getContractAt("ActivaMarketplace", CONTRACTS.marketplace);

  // Intentar dar reputación rápidamente
  console.log("\n1️⃣ Dando reputación...");
  try {
    const tx = await activaNFT.mintCertification(
      deployer.address,
      "ActivaChain Developer",
      3,
      100,
      "https://api.activachain.com/metadata/dev"
    );
    console.log("⏳ Esperando confirmación...");
    await tx.wait(1); // Solo 1 confirmación
    console.log("✅ Certificación creada");
  } catch (error) {
    console.log("⚠️  Error en certificación:", error.message);
  }

  // Verificar reputación
  const reputation = await activaNFT.reputationScore(deployer.address);
  console.log(`⭐ Reputación: ${reputation}`);

  // Crear servicios
  console.log("\n2️⃣ Creando servicios...");
  let servicesCreated = 0;
  
  for (let i = 0; i < DEMO_SERVICES.length; i++) {
    const service = DEMO_SERVICES[i];
    
    try {
      const tx = await marketplace.createService(
        service.title,
        service.description,
        ethers.parseUnits(service.priceInUSDC.toString(), 6),
        service.category,
        service.minReputation
      );
      await tx.wait(1); // Solo 1 confirmación
      servicesCreated++;
      console.log(`   ✅ ${i + 1}/20: ${service.title}`);
    } catch (error) {
      console.log(`   ❌ ${i + 1}/20: ${error.message}`);
    }
  }

  // Verificar resultado
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`\n📊 Servicios creados: ${serviceCounter}`);

  // Guardar info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    contracts: CONTRACTS,
    services: {
      total: Number(serviceCounter),
      created: servicesCreated
    },
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Info guardada en deployment-info.json");

  console.log("\n🎉 ¡DEPLOYMENT COMPLETADO!");
  console.log("=" * 40);
  console.log("📋 Contratos desplegados:");
  Object.entries(CONTRACTS).forEach(([name, address]) => {
    console.log(`   ${name}: ${address}`);
  });
  console.log(`\n📊 Servicios: ${serviceCounter}`);
  console.log("\n🌐 Próximos pasos:");
  console.log("   1. cd frontend && npm run dev");
  console.log("   2. http://localhost:3000/marketplace");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
