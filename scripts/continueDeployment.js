const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Direcciones ya desplegadas
const DEPLOYED_CONTRACTS = {
  usdc: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
  reputation: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
  marketplace: "0x721aE67eC40BA624486CF9a2fE64309bB11536F3"
};

// Servicios demo
const DEMO_SERVICES = [
  {
    title: "Desarrollo de Smart Contracts DeFi Avanzados",
    description: "Creación de contratos inteligentes para protocolos DeFi incluyendo DEX, lending, yield farming y governance. Experiencia con Solidity 0.8.20+, OpenZeppelin, y auditorías de seguridad.",
    priceInUSDC: 2500,
    category: 1,
    minReputation: 200
  },
  {
    title: "Desarrollo de DApps con Next.js y Web3",
    description: "Aplicaciones descentralizadas completas con frontend moderno, integración Web3, y UX optimizada. Stack: Next.js 15, TypeScript, Wagmi, Tailwind CSS.",
    priceInUSDC: 1800,
    category: 1,
    minReputation: 150
  },
  {
    title: "Auditoría de Smart Contracts",
    description: "Auditoría completa de seguridad para contratos inteligentes. Análisis de vulnerabilidades, gas optimization, y reporte detallado con recomendaciones.",
    priceInUSDC: 3500,
    category: 1,
    minReputation: 400
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
    minReputation: 500
  },
  {
    title: "Diseño de UI/UX para Aplicaciones Web3",
    description: "Diseño completo de interfaces para DApps con enfoque en usabilidad Web3. Incluye wireframes, prototipos interactivos, y guías de diseño.",
    priceInUSDC: 800,
    category: 2,
    minReputation: 80
  },
  {
    title: "Branding y Identidad Visual para Proyectos DeFi",
    description: "Desarrollo de identidad visual completa para proyectos DeFi. Logo, paleta de colores, tipografías, y aplicaciones en marketing digital.",
    priceInUSDC: 600,
    category: 2,
    minReputation: 60
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
    minReputation: 70
  },
  {
    title: "Diseño de Interfaces para DAOs",
    description: "Diseño de interfaces para gobernanza descentralizada. Incluye dashboards de votación, propuestas, y gestión de tesorería.",
    priceInUSDC: 1000,
    category: 2,
    minReputation: 90
  },
  {
    title: "Estrategia de Marketing DeFi Completa",
    description: "Estrategia integral de marketing para proyectos DeFi. Incluye community building, partnerships, influencer marketing, y campañas de lanzamiento.",
    priceInUSDC: 1500,
    category: 3,
    minReputation: 120
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
    minReputation: 100
  },
  {
    title: "Growth Hacking para DApps",
    description: "Estrategias de crecimiento para aplicaciones descentralizadas. Viral loops, referral programs, y optimización de conversión.",
    priceInUSDC: 1000,
    category: 3,
    minReputation: 80
  },
  {
    title: "Consultoría Estratégica Blockchain",
    description: "Asesoramiento estratégico para implementación de blockchain en empresas. Análisis de casos de uso, ROI, y roadmap de implementación.",
    priceInUSDC: 2000,
    category: 4,
    minReputation: 300
  },
  {
    title: "Tokenomics y Economía de Tokens",
    description: "Diseño de tokenomics para proyectos Web3. Distribución, vesting, utilidad, y modelos económicos sostenibles.",
    priceInUSDC: 1800,
    category: 4,
    minReputation: 250
  },
  {
    title: "Consultoría Legal Web3",
    description: "Asesoramiento legal para proyectos blockchain. Compliance, regulaciones, y estructuración legal para DAOs y tokens.",
    priceInUSDC: 3000,
    category: 4,
    minReputation: 400
  },
  {
    title: "Consultoría de Seguridad Blockchain",
    description: "Auditoría de seguridad y consultoría para proyectos blockchain. Análisis de riesgos, mejores prácticas, y implementación de medidas de seguridad.",
    priceInUSDC: 2500,
    category: 4,
    minReputation: 350
  },
  {
    title: "Consultoría de Gobernanza DAO",
    description: "Diseño e implementación de sistemas de gobernanza para DAOs. Estructura de votación, propuestas, y mecanismos de decisión.",
    priceInUSDC: 1500,
    category: 4,
    minReputation: 200
  }
];

// Direcciones de testnet para proveedores
const DEMO_PROVIDERS = [
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "0x8ba1f109551bD432803012645Hac136c4c8b8b8b",
  "0x9cA855777E6c7a1C2d3e4f5g6h7i8j9k0l1m2n3o4p",
  "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
  "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
  "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
  "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w",
  "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
  "0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y",
  "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
  "0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
  "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
  "0x0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c",
  "0x1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d",
  "0x2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e",
  "0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
  "0x4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g",
  "0x5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h",
  "0x6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i",
  "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j"
];

