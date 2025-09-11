const { ethers } = require("hardhat");

const CONTRACTS = {
  activaNFT: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
  marketplace: "0x721aE67eC40BA624486CF9a2fE64309bB11536F3"
};

async function main() {
  console.log("🔍 Verificando reputación del deployer...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Cuenta:", deployer.address);

  // Conectar a contratos
  const activaNFT = await ethers.getContractAt("ActivaNFT", CONTRACTS.activaNFT);
  const marketplace = await ethers.getContractAt("ActivaMarketplace", CONTRACTS.marketplace);

  // Verificar reputación
  const reputation = await activaNFT.reputationScore(deployer.address);
  console.log(`⭐ Reputación actual: ${reputation}`);

  // Verificar certificaciones
  const certifications = await activaNFT.userCertifications(deployer.address);
  console.log(`📜 Certificaciones: ${certifications.length}`);

  // Mostrar detalles de certificaciones
  for (let i = 0; i < certifications.length; i++) {
    const tokenId = certifications[i];
    const cert = await activaNFT.certifications(tokenId);
    console.log(`   📋 Certificación ${i + 1}:`);
    console.log(`      Nombre: ${cert.courseName}`);
    console.log(`      Nivel: ${cert.level}`);
    console.log(`      Score: ${cert.score}`);
    console.log(`      Fecha: ${new Date(Number(cert.completionDate) * 1000).toLocaleString()}`);
  }

  // Verificar si puede crear servicios
  const canCreateService = reputation >= 100;
  console.log(`\n🔧 Puede crear servicios: ${canCreateService ? '✅ SÍ' : '❌ NO'}`);

  if (!canCreateService) {
    console.log("💡 Solución: Crear más certificaciones o aumentar el score");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
