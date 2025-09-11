const { ethers } = require("hardhat");
const fs = require("fs");

// Direcciones de contratos desplegados
const CONTRACTS = {
  marketplace: "0x721aE67eC40BA624486CF9a2fE64309bB11536F3"
};

// Servicios demo con reputación mínima 0
const SERVICES = [
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
  console.log("🚀 Creando servicios sin verificar reputación...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);

  // Conectar al marketplace
  const marketplace = await ethers.getContractAt("ActivaMarketplace", CONTRACTS.marketplace);

  // Verificar servicios existentes
  const existingServices = await marketplace.serviceCounter();
  console.log(`📊 Servicios existentes: ${existingServices}`);

  // Crear servicios uno por uno
  console.log("\n📝 Creando servicios...");
  let created = 0;

  for (let i = 0; i < SERVICES.length; i++) {
    const service = SERVICES[i];
    
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
      created++;
      console.log(`   ✅ Creado: ${service.title}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Verificar resultado final
  const finalCount = await marketplace.serviceCounter();
  console.log(`\n🎉 Servicios creados: ${finalCount}`);

  // Mostrar algunos servicios
  console.log("\n📋 Servicios disponibles:");
  for (let i = 1; i <= Math.min(Number(finalCount), 5); i++) {
    const service = await marketplace.services(i);
    console.log(`   ${i}. ${service.title} - $${Number(service.priceInUSDC) / 1e6} USDC`);
  }

  console.log("\n🌐 ¡Listo! Ahora puedes ver los servicios en el marketplace");
  console.log("📱 Inicia el frontend: cd frontend && npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
