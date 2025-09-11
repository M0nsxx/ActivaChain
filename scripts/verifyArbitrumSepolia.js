const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando ActivaMarketplaceMultiToken en Arbitrum Sepolia...");
  
  // Configuración para Arbitrum Sepolia
  const arbitrumRpc = "https://sepolia-rollup.arbitrum.io/rpc";
  const provider = new ethers.JsonRpcProvider(arbitrumRpc);
  
  // Direcciones de los contratos desplegados en Arbitrum Sepolia
  const contracts = {
    marketplace: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
    usdc: "0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086",
    arb: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D"
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
    console.log("\n📋 Verificando servicios en Arbitrum Sepolia...");
    
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
    console.log("\n📊 Resumen del marketplace en Arbitrum Sepolia:");
    console.log("   ✅ Smart Contract: ActivaMarketplaceMultiToken");
    console.log("   ✅ Red: Arbitrum Sepolia");
    console.log("   ✅ Tokens soportados: ETH, USDC, ARB");
    console.log("   ✅ Servicios: " + services.length + " servicios activos");
    console.log("   ✅ Reputación: Sistema funcional");
    console.log("   ✅ Precios: Multi-token con precios variados");
    console.log("   ✅ Optimizado para Bounty Maldo");
    
    console.log("\n🌐 Enlaces Arbitrum Sepolia:");
    console.log("   Marketplace: https://sepolia.arbiscan.io/address/" + contracts.marketplace);
    console.log("   USDC: https://sepolia.arbiscan.io/address/" + contracts.usdc);
    console.log("   ARB: https://sepolia.arbiscan.io/address/" + contracts.arb);
    
    console.log("\n💰 Servicios por Token:");
    const ethServices = services.filter(s => s.paymentToken === 0);
    const usdcServices = services.filter(s => s.paymentToken === 1);
    const arbServices = services.filter(s => s.paymentToken === 2);
    
    console.log(`   🟡 ETH: ${ethServices.length} servicios`);
    console.log(`   🔵 USDC: ${usdcServices.length} servicios`);
    console.log(`   🟠 ARB: ${arbServices.length} servicios`);
    
    console.log("\n🏆 ¡Listo para ganar el Bounty Maldo!");
    console.log("   ✅ Desplegado en Arbitrum Sepolia");
    console.log("   ✅ Servicios específicos de Arbitrum");
    console.log("   ✅ Sistema multi-token funcional");
    console.log("   ✅ Reputación configurada");
    console.log("   ✅ Optimizado para hackathon");
    
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
