const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Desplegando ActivaChains con cuenta directa...");
  
  // Configuración directa con la nueva cuenta
  const privateKey = "0xa664aeeb847952b84144df7b9fdecec732e834fc89487b9e0db11deb26fcceba";
  const rpcUrl = "https://sepolia.drpc.org";
  
  // Crear provider y wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl, {
    name: "sepolia",
    chainId: 11155111
  });
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("📝 Cuenta:", wallet.address);
  
  // Verificar balance
  try {
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      console.log("❌ Sin balance para desplegar");
      return;
    }
  } catch (error) {
    console.log("⚠️ No se pudo verificar balance, continuando...");
  }
  
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    deployer: wallet.address,
    contracts: {},
    services: {
      total: 0,
      created: 0
    },
    timestamp: new Date().toISOString()
  };
  
  try {
    // 1. Desplegar MockUSDC
    console.log("\n📦 1/5 Desplegando MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.connect(wallet).deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    deploymentInfo.contracts.usdc = usdcAddress;
    console.log("✅ MockUSDC desplegado en:", usdcAddress);
    
    // 2. Desplegar ActivaToken
    console.log("\n📦 2/5 Desplegando ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.connect(wallet).deploy();
    await activaToken.waitForDeployment();
    const activaTokenAddress = await activaToken.getAddress();
    deploymentInfo.contracts.activaToken = activaTokenAddress;
    console.log("✅ ActivaToken desplegado en:", activaTokenAddress);
    
    // 3. Desplegar ReputationSystem
    console.log("\n📦 3/5 Desplegando ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.connect(wallet).deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    deploymentInfo.contracts.reputation = reputationAddress;
    console.log("✅ ReputationSystem desplegado en:", reputationAddress);
    
    // 4. Desplegar ActivaNFT
    console.log("\n📦 4/5 Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.connect(wallet).deploy(reputationAddress);
    await activaNFT.waitForDeployment();
    const activaNFTAddress = await activaNFT.getAddress();
    deploymentInfo.contracts.activaNFT = activaNFTAddress;
    console.log("✅ ActivaNFT desplegado en:", activaNFTAddress);
    
    // 5. Desplegar ActivaMarketplace
    console.log("\n📦 5/5 Desplegando ActivaMarketplace...");
    const ActivaMarketplace = await ethers.getContractFactory("ActivaMarketplace");
    const marketplace = await ActivaMarketplace.connect(wallet).deploy(usdcAddress, activaNFTAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    deploymentInfo.contracts.marketplace = marketplaceAddress;
    console.log("✅ ActivaMarketplace desplegado en:", marketplaceAddress);
    
    // Crear servicios de prueba
    console.log("\n🎯 Creando servicios de prueba...");
    
    const services = [
      {
        title: "Desarrollo Smart Contract Básico",
        description: "Creación de smart contracts simples para proyectos DeFi. Incluye testing y deployment.",
        priceInUSDC: BigInt(100 * 1e6), // $100 USDC
        category: 1,
        minReputation: 0
      },
      {
        title: "UI/UX para DApps",
        description: "Diseño de interfaces modernas para aplicaciones descentralizadas con glassmorphism.",
        priceInUSDC: BigInt(200 * 1e6), // $200 USDC
        category: 2,
        minReputation: 0
      },
      {
        title: "Marketing Web3",
        description: "Estrategias de marketing digital para proyectos blockchain y DeFi.",
        priceInUSDC: BigInt(150 * 1e6), // $150 USDC
        category: 3,
        minReputation: 0
      }
    ];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      try {
        console.log(`   ${i + 1}/${services.length}: ${service.title}`);
        const tx = await marketplace.createService(
          service.title,
          service.description,
          service.priceInUSDC,
          service.category,
          service.minReputation
        );
        await tx.wait();
        console.log(`   ✅ Creado exitosamente`);
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Verificar servicios creados
    const serviceCounter = await marketplace.serviceCounter();
    deploymentInfo.services.total = Number(serviceCounter);
    deploymentInfo.services.created = Number(serviceCounter);
    console.log(`\n📊 Total de servicios creados: ${serviceCounter}`);
    
    // Guardar información de despliegue
    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 deployment-info.json actualizado");
    
    // Mostrar resumen
    console.log("\n🎉 ¡Despliegue completo exitoso!");
    console.log("📋 Resumen de contratos:");
    console.log("   USDC:", usdcAddress);
    console.log("   ActivaToken:", activaTokenAddress);
    console.log("   ReputationSystem:", reputationAddress);
    console.log("   ActivaNFT:", activaNFTAddress);
    console.log("   ActivaMarketplace:", marketplaceAddress);
    console.log("\n🌐 Verificar en Etherscan:");
    console.log("   https://sepolia.etherscan.io/address/" + marketplaceAddress);
    
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
