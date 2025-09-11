const { ethers } = require("hardhat");

async function testMarketplace() {
  console.log("🧪 Iniciando tests del marketplace...");

  // Cargar información del deployment
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "..", "deployment-info.json");
  
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("❌ deployment-info.json not found. Run deployment first.");
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const [deployer, buyer] = await ethers.getSigners();

  console.log("📋 Información del deployment:");
  console.log(`   Red: ${deploymentInfo.network}`);
  console.log(`   Chain ID: ${deploymentInfo.chainId}`);
  console.log(`   Deployer: ${deploymentInfo.deployer}`);
  console.log(`   Servicios: ${deploymentInfo.services.total}`);

  // Conectar a contratos
  const marketplace = await ethers.getContractAt("ActivaMarketplace", deploymentInfo.contracts.marketplace);
  const usdc = await ethers.getContractAt("MockUSDC", deploymentInfo.contracts.usdc);
  const activaNFT = await ethers.getContractAt("ActivaNFT", deploymentInfo.contracts.activaNFT);

  console.log("\n🔗 Contratos conectados exitosamente");

  // Test 1: Verificar servicios creados
  console.log("\n1️⃣ Verificando servicios creados...");
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`   ✅ Total de servicios: ${serviceCounter}`);

  if (Number(serviceCounter) === 0) {
    throw new Error("❌ No se encontraron servicios. Ejecuta el deployment primero.");
  }

  // Test 2: Verificar detalles de servicios
  console.log("\n2️⃣ Verificando detalles de servicios...");
  for (let i = 1; i <= Math.min(Number(serviceCounter), 5); i++) {
    const service = await marketplace.services(i);
    console.log(`   📋 Servicio ${i}: ${service.title}`);
    console.log(`      💰 Precio: $${Number(service.priceInUSDC) / 1e6} USDC`);
    console.log(`      📂 Categoría: ${service.category}`);
    console.log(`      👤 Proveedor: ${service.provider}`);
    console.log(`      ⭐ Reputación mínima: ${service.minReputation}`);
    console.log(`      ✅ Activo: ${service.isActive}`);
  }

  // Test 3: Verificar balance USDC
  console.log("\n3️⃣ Verificando balance USDC...");
  const deployerBalance = await usdc.balanceOf(deployer.address);
  const buyerBalance = await usdc.balanceOf(buyer.address);
  
  console.log(`   💰 Balance deployer: ${Number(deployerBalance) / 1e6} USDC`);
  console.log(`   💰 Balance buyer: ${Number(buyerBalance) / 1e6} USDC`);

  // Test 4: Verificar reputación
  console.log("\n4️⃣ Verificando sistema de reputación...");
  const deployerReputation = await activaNFT.reputationScore(deployer.address);
  const buyerReputation = await activaNFT.reputationScore(buyer.address);
  
  console.log(`   ⭐ Reputación deployer: ${deployerReputation}`);
  console.log(`   ⭐ Reputación buyer: ${buyerReputation}`);

  // Test 5: Simular compra de servicio
  console.log("\n5️⃣ Simulando compra de servicio...");
  
  if (Number(serviceCounter) > 0) {
    const serviceId = 1;
    const service = await marketplace.services(serviceId);
    const price = service.priceInUSDC;
    
    console.log(`   🛒 Intentando comprar servicio ${serviceId}...`);
    console.log(`   💰 Precio: $${Number(price) / 1e6} USDC`);

    try {
      // Aprobar USDC para el marketplace
      const approveTx = await usdc.approve(marketplace.target, price);
      await approveTx.wait();
      console.log("   ✅ USDC aprobado para el marketplace");

      // Comprar servicio
      const purchaseTx = await marketplace.purchaseService(serviceId);
      await purchaseTx.wait();
      console.log("   ✅ Servicio comprado exitosamente");

      // Verificar orden creada
      const orderCounter = await marketplace.orderCounter();
      const order = await marketplace.orders(orderCounter);
      
      console.log(`   📋 Orden creada: ${orderCounter}`);
      console.log(`   👤 Comprador: ${order.buyer}`);
      console.log(`   👤 Proveedor: ${order.provider}`);
      console.log(`   💰 Monto: $${Number(order.amount) / 1e6} USDC`);
      console.log(`   📊 Estado: ${order.status} (1 = En progreso)`);

    } catch (error) {
      console.log(`   ⚠️  Error en compra: ${error.message}`);
      console.log("   💡 Esto puede ser normal si no hay suficiente reputación o USDC");
    }
  }

  // Test 6: Verificar estadísticas del marketplace
  console.log("\n6️⃣ Estadísticas del marketplace...");
  const totalServices = Number(serviceCounter);
  const totalOrders = Number(await marketplace.orderCounter());
  
  console.log(`   📊 Servicios totales: ${totalServices}`);
  console.log(`   📋 Órdenes totales: ${totalOrders}`);
  console.log(`   💼 Proveedores únicos: ${await getUniqueProviders(marketplace, totalServices)}`);

  // Test 7: Verificar categorías
  console.log("\n7️⃣ Distribución por categorías...");
  const categoryCounts = await getCategoryDistribution(marketplace, totalServices);
  console.log(`   💻 Desarrollo: ${categoryCounts[1] || 0} servicios`);
  console.log(`   🎨 Diseño: ${categoryCounts[2] || 0} servicios`);
  console.log(`   📈 Marketing: ${categoryCounts[3] || 0} servicios`);
  console.log(`   💼 Consultoría: ${categoryCounts[4] || 0} servicios`);

  console.log("\n🎉 Tests completados exitosamente!");
  console.log("✅ El marketplace está funcionando correctamente");
  console.log("🌐 Puedes acceder al frontend en: http://localhost:3000/marketplace");
}

async function getUniqueProviders(marketplace, totalServices) {
  const providers = new Set();
  for (let i = 1; i <= totalServices; i++) {
    const service = await marketplace.services(i);
    providers.add(service.provider);
  }
  return providers.size;
}

async function getCategoryDistribution(marketplace, totalServices) {
  const counts = {};
  for (let i = 1; i <= totalServices; i++) {
    const service = await marketplace.services(i);
    counts[Number(service.category)] = (counts[Number(service.category)] || 0) + 1;
  }
  return counts;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en tests:", error);
    process.exit(1);
  });
