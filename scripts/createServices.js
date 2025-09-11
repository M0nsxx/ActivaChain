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

// Servicios demo
const DEMO_SERVICES = [
  {
    title: "Desarrollo de Smart Contracts DeFi Avanzados",
    description: "Creación de contratos inteligentes para protocolos DeFi incluyendo DEX, lending, yield farming y governance. Experiencia con Solidity 0.8.20+, OpenZeppelin, y auditorías de seguridad.",
    priceInUSDC: 2500,
    category: 1,
    minReputation: 100
  },
  {
    title: "Desarrollo de DApps con Next.js y Web3",
    description: "Aplicaciones descentralizadas completas con frontend moderno, integración Web3, y UX optimizada. Stack: Next.js 15, TypeScript, Wagmi, Tailwind CSS.",
    priceInUSDC: 1800,
    category: 1,
    minReputation: 100
  },
  {
    title: "Auditoría de Smart Contracts",
    description: "Auditoría completa de seguridad para contratos inteligentes. Análisis de vulnerabilidades, gas optimization, y reporte detallado con recomendaciones.",
    priceInUSDC: 3500,
    category: 1,
    minReputation: 100
  },
  {
    title: "Desarrollo de NFTs con Metadata Dinámica",
    description: "Creación de colecciones NFT con metadata dinámica, traits raros, y funcionalidades avanzadas. Incluye marketplace personalizado y sistema de royalties.",
    priceInUSDC: 1200,
    category: 1,
    minReputation: 100
  },
  {
    title: "Desarrollo de Bridge Cross-Chain",
    description: "Implementación de bridge para transferencias entre Ethereum, Arbitrum, y Polygon. Incluye validación de transacciones y sistema de seguridad multicapa.",
    priceInUSDC: 5000,
    category: 1,
    minReputation: 100
  },
  {
    title: "Diseño de UI/UX para Aplicaciones Web3",
    description: "Diseño completo de interfaces para DApps con enfoque en usabilidad Web3. Incluye wireframes, prototipos interactivos, y guías de diseño.",
    priceInUSDC: 800,
    category: 2,
    minReputation: 50
  },
  {
    title: "Branding y Identidad Visual para Proyectos DeFi",
    description: "Desarrollo de identidad visual completa para proyectos DeFi. Logo, paleta de colores, tipografías, y aplicaciones en marketing digital.",
    priceInUSDC: 600,
    category: 2,
    minReputation: 50
  },
  {
    title: "Diseño de NFTs y Arte Digital",
    description: "Creación de arte digital para colecciones NFT. Estilos únicos, traits personalizados, y generación de metadata. Especialización en arte generativo.",
    priceInUSDC: 400,
    category: 2,
    minReputation: 50
  },
  {
    title: "Diseño de Landing Pages para ICOs",
    description: "Landing pages optimizadas para lanzamientos de tokens. Diseño responsive, animaciones, y integración con wallets Web3.",
    priceInUSDC: 700,
    category: 2,
    minReputation: 50
  },
  {
    title: "Diseño de Interfaces para DAOs",
    description: "Diseño de interfaces para gobernanza descentralizada. Incluye dashboards de votación, propuestas, y gestión de tesorería.",
    priceInUSDC: 1000,
    category: 2,
    minReputation: 50
  },
  {
    title: "Estrategia de Marketing DeFi Completa",
    description: "Estrategia integral de marketing para proyectos DeFi. Incluye community building, partnerships, influencer marketing, y campañas de lanzamiento.",
    priceInUSDC: 1500,
    category: 3,
    minReputation: 80
  },
  {
    title: "Community Management para Web3",
    description: "Gestión completa de comunidades Web3 en Discord, Telegram, y Twitter. Incluye moderación, engagement, y estrategias de crecimiento.",
    priceInUSDC: 500,
    category: 3,
    minReputation: 40
  },
  {
    title: "Content Marketing para Blockchain",
    description: "Creación de contenido educativo sobre blockchain y DeFi. Artículos, videos, infografías, y estrategia de SEO para Web3.",
    priceInUSDC: 800,
    category: 3,
    minReputation: 60
  },
  {
    title: "Influencer Marketing en Web3",
    description: "Conexión con influencers del ecosistema crypto y DeFi. Estrategias de partnerships, campañas pagadas, y medición de ROI.",
    priceInUSDC: 1200,
    category: 3,
    minReputation: 80
  },
  {
    title: "Growth Hacking para DApps",
    description: "Estrategias de crecimiento para aplicaciones descentralizadas. Viral loops, referral programs, y optimización de conversión.",
    priceInUSDC: 1000,
    category: 3,
    minReputation: 60
  },
  {
    title: "Consultoría Estratégica Blockchain",
    description: "Asesoramiento estratégico para implementación de blockchain en empresas. Análisis de casos de uso, ROI, y roadmap de implementación.",
    priceInUSDC: 2000,
    category: 4,
    minReputation: 100
  },
  {
    title: "Tokenomics y Economía de Tokens",
    description: "Diseño de tokenomics para proyectos Web3. Distribución, vesting, utilidad, y modelos económicos sostenibles.",
    priceInUSDC: 1800,
    category: 4,
    minReputation: 100
  },
  {
    title: "Consultoría Legal Web3",
    description: "Asesoramiento legal para proyectos blockchain. Compliance, regulaciones, y estructuración legal para DAOs y tokens.",
    priceInUSDC: 3000,
    category: 4,
    minReputation: 100
  },
  {
    title: "Consultoría de Seguridad Blockchain",
    description: "Auditoría de seguridad y consultoría para proyectos blockchain. Análisis de riesgos, mejores prácticas, y implementación de medidas de seguridad.",
    priceInUSDC: 2500,
    category: 4,
    minReputation: 100
  },
  {
    title: "Consultoría de Gobernanza DAO",
    description: "Diseño e implementación de sistemas de gobernanza para DAOs. Estructura de votación, propuestas, y mecanismos de decisión.",
    priceInUSDC: 1500,
    category: 4,
    minReputation: 100
  }
];

