const hre = require("hardhat");

async function main() {
  console.log("🧪 Probando lectura de servicios del marketplace...");
  
  const network = hre.network.name;
  console.log(`📍 Red actual: ${network}`);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Usando cuenta:", deployer.address);

  try {
    // Leer información de deployment
    let deploymentInfo;
    let marketplaceAddress;
    
    if (network === 'sepolia') {
      deploymentInfo = JSON.parse(require('fs').readFileSync('deployment-info-multitoken.json', 'utf8'));
      marketplaceAddress = deploymentInfo.contracts.marketplace;
    } else if (network === 'arbitrumSepolia') {
      deploymentInfo = JSON.parse(require('fs').readFileSync('deployment-info-arbitrum.json', 'utf8'));
      marketplaceAddress = deploymentInfo.contracts.marketplace;
    } else {
      console.log("❌ Red no soportada. Use 'sepolia' o 'arbitrumSepolia'");
      process.exit(1);
    }
    
    console.log(`📋 Marketplace: ${marketplaceAddress}`);
    
    // Conectar al marketplace
    const marketplace = await hre.ethers.getContractAt("ActivaMarketplaceMultiToken", marketplaceAddress);
    
    // Obtener contador de servicios
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`📊 Total de servicios: ${serviceCounter}`);
    
    // Leer algunos servicios específicos
    const servicesToTest = network === 'arbitrumSepolia' ? [33, 34, 35, 36, 37] : [16, 17, 18, 19, 20];
    
    console.log(`\n🔍 Probando servicios ${servicesToTest.join(', ')}...`);
    
    for (const serviceId of servicesToTest) {
      try {
        if (Number(serviceCounter) >= serviceId) {
          const service = await marketplace.services(serviceId);
          console.log(`\n📋 Servicio ${serviceId}:`);
          console.log(`   ID: ${service.id}`);
          console.log(`   Título: ${service.title}`);
          console.log(`   Precio: ${hre.ethers.formatEther(service.price)}`);
          console.log(`   Token de pago: ${service.paymentToken === 0 ? 'ETH' : 'ARB'}`);
          console.log(`   Categoría: ${service.category}`);
          console.log(`   Activo: ${service.isActive}`);
          console.log(`   Reputación mínima: ${service.minReputation}`);
          console.log(`   Proveedor: ${service.provider}`);
        } else {
          console.log(`   Servicio ${serviceId}: No existe`);
        }
      } catch (error) {
        console.log(`   Servicio ${serviceId}: Error - ${error.message}`);
      }
    }
    
    // Probar balance de ARB
    console.log(`\n💰 Probando balance de ARB...`);
    const arbAddress = network === 'arbitrumSepolia' ? "0x0eBdB4cf4b72E806A0c55059B301797aE6629f6D" : "0x912CE59144191C1204E64559FE8253a0e49E6548";
    const arbToken = await hre.ethers.getContractAt("IERC20", arbAddress);
    
    try {
      const balance = await arbToken.balanceOf(deployer.address);
      console.log(`   Balance de ARB: ${hre.ethers.formatEther(balance)} ARB`);
    } catch (error) {
      console.log(`   Error leyendo balance de ARB: ${error.message}`);
    }
    
    console.log("\n✅ Prueba completada");
    
  } catch (error) {
    console.error("❌ Error en la prueba:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
