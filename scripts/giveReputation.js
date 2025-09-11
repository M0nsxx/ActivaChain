const { ethers } = require("hardhat");

const CONTRACTS = {
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
  marketplace: "0x721aE67eC40BA624486CF9a2fE64309bB11536F3"
};

async function main() {
  console.log("🚀 Dando reputación al deployer...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);

  // Conectar a contratos
  const activaNFT = await ethers.getContractAt("ActivaNFT", CONTRACTS.activaNFT);

  // Verificar reputación actual
  const currentReputation = await activaNFT.reputationScore(deployer.address);
  console.log(`⭐ Reputación actual: ${currentReputation}`);

  if (currentReputation >= 100) {
    console.log("✅ Ya tiene suficiente reputación");
    return;
  }

  // Crear certificación con alta reputación
  console.log("\n📜 Creando certificación...");
  try {
    const tx = await activaNFT.mintCertification(
      deployer.address,
      "ActivaChain Master Developer",
      3, // Nivel avanzado
      200, // Score alto
      "https://api.activachain.com/metadata/master-dev"
    );
    await tx.wait();
    console.log("✅ Certificación creada");

    // Verificar nueva reputación
    const newReputation = await activaNFT.reputationScore(deployer.address);
    console.log(`⭐ Nueva reputación: ${newReputation}`);

    if (newReputation >= 100) {
      console.log("🎉 ¡Reputación suficiente para crear servicios!");
    } else {
      console.log("⚠️  Aún necesita más reputación");
    }
  } catch (error) {
    console.log("❌ Error creando certificación:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
