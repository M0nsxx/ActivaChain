const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando balance del wallet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Wallet address:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log("💰 Balance:", balanceInEth, "ETH");
  
  if (parseFloat(balanceInEth) < 0.01) {
    console.log("⚠️  Balance bajo. Necesitas al menos 0.01 ETH para el deployment.");
    console.log("💡 Obtén ETH de testnet en: https://sepoliafaucet.com/");
    return false;
  } else {
    console.log("✅ Balance suficiente para el deployment.");
    return true;
  }
}

main()
  .then((hasFunds) => {
    if (hasFunds) {
      console.log("🚀 Listo para deployment!");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
