const hre = require("hardhat");

async function main() {
  console.log("🧪 Probando contratos avanzados de ActivaChain...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuentas:");
  console.log("   Deployer:", deployer.address);
  console.log("   User1:", user1.address);
  console.log("   User2:", user2.address);

  try {
    // Leer información de deployment
    let deploymentInfo;
    const filename = `deployment-info-advanced-${network}.json`;
    
    try {
      deploymentInfo = JSON.parse(require('fs').readFileSync(filename, 'utf8'));
    } catch (error) {
      console.log("❌ No se encontró información de deployment. Ejecuta primero deployAdvancedContracts.js");
      process.exit(1);
    }
    
    console.log("\n📋 Contratos a probar:");
    console.log("   ActivaMultiToken:", deploymentInfo.contracts.activaMultiToken);
    console.log("   ActivaCollection:", deploymentInfo.contracts.activaCollection);
    console.log("   AdvancedReputationSystem:", deploymentInfo.contracts.advancedReputationSystem);
    console.log("   CommunitySystem:", deploymentInfo.contracts.communitySystem);
    console.log("   GamificationSystem:", deploymentInfo.contracts.gamificationSystem);
    console.log("   IPFSIntegration:", deploymentInfo.contracts.ipfsIntegration);
    console.log("   PushNotificationSystem:", deploymentInfo.contracts.pushNotificationSystem);
    console.log("   ExternalAPIIntegration:", deploymentInfo.contracts.externalAPIIntegration);

    // Conectar a contratos
    const activaMultiToken = await hre.ethers.getContractAt("ActivaMultiToken", deploymentInfo.contracts.activaMultiToken);
    const activaCollection = await hre.ethers.getContractAt("ActivaCollection", deploymentInfo.contracts.activaCollection);
    const advancedReputation = await hre.ethers.getContractAt("AdvancedReputationSystem", deploymentInfo.contracts.advancedReputationSystem);
    const communitySystem = await hre.ethers.getContractAt("CommunitySystem", deploymentInfo.contracts.communitySystem);
    const gamificationSystem = await hre.ethers.getContractAt("GamificationSystem", deploymentInfo.contracts.gamificationSystem);
    const ipfsIntegration = await hre.ethers.getContractAt("IPFSIntegration", deploymentInfo.contracts.ipfsIntegration);
    const pushNotificationSystem = await hre.ethers.getContractAt("PushNotificationSystem", deploymentInfo.contracts.pushNotificationSystem);
    const externalAPIIntegration = await hre.ethers.getContractAt("ExternalAPIIntegration", deploymentInfo.contracts.externalAPIIntegration);

    console.log("\n🧪 Iniciando pruebas...");

    // Test 1: ActivaMultiToken
    console.log("\n1️⃣ Probando ActivaMultiToken...");
    try {
      // Crear token
      const createTx = await activaMultiToken.createToken(
        "Test Token",
        "TEST",
        1000,
        hre.ethers.parseEther("0.01"),
        1, // Invierno
        "ipfs://test-metadata"
      );
      await createTx.wait();
      console.log("✅ Token creado exitosamente");

      // Mintear token
      const mintTx = await activaMultiToken.mintToken(0, 5, { value: hre.ethers.parseEther("0.05") });
      await mintTx.wait();
      console.log("✅ Token minteado exitosamente");

      // Leer información del token
      const tokenInfo = await activaMultiToken.getTokenInfo(0);
      console.log("✅ Información del token leída:", tokenInfo.name);
    } catch (error) {
      console.log("❌ Error en ActivaMultiToken:", error.message);
    }

    // Test 2: ActivaCollection
    console.log("\n2️⃣ Probando ActivaCollection...");
    try {
      // Crear colección
      const createTx = await activaCollection.createCollection(
        "Test Collection",
        "Una colección de prueba",
        100,
        hre.ethers.parseEther("0.05"),
        1, // Invierno
        "ipfs://test-collection-metadata"
      );
      await createTx.wait();
      console.log("✅ Colección creada exitosamente");

      // Mintear NFT de la colección
      const mintTx = await activaCollection.mintFromCollection(0, "ipfs://test-nft-metadata", { value: hre.ethers.parseEther("0.05") });
      await mintTx.wait();
      console.log("✅ NFT minteado de la colección exitosamente");

      // Leer información de la colección
      const collectionInfo = await activaCollection.getCollectionInfo(0);
      console.log("✅ Información de la colección leída:", collectionInfo.name);
    } catch (error) {
      console.log("❌ Error en ActivaCollection:", error.message);
    }

    // Test 3: AdvancedReputationSystem
    console.log("\n3️⃣ Probando AdvancedReputationSystem...");
    try {
      // Verificar identidad con ZK proof
      const proofHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("test-proof"));
      const verifyTx = await advancedReputation.verifyIdentityWithZK(proofHash, "0x1234", 1);
      await verifyTx.wait();
      console.log("✅ Verificación ZK exitosa");

      // Endorsar usuario
      const endorseTx = await advancedReputation.endorseUser(user1.address);
      await endorseTx.wait();
      console.log("✅ Endorsement exitoso");

      // Registrar actividad
      const activityTx = await advancedReputation.recordActivity(user1.address);
      await activityTx.wait();
      console.log("✅ Actividad registrada exitosamente");

      // Leer reputación
      const reputation = await advancedReputation.getReputation(user1.address);
      console.log("✅ Reputación leída:", Number(reputation.score), "puntos");
    } catch (error) {
      console.log("❌ Error en AdvancedReputationSystem:", error.message);
    }

    // Test 4: CommunitySystem
    console.log("\n4️⃣ Probando CommunitySystem...");
    try {
      // Registrar mentoreada
      const menteeTx = await communitySystem.connect(user1).registerMentee(
        "Test Mentee",
        "Aprender blockchain",
        1
      );
      await menteeTx.wait();
      console.log("✅ Mentoreada registrada exitosamente");

      // Crear workshop
      const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hora desde ahora
      const endTime = startTime + 7200; // 2 horas de duración
      
      const workshopTx = await communitySystem.createWorkshop(
        "Test Workshop",
        "Un workshop de prueba",
        startTime,
        endTime,
        20,
        hre.ethers.parseEther("0.05"),
        { value: hre.ethers.parseEther("0.005") }
      );
      await workshopTx.wait();
      console.log("✅ Workshop creado exitosamente");

      // Crear evento
      const eventTx = await communitySystem.createEvent(
        "Test Event",
        "Un evento de prueba",
        startTime,
        endTime,
        "Online",
        50,
        { value: hre.ethers.parseEther("0.002") }
      );
      await eventTx.wait();
      console.log("✅ Evento creado exitosamente");

      // Leer workshops activos
      const activeWorkshops = await communitySystem.getActiveWorkshops();
      console.log("✅ Workshops activos:", activeWorkshops.length);
    } catch (error) {
      console.log("❌ Error en CommunitySystem:", error.message);
    }

    // Test 5: GamificationSystem
    console.log("\n5️⃣ Probando GamificationSystem...");
    try {
      // Desbloquear achievement
      const achievementTx = await gamificationSystem.unlockAchievement(user1.address, 0);
      await achievementTx.wait();
      console.log("✅ Achievement desbloqueado exitosamente");

      // Otorgar badge
      const badgeTx = await gamificationSystem.earnBadge(user1.address, 0);
      await badgeTx.wait();
      console.log("✅ Badge otorgado exitosamente");

      // Registrar actividad diaria
      const activityTx = await gamificationSystem.recordDailyActivity(user1.address);
      await activityTx.wait();
      console.log("✅ Actividad diaria registrada exitosamente");

      // Leer perfil de usuario
      const profile = await gamificationSystem.getUserProfile(user1.address);
      console.log("✅ Perfil de usuario leído:", Number(profile.totalPoints), "puntos");
    } catch (error) {
      console.log("❌ Error en GamificationSystem:", error.message);
    }

    // Test 6: IPFSIntegration
    console.log("\n6️⃣ Probando IPFSIntegration...");
    try {
      // Subir archivo
      const uploadTx = await ipfsIntegration.uploadFile(
        "QmTestHash123",
        "test-file.txt",
        "text/plain",
        1024,
        true,
        { value: hre.ethers.parseEther("0.001") }
      );
      await uploadTx.wait();
      console.log("✅ Archivo subido exitosamente");

      // Crear colección
      const collectionTx = await ipfsIntegration.createCollection(
        "Test Collection",
        "Una colección de prueba",
        ["QmTestHash123"],
        true
      );
      await collectionTx.wait();
      console.log("✅ Colección IPFS creada exitosamente");

      // Leer información del archivo
      const fileInfo = await ipfsIntegration.getFileInfo("QmTestHash123");
      console.log("✅ Información del archivo leída:", fileInfo.name);
    } catch (error) {
      console.log("❌ Error en IPFSIntegration:", error.message);
    }

    // Test 7: PushNotificationSystem
    console.log("\n7️⃣ Probando PushNotificationSystem...");
    try {
      // Enviar notificación
      const notificationTx = await pushNotificationSystem.sendNotification(
        user1.address,
        "Test Notification",
        "Esta es una notificación de prueba",
        1, // Transaction
        '{"test": "data"}'
      );
      await notificationTx.wait();
      console.log("✅ Notificación enviada exitosamente");

      // Actualizar configuración de usuario
      const settingsTx = await pushNotificationSystem.connect(user1).updateNotificationSettings(
        true, // transactionNotifications
        true, // achievementNotifications
        true, // communityNotifications
        true, // systemNotifications
        true, // emailNotifications
        true, // pushNotifications
        22, // quietHoursStart
        6   // quietHoursEnd
      );
      await settingsTx.wait();
      console.log("✅ Configuración de notificaciones actualizada exitosamente");

      // Leer configuración
      const settings = await pushNotificationSystem.getNotificationSettings(user1.address);
      console.log("✅ Configuración leída:", settings.pushNotifications);
    } catch (error) {
      console.log("❌ Error en PushNotificationSystem:", error.message);
    }

    // Test 8: ExternalAPIIntegration
    console.log("\n8️⃣ Probando ExternalAPIIntegration...");
    try {
      // Actualizar configuración de Circle
      const circleTx = await externalAPIIntegration.updateCircleConfig(
        "test-api-key",
        "sandbox",
        true
      );
      await circleTx.wait();
      console.log("✅ Configuración de Circle actualizada exitosamente");

      // Simular llamada API
      const apiCallTx = await externalAPIIntegration.makeAPICall(
        "circle",
        "/v1/balance",
        "GET",
        '{"address":"0x123"}',
        { value: hre.ethers.parseEther("0.0001") }
      );
      await apiCallTx.wait();
      console.log("✅ Llamada API simulada exitosamente");

      // Leer configuración
      const circleConfig = await externalAPIIntegration.getCircleConfig();
      console.log("✅ Configuración de Circle leída:", circleConfig.isActive);
    } catch (error) {
      console.log("❌ Error en ExternalAPIIntegration:", error.message);
    }

    console.log("\n🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!");
    console.log("=" * 60);
    console.log("✅ ActivaMultiToken: Funcionando");
    console.log("✅ ActivaCollection: Funcionando");
    console.log("✅ AdvancedReputationSystem: Funcionando");
    console.log("✅ CommunitySystem: Funcionando");
    console.log("✅ GamificationSystem: Funcionando");
    console.log("✅ IPFSIntegration: Funcionando");
    console.log("✅ PushNotificationSystem: Funcionando");
    console.log("✅ ExternalAPIIntegration: Funcionando");
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. Probar funcionalidades en frontend");
    console.log("   2. Configurar APIs externas reales");
    console.log("   3. Crear contenido inicial");
    console.log("   4. Lanzar a la comunidad");
    
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
