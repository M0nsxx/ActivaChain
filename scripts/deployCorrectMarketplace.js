const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaMarketplaceETH correcto...");
  
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
  
  // Desplegar ActivaMarketplaceETH
  console.log("\n📦 Desplegando ActivaMarketplaceETH...");
  const ActivaMarketplaceETH = await ethers.getContractFactory("ActivaMarketplaceETH");
  const marketplace = await ActivaMarketplaceETH.deploy();
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ ActivaMarketplaceETH desplegado en:", marketplaceAddress);
  
  // Crear servicios de ejemplo con precios en ETH
  console.log("\n🛠️ Creando servicios de ejemplo...");
  
  const services = [
    {
      title: "Desarrollo Smart Contract Básico",
      description: "Creación de smart contracts básicos en Solidity",
      priceInETH: ethers.parseEther("0.01"), // 0.01 ETH
      category: 1, // Desarrollo
      minReputation: 0
    },
    {
      title: "UI/UX para DApps",
      description: "Diseño de interfaces para aplicaciones descentralizadas",
      priceInETH: ethers.parseEther("0.02"), // 0.02 ETH
      category: 2, // Diseño
      minReputation: 0
    },
    {
      title: "Marketing Web3",
      description: "Estrategias de marketing para proyectos blockchain",
      priceInETH: ethers.parseEther("0.015"), // 0.015 ETH
      category: 3, // Marketing
      minReputation: 0
    },
    {
      title: "Consultoría Blockchain",
      description: "Asesoría técnica en proyectos blockchain",
      priceInETH: ethers.parseEther("0.03"), // 0.03 ETH
      category: 4, // Consultoría
      minReputation: 0
    },
    {
      title: "Auditoría de Seguridad",
      description: "Revisión de seguridad de smart contracts",
      priceInETH: ethers.parseEther("0.05"), // 0.05 ETH
      category: 1, // Desarrollo
      minReputation: 10
    },
    {
      title: "Consultoría Blockchain México",
      description: "Servicios de consultoría blockchain para empresas mexicanas",
      priceInETH: ethers.parseEther("0.001"), // 0.001 ETH (equivalente a ~$2.5 USD)
      category: 4, // Consultoría
      minReputation: 0
    }
  ];
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    console.log(`   Creando servicio ${i + 1}: ${service.title}`);
    
    const tx = await marketplace.createService(
      service.title,
      service.description,
      service.priceInETH,
      service.category,
      service.minReputation
    );
    await tx.wait();
    
    console.log(`   ✅ Servicio creado - Precio: ${ethers.formatEther(service.priceInETH)} ETH`);
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
    console.log(`   ${i}. ${service.title} - ${ethers.formatEther(service.priceInETH)} ETH`);
  }
  
  // Guardar información del despliegue
  const deploymentInfo = {
    network: "sepolia",
    timestamp: new Date().toISOString(),
    contracts: {
      marketplace: marketplaceAddress
    },
    deployer: deployer.address,
    services: services.length,
    reputation: 50
  };
  
  const fs = require('fs');
  fs.writeFileSync('deployment-info-eth.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 ¡Despliegue completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log("   ✅ ActivaMarketplaceETH desplegado");
  console.log("   ✅ 6 servicios creados con precios en ETH");
  console.log("   ✅ Sistema de reputación configurado");
  console.log("   ✅ Deployer con 50 puntos de reputación");
  
  console.log("\n🌐 Enlaces:");
  console.log("   Etherscan:", `https://sepolia.etherscan.io/address/${marketplaceAddress}`);
  console.log("   Contrato:", marketplaceAddress);
  
  console.log("\n💰 Precios en ETH:");
  console.log("   Consultoría México: 0.001 ETH (~$2.5 USD)");
  console.log("   Desarrollo Básico: 0.01 ETH (~$25 USD)");
  console.log("   Marketing Web3: 0.015 ETH (~$37.5 USD)");
  console.log("   UI/UX DApps: 0.02 ETH (~$50 USD)");
  console.log("   Consultoría: 0.03 ETH (~$75 USD)");
  console.log("   Auditoría: 0.05 ETH (~$125 USD)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:", error);
    process.exit(1);
  });
