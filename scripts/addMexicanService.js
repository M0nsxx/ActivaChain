const { ethers } = require("hardhat");

async function main() {
  console.log("🇲🇽 Creando servicio mexicano con valor de 50 MXN...");
  
  // Configuración con Alchemy
  const privateKey = "0xa664aeeb847952b84144df7b9fdecec732e834fc89487b9e0db11deb26fcceba";
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7";
  
  // Crear provider y wallet
  const provider = new ethers.JsonRpcProvider(alchemyUrl, {
    name: "sepolia",
    chainId: 11155111
  });
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("📝 Cuenta deployer:", wallet.address);
  
  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  // Dirección del marketplace desplegado
  const marketplaceAddress = "0x45745c3A9ae2955a7F877b0D8042e3f6986527c7";
  const marketplace = await ethers.getContractAt("ActivaMarketplace", marketplaceAddress);
  
  // Calcular precio en USDC
  // 50 MXN ≈ $2.5 USD (aproximado)
  // Para Sepolia, usaremos un valor simbólico de $2.5 USDC
  const priceInUSDC = BigInt(2.5 * 1e6); // $2.5 USDC en wei
  
  console.log("\n🎯 Creando servicio mexicano...");
  console.log("   Título: Consultoría Blockchain México");
  console.log("   Precio: $2.5 USDC (equivalente a 50 MXN)");
  console.log("   Categoría: Consultoría");
  
  try {
    const tx = await marketplace.connect(wallet).createService(
      "Consultoría Blockchain México",
      "Servicio especializado en implementación de soluciones blockchain para empresas mexicanas. Incluye asesoría en regulaciones locales, integración con sistemas existentes y capacitación del equipo. Perfecto para PyMEs que quieren adoptar tecnología Web3.",
      priceInUSDC,
      4, // Consultoría
      0  // Sin requisito de reputación mínima
    );
    
    console.log("⏳ Esperando confirmación...");
    await tx.wait();
    console.log("✅ Servicio mexicano creado exitosamente!");
    
    // Verificar servicios totales
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`\n📊 Total de servicios en el marketplace: ${serviceCounter}`);
    
    console.log("\n🎉 ¡Servicio mexicano agregado al marketplace!");
    console.log("🌐 Verificar en Etherscan:");
    console.log("   https://sepolia.etherscan.io/address/" + marketplaceAddress);
    
  } catch (error) {
    console.error("❌ Error creando servicio:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
