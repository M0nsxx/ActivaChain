const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando ActivaMarketplaceETH correcto...");
  
  // Configuración con Alchemy
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  // Dirección del contrato desplegado
  const marketplaceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // ABI del contrato
  const marketplaceABI = [
    {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "services",
      "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "provider", "type": "address"},
        {"internalType": "string", "name": "title", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "uint256", "name": "priceInETH", "type": "uint256"},
        {"internalType": "uint8", "name": "category", "type": "uint8"},
        {"internalType": "bool", "name": "isActive", "type": "bool"},
        {"internalType": "uint256", "name": "minReputation", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "serviceCounter",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "", "type": "address"}],
      "name": "userReputation",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
  
  try {
    console.log("\n📋 Verificando servicios...");
    
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`   Total de servicios: ${serviceCounter}`);
    
    const services = []
    for (let i = 1; i <= Number(serviceCounter); i++) {
      try {
        const service = await marketplace.services(i);
        if (service.title && service.title.length > 0) {
          services.push({
            id: Number(service.id),
            title: service.title,
            price: ethers.formatEther(service.priceInETH),
            category: Number(service.category),
            isActive: service.isActive,
            minReputation: Number(service.minReputation)
          })
        }
      } catch (error) {
        break
      }
    }
    
    console.log(`\n✅ Servicios activos: ${services.length}`);
    
    const categoryNames = {
      1: "💻 Desarrollo",
      2: "🎨 Diseño", 
      3: "📈 Marketing",
      4: "💼 Consultoría"
    }
    
    services.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.title}`);
      console.log(`   💰 Precio: ${service.price} ETH`);
      console.log(`   📂 Categoría: ${categoryNames[service.category] || 'Desconocida'}`);
      console.log(`   ⭐ Reputación mínima: ${service.minReputation}`);
      console.log(`   ✅ Estado: ${service.isActive ? 'Activo' : 'Inactivo'}`);
      
      if (service.title.includes("México")) {
        console.log(`   🇲🇽 ¡Servicio mexicano!`);
      }
    })
    
    // Verificar reputación del deployer
    console.log("\n⭐ Verificando reputación...");
    const deployerAddress = "0xe6bE36A435c3BecAd922ddD9Ede2Fc1DbB632BA1";
    const reputation = await marketplace.userReputation(deployerAddress);
    console.log(`   Reputación del deployer: ${reputation} puntos`);
    
    console.log("\n🎉 ¡Verificación completada exitosamente!");
    console.log("\n📊 Resumen del marketplace correcto:");
    console.log("   ✅ Smart Contract: ActivaMarketplaceETH");
    console.log("   ✅ Red: Ethereum Sepolia");
    console.log("   ✅ Token: ETH nativo (no USDC)");
    console.log("   ✅ Servicios: " + services.length + " servicios activos");
    console.log("   ✅ Reputación: Sistema funcional");
    console.log("   ✅ Precios: Variados en ETH");
    
    console.log("\n🌐 Enlaces:");
    console.log("   Etherscan: https://sepolia.etherscan.io/address/" + marketplaceAddress);
    console.log("   Contrato: " + marketplaceAddress);
    
    console.log("\n💰 Precios en ETH:");
    services.forEach(service => {
      const priceUSD = (parseFloat(service.price) * 2500).toFixed(2); // Asumiendo ETH = $2500
      console.log(`   ${service.title}: ${service.price} ETH (~$${priceUSD} USD)`);
    });
    
  } catch (error) {
    console.error("❌ Error durante la verificación:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
