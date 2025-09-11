const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔧 Configurando variables de entorno para el frontend...");
  
  // Direcciones de los contratos multi-token desplegados en Sepolia
  const contractAddresses = {
    USDC: "0xD196B1d67d101E2D6634F5d6F238F7716A8f41AE",
    ARB: "0x5C0F9F645E82cFB26918369Feb1189211511250e",
    MARKETPLACE: "0xd7458887a104a6F7505b86fAab960eF1834491e4",
    // Legacy contracts (no usados en multi-token)
    ACTIVA_NFT: "0x0000000000000000000000000000000000000000",
    ACTIVA_TOKEN: "0x0000000000000000000000000000000000000000",
    REPUTATION: "0x0000000000000000000000000000000000000000"
  };
  
  const envContent = `# ActivaChains - Multi-Token Marketplace (DESPLEGADO EXITOSAMENTE)
# Ethereum Sepolia - Marketplace Multi-Token
NEXT_PUBLIC_SEPOLIA_MARKETPLACE=${contractAddresses.MARKETPLACE}
NEXT_PUBLIC_SEPOLIA_USDC=${contractAddresses.USDC}
NEXT_PUBLIC_SEPOLIA_ARB=${contractAddresses.ARB}

# Legacy contracts (no usados en multi-token)
NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT=${contractAddresses.ACTIVA_NFT}
NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN=${contractAddresses.ACTIVA_TOKEN}
NEXT_PUBLIC_SEPOLIA_REPUTATION=${contractAddresses.REPUTATION}

# Arbitrum Sepolia - Bounty Maldo
NEXT_PUBLIC_ARBITRUM_MARKETPLACE=0x91f2522Fba8AD5520556D94fca100520D7d2e48c
NEXT_PUBLIC_ARBITRUM_USDC=0x4f9F5A2c70da70Ffa8e63b6cb362687fB2E29086
NEXT_PUBLIC_ARBITRUM_ARB=0x0483Cc05aD323020BFD463CE5A986edFa8DCa68D
NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_ARBITRUM_REPUTATION=0x0000000000000000000000000000000000000000

# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=c2b93e3f5a3a9b146ef83026c4d17a67

# ✅ MARKETPLACE MULTI-TOKEN DESPLEGADO - 2025-09-10
# 🌐 Ethereum Sepolia: https://sepolia.etherscan.io/address/${contractAddresses.MARKETPLACE}
# 🌉 Arbitrum Sepolia: https://sepolia.arbiscan.io/address/0x91f2522Fba8AD5520556D94fca100520D7d2e48c
`;
  
  const frontendEnvPath = path.join(__dirname, "..", "frontend", ".env.local");
  
  try {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("✅ Archivo .env.local creado en el frontend");
    console.log("📍 Ubicación:", frontendEnvPath);
    
    console.log("\n📋 Variables de entorno configuradas:");
    console.log("   🏪 Marketplace Multi-Token:", contractAddresses.MARKETPLACE);
    console.log("   💰 USDC:", contractAddresses.USDC);
    console.log("   🪙 ARB:", contractAddresses.ARB);
    console.log("   🌉 Arbitrum Marketplace:", "0x91f2522Fba8AD5520556D94fca100520D7d2e48c");
    
    console.log("\n🚀 Próximos pasos:");
    console.log("   1. cd frontend");
    console.log("   2. npm run dev");
    console.log("   3. Conecta tu wallet a Sepolia");
    console.log("   4. ¡Usa el marketplace!");
    
  } catch (error) {
    console.error("❌ Error creando archivo .env.local:", error.message);
    console.log("\n📝 Crea manualmente el archivo frontend/.env.local con:");
    console.log(envContent);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });