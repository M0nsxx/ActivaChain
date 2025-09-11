const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Creando servicios con tu cuenta personal...");
  
  // IMPORTANTE: Conecta tu wallet personal aquí
  // Reemplaza con tu private key o usa MetaMask
  const privateKey = "TU_PRIVATE_KEY_AQUI"; // ⚠️ CAMBIA ESTO
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  
  const provider = new ethers.JsonRpcProvider(alchemyUrl, {
    name: "sepolia",
    chainId: 11155111
  });
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("📝 Tu cuenta:", wallet.address);
  
  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Tu balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Sin balance para crear servicios");
    console.log("💡 Obtén ETH de: https://sepoliafaucet.com/");
    return;
  }
  
  // Dirección del marketplace desplegado
  const marketplaceAddress = "0x45745c3A9ae2955a7F877b0D8042e3f6986527c7";
  const marketplace = await ethers.getContractAt("ActivaMarketplace", marketplaceAddress);
  
  console.log("\n🎯 Creando servicios con tu cuenta...");
  
  const myServices = [
    {
      title: "Mi Servicio de Desarrollo Web3",
      description: "Desarrollo de aplicaciones descentralizadas con React y Solidity. Especializado en DeFi y NFTs.",
      priceInUSDC: BigInt(250 * 1e6), // $250 USDC
      category: 1, // Desarrollo
      minReputation: 0
    },
    {
      title: "Consultoría Blockchain Personalizada",
      description: "Asesoría técnica para implementar soluciones blockchain en tu empresa. Análisis de casos de uso.",
      priceInUSDC: BigInt(400 * 1e6), // $400 USDC
      category: 4, // Consultoría
      minReputation: 0
    },
    {
      title: "Auditoría de Smart Contracts",
      description: "Revisión completa de seguridad para tus contratos inteligentes. Reporte detallado de vulnerabilidades.",
      priceInUSDC: BigInt(600 * 1e6), // $600 USDC
      category: 1, // Desarrollo
      minReputation: 0
    }
  ];
  
  for (let i = 0; i < myServices.length; i++) {
    const service = myServices[i];
    try {
      console.log(`\n   ${i + 1}/${myServices.length}: ${service.title}`);
      console.log(`   💰 Precio: $${Number(service.priceInUSDC) / 1e6} USDC`);
      
      const tx = await marketplace.connect(wallet).createService(
        service.title,
        service.description,
        service.priceInUSDC,
        service.category,
        service.minReputation
      );
      
      console.log("   ⏳ Esperando confirmación...");
      await tx.wait();
      console.log("   ✅ Servicio creado exitosamente");
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  // Verificar servicios totales
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`\n📊 Total de servicios en el marketplace: ${serviceCounter}`);
  
  console.log("\n🎉 ¡Servicios creados con tu cuenta personal!");
  console.log("💡 Ahora puedes ver tus servicios en el frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
