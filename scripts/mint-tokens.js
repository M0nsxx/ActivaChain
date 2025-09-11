const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando mint de tokens de prueba...");
  
  // Obtener el signer (cuenta del deployer)
  const [deployer] = await ethers.getSigners();
  console.log("📄 Usando cuenta:", deployer.address);
  
  // Direcciones de los contratos según la red
  const networkName = hre.network.name;
  console.log("🌐 Red:", networkName);
  
  let usdcAddress;
  if (networkName === "sepolia") {
    usdcAddress = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8";
  } else if (networkName === "arbitrumSepolia") {
    usdcAddress = "0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086";
  } else {
    console.error("❌ Red no soportada. Usa 'sepolia' o 'arbitrumSepolia'");
    process.exit(1);
  }
  
  console.log("💰 Dirección USDC Mock:", usdcAddress);
  
  // Conectar al contrato USDC Mock
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdcContract = MockUSDC.attach(usdcAddress);
  
  // Verificar balance inicial
  const initialBalance = await usdcContract.balanceOf(deployer.address);
  console.log("💳 Balance inicial USDC:", ethers.formatUnits(initialBalance, 6), "USDC");
  
  // Mintear tokens de prueba (10,000 USDC)
  const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDC
  
  console.log("⏳ Minteando", ethers.formatUnits(mintAmount, 6), "USDC...");
  
  try {
    const tx = await usdcContract.mint(deployer.address, mintAmount, {
      gasLimit: 100000,
      maxFeePerGas: networkName.includes("arbitrum") ? 
        ethers.parseUnits("0.1", "gwei") : 
        ethers.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: networkName.includes("arbitrum") ? 
        ethers.parseUnits("0.01", "gwei") : 
        ethers.parseUnits("2", "gwei")
    });
    
    console.log("📤 Transacción enviada:", tx.hash);
    console.log("⏳ Esperando confirmación...");
    
    const receipt = await tx.wait();
    console.log("✅ Transacción confirmada en el bloque:", receipt.blockNumber);
    
    // Verificar balance final
    const finalBalance = await usdcContract.balanceOf(deployer.address);
    console.log("💳 Balance final USDC:", ethers.formatUnits(finalBalance, 6), "USDC");
    
    console.log("\n🎉 ¡Tokens minteados exitosamente!");
    console.log("📊 Resumen:");
    console.log(`   • Red: ${networkName}`);
    console.log(`   • Contrato USDC: ${usdcAddress}`);
    console.log(`   • Tokens minteados: ${ethers.formatUnits(mintAmount, 6)} USDC`);
    console.log(`   • Balance total: ${ethers.formatUnits(finalBalance, 6)} USDC`);
    
  } catch (error) {
    console.error("❌ Error al mintear tokens:", error);
    
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.log("💡 Solución: Necesitas ETH para gas en tu wallet");
    } else if (error.message?.includes("gas")) {
      console.log("💡 Solución: Ajusta la configuración de gas");
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