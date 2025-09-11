const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaMarketplace...");
  
  // Usar RPC con timeout corto
  const provider = new ethers.JsonRpcProvider("https://rpc2.sepolia.org", {
    name: "sepolia",
    chainId: 11155111
  });
  
  const wallet = new ethers.Wallet("0x2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765", provider);
  
  console.log("📝 Cuenta:", wallet.address);
  
  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Sin balance para desplegar");
    return;
  }
  
  // Direcciones de contratos existentes
  const USDC_ADDRESS = "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953";
  const ACTIVA_NFT_ADDRESS = "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28";
  
  console.log("📋 Usando contratos existentes:");
  console.log("   USDC:", USDC_ADDRESS);
  console.log("   ActivaNFT:", ACTIVA_NFT_ADDRESS);
  
  // Desplegar ActivaMarketplace
  console.log("\n📦 Desplegando ActivaMarketplace...");
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = await ActivaMarketplace.connect(wallet).deploy(USDC_ADDRESS, ACTIVA_NFT_ADDRESS);
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
  
  // Actualizar deployment-info.json
  const fs = require("fs");
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"));
  deploymentInfo.contracts.marketplace = marketplaceAddress;
  deploymentInfo.timestamp = new Date().toISOString();
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 deployment-info.json actualizado");
  
  console.log("\n🎉 ¡Marketplace desplegado exitosamente!");
  console.log("📍 Nueva dirección del marketplace:", marketplaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
