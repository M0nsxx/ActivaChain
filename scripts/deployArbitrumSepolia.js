const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando en Arbitrum Sepolia para Bounty Maldo...");
  
  // Configuración para Arbitrum Sepolia
  const arbitrumRpc = "https://sepolia-rollup.arbitrum.io/rpc";
  const provider = new ethers.JsonRpcProvider(arbitrumRpc);
  
  // Usar la wallet del usuario
  const privateKey = "0xa664aeeb847952b84144df7b9fdecec732e834fc89487b9e0db11deb26fcceba";
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("📋 Información del despliegue:");
  console.log("   Red: Arbitrum Sepolia");
  console.log("   RPC: Arbitrum Sepolia");
  console.log("   Deployer:", deployer.address);
  
  // Verificar balance
  const balance = await provider.getBalance(deployer.address);
  console.log("   Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.001")) {
    throw new Error("❌ Balance insuficiente para el despliegue en Arbitrum Sepolia");
  }
  
  // Desplegar MockUSDC
  console.log("\n📦 Desplegando MockUSDC en Arbitrum Sepolia...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("✅ MockUSDC desplegado en:", usdcAddress);
  
  // Desplegar MockARB
  console.log("\n📦 Desplegando MockARB en Arbitrum Sepolia...");
  const MockARB = await ethers.getContractFactory("MockUSDC");
  const arb = await MockARB.deploy();
  await arb.waitForDeployment();
  const arbAddress = await arb.getAddress();
  console.log("✅ MockARB desplegado en:", arbAddress);
  
  // Desplegar ActivaMarketplaceMultiToken
  console.log("\n📦 Desplegando ActivaMarketplaceMultiToken en Arbitrum Sepolia...");
  const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
  const marketplace = await ActivaMarketplaceMultiToken.deploy(usdcAddress, arbAddress);
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplaceMultiToken desplegado en:", marketplaceAddress);
  
  // Crear servicios optimizados para Arbitrum
  console.log("\n🛠️ Creando servicios para Arbitrum Sepolia...");
  
  const services = [
    {
      title: "Desarrollo DeFi en Arbitrum",
      description: "Creación de protocolos DeFi optimizados para Arbitrum",
      price: ethers.parseEther("0.01"), // 0.01 ETH
      paymentToken: 0, // ETH
      category: 1, // Desarrollo
      minReputation: 0
    },
    {
      title: "Arbitrum Layer 2 Solutions",
      description: "Soluciones de escalabilidad en Layer 2 de Arbitrum",
      price: ethers.parseUnits("25", 6), // 25 USDC
      paymentToken: 1, // USDC
      category: 1, // Desarrollo
      minReputation: 0
    },
    {
      title: "Cross-Chain Bridge Development",
      description: "Desarrollo de puentes entre Ethereum y Arbitrum",
      price: ethers.parseEther("0.02"), // 0.02 ETH
      paymentToken: 0, // ETH
      category: 1, // Desarrollo
      minReputation: 5
    },
    {
      title: "Arbitrum NFT Marketplace",
      description: "Marketplace de NFTs optimizado para Arbitrum",
      price: ethers.parseUnits("50", 6), // 50 USDC
      paymentToken: 1, // USDC
      category: 2, // Diseño
      minReputation: 0
    },
    {
      title: "Gas Optimization Arbitrum",
      description: "Optimización de gas para contratos en Arbitrum",
      price: ethers.parseEther("0.015"), // 0.015 ETH
      paymentToken: 0, // ETH
      category: 1, // Desarrollo
      minReputation: 10
    },
    {
      title: "Consultoría Arbitrum México",
      description: "Servicios de consultoría Arbitrum para empresas mexicanas",
      price: ethers.parseUnits("5", 6), // 5 USDC
      paymentToken: 1, // USDC
      category: 4, // Consultoría
      minReputation: 0
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
  const reputationTx = await marketplace.giveReputation(deployer.address, 100);
  await reputationTx.wait();
  console.log("   ✅ Reputación configurada: 100 puntos");
  
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
    network: "arbitrumSepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      marketplace: marketplaceAddress,
      usdc: usdcAddress,
      arb: arbAddress
    },
    deployer: deployer.address,
    services: services.length,
    reputation: 100,
    supportedTokens: ["ETH", "USDC", "ARB"],
    bounty: "Maldo",
    hackathon: "ActivaChains"
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info-arbitrum.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 ¡Despliegue en Arbitrum Sepolia completado exitosamente!");
  console.log("\n📊 Resumen para Bounty Maldo:");
  console.log("   ✅ ActivaMarketplaceMultiToken desplegado en Arbitrum Sepolia");
  console.log("   ✅ MockUSDC desplegado");
  console.log("   ✅ MockARB desplegado");
  console.log("   ✅ 6 servicios específicos de Arbitrum creados");
  console.log("   ✅ Sistema de reputación configurado");
  console.log("   ✅ Deployer con 100 puntos de reputación");
  console.log("   ✅ Optimizado para ganar el bounty de Maldo");
  
  console.log("\n🌐 Enlaces Arbitrum Sepolia:");
  console.log("   Marketplace:", `https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
  console.log("   USDC:", `https://sepolia.arbiscan.io/address/${usdcAddress}`);
  console.log("   ARB:", `https://sepolia.arbiscan.io/address/${arbAddress}`);
  
  console.log("\n💰 Servicios Arbitrum:");
  console.log("   🌉 DeFi Arbitrum: 0.01 ETH (~$25 USD)");
  console.log("   🔧 Layer 2 Solutions: 25 USDC (~$25 USD)");
  console.log("   🌉 Cross-Chain Bridge: 0.02 ETH (~$50 USD)");
  console.log("   🎨 NFT Marketplace: 50 USDC (~$50 USD)");
  console.log("   ⚡ Gas Optimization: 0.015 ETH (~$37.5 USD)");
  console.log("   🇲🇽 Consultoría México: 5 USDC (~$5 USD)");
  
  console.log("\n🏆 ¡Listo para ganar el bounty de Maldo!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });
