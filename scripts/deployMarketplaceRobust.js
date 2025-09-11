const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaMarketplace con manejo robusto...");
  
  // Configuración con múltiples RPCs y timeouts
  const rpcUrls = [
    "https://sepolia.drpc.org",
    "https://rpc2.sepolia.org", 
    "https://eth-sepolia.g.alchemy.com/v2/demo"
  ];
  
  const privateKey = "0x2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765";
  
  let provider;
  let wallet;
  
  // Intentar conectar con diferentes RPCs
  for (let i = 0; i < rpcUrls.length; i++) {
    try {
      console.log(`🔗 Intentando RPC ${i + 1}/${rpcUrls.length}: ${rpcUrls[i]}`);
      
      provider = new ethers.JsonRpcProvider(rpcUrls[i], {
        name: "sepolia",
        chainId: 11155111
      }, {
        polling: false,
        staticNetwork: true
      });
      
      wallet = new ethers.Wallet(privateKey, provider);
      
      // Test de conectividad con timeout
      const testPromise = provider.getBlockNumber();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );
      
      await Promise.race([testPromise, timeoutPromise]);
      console.log("✅ RPC conectado exitosamente");
      break;
      
    } catch (error) {
      console.log(`❌ RPC ${i + 1} falló: ${error.message}`);
      if (i === rpcUrls.length - 1) {
        throw new Error("Todos los RPCs fallaron");
      }
    }
  }
  
  console.log("📝 Cuenta:", wallet.address);
  
  // Verificar balance con timeout
  try {
    const balancePromise = provider.getBalance(wallet.address);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 15000)
    );
    
    const balance = await Promise.race([balancePromise, timeoutPromise]);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      console.log("❌ Sin balance para desplegar");
      return;
    }
  } catch (error) {
    console.log("⚠️ No se pudo verificar balance, continuando...");
  }
  
  // Direcciones de contratos existentes
  const USDC_ADDRESS = "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953";
  const ACTIVA_NFT_ADDRESS = "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28";
  
  console.log("📋 Usando contratos existentes:");
  console.log("   USDC:", USDC_ADDRESS);
  console.log("   ActivaNFT:", ACTIVA_NFT_ADDRESS);
  
  // Desplegar ActivaMarketplace con timeout
  console.log("\n📦 Desplegando ActivaMarketplace...");
  
  try {
    const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
    
    // Configurar gas y timeout
    const deployOptions = {
      gasLimit: 3000000,
      gasPrice: ethers.parseUnits("20", "gwei")
    };
    
    const deployPromise = ActivaMarketplace.connect(wallet).deploy(USDC_ADDRESS, ACTIVA_NFT_ADDRESS, deployOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Deploy timeout")), 120000) // 2 minutos
    );
    
    const marketplace = await Promise.race([deployPromise, timeoutPromise]);
    
    console.log("⏳ Esperando confirmación...");
    const waitPromise = marketplace.waitForDeployment();
    const waitTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Wait timeout")), 180000) // 3 minutos
    );
    
    await Promise.race([waitPromise, waitTimeoutPromise]);
    
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
    
    // Actualizar deployment-info.json
    const fs = require("fs");
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"));
    deploymentInfo.contracts.marketplace = marketplaceAddress;
    deploymentInfo.timestamp = new Date().toISOString();
    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 deployment-info.json actualizado");
    
    console.log("\n🎉 ¡Marketplace desplegado exitosamente!");
    console.log("📍 Nueva dirección del marketplace:", marketplaceAddress);
    console.log("🌐 Verificar en: https://sepolia.etherscan.io/address/" + marketplaceAddress);
    
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
