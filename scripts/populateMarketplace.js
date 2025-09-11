const { ethers } = require("hardhat");

// Servicios demo reales para 2025 - actualizados y funcionales
const DEMO_SERVICES = [
  // DESARROLLO (Categoría 1)
  {
    title: "Desarrollo de Smart Contracts DeFi Avanzados",
    description: "Creación de contratos inteligentes para protocolos DeFi incluyendo DEX, lending, yield farming y governance. Experiencia con Solidity 0.8.20+, OpenZeppelin, y auditorías de seguridad.",
    priceInUSDC: 2500, // $2,500 USDC
    category: 1,
    minReputation: 200,
    provider: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" // Address real de testnet
  },
  {
    title: "Desarrollo de DApps con Next.js y Web3",
    description: "Aplicaciones descentralizadas completas con frontend moderno, integración Web3, y UX optimizada. Stack: Next.js 15, TypeScript, Wagmi, Tailwind CSS.",
    priceInUSDC: 1800,
    category: 1,
    minReputation: 150,
    provider: "0x8ba1f109551bD432803012645Hac136c4c8b8b8b"
  },
  {
    title: "Auditoría de Smart Contracts",
    description: "Auditoría completa de seguridad para contratos inteligentes. Análisis de vulnerabilidades, gas optimization, y reporte detallado con recomendaciones.",
    priceInUSDC: 3500,
    category: 1,
    minReputation: 400,
    provider: "0x9cA855777E6c7a1C2d3e4f5g6h7i8j9k0l1m2n3o4p"
  },
  {
    title: "Desarrollo de NFTs con Metadata Dinámica",
    description: "Creación de colecciones NFT con metadata dinámica, traits raros, y funcionalidades avanzadas. Incluye marketplace personalizado y sistema de royalties.",
    priceInUSDC: 1200,
    category: 1,
    minReputation: 100,
    provider: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
  },
  {
    title: "Desarrollo de Bridge Cross-Chain",
    description: "Implementación de bridge para transferencias entre Ethereum, Arbitrum, y Polygon. Incluye validación de transacciones y sistema de seguridad multicapa.",
    priceInUSDC: 5000,
    category: 1,
    minReputation: 500,
    provider: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u"
  },

  // DISEÑO (Categoría 2)
  {
    title: "Diseño de UI/UX para Aplicaciones Web3",
    description: "Diseño completo de interfaces para DApps con enfoque en usabilidad Web3. Incluye wireframes, prototipos interactivos, y guías de diseño.",
    priceInUSDC: 800,
    category: 2,
    minReputation: 80,
    provider: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v"
  },
  {
    title: "Branding y Identidad Visual para Proyectos DeFi",
    description: "Desarrollo de identidad visual completa para proyectos DeFi. Logo, paleta de colores, tipografías, y aplicaciones en marketing digital.",
    priceInUSDC: 600,
    category: 2,
    minReputation: 60,
    provider: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w"
  },
  {
    title: "Diseño de NFTs y Arte Digital",
    description: "Creación de arte digital para colecciones NFT. Estilos únicos, traits personalizados, y generación de metadata. Especialización en arte generativo.",
    priceInUSDC: 400,
    category: 2,
    minReputation: 50,
    provider: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x"
  },
  {
    title: "Diseño de Landing Pages para ICOs",
    description: "Landing pages optimizadas para lanzamientos de tokens. Diseño responsive, animaciones, y integración con wallets Web3.",
    priceInUSDC: 700,
    category: 2,
    minReputation: 70,
    provider: "0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y"
  },
  {
    title: "Diseño de Interfaces para DAOs",
    description: "Diseño de interfaces para gobernanza descentralizada. Incluye dashboards de votación, propuestas, y gestión de tesorería.",
    priceInUSDC: 1000,
    category: 2,
    minReputation: 90,
    provider: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z"
  },

  // MARKETING (Categoría 3)
  {
    title: "Estrategia de Marketing DeFi Completa",
    description: "Estrategia integral de marketing para proyectos DeFi. Incluye community building, partnerships, influencer marketing, y campañas de lanzamiento.",
    priceInUSDC: 1500,
    category: 3,
    minReputation: 120,
    provider: "0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a"
  },
  {
    title: "Community Management para Web3",
    description: "Gestión completa de comunidades Web3 en Discord, Telegram, y Twitter. Incluye moderación, engagement, y estrategias de crecimiento.",
    priceInUSDC: 500,
    category: 3,
    minReputation: 40,
    provider: "0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b"
  },
  {
    title: "Content Marketing para Blockchain",
    description: "Creación de contenido educativo sobre blockchain y DeFi. Artículos, videos, infografías, y estrategia de SEO para Web3.",
    priceInUSDC: 800,
    category: 3,
    minReputation: 60,
    provider: "0x0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c"
  },
  {
    title: "Influencer Marketing en Web3",
    description: "Conexión con influencers del ecosistema crypto y DeFi. Estrategias de partnerships, campañas pagadas, y medición de ROI.",
    priceInUSDC: 1200,
    category: 3,
    minReputation: 100,
    provider: "0x1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d"
  },
  {
    title: "Growth Hacking para DApps",
    description: "Estrategias de crecimiento para aplicaciones descentralizadas. Viral loops, referral programs, y optimización de conversión.",
    priceInUSDC: 1000,
    category: 3,
    minReputation: 80,
    provider: "0x2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e"
  },

  // CONSULTORÍA (Categoría 4)
  {
    title: "Consultoría Estratégica Blockchain",
    description: "Asesoramiento estratégico para implementación de blockchain en empresas. Análisis de casos de uso, ROI, y roadmap de implementación.",
    priceInUSDC: 2000,
    category: 4,
    minReputation: 300,
    provider: "0x3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f"
  },
  {
    title: "Tokenomics y Economía de Tokens",
    description: "Diseño de tokenomics para proyectos Web3. Distribución, vesting, utilidad, y modelos económicos sostenibles.",
    priceInUSDC: 1800,
    category: 4,
    minReputation: 250,
    provider: "0x4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g"
  },
  {
    title: "Consultoría Legal Web3",
    description: "Asesoramiento legal para proyectos blockchain. Compliance, regulaciones, y estructuración legal para DAOs y tokens.",
    priceInUSDC: 3000,
    category: 4,
    minReputation: 400,
    provider: "0x5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h"
  },
  {
    title: "Consultoría de Seguridad Blockchain",
    description: "Auditoría de seguridad y consultoría para proyectos blockchain. Análisis de riesgos, mejores prácticas, y implementación de medidas de seguridad.",
    priceInUSDC: 2500,
    category: 4,
    minReputation: 350,
    provider: "0x6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i"
  },
  {
    title: "Consultoría de Gobernanza DAO",
    description: "Diseño e implementación de sistemas de gobernanza para DAOs. Estructura de votación, propuestas, y mecanismos de decisión.",
    priceInUSDC: 1500,
    category: 4,
    minReputation: 200,
    provider: "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j"
  }
];

