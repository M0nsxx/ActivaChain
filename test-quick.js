const { expect } = require("chai");
const { ethers } = require("hardhat");

async function quickTest() {
  console.log("🧪 Ejecutando tests rápidos de ActivaChain...");
  
  try {
    // Deploy contracts
    console.log("📦 Deployando contratos...");
    
    const [owner, user1, user2] = await ethers.getSigners();
    
    const ActivaNFT = await ethers.getContractFactory("ActivaNFT");
    const activaNFT = await ActivaNFT.deploy();
    
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    
    const ActivaToken = await ethers.getContractFactory("ActivaToken");
    const activaToken = await ActivaToken.deploy(
      "ActivaChain Token",
      "ACTIVA",
      ethers.parseEther("1000000")
    );
    
    const Marketplace = await ethers.getContractFactory("ActivaMarketplace");
    const marketplace = await Marketplace.deploy(await mockUSDC.getAddress(), await activaNFT.getAddress());
    
    const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
    const reputation = await ReputationSystem.deploy();
    
    console.log("✅ Contratos deployados exitosamente");
    
    // Test 1: Mint NFT certification
    console.log("🎓 Probando mint de certificación NFT...");
    await activaNFT.mintCertification(
      user1.address,
      "Blockchain Basics",
      1,
      100,
      "ipfs://test"
    );
    
    const certs = await activaNFT.getUserCertifications(user1.address);
    console.log(`✅ Certificación minteada. Total: ${certs.length}`);
    
    // Test 2: ZK Proof verification
    console.log("🔐 Probando verificación ZK...");
    const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));
    await reputation.verifyIdentityWithZK(proofHash, "0x1234");
    
    const rep = await reputation.getReputation(owner.address);
    console.log(`✅ Usuario verificado. Reputación: ${rep.score}`);
    
    // Test 3: Marketplace service creation
    console.log("💼 Probando creación de servicio...");
    await marketplace.connect(user1).createService(
      "Smart Contract Development",
      "I will develop a smart contract for you",
      ethers.parseUnits("100", 6),
      1,
      50
    );
    
    const service = await marketplace.getServiceDetails(1);
    console.log(`✅ Servicio creado: ${service.title}`);
    
    // Test 4: Token staking
    console.log("💰 Probando staking de tokens...");
    await activaToken.transfer(user1.address, ethers.parseEther("1000"));
    await activaToken.connect(user1).stake(ethers.parseEther("100"));
    
    const stakingInfo = await activaToken.getStakingInfo(user1.address);
    console.log(`✅ Tokens staked: ${ethers.formatEther(stakingInfo.balance)} ACTIVA`);
    
    console.log("\n🎉 ¡Todos los tests pasaron exitosamente!");
    console.log("\n📊 Resumen de contratos:");
    console.log(`ActivaNFT: ${await activaNFT.getAddress()}`);
    console.log(`ActivaToken: ${await activaToken.getAddress()}`);
    console.log(`Marketplace: ${await marketplace.getAddress()}`);
    console.log(`ReputationSystem: ${await reputation.getAddress()}`);
    console.log(`MockUSDC: ${await mockUSDC.getAddress()}`);
    
  } catch (error) {
    console.error("❌ Error en los tests:", error.message);
    process.exit(1);
  }
}

quickTest();