async function main() {
  console.log("🚀 Continuando deployment de ActivaChain...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // 1. Deploy ActivaToken
  console.log("\n1️⃣ Deploying ActivaToken...");
  const ActivaToken = await ethers.getContractFactory("ActivaToken");
  const activaToken = await ActivaToken.deploy(
    "ActivaChain Token",
    "ACTIVA",
    ethers.parseEther("1000000") // 1M tokens
  );
  await activaToken.waitForDeployment();
  const activaTokenAddress = await activaToken.getAddress();
  console.log("✅ ActivaToken deployed to:", activaTokenAddress);

  // 2. Conectar a contratos existentes
  console.log("\n2️⃣ Conectando a contratos existentes...");
  const usdc = await ethers.getContractAt("MockUSDC", DEPLOYED_CONTRACTS.usdc);
  const activaNFT = await ethers.getContractAt("ActivaNFT", DEPLOYED_CONTRACTS.activaNFT);
  const marketplace = await ethers.getContractAt("ActivaMarketplace", DEPLOYED_CONTRACTS.marketplace);

  // 3. Mint USDC para testing
  console.log("\n3️⃣ Minting USDC for testing...");
  const mintAmount = ethers.parseUnits("1000000", 6); // 1M USDC
  await usdc.mint(deployer.address, mintAmount);
  console.log("✅ Minted 1,000,000 USDC for testing");

  // 4. Crear certificaciones demo
  console.log("\n4️⃣ Creating demo certifications...");
  for (let i = 0; i < Math.min(DEMO_PROVIDERS.length, 10); i++) {
    const provider = DEMO_PROVIDERS[i];
    const service = DEMO_SERVICES[i];
    
    try {
      await activaNFT.mintCertification(
        provider,
        `Certificación ${service.title.split(' ')[0]}`,
        3, // Nivel avanzado
        service.minReputation,
        `https://api.activachain.com/metadata/cert-${i + 1}`
      );
      console.log(`   ✅ Certificación creada para ${provider.slice(0, 8)}...`);
    } catch (error) {
      console.log(`   ⚠️  Saltando certificación para ${provider.slice(0, 8)}...`);
    }
  }

  // 5. Crear servicios demo
  console.log("\n5️⃣ Creating demo services...");
  for (let i = 0; i < DEMO_SERVICES.length; i++) {
    const service = DEMO_SERVICES[i];
    const provider = DEMO_PROVIDERS[i];
    
    try {
      const tx = await marketplace.createService(
        service.title,
        service.description,
        ethers.parseUnits(service.priceInUSDC.toString(), 6),
        service.category,
        service.minReputation
      );
      await tx.wait();
      console.log(`   ✅ Servicio ${i + 1}/20: ${service.title}`);
    } catch (error) {
      console.log(`   ⚠️  Saltando servicio ${i + 1}: ${error.message}`);
    }
  }

  // 6. Verificar deployment
  console.log("\n6️⃣ Verificando deployment...");
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`   📊 Total de servicios creados: ${serviceCounter}`);

  // 7. Guardar información del deployment
  console.log("\n7️⃣ Guardando información del deployment...");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      usdc: DEPLOYED_CONTRACTS.usdc,
      activaNFT: DEPLOYED_CONTRACTS.activaNFT,
      reputation: DEPLOYED_CONTRACTS.reputation,
      marketplace: DEPLOYED_CONTRACTS.marketplace,
      activaToken: activaTokenAddress
    },
    services: {
      total: Number(serviceCounter),
      created: DEMO_SERVICES.length
    },
    timestamp: new Date().toISOString()
  };

  const deploymentPath = path.join(__dirname, "..", "deployment-info.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Deployment info saved to deployment-info.json");

  // 8. Actualizar variables de entorno
  console.log("\n8️⃣ Actualizando variables de entorno...");
  const { updateEnvFile } = require("./updateEnv");
  updateEnvFile(deploymentInfo);

  // 9. Mostrar resumen final
  console.log("\n🎉 DEPLOYMENT COMPLETADO EXITOSAMENTE!");
  console.log("=" * 50);
  console.log("📋 Direcciones de contratos:");
  console.log(`   USDC: ${DEPLOYED_CONTRACTS.usdc}`);
  console.log(`   ActivaNFT: ${DEPLOYED_CONTRACTS.activaNFT}`);
  console.log(`   Reputation: ${DEPLOYED_CONTRACTS.reputation}`);
  console.log(`   Marketplace: ${DEPLOYED_CONTRACTS.marketplace}`);
  console.log(`   ActivaToken: ${activaTokenAddress}`);
  console.log("\n📊 Estadísticas:");
  console.log(`   Servicios creados: ${serviceCounter}`);
  console.log(`   Proveedores: ${DEMO_PROVIDERS.length}`);
  console.log(`   Categorías: 4 (Desarrollo, Diseño, Marketing, Consultoría)`);
  console.log("\n🌐 Próximos pasos:");
  console.log("   1. Configurar variables de entorno en .env.local");
  console.log("   2. Ejecutar 'npm run dev' en el frontend");
  console.log("   3. Visitar http://localhost:3000/marketplace");
  console.log("   4. Conectar wallet y explorar servicios");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