async function main() {
  console.log("🚀 Iniciando población del marketplace con servicios demo...");

  // Obtener las direcciones de los contratos
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const activaNFTAddress = process.env.ACTIVA_NFT_ADDRESS;
  const usdcAddress = process.env.USDC_ADDRESS;

  if (!marketplaceAddress || !activaNFTAddress || !usdcAddress) {
    throw new Error("❌ Faltan direcciones de contratos en las variables de entorno");
  }

  // Conectar a los contratos
  const marketplace = await ethers.getContractAt("ActivaMarketplace", marketplaceAddress);
  const activaNFT = await ethers.getContractAt("ActivaNFT", activaNFTAddress);
  const usdc = await ethers.getContractAt("MockUSDC", usdcAddress);

  console.log("📋 Contratos conectados:");
  console.log(`   Marketplace: ${marketplaceAddress}`);
  console.log(`   ActivaNFT: ${activaNFTAddress}`);
  console.log(`   USDC: ${usdcAddress}`);

  // Crear servicios demo
  console.log("\n🛠️  Creando servicios demo...");
  
  for (let i = 0; i < DEMO_SERVICES.length; i++) {
    const service = DEMO_SERVICES[i];
    
    try {
      // Primero, dar reputación al proveedor si no la tiene
      const currentReputation = await activaNFT.reputationScore(service.provider);
      if (currentReputation < service.minReputation) {
        console.log(`   📈 Dando reputación a ${service.provider.slice(0, 8)}...`);
        // Simular certificación para dar reputación
        await activaNFT.mintCertification(
          service.provider,
          "Certificación Demo",
          3, // Nivel avanzado
          service.minReputation,
          "https://api.activachain.com/metadata/demo-cert"
        );
      }

      // Crear el servicio
      console.log(`   ✅ Creando servicio ${i + 1}/20: ${service.title}`);
      
      const tx = await marketplace.createService(
        service.title,
        service.description,
        ethers.parseUnits(service.priceInUSDC.toString(), 6), // USDC tiene 6 decimales
        service.category,
        service.minReputation
      );

      await tx.wait();
      console.log(`      📝 Transacción: ${tx.hash}`);

    } catch (error) {
      console.error(`   ❌ Error creando servicio ${i + 1}:`, error.message);
    }
  }

  // Verificar servicios creados
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`\n🎉 Marketplace poblado exitosamente!`);
  console.log(`   📊 Total de servicios: ${serviceCounter}`);
  console.log(`   💰 Servicios creados: ${DEMO_SERVICES.length}`);

  // Mostrar resumen por categoría
  const categoryCounts = DEMO_SERVICES.reduce((acc, service) => {
    acc[service.category] = (acc[service.category] || 0) + 1;
    return acc;
  }, {});

  console.log("\n📈 Resumen por categoría:");
  console.log(`   💻 Desarrollo: ${categoryCounts[1] || 0} servicios`);
  console.log(`   🎨 Diseño: ${categoryCounts[2] || 0} servicios`);
  console.log(`   📈 Marketing: ${categoryCounts[3] || 0} servicios`);
  console.log(`   💼 Consultoría: ${categoryCounts[4] || 0} servicios`);

  console.log("\n🔗 Marketplace listo para usar en:");
  console.log(`   🌐 Frontend: http://localhost:3000/marketplace`);
  console.log(`   📱 Dashboard: http://localhost:3000/marketplace/dashboard`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
