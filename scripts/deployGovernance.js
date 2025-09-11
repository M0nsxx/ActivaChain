const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaGovernance...");

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Dirección del token ACTIVA (ajustar según el despliegue real)
  const ACTIVA_TOKEN_ADDRESS = "0x..."; // Reemplazar con la dirección real del token

  // Desplegar el contrato de gobernanza
  const ActivaGovernance = await ethers.getContractFactory("ActivaGovernance");
  const governance = await ActivaGovernance.deploy(ACTIVA_TOKEN_ADDRESS);
  
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();

  console.log("✅ ActivaGovernance desplegado en:", governanceAddress);

  // Verificar el contrato
  console.log("🔍 Verificando contrato...");
  try {
    await hre.run("verify:verify", {
      address: governanceAddress,
      constructorArguments: [ACTIVA_TOKEN_ADDRESS],
    });
    console.log("✅ Contrato verificado exitosamente");
  } catch (error) {
    console.log("❌ Error en verificación:", error.message);
  }

  // Información del despliegue
  const deploymentInfo = {
    network: hre.network.name,
    governanceAddress: governanceAddress,
    activaTokenAddress: ACTIVA_TOKEN_ADDRESS,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("\n📋 Información del despliegue:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Guardar información del despliegue
  const fs = require('fs');
  const filename = `deployment-info-governance-${hre.network.name}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Información guardada en: ${filename}`);

  // Configuración inicial
  console.log("\n⚙️ Configuración inicial:");
  console.log("- Mínimo para proponer: 1,000 ACTIVA tokens");
  console.log("- Período de votación: 7 días");
  console.log("- Quorum requerido: 10,000 ACTIVA tokens");
  console.log("- Umbral de ejecución: 5,000 ACTIVA tokens");
  console.log("- Delay de ejecución: 1 día");

  console.log("\n🎉 ¡Despliegue completado exitosamente!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en el despliegue:", error);
    process.exit(1);
  });
