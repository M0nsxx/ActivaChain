const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Probando funcionalidad del marketplace...");
  
  const [deployer] = await ethers.getSigners();
  const networkName = hre.network.name;
  
  // Direcciones según la red
  let addresses;
  if (networkName === "sepolia") {
    addresses = {
      marketplace: "0xCa3bde2c1069ba384a7Cb47991f97B2f1D1DAfd8",
      usdc: "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"
    };
  } else if (networkName === "arbitrumSepolia") {
    addresses = {
      marketplace: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      usdc: "0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086"
    };
  } else {
    console.error("❌ Red no soportada");
    process.exit(1);
  }
  
  console.log(`🌐 Probando en ${networkName}`);
  console.log("📄 Cuenta:", deployer.address);
  
  try {
    // ABIs
    const marketplaceABI = [
      "function serviceCounter() view returns (uint256)",
      "function createService(string,string,uint256,uint8,uint8,uint256)",
      "function services(uint256) view returns (uint256,address,string,string,uint256,uint8,uint8,bool,uint256)",
      "function purchaseServiceWithToken(uint256,uint256)"
    ];
    
    const erc20ABI = [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address,uint256) returns (bool)",
      "function allowance(address,address) view returns (uint256)"
    ];
    
    // Conectar contratos
    const marketplace = new ethers.Contract(addresses.marketplace, marketplaceABI, deployer);
    const usdc = new ethers.Contract(addresses.usdc, erc20ABI, deployer);
    
    // Verificar estado inicial
    const serviceCount = await marketplace.serviceCounter();
    const usdcBalance = await usdc.balanceOf(deployer.address);
    
    console.log("\n📊 Estado inicial:");
    console.log(`  • Servicios en marketplace: ${serviceCount}`);
    console.log(`  • Balance USDC: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
    
    // Verificar que tenemos suficiente USDC
    const minRequired = ethers.parseUnits("500", 6); // 500 USDC mínimo
    if (usdcBalance < minRequired) {
      console.log("\n⚠️  Insuficiente USDC para pruebas. Ejecutando mint...");
      
      // Mintear USDC
      const MockUSDC = await ethers.getContractFactory("MockUSDC");
      const mockUsdc = MockUSDC.attach(addresses.usdc);
      
      const mintAmount = ethers.parseUnits("5000", 6);
      const mintTx = await mockUsdc.mint(deployer.address, mintAmount, {
        gasLimit: 100000
      });
      await mintTx.wait();
      
      console.log("✅ USDC minteado exitosamente");
    }
    
    // Test 1: Crear un servicio
    console.log("\n🧪 Test 1: Crear servicio...");
    
    const gasConfig = networkName.includes("arbitrum") ? {
      gasLimit: 400000,
      maxFeePerGas: ethers.parseUnits("0.1", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("0.01", "gwei")
    } : {
      gasLimit: 300000,
      maxFeePerGas: ethers.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
    };
    
    try {
      const createTx = await marketplace.createService(
        "Test Service - Desarrollo Web3",
        "Servicio de prueba para testing del marketplace",
        ethers.parseUnits("100", 6), // 100 USDC
        1, // USDC token
        0, // Desarrollo category
        0, // Min reputation
        gasConfig
      );
      
      console.log("📤 Transacción de creación enviada:", createTx.hash);
      await createTx.wait();
      console.log("✅ Servicio creado exitosamente");
    } catch (error) {
      console.error("❌ Error creando servicio:", error.message);
    }
    
    // Obtener el último servicio creado
    const newServiceCount = await marketplace.serviceCounter();
    console.log(`📊 Nuevo contador de servicios: ${newServiceCount}`);
    
    if (newServiceCount > 0) {
      // Test 2: Probar compra con USDC
      console.log("\n🧪 Test 2: Comprar servicio con USDC...");
      
      const serviceId = newServiceCount; // El último servicio creado
      const serviceData = await marketplace.services(serviceId);
      const servicePrice = serviceData[4]; // precio
      
      console.log(`💰 Precio del servicio: ${ethers.formatUnits(servicePrice, 6)} USDC`);
      
      // Verificar balance actual
      const currentBalance = await usdc.balanceOf(deployer.address);
      console.log(`💳 Balance actual: ${ethers.formatUnits(currentBalance, 6)} USDC`);
      
      if (currentBalance >= servicePrice) {
        // Paso 1: Approve
        console.log("📝 Aprobando USDC...");
        const approveTx = await usdc.approve(addresses.marketplace, servicePrice, {
          gasLimit: 80000,
          ...gasConfig
        });
        await approveTx.wait();
        console.log("✅ USDC aprobado");
        
        // Verificar allowance
        const allowance = await usdc.allowance(deployer.address, addresses.marketplace);
        console.log(`🔐 Allowance: ${ethers.formatUnits(allowance, 6)} USDC`);
        
        // Paso 2: Comprar
        console.log("🛒 Comprando servicio...");
        const purchaseTx = await marketplace.purchaseServiceWithToken(serviceId, servicePrice, {
          gasLimit: 200000,
          ...gasConfig
        });
        await purchaseTx.wait();
        console.log("✅ Servicio comprado exitosamente");
        
        // Verificar balance final
        const finalBalance = await usdc.balanceOf(deployer.address);
        console.log(`💳 Balance final: ${ethers.formatUnits(finalBalance, 6)} USDC`);
        
      } else {
        console.log("⚠️  Balance insuficiente para compra");
      }
    }
    
    console.log("\n🎉 Pruebas completadas exitosamente!");
    
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    
    if (error.message?.includes("insufficient funds")) {
      console.log("💡 Solución: Necesitas más ETH para gas");
    } else if (error.message?.includes("transfer amount exceeds balance")) {
      console.log("💡 Solución: Ejecuta el script de mint para obtener USDC");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });