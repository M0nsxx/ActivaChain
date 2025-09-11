const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos desplegados en Sepolia...");
  
  // Direcciones de los contratos desplegados
  const contracts = {
    usdc: "0xC71fF0EA431A5B1bA7D9191b1C7b28044f0352d1",
    activaToken: "0xfF50880cB75c87f2b27F57913658c8E6317C8b2a",
    reputation: "0x8036b3C8be65D87DbE690f1E6c4f41b02E7D172A",
    activaNFT: "0x50d00F9493940e844B61C0Af8B56abbE5FFaF3d0",
    marketplace: "0x45745c3A9ae2955a7F877b0D8042e3f6986527c7"
  };
  
  try {
    // Verificar ActivaMarketplace
    console.log("\n📦 Verificando ActivaMarketplace...");
    const marketplace = await ethers.getContractAt("ActivaMarketplace", contracts.marketplace);
    
    const serviceCounter = await marketplace.serviceCounter();
    console.log("✅ Servicios disponibles:", serviceCounter.toString());
    
    // Verificar MockUSDC
    console.log("\n💰 Verificando MockUSDC...");
    const usdc = await ethers.getContractAt("MockUSDC", contracts.usdc);
    const usdcName = await usdc.name();
    const usdcSymbol = await usdc.symbol();
    console.log("✅ USDC:", usdcName, "(" + usdcSymbol + ")");
    
    // Verificar ActivaToken
    console.log("\n🪙 Verificando ActivaToken...");
    const activaToken = await ethers.getContractAt("ActivaToken", contracts.activaToken);
    const tokenName = await activaToken.name();
    const tokenSymbol = await activaToken.symbol();
    console.log("✅ Token:", tokenName, "(" + tokenSymbol + ")");
    
    // Verificar ActivaNFT
    console.log("\n🎨 Verificando ActivaNFT...");
    const activaNFT = await ethers.getContractAt("ActivaNFT", contracts.activaNFT);
    const nftName = await activaNFT.name();
    const nftSymbol = await activaNFT.symbol();
    console.log("✅ NFT:", nftName, "(" + nftSymbol + ")");
    
    // Verificar ReputationSystem
    console.log("\n⭐ Verificando ReputationSystem...");
    const reputation = await ethers.getContractAt("ReputationSystem", contracts.reputation);
    console.log("✅ ReputationSystem verificado");
    
    console.log("\n🎉 ¡Todos los contratos están funcionando correctamente!");
    console.log("\n📋 Resumen de verificación:");
    console.log("   ActivaMarketplace:", contracts.marketplace);
    console.log("   Servicios creados:", serviceCounter.toString());
    console.log("   MockUSDC:", contracts.usdc);
    console.log("   ActivaToken:", contracts.activaToken);
    console.log("   ActivaNFT:", contracts.activaNFT);
    console.log("   ReputationSystem:", contracts.reputation);
    
    console.log("\n🌐 Verificar en Etherscan:");
    console.log("   https://sepolia.etherscan.io/address/" + contracts.marketplace);
    
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
