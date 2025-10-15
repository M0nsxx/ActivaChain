const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando UnifiedReputationSystem...");
  
  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Desplegar el contrato unificado
  const UnifiedReputationSystem = await ethers.getContractFactory("UnifiedReputationSystem");
  const unifiedReputation = await UnifiedReputationSystem.deploy();
  
  await unifiedReputation.waitForDeployment();
  const address = await unifiedReputation.getAddress();
  
  console.log("✅ UnifiedReputationSystem deployed to:", address);
  
  // Verificar configuración inicial
  const decayConfig = await unifiedReputation.decayConfig();
  console.log("⚙️ Configuración inicial:");
  console.log("   - Decay Period:", decayConfig.decayPeriod.toString(), "segundos");
  console.log("   - Max Decay:", decayConfig.maxDecayPercent.toString(), "%");
  console.log("   - Activity Threshold:", decayConfig.activityThreshold.toString(), "segundos");
  
  // Verificar constantes
  console.log("📊 Constantes del sistema:");
  console.log("   - Endorsement Cooldown:", (await unifiedReputation.ENDORSEMENT_COOLDOWN()).toString());
  console.log("   - Verification Bonus:", (await unifiedReputation.VERIFICATION_BONUS()).toString());
  console.log("   - Endorsement Bonus:", (await unifiedReputation.ENDORSEMENT_BONUS()).toString());
  console.log("   - Activity Bonus:", (await unifiedReputation.ACTIVITY_BONUS()).toString());
  console.log("   - Min Reputation to Endorse:", (await unifiedReputation.MIN_REPUTATION_TO_ENDORSE()).toString());
  
  // Guardar información de deployment
  const deploymentInfo = {
    network: network.name,
    unifiedReputation: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    gasUsed: "TBD" // Se puede obtener del receipt
  };
  
  console.log("📋 Información de deployment:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Guardar en archivo
  const fs = require('fs');
  const filename = `deployment-info-unified-reputation-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Información guardada en: ${filename}`);
  
  console.log("\n🎉 ¡Deployment completado exitosamente!");
  console.log("📖 Próximos pasos:");
  console.log("   1. Verificar contrato en el explorador");
  console.log("   2. Migrar datos del sistema anterior");
  console.log("   3. Actualizar frontend con nueva dirección");
  console.log("   4. Probar funcionalidades");
  console.log("   5. Desactivar contratos antiguos");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el deployment:", error);
    process.exit(1);
  });
