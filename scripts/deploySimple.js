const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando ActivaChains en Ethereum Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  try {
    // 1. MockUSDC
    console.log("\n1️⃣ Desplegando MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    console.log("✅ MockUSDC:", usdcAddress);
    
    // 2. ActivaToken
    console.log("\n2️⃣ Desplegando ActivaToken...");
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy(
      "ActivaChain Token",
      "ACTIVA",
      ethers.parseEther("1000000")
    );
    await activaToken.waitForDeployment();
    const activaTokenAddress = await activaToken.getAddress();
    console.log("✅ ActivaToken:", activaTokenAddress);
    
    // 3. ReputationSystem
    console.log("\n3️⃣ Desplegando ReputationSystem...");
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    await reputation.waitForDeployment();
    const reputationAddress = await reputation.getAddress();
    console.log("✅ ReputationSystem:", reputationAddress);
    
    // 4. ActivaNFT
    console.log("\n4️⃣ Desplegando ActivaNFT...");
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    await activaNFT.waitForDeployment();
    const activaNFTAddress = await activaNFT.getAddress();
    console.log("✅ ActivaNFT:", activaNFTAddress);
    
    // 5. ActivaGovernance
    console.log("\n5️⃣ Desplegando ActivaGovernance...");
    const ActivaGovernance = await ethers.getContractFactory("ActivaGovernance");
    const governance = await ActivaGovernance.deploy(activaTokenAddress);
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("✅ ActivaGovernance:", governanceAddress);
    
    // 6. ActivaMarketplaceMultiToken
    console.log("\n6️⃣ Desplegando ActivaMarketplaceMultiToken...");
    const ActivaMarketplaceMultiToken = await ethers.getContractFactory("ActivaMarketplaceMultiToken");
    const marketplace = await ActivaMarketplaceMultiToken.deploy(usdcAddress, usdcAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("✅ ActivaMarketplaceMultiToken:", marketplaceAddress);
    
    // 7. Configurar reputación
    console.log("\n7️⃣ Configurando reputación...");
    const reputationTx = await marketplace.giveReputation(deployer.address, 100);
    await reputationTx.wait();
    console.log("✅ Reputación configurada");
    
    // 8. Crear servicios
    console.log("\n8️⃣ Creando servicios...");
    const services = [
      {
        title: "Desarrollo Smart Contract",
        description: "Desarrollo de contratos inteligentes seguros",
        price: ethers.parseEther("0.1"),
        paymentToken: 0,
        category: 1,
        minReputation: 0
      },
      {
        title: "UI/UX para DApps",
        description: "Diseño de interfaces para DApps",
        price: ethers.parseUnits("50", 6),
        paymentToken: 1,
        category: 2,
        minReputation: 0
      },
      {
        title: "Marketing Web3",
        description: "Estrategias de marketing blockchain",
        price: ethers.parseEther("25"),
        paymentToken: 2,
        category: 3,
        minReputation: 0
      }
    ];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const tx = await marketplace.createService(
        service.title,
        service.description,
        service.price,
        service.paymentToken,
        service.category,
        service.minReputation
      );
      await tx.wait();
      console.log(`   ✅ Servicio ${i + 1}: ${service.title}`);
    }
    
    // 9. Verificar
    const serviceCounter = await marketplace.serviceCounter();
    const fee = await marketplace.platformFee();
    
    console.log("\n🎉 ¡Despliegue exitoso!");
    console.log("\n📊 Resumen:");
    console.log("   MockUSDC:", usdcAddress);
    console.log("   ActivaToken:", activaTokenAddress);
    console.log("   ReputationSystem:", reputationAddress);
    console.log("   ActivaNFT:", activaNFTAddress);
    console.log("   ActivaGovernance:", governanceAddress);
    console.log("   ActivaMarketplaceMultiToken:", marketplaceAddress);
    console.log(`   Servicios: ${serviceCounter}`);
    console.log(`   Comisión: ${fee} basis points (${fee/100}%)`);
    
    // Guardar información
    const deploymentInfo = {
      network: "sepolia",
      chainId: 11155111,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        usdc: usdcAddress,
        activaToken: activaTokenAddress,
        reputation: reputationAddress,
        activaNFT: activaNFTAddress,
        governance: governanceAddress,
        marketplace: marketplaceAddress
      },
      services: Number(serviceCounter),
      platformFee: Number(fee)
    };
    
    const fs = require('fs');
    fs.writeFileSync('deployment-sepolia-final.json', JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🌐 Enlaces:");
    console.log("   Marketplace:", `https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    console.log("   USDC:", `https://sepolia.etherscan.io/address/${usdcAddress}`);
    console.log("   ActivaToken:", `https://sepolia.etherscan.io/address/${activaTokenAddress}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });