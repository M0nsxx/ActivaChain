const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Actualizando servicios del marketplace en Arbitrum Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  if (network !== 'arbitrumSepolia') {
    console.log("❌ Este script debe ejecutarse en la red Arbitrum Sepolia");
    process.exit(1);
  }
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    // Leer información de deployment
    const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-arbitrum.json', 'utf8'));
    const marketplaceAddress = deploymentInfo.contracts.marketplace;
    const arbAddress = deploymentInfo.contracts.arb;
    
    console.log(`📋 Marketplace: ${marketplaceAddress}`);
    console.log(`📋 ARB Token: ${arbAddress}`);
    
    // Conectar a contratos
    const marketplace = await hre.ethers.getContractAt("ActivaMarketplaceMultiToken", marketplaceAddress);
    const arbToken = await hre.ethers.getContractAt("MockARB", arbAddress);
    
    // Verificar servicios existentes
    const existingServices = await marketplace.serviceCounter();
    console.log(`📊 Servicios existentes: ${existingServices}`);
    
    // Servicios específicos para Arbitrum Sepolia (Layer 2)
    const arbitrumServices = [
      {
        title: "Arbitrum Layer 2 Development",
        description: "Desarrollo de aplicaciones en Arbitrum Layer 2. Optimización para gas fees bajos, integración con bridges, y deployment en testnet. Especializado en rollups.",
        price: hre.ethers.parseEther("0.05"), // 0.05 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 0
      },
      {
        title: "Cross-Chain Bridge Integration",
        description: "Implementación de bridges entre Ethereum y Arbitrum. Integración con Arbitrum Bridge, testing de transferencias, y optimización de fees.",
        price: hre.ethers.parseEther("0.3"), // 0.3 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 50
      },
      {
        title: "ARB Token Integration",
        description: "Integración completa con tokens ARB en Arbitrum. Smart contracts que usan ARB como token de pago, staking, y governance. Optimizado para Layer 2.",
        price: hre.ethers.parseEther("0.2"), // 0.2 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 25
      },
      {
        title: "Optimistic Rollup Development",
        description: "Desarrollo de aplicaciones usando Optimistic Rollups en Arbitrum. Implementación de fraud proofs, challenge periods, y dispute resolution.",
        price: hre.ethers.parseEther("1.0"), // 1.0 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 100
      },
      {
        title: "Arbitrum DeFi Protocols",
        description: "Desarrollo de protocolos DeFi específicos para Arbitrum. DEX con fees bajos, yield farming, y liquidity pools. Optimizado para Layer 2.",
        price: hre.ethers.parseEther("0.8"), // 0.8 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 75
      },
      {
        title: "Layer 2 UI/UX Design",
        description: "Diseño de interfaces para aplicaciones Layer 2. Optimización para transacciones rápidas, indicadores de estado de rollup, y UX de bridges.",
        price: hre.ethers.parseEther("0.15"), // 0.15 ETH
        paymentToken: 0, // ETH
        category: 2, // Diseño
        minReputation: 0
      },
      {
        title: "Arbitrum Marketing Strategy",
        description: "Estrategias de marketing para proyectos en Arbitrum. Community building en Layer 2, educación sobre rollups, y outreach a desarrolladores.",
        price: hre.ethers.parseEther("0.1"), // 0.1 ETH
        paymentToken: 0, // ETH
        category: 3, // Marketing
        minReputation: 0
      },
      {
        title: "Arbitrum Consulting",
        description: "Consultoría especializada en Arbitrum y Layer 2. Análisis de migración desde Ethereum, optimización de gas, y estrategias de deployment.",
        price: hre.ethers.parseEther("0.4"), // 0.4 ETH
        paymentToken: 0, // ETH
        category: 4, // Consultoría
        minReputation: 50
      },
      {
        title: "ARB Token Services",
        description: "Servicios especializados con tokens ARB. Desarrollo de contratos que aceptan ARB como pago, staking pools, y governance mechanisms.",
        price: hre.ethers.parseEther("0.25"), // 0.25 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 25
      },
      {
        title: "Arbitrum Testnet Deployment",
        description: "Deployment completo en Arbitrum Sepolia testnet. Testing de contratos, verificación en Arbiscan, y documentación de deployment.",
        price: hre.ethers.parseEther("0.1"), // 0.1 ETH
        paymentToken: 0, // ETH
        category: 1, // Desarrollo
        minReputation: 0
      }
    ];
    
    // Crear nuevos servicios
    console.log("\n🎯 Creando servicios específicos para Arbitrum Sepolia...");
    let created = 0;
    
    for (let i = 0; i < arbitrumServices.length; i++) {
      const service = arbitrumServices[i];
      
      try {
        console.log(`   ${i + 1}/${arbitrumServices.length}: ${service.title}`);
        console.log(`   💰 Precio: ${hre.ethers.formatEther(service.price)} ETH`);
        
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
      arbitrumServices: created
    };
    
    fs.writeFileSync('deployment-info-arbitrum.json', JSON.stringify(updatedInfo, null, 2));
    
    console.log("\n🎉 SERVICIOS DE ARBITRUM SEPOLIA ACTUALIZADOS EXITOSAMENTE!");
    console.log("=" * 60);
    console.log(`📍 Red: Arbitrum Sepolia (Layer 2 Testnet)`);
    console.log(`🎯 Servicios creados: ${created}`);
    console.log(`📊 Total de servicios: ${finalCount}`);
    console.log(`💰 Tokens soportados: ETH nativo, ARB`);
    console.log(`⭐ Reputación requerida: 0-100 puntos`);
    console.log(`🏆 Optimizado para Bounty Maldo - Hackathon ActivaChains`);
    
    console.log("\n🌐 Verificar en Arbiscan:");
    console.log(`   Marketplace: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    console.log(`   ARB Token: https://sepolia.arbiscan.io/address/${arbAddress}`);
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Conectar wallet a Arbitrum Sepolia");
    console.log("   2. Obtener ETH de testnet faucet");
    console.log("   3. Probar compra de servicios con ETH");
    console.log("   4. Verificar transacciones en Arbiscan");
    console.log("   5. Probar funcionalidades Layer 2");
    
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
