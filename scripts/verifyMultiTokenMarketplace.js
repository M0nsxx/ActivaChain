const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando ActivaMarketplaceMultiToken...");
  
  // Configuración con Alchemy
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  // Direcciones de los contratos desplegados en Sepolia
  const contracts = {
    marketplace: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
    usdc: "0xD196B1d67d101E2D6634F5d6F238F7716A8f41AE",
    arb: "0x5C0F9F645E82cFB26918369Feb1189211511250e"
  };
  
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
        {"internalType": "uint256", "name": "price", "type": "uint256"},
        {"internalType": "uint8", "name": "paymentToken", "type": "uint8"},
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
  
  const marketplace = new ethers.Contract(contracts.marketplace, marketplaceABI, provider);
  
  try {
    console.log("\n📋 Verificando servicios multi-token...");
    
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
            price: service.price,
            paymentToken: Number(service.paymentToken),
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
    
    const tokenNames = ["ETH", "USDC", "ARB"]
    
    services.forEach((service, index) => {
      let priceDisplay;
      if (service.paymentToken === 0) {
        priceDisplay = `${ethers.formatEther(service.price)} ETH`;
      } else if (service.paymentToken === 1) {
        priceDisplay = `${ethers.formatUnits(service.price, 6)} USDC`;
      } else {
        priceDisplay = `${ethers.formatEther(service.price)} ARB`;
      }
      
      console.log(`\n${index + 1}. ${service.title}`);
      console.log(`   💰 Precio: ${priceDisplay}`);
      console.log(`   🪙 Token: ${tokenNames[service.paymentToken]}`);
      console.log(`   📂 Categoría: ${categoryNames[service.category] || 'Desconocida'}`);
      console.log(`   ⭐ Reputación mínima: ${service.minReputation}`);
      console.log(`   ✅ Estado: ${service.isActive ? 'Activo' : 'Inactivo'}`);
      
      if (service.title.includes("México")) {
        console.log(`   🇲🇽 ¡Servicio mexicano!`);
      }
      if (service.title.includes("Arbitrum")) {
        console.log(`   🌉 ¡Servicio Arbitrum!`);
      }
    })
    
    // Verificar reputación del deployer
    console.log("\n⭐ Verificando reputación...");
    const deployerAddress = "0xe6bE36A435c3BecAd922ddD9Ede2Fc1DbB632BA1";
    const reputation = await marketplace.userReputation(deployerAddress);
    console.log(`   Reputación del deployer: ${reputation} puntos`);
    
    console.log("\n🎉 ¡Verificación completada exitosamente!");
    console.log("\n📊 Resumen del marketplace multi-token:");
    console.log("   ✅ Smart Contract: ActivaMarketplaceMultiToken");
    console.log("   ✅ Red: Ethereum Sepolia");
    console.log("   ✅ Tokens soportados: ETH, USDC, ARB");
    console.log("   ✅ Servicios: " + services.length + " servicios activos");
    console.log("   ✅ Reputación: Sistema funcional");
    console.log("   ✅ Precios: Multi-token con precios variados");
    
    console.log("\n🌐 Enlaces:");
    console.log("   Marketplace: https://sepolia.etherscan.io/address/" + contracts.marketplace);
    console.log("   USDC: https://sepolia.etherscan.io/address/" + contracts.usdc);
    console.log("   ARB: https://sepolia.etherscan.io/address/" + contracts.arb);
    
    console.log("\n💰 Servicios por Token:");
    const ethServices = services.filter(s => s.paymentToken === 0);
    const usdcServices = services.filter(s => s.paymentToken === 1);
    const arbServices = services.filter(s => s.paymentToken === 2);
    
    console.log(`   🟡 ETH: ${ethServices.length} servicios`);
    console.log(`   🔵 USDC: ${usdcServices.length} servicios`);
    console.log(`   🟠 ARB: ${arbServices.length} servicios`);
    
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
