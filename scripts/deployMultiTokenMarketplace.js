const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaMarketplaceMultiToken...");
  
  // Configuración con Alchemy
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  const provider = new ethers.JsonRpcProvider(alchemyUrl);
  
  // Usar la clave privada del usuario
  const privateKey = "0xa664aeeb847952b84144df7b9fdecec732e834fc89487b9e0db11deb26fcceba";
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("📋 Información del despliegue:");
  console.log("   Red: Ethereum Sepolia");
  console.log("   RPC: Alchemy");
  console.log("   Deployer:", deployer.address);
  
  // Verificar balance
  const balance = await provider.getBalance(deployer.address);
  console.log("   Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    throw new Error("❌ Balance insuficiente para el despliegue");
  }
  
  // Desplegar MockUSDC primero
  console.log("\n📦 Desplegando MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("✅ MockUSDC desplegado en:", usdcAddress);
  
  // Desplegar MockARB (usaremos MockUSDC como base)
  console.log("\n📦 Desplegando MockARB...");
  const MockARB = await ethers.getContractFactory("MockUSDC");
  const arb = await MockARB.deploy();
  await arb.waitForDeployment();
  const arbAddress = await arb.getAddress();
  console.log("✅ MockARB desplegado en:", arbAddress);
  
  // Desplegar ActivaMarketplaceMultiToken
  console.log("\n📦 Desplegando ActivaMarketplaceMultiToken...");
  const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
  const marketplace = await ActivaMarketplaceMultiToken.deploy(usdcAddress, arbAddress);
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
  
  // Crear servicios de ejemplo con diferentes tokens de pago
  console.log("\n🛠️ Creando servicios multi-token...");
  
  const services = [
    {
      title: "Desarrollo Smart Contract Básico",
      description: "Creación de smart contracts básicos en Solidity",
      price: ethers.parseEther("0.01"), // 0.01 ETH
      paymentToken: 0, // ETH
      category: 1, // Desarrollo
      minReputation: 0
    },
    {
      title: "UI/UX para DApps",
      description: "Diseño de interfaces para aplicaciones descentralizadas",
      price: ethers.parseUnits("50", 6), // 50 USDC (6 decimals)
      paymentToken: 1, // USDC
      category: 2, // Diseño
      minReputation: 0
    },
    {
      title: "Marketing Web3",
      description: "Estrategias de marketing para proyectos blockchain",
      price: ethers.parseEther("0.015"), // 0.015 ETH
      paymentToken: 0, // ETH
      category: 3, // Marketing
      minReputation: 0
    },
    {
      title: "Consultoría Blockchain",
      description: "Asesoría técnica en proyectos blockchain",
      price: ethers.parseUnits("100", 6), // 100 USDC
      paymentToken: 1, // USDC
      category: 4, // Consultoría
      minReputation: 0
    },
    {
      title: "Auditoría de Seguridad",
      description: "Revisión de seguridad de smart contracts",
      price: ethers.parseEther("0.05"), // 0.05 ETH
      paymentToken: 0, // ETH
      category: 1, // Desarrollo
      minReputation: 10
    },
    {
      title: "Consultoría Blockchain México",
      description: "Servicios de consultoría blockchain para empresas mexicanas",
      price: ethers.parseUnits("2.5", 6), // 2.5 USDC (equivalente a ~50 MXN)
      paymentToken: 1, // USDC
      category: 4, // Consultoría
      minReputation: 0
    },
    {
      title: "Desarrollo DeFi en Arbitrum",
      description: "Desarrollo de protocolos DeFi en la red Arbitrum",
      price: ethers.parseEther("0.02"), // 0.02 ARB
      paymentToken: 2, // ARB
      category: 1, // Desarrollo
      minReputation: 5
    }
  ];
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const tokenNames = ["ETH", "USDC", "ARB"];
    console.log(`   Creando servicio ${i + 1}: ${service.title} (${tokenNames[service.paymentToken]})`);
    
    const tx = await marketplace.createService(
      service.title,
      service.description,
      service.price,
      service.paymentToken,
      service.category,
      service.minReputation
    );
    await tx.wait();
    
    let priceDisplay;
    if (service.paymentToken === 0) {
      priceDisplay = `${ethers.formatEther(service.price)} ETH`;
    } else if (service.paymentToken === 1) {
      priceDisplay = `${ethers.formatUnits(service.price, 6)} USDC`;
    } else {
      priceDisplay = `${ethers.formatEther(service.price)} ARB`;
    }
    
    console.log(`   ✅ Servicio creado - Precio: ${priceDisplay}`);
  }
  
  // Dar reputación al deployer
  console.log("\n⭐ Configurando reputación...");
  const reputationTx = await marketplace.giveReputation(deployer.address, 50);
  await reputationTx.wait();
  console.log("   ✅ Reputación configurada: 50 puntos");
  
  // Verificar servicios creados
  console.log("\n🔍 Verificando servicios creados...");
  const serviceCounter = await marketplace.serviceCounter();
  console.log(`   Total de servicios: ${serviceCounter}`);
  
  for (let i = 1; i <= Number(serviceCounter); i++) {
    const service = await marketplace.services(i);
    const tokenNames = ["ETH", "USDC", "ARB"];
    let priceDisplay;
    if (service.paymentToken === 0) {
      priceDisplay = `${ethers.formatEther(service.price)} ETH`;
    } else if (service.paymentToken === 1) {
      priceDisplay = `${ethers.formatUnits(service.price, 6)} USDC`;
    } else {
      priceDisplay = `${ethers.formatEther(service.price)} ARB`;
    }
    console.log(`   ${i}. ${service.title} - ${priceDisplay}`);
  }
  
  // Guardar información del despliegue
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      marketplace: marketplaceAddress,
      usdc: usdcAddress,
      arb: arbAddress
    },
    deployer: deployer.address,
    services: services.length,
    reputation: 50,
    supportedTokens: ["ETH", "USDC", "ARB"]
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info-multitoken.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 ¡Despliegue completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log("   ✅ ActivaMarketplaceMultiToken desplegado");
  console.log("   ✅ MockUSDC desplegado");
  console.log("   ✅ MockARB desplegado");
  console.log("   ✅ 7 servicios creados con múltiples tokens");
  console.log("   ✅ Sistema de reputación configurado");
  console.log("   ✅ Deployer con 50 puntos de reputación");
  
  console.log("\n🌐 Enlaces:");
  console.log("   Marketplace:", `https://sepolia.etherscan.io/address/${marketplaceAddress}`);
  console.log("   USDC:", `https://sepolia.etherscan.io/address/${usdcAddress}`);
  console.log("   ARB:", `https://sepolia.etherscan.io/address/${arbAddress}`);
  
  console.log("\n💰 Servicios Multi-Token:");
  console.log("   🇲🇽 Consultoría México: 2.5 USDC (~$2.5 USD)");
  console.log("   💻 Desarrollo Básico: 0.01 ETH (~$25 USD)");
  console.log("   🎨 UI/UX DApps: 50 USDC (~$50 USD)");
  console.log("   📈 Marketing Web3: 0.015 ETH (~$37.5 USD)");
  console.log("   💼 Consultoría: 100 USDC (~$100 USD)");
  console.log("   🔒 Auditoría: 0.05 ETH (~$125 USD)");
  console.log("   🌉 DeFi Arbitrum: 0.02 ARB (~$50 USD)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });
