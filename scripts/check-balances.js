const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando balances y configuración...");
  
  // Obtener el signer
  const [deployer] = await ethers.getSigners();
  console.log("📄 Cuenta:", deployer.address);
  
  // Network info
  const networkName = hre.network.name;
  const chainId = hre.network.config.chainId;
  console.log("🌐 Red:", networkName, `(Chain ID: ${chainId})`);
  
  // Direcciones según la red
  let addresses;
  if (networkName === "sepolia") {
    addresses = {
      marketplace: "0xCa3bde2c1069ba384a7Cb47991f97B2f1D1DAfd8",
      usdc: "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8",
      arb: "0x912ce59144191c1204e64559fe8253a0e49e6548"
    };
  } else if (networkName === "arbitrumSepolia") {
    addresses = {
      marketplace: "0x91f2522Fba8AD5520556D94fca100520D7d2e48c",
      usdc: "0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086",
      arb: "0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D"
    };
  } else {
    console.error("❌ Red no soportada");
    process.exit(1);
  }
  
  console.log("\n📊 Direcciones de contratos:");
  console.log("  • Marketplace:", addresses.marketplace);
  console.log("  • USDC:", addresses.usdc);
  console.log("  • ARB:", addresses.arb);
  
  try {
    // Balance de ETH
    const ethBalance = await ethers.provider.getBalance(deployer.address);
    console.log("\n💰 Balances:");
    console.log(`  • ETH: ${ethers.formatEther(ethBalance)} ETH`);
    
    // ABI mínimo para ERC20
    const erc20ABI = [
      "function balanceOf(address) view returns (uint256)",
      "function allowance(address,address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ];
    
    // Verificar USDC
    if (addresses.usdc !== "0x0000000000000000000000000000000000000000") {
      const usdcContract = new ethers.Contract(addresses.usdc, erc20ABI, deployer);
      const usdcBalance = await usdcContract.balanceOf(deployer.address);
      const usdcAllowance = await usdcContract.allowance(deployer.address, addresses.marketplace);
      const usdcSymbol = await usdcContract.symbol();
      
      console.log(`  • ${usdcSymbol}: ${ethers.formatUnits(usdcBalance, 6)} USDC`);
      console.log(`    Allowance al Marketplace: ${ethers.formatUnits(usdcAllowance, 6)} USDC`);
    }
    
    // Verificar ARB (si existe)
    if (addresses.arb !== "0x0000000000000000000000000000000000000000") {
      try {
        const arbContract = new ethers.Contract(addresses.arb, erc20ABI, deployer);
        const arbBalance = await arbContract.balanceOf(deployer.address);
        const arbAllowance = await arbContract.allowance(deployer.address, addresses.marketplace);
        const arbSymbol = await arbContract.symbol();
        
        console.log(`  • ${arbSymbol}: ${ethers.formatUnits(arbBalance, 18)} ARB`);
        console.log(`    Allowance al Marketplace: ${ethers.formatUnits(arbAllowance, 18)} ARB`);
      } catch (error) {
        console.log("  • ARB: No disponible en esta red");
      }
    }
    
    // Verificar marketplace
    console.log("\n🏪 Estado del Marketplace:");
    try {
      const marketplaceABI = [
        "function serviceCounter() view returns (uint256)"
      ];
      const marketplace = new ethers.Contract(addresses.marketplace, marketplaceABI, deployer);
      const serviceCount = await marketplace.serviceCounter();
      console.log(`  • Servicios totales: ${serviceCount}`);
    } catch (error) {
      console.log("  • Error al conectar con marketplace:", error.message);
    }
    
    // Recomendaciones
    console.log("\n💡 Recomendaciones:");
    
    const ethBalanceNum = parseFloat(ethers.formatEther(ethBalance));
    if (ethBalanceNum < 0.01) {
      console.log("  ⚠️  Saldo ETH bajo para gas - obtén más ETH del faucet");
      console.log("     → https://faucets.chain.link/sepolia");
    }
    
    if (addresses.usdc !== "0x0000000000000000000000000000000000000000") {
      const usdcContract = new ethers.Contract(addresses.usdc, erc20ABI, deployer);
      const usdcBalance = await usdcContract.balanceOf(deployer.address);
      const usdcBalanceNum = parseFloat(ethers.formatUnits(usdcBalance, 6));
      
      if (usdcBalanceNum < 100) {
        console.log("  ⚠️  Saldo USDC bajo - ejecuta el script de mint:");
        console.log(`     → npx hardhat run scripts/mint-tokens.js --network ${networkName}`);
      }
    }
    
    console.log("\n✅ Verificación completa!");
    
  } catch (error) {
    console.error("❌ Error al verificar balances:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });