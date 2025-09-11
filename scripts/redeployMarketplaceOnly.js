const { ethers } = require("hardhat");

// Direcciones de contratos existentes
const EXISTING_CONTRACTS = {
  usdc: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28"
};

async function main() {
  console.log("🚀 Redesplegando solo ActivaMarketplace...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Redesplegar ActivaMarketplace
  console.log("\n1️⃣ Redesplegando ActivaMarketplace...");
  const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
  const marketplace = await ActivaMarketplace.deploy(
    EXISTING_CONTRACTS.usdc,
    EXISTING_CONTRACTS.activaNFT
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplace redesplegado a:", marketplaceAddress);

  console.log("\n🎉 ¡MARKETPLACE REDESPLEGADO!");
  console.log("📋 Nueva dirección:", marketplaceAddress);
  console.log("\n🌐 Próximos pasos:");
  console.log("   1. Actualizar .env con nueva dirección");
  console.log("   2. Crear servicios con script separado");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
