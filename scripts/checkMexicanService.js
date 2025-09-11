const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando servicio mexicano...");
  
  // Configuración con Alchemy
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  // Dirección del marketplace
  const marketplaceAddress = "0x45745c3A9ae2955a7F877b0D8042e3f6986527c7";
  
  // ABI simplificado
  const marketplaceABI = [
    {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "services",
      "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "provider", "type": "address"},
        {"internalType": "string", "name": "title", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "uint256", "name": "priceInUSDC", "type": "uint256"},
        {"internalType": "uint8", "name": "category", "type": "uint8"},
        {"internalType": "bool", "name": "isActive", "type": "bool"},
        {"internalType": "uint256", "name": "minReputation", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const marketplace = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
  
  try {
    console.log("\n📋 Verificando servicios...");
    
    // Verificar servicios del 1 al 10
    for (let i = 1; i <= 10; i++) {
      try {
        const service = await marketplace.services(i);
        console.log(`\n✅ Servicio ${i}:`);
        console.log(`   Título: ${service.title}`);
        console.log(`   Precio: $${Number(service.priceInUSDC) / 1e6} USDC`);
        console.log(`   Categoría: ${service.category}`);
        console.log(`   Activo: ${service.isActive}`);
        console.log(`   Proveedor: ${service.provider}`);
        
        // Verificar si es el servicio mexicano
        if (service.title.includes("México") || service.title.includes("Mexican")) {
          console.log("🇲🇽 ¡Servicio mexicano encontrado!");
        }
      } catch (error) {
        // No hay más servicios
        break;
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
