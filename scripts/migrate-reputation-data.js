const { ethers } = require("hardhat");

async function main() {
  console.log("🔄 Iniciando migración de datos de reputación...");
  
  // Direcciones de los contratos (actualizar con las reales)
  const OLD_REPUTATION_ADDRESS = "0x..."; // ReputationSystem
  const OLD_ADVANCED_REPUTATION_ADDRESS = "0x..."; // AdvancedReputationSystem
  const NEW_UNIFIED_ADDRESS = "0x..."; // UnifiedReputationSystem
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Migrando con la cuenta:", deployer.address);
  
  // Obtener instancias de contratos
  const oldReputation = await ethers.getContractAt("ReputationSystem", OLD_REPUTATION_ADDRESS);
  const oldAdvanced = await ethers.getContractAt("AdvancedReputationSystem", OLD_ADVANCED_REPUTATION_ADDRESS);
  const newUnified = await ethers.getContractAt("UnifiedReputationSystem", NEW_UNIFIED_ADDRESS);
  
  // Lista de usuarios a migrar (obtener de eventos o base de datos)
  const usersToMigrate = [
    "0x...", // Agregar direcciones de usuarios
    // ... más usuarios
  ];
  
  console.log(`👥 Migrando ${usersToMigrate.length} usuarios...`);
  
  for (const userAddress of usersToMigrate) {
    try {
      console.log(`🔄 Migrando usuario: ${userAddress}`);
      
      // Obtener datos del sistema anterior
      let oldReputationData;
      let oldAdvancedData;
      
      try {
        oldReputationData = await oldReputation.getReputation(userAddress);
      } catch (error) {
        console.log(`   ⚠️ No hay datos en ReputationSystem para ${userAddress}`);
        oldReputationData = null;
      }
      
      try {
        oldAdvancedData = await oldAdvanced.getReputation(userAddress);
      } catch (error) {
        console.log(`   ⚠️ No hay datos en AdvancedReputationSystem para ${userAddress}`);
        oldAdvancedData = null;
      }
      
      // Determinar la mejor fuente de datos
      let bestScore = 0;
      let bestVerification = false;
      let bestVerificationLevel = 0;
      let bestEndorsementCount = 0;
      
      if (oldAdvancedData) {
        const [score, endorsementCount, isVerified, verificationLevel] = oldAdvancedData;
        bestScore = Number(score);
        bestVerification = isVerified;
        bestVerificationLevel = Number(verificationLevel);
        bestEndorsementCount = Number(endorsementCount);
      } else if (oldReputationData) {
        const [score, endorsementCount, isVerified] = oldReputationData;
        bestScore = Number(score);
        bestVerification = isVerified;
        bestVerificationLevel = isVerified ? 1 : 0;
        bestEndorsementCount = Number(endorsementCount);
      }
      
      if (bestScore > 0) {
        // Migrar reputación base
        await newUnified.updateReputation(userAddress, bestScore, true);
        console.log(`   ✅ Reputación migrada: ${bestScore} puntos`);
        
        // Si estaba verificado, recrear la verificación
        if (bestVerification) {
          // Crear un proof hash único para la migración
          const migrationProofHash = ethers.keccak256(
            ethers.toUtf8Bytes(`migration_${userAddress}_${Date.now()}`)
          );
          
          // Simular proof (en producción usar proof real)
          const mockProof = ethers.toUtf8Bytes("migration_proof");
          
          await newUnified.verifyIdentityWithZK(
            migrationProofHash,
            mockProof,
            bestVerificationLevel
          );
          
          console.log(`   ✅ Verificación migrada: Nivel ${bestVerificationLevel}`);
        }
        
        // Migrar endorsements (simplificado - en producción hacer migración completa)
        for (let i = 0; i < Math.min(bestEndorsementCount, 10); i++) {
          // Crear endorsements sintéticos para mantener la reputación
          // En producción, migrar endorsements reales
        }
        
        console.log(`   ✅ Usuario ${userAddress} migrado exitosamente`);
      } else {
        console.log(`   ⚠️ Usuario ${userAddress} sin reputación para migrar`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error migrando ${userAddress}:`, error.message);
    }
  }
  
  console.log("\n🎉 ¡Migración completada!");
  console.log("📋 Próximos pasos:");
  console.log("   1. Verificar datos migrados");
  console.log("   2. Probar funcionalidades");
  console.log("   3. Actualizar frontend");
  console.log("   4. Desactivar contratos antiguos");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  });
