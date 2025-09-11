const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Actualizando servicios del marketplace con ARB real...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    // Direcciones de tokens ARB reales por red
    const ARB_ADDRESSES = {
      sepolia: "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB real en Sepolia (si existe)
      arbitrumSepolia: "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB real en Arbitrum Sepolia
      arbitrum: "0x912CE59144191C1204E64559FE8253a0e49E6548" // ARB real en Arbitrum mainnet
    };
    
    // Leer información de deployment
    let deploymentInfo;
    let marketplaceAddress;
    let arbAddress;
    
    if (network === 'sepolia') {
      deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-multitoken.json', 'utf8'));
      marketplaceAddress = deploymentInfo.contracts.marketplace;
      // Usar ARB real en lugar de mock
      arbAddress = ARB_ADDRESSES.sepolia;
    } else if (network === 'arbitrumSepolia') {
      deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
      marketplaceAddress = deploymentInfo.contracts.marketplace;
      // Usar ARB real en lugar de mock
      arbAddress = ARB_ADDRESSES.arbitrumSepolia;
    } else {
      console.log("❌ Red no soportada. Use 'sepolia' o 'arbitrumSepolia'");
      process.exit(1);
    }
    
    console.log(`📋 Marketplace: ${marketplaceAddress}`);
    console.log(`📋 ARB Token Real: ${arbAddress}`);
    
    // Conectar a contratos
    const marketplace = await hre.ethers.getContractAt("ActivaMarketplaceMultiToken", marketplaceAddress);
    
    // Verificar servicios existentes
    const existingServices = await marketplace.serviceCounter();
    console.log(`📊 Servicios existentes: ${existingServices}`);
    
    // Servicios específicos por red con ARB real
    let services;
    
    if (network === 'sepolia') {
      services = [
        {
          title: "Desarrollo Smart Contracts Ethereum",
          description: "Creación de contratos inteligentes para la red Ethereum. Incluye testing, deployment y verificación en Etherscan. Especializado en estándares ERC20, ERC721 y ERC1155.",
          price: hre.ethers.parseEther("0.1"), // 0.1 ETH
          paymentToken: 0, // ETH
          category: 1, // Desarrollo
          minReputation: 0
        },
        {
          title: "Auditoría de Seguridad Ethereum",
          description: "Revisión completa de seguridad para contratos en Ethereum. Análisis de vulnerabilidades, gas optimization y mejores prácticas. Reporte detallado incluido.",
          price: hre.ethers.parseEther("0.5"), // 0.5 ETH
          paymentToken: 0, // ETH
          category: 1, // Desarrollo
          minReputation: 50
        },
        {
          title: "DeFi Protocol Development",
          description: "Desarrollo de protocolos DeFi completos: DEX, lending, yield farming. Incluye frontend React y testing exhaustivo. Optimizado para gas en Ethereum.",
          price: hre.ethers.parseEther("2.0"), // 2.0 ETH
          paymentToken: 0, // ETH
          category: 1, // Desarrollo
          minReputation: 100
        },
        {
          title: "NFT Collection Launch",
          description: "Lanzamiento completo de colección NFT en Ethereum. Smart contract, minting website, metadata, y marketing. Incluye verificación en OpenSea.",
          price: hre.ethers.parseEther("1.0"), // 1.0 ETH
          paymentToken: 0, // ETH
          category: 1, // Desarrollo
          minReputation: 25
        },
        {
          title: "UI/UX para DApps Ethereum",
          description: "Diseño moderno para aplicaciones descentralizadas en Ethereum. Web3 integration, wallet connection, responsive design. Glassmorphism y dark mode.",
          price: hre.ethers.parseEther("0.3"), // 0.3 ETH
          paymentToken: 0, // ETH
          category: 2, // Diseño
          minReputation: 0
        },
        {
          title: "Marketing Web3 Ethereum",
          description: "Estrategias de marketing para proyectos en Ethereum. Community building, social media, influencer outreach. Especializado en DeFi y NFTs.",
          price: hre.ethers.parseEther("0.2"), // 0.2 ETH
          paymentToken: 0, // ETH
          category: 3, // Marketing
          minReputation: 0
        },
        {
          title: "Consultoría Blockchain Ethereum",
          description: "Asesoramiento estratégico para implementar blockchain en Ethereum. Análisis de casos de uso, arquitectura, y roadmap técnico. Sesiones 1:1 incluidas.",
          price: hre.ethers.parseEther("0.8"), // 0.8 ETH
          paymentToken: 0, // ETH
          category: 4, // Consultoría
          minReputation: 75
        },
        {
          title: "Gas Optimization Expert",
          description: "Optimización de gas para contratos Ethereum. Reducción de costos de transacción, análisis de eficiencia, y implementación de patrones gas-efficient.",
          price: hre.ethers.parseEther("0.4"), // 0.4 ETH
          paymentToken: 0, // ETH
          category: 1, // Desarrollo
          minReputation: 100
        }
      ];
    } else if (network === 'arbitrumSepolia') {
      services = [
        {
          title: "Arbitrum Layer 2 Development",
          description: "Desarrollo de aplicaciones en Arbitrum Layer 2. Optimización para gas fees bajos, integración con bridges, y deployment en testnet. Especializado en rollups.",
          price: hre.ethers.parseEther("50"), // 50 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 0
        },
        {
          title: "Cross-Chain Bridge Integration",
          description: "Implementación de bridges entre Ethereum y Arbitrum. Integración con Arbitrum Bridge, testing de transferencias, y optimización de fees.",
          price: hre.ethers.parseEther("300"), // 300 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 50
        },
        {
          title: "ARB Token Integration Real",
          description: "Integración completa con tokens ARB reales en Arbitrum. Smart contracts que usan ARB como token de pago, staking, y governance. Optimizado para Layer 2.",
          price: hre.ethers.parseEther("200"), // 200 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 25
        },
        {
          title: "Optimistic Rollup Development",
          description: "Desarrollo de aplicaciones usando Optimistic Rollups en Arbitrum. Implementación de fraud proofs, challenge periods, y dispute resolution.",
          price: hre.ethers.parseEther("1000"), // 1000 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 100
        },
        {
          title: "Arbitrum DeFi Protocols",
          description: "Desarrollo de protocolos DeFi específicos para Arbitrum. DEX con fees bajos, yield farming, y liquidity pools. Optimizado para Layer 2.",
          price: hre.ethers.parseEther("800"), // 800 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 75
        },
        {
          title: "Layer 2 UI/UX Design",
          description: "Diseño de interfaces para aplicaciones Layer 2. Optimización para transacciones rápidas, indicadores de estado de rollup, y UX de bridges.",
          price: hre.ethers.parseEther("150"), // 150 ARB
          paymentToken: 1, // ARB
          category: 2, // Diseño
          minReputation: 0
        },
        {
          title: "Arbitrum Marketing Strategy",
          description: "Estrategias de marketing para proyectos en Arbitrum. Community building en Layer 2, educación sobre rollups, y outreach a desarrolladores.",
          price: hre.ethers.parseEther("100"), // 100 ARB
          paymentToken: 1, // ARB
          category: 3, // Marketing
          minReputation: 0
        },
        {
          title: "Arbitrum Consulting Real",
          description: "Consultoría especializada en Arbitrum y Layer 2. Análisis de migración desde Ethereum, optimización de gas, y estrategias de deployment con tokens reales.",
          price: hre.ethers.parseEther("400"), // 400 ARB
          paymentToken: 1, // ARB
          category: 4, // Consultoría
          minReputation: 50
        },
        {
          title: "ARB Token Services Real",
          description: "Servicios especializados con tokens ARB reales. Desarrollo de contratos que aceptan ARB como pago, staking pools, y governance mechanisms.",
          price: hre.ethers.parseEther("250"), // 250 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 25
        },
        {
          title: "Arbitrum Testnet Deployment Real",
          description: "Deployment completo en Arbitrum Sepolia testnet con tokens reales. Testing de contratos, verificación en Arbiscan, y documentación de deployment.",
          price: hre.ethers.parseEther("100"), // 100 ARB
          paymentToken: 1, // ARB
          category: 1, // Desarrollo
          minReputation: 0
        }
      ];
    }
    
    // Crear nuevos servicios
    console.log("\n🎯 Creando servicios específicos para", network, "con ARB real...");
    let created = 0;
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      
      try {
        console.log(`   ${i + 1}/${services.length}: ${service.title}`);
        const tokenName = service.paymentToken === 0 ? "ETH" : "ARB";
        console.log(`   💰 Precio: ${hre.ethers.formatEther(service.price)} ${tokenName}`);
        
        const tx = await marketplace.createService(
          service.title,
          service.description,
          service.price,
          service.paymentToken,
          service.category,
          service.minReputation
        );
        
        await tx.wait();
        created++;
        console.log(`   ✅ Creado exitosamente`);
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Verificar resultado final
    const finalCount = await marketplace.serviceCounter();
    console.log(`\n📊 Total de servicios en el marketplace: ${finalCount}`);
    console.log(`✅ Servicios creados en esta sesión: ${created}`);
    
    // Mostrar algunos servicios
    console.log("\n📋 Últimos servicios creados:");
    for (let i = Math.max(1, Number(finalCount) - created + 1); i <= Number(finalCount); i++) {
      try {
        const service = await marketplace.services(i);
        const priceFormatted = hre.ethers.formatEther(service.price);
        const tokenName = service.paymentToken === 0 ? "ETH" : "ARB";
        console.log(`   ${i}. ${service.title} - ${priceFormatted} ${tokenName}`);
      } catch (error) {
        console.log(`   ${i}. Error obteniendo servicio`);
      }
    }
    
    // Actualizar archivo de deployment info
    const updatedInfo = {
      ...deploymentInfo,
      services: Number(finalCount),
      lastUpdate: new Date().toISOString(),
      realARB: true,
      arbAddress: arbAddress,
      servicesCreated: created
    };
    
    const filename = network === 'sepolia' ? 'deployment-info-multitoken.json' : 'deployment-info-arbitrum.json';
    fs.writeFileSync(filename, JSON.stringify(updatedInfo, null, 2));
    
    console.log("\n🎉 SERVICIOS ACTUALIZADOS CON ARB REAL!");
    console.log("=" * 60);
    console.log(`📍 Red: ${network}`);
    console.log(`🎯 Servicios creados: ${created}`);
    console.log(`📊 Total de servicios: ${finalCount}`);
    console.log(`💰 Tokens soportados: ETH nativo, ARB real`);
    console.log(`🔗 ARB Token Real: ${arbAddress}`);
    console.log(`⭐ Reputación requerida: 0-100 puntos`);
    
    if (network === 'sepolia') {
      console.log("\n🌐 Verificar en Etherscan:");
      console.log(`   Marketplace: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
      console.log(`   ARB Token: https://sepolia.etherscan.io/address/${arbAddress}`);
    } else if (network === 'arbitrumSepolia') {
      console.log("\n🌐 Verificar en Arbiscan:");
      console.log(`   Marketplace: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
      console.log(`   ARB Token: https://sepolia.arbiscan.io/address/${arbAddress}`);
    }
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Conectar wallet a", network);
    console.log("   2. Obtener ETH de testnet faucet");
    console.log("   3. Probar compra de servicios con ETH");
    console.log("   4. Verificar transacciones en exploradores");
    console.log("   5. ¡Usar tokens ARB reales!");
    
  } catch (error) {
    console.error("❌ Error actualizando servicios:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
