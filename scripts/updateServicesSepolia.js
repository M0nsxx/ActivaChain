const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Actualizando servicios del marketplace en Sepolia...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  if (network !== 'sepolia') {
    console.log("❌ Este script debe ejecutarse en la red Sepolia");
    process.exit(1);
  }
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  try {
    // Leer información de deployment
    const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-multitoken.json', 'utf8'));
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
    
    // Servicios específicos para Sepolia (Ethereum testnet)
    const sepoliaServices = [
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
    
    // Limpiar servicios existentes (opcional - comentar si quieres mantener los existentes)
    console.log("\n🧹 Limpiando servicios existentes...");
    // Nota: No podemos eliminar servicios del contrato, pero podemos crear nuevos
    
    // Crear nuevos servicios
    console.log("\n🎯 Creando servicios específicos para Sepolia...");
    let created = 0;
    
    for (let i = 0; i < sepoliaServices.length; i++) {
      const service = sepoliaServices[i];
      
      try {
        console.log(`   ${i + 1}/${sepoliaServices.length}: ${service.title}`);
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
      sepoliaServices: created
    };
    
    fs.writeFileSync('deployment-info-multitoken.json', JSON.stringify(updatedInfo, null, 2));
    
    console.log("\n🎉 SERVICIOS DE SEPOLIA ACTUALIZADOS EXITOSAMENTE!");
    console.log("=" * 60);
    console.log(`📍 Red: Sepolia (Ethereum Testnet)`);
    console.log(`🎯 Servicios creados: ${created}`);
    console.log(`📊 Total de servicios: ${finalCount}`);
    console.log(`💰 Tokens soportados: ETH nativo`);
    console.log(`⭐ Reputación requerida: 0-100 puntos`);
    
    console.log("\n🌐 Verificar en Etherscan:");
    console.log(`   Marketplace: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    console.log(`   ARB Token: https://sepolia.etherscan.io/address/${arbAddress}`);
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Conectar wallet a Sepolia");
    console.log("   2. Obtener ETH de testnet faucet");
    console.log("   3. Probar compra de servicios con ETH");
    console.log("   4. Verificar transacciones en Etherscan");
    
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
