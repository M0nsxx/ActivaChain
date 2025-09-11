const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando conexión del frontend con los smart contracts...");
  
  // Direcciones de los contratos
  const contracts = {
    usdc: "0xC71fF0EA431A5B1bA7D9191b1C7b28044f0352d1",
    activaToken: "0xfF50880cB75c87f2b27F57913658c8E6317C8b2a",
    reputation: "0x8036b3C8be65D87DbE690f1E6c4f41b02E7D172A",
    activaNFT: "0x50d00F9493940e844B61C0Af8B56abbE5FFaF3d0",
    marketplace: "0x45745c3A9ae2955a7F877b0D8042e3f6986527c7"
  };
  
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  try {
    console.log("\n📦 Verificando ActivaMarketplace...");
    const marketplace = await ethers.getContractAt("ActivaMarketplace", contracts.marketplace);
    const serviceCounter = await marketplace.serviceCounter();
    console.log("✅ Servicios disponibles:", serviceCounter.toString());
    
    // Verificar algunos servicios
    if (serviceCounter > 0) {
      console.log("\n🎯 Servicios disponibles:");
      for (let i = 1; i <= Math.min(Number(serviceCounter), 3); i++) {
        try {
          const service = await marketplace.services(i);
          console.log(`   ${i}. ${service.title} - $${Number(service.priceInUSDC) / 1e6} USDC`);
        } catch (error) {
          console.log(`   ${i}. Error leyendo servicio`);
        }
      }
    }
    
    console.log("\n💰 Verificando MockUSDC...");
    const usdc = await ethers.getContractAt("MockUSDC", contracts.usdc);
    const usdcName = await usdc.name();
    console.log("✅ USDC:", usdcName);
    
    console.log("\n🪙 Verificando ActivaToken...");
    const activaToken = await ethers.getContractAt("ActivaToken", contracts.activaToken);
    const tokenName = await activaToken.name();
    console.log("✅ Token:", tokenName);
    
    console.log("\n🎨 Verificando ActivaNFT...");
    const activaNFT = await ethers.getContractAt("ActivaNFT", contracts.activaNFT);
    const nftName = await activaNFT.name();
    console.log("✅ NFT:", nftName);
    
    console.log("\n🎉 ¡Frontend listo para conectar!");
    console.log("\n📋 Instrucciones para usar el marketplace:");
    console.log("   1. Ve a http://localhost:3000");
    console.log("   2. Conecta tu wallet (MetaMask)");
    console.log("   3. Cambia a la red Sepolia");
    console.log("   4. Ve a la sección Marketplace");
    console.log("   5. ¡Crea o compra servicios!");
    
    console.log("\n🌐 Enlaces útiles:");
    console.log("   Frontend: http://localhost:3000");
    console.log("   Etherscan: https://sepolia.etherscan.io/address/" + contracts.marketplace);
    console.log("   Sepolia Faucet: https://sepoliafaucet.com/");
    
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