async function main() {
  console.log("🚀 Creando servicios demo en el marketplace...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Usando cuenta:", deployer.address);

  // Conectar a contratos
  const activaNFT = await ethers.getContractAt("ActivaNFT", CONTRACTS.activaNFT);
  const marketplace = await ethers.getContractAt("ActivaMarketplace", CONTRACTS.marketplace);

  // 1. Dar reputación al deployer
  console.log("\n1️⃣ Dando reputación al deployer...");
  try {
    await activaNFT.mintCertification(
      deployer.address,
      "Certificación ActivaChain Developer",
      3, // Nivel avanzado
      500, // Reputación alta
      "https://api.activachain.com/metadata/dev-cert"
    );
    console.log("✅ Certificación creada para el deployer");
  } catch (error) {
    console.log("⚠️  Error creando certificación:", error.message);
  }

  // 2. Crear servicios
  console.log("\n2️⃣ Creando servicios demo...");
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
      await tx.wait();
      servicesCreated++;
      console.log(`   ✅ Servicio ${i + 1}/20: ${service.title}`);
    } catch (error) {
      console.log(`   ❌ Error en servicio ${i + 1}: ${error.message}`);
    }
  }

  // 3. Verificar servicios creados
  console.log("\n3️⃣ Verificando servicios creados...");
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`   📊 Total de servicios: ${serviceCounter}`);
  console.log(`   ✅ Servicios creados en esta sesión: ${servicesCreated}`);

  // 4. Mostrar algunos servicios
  console.log("\n4️⃣ Mostrando servicios creados...");
  for (let i = 1; i <= Math.min(Number(serviceCounter), 5); i++) {
    const service = await marketplace.services(i);
    console.log(`   📋 Servicio ${i}: ${service.title}`);
    console.log(`      💰 Precio: $${Number(service.priceInUSDC) / 1e6} USDC`);
    console.log(`      📂 Categoría: ${service.category}`);
    console.log(`      ⭐ Reputación mínima: ${service.minReputation}`);
  }

  // 5. Guardar información actualizada
  console.log("\n5️⃣ Guardando información actualizada...");
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

  const deploymentPath = path.join(__dirname, "..", "deployment-info.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Deployment info actualizada");

  // 6. Actualizar variables de entorno
  console.log("\n6️⃣ Actualizando variables de entorno...");
  const { updateEnvFile } = require("./updateEnv");
  updateEnvFile(deploymentInfo);

  console.log("\n🎉 SERVICIOS CREADOS EXITOSAMENTE!");
  console.log("=" * 50);
  console.log("📋 Resumen:");
  console.log(`   Servicios totales: ${serviceCounter}`);
  console.log(`   Servicios creados: ${servicesCreated}`);
  console.log(`   Proveedor: ${deployer.address}`);
  console.log("\n🌐 Próximos pasos:");
  console.log("   1. Iniciar frontend: cd frontend && npm run dev");
  console.log("   2. Visitar: http://localhost:3000/marketplace");
  console.log("   3. Conectar wallet y explorar servicios");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
