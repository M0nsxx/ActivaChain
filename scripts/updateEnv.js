const fs = require("fs");
const path = require("path");

function updateEnvFile(deploymentInfo) {
  const envPath = path.join(__dirname, "..", ".env.local");
  const envExamplePath = path.join(__dirname, "..", "env.example");
  
  // Leer el archivo .env.example como base
  let envContent = "";
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, "utf8");
  }

  // Determinar la red basada en el chainId
  const isArbitrum = deploymentInfo.chainId === 421614n;
  const networkPrefix = isArbitrum ? "ARBITRUM" : "SEPOLIA";

  // Actualizar las direcciones de contratos
  const contractUpdates = {
    [`NEXT_PUBLIC_${networkPrefix}_USDC`]: deploymentInfo.contracts.usdc,
    [`NEXT_PUBLIC_${networkPrefix}_ACTIVA_NFT`]: deploymentInfo.contracts.activaNFT,
    [`NEXT_PUBLIC_${networkPrefix}_ACTIVA_TOKEN`]: deploymentInfo.contracts.activaToken,
    [`NEXT_PUBLIC_${networkPrefix}_MARKETPLACE`]: deploymentInfo.contracts.marketplace,
    [`NEXT_PUBLIC_${networkPrefix}_REPUTATION`]: deploymentInfo.contracts.reputation
  };

  // Aplicar las actualizaciones
  for (const [key, value] of Object.entries(contractUpdates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const newLine = `${key}=${value}`;
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  }

  // Agregar información del deployment
  envContent += `\n# Deployment info\n`;
  envContent += `# Deployed on: ${deploymentInfo.timestamp}\n`;
  envContent += `# Network: ${deploymentInfo.network}\n`;
  envContent += `# Chain ID: ${deploymentInfo.chainId}\n`;
  envContent += `# Services created: ${deploymentInfo.services.total}\n`;

  // Escribir el archivo .env.local
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Updated .env.local with contract addresses`);
}

function main() {
  const deploymentPath = path.join(__dirname, "..", "deployment-info.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment-info.json not found. Run deployment first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  updateEnvFile(deploymentInfo);
  
  console.log("🎉 Environment variables updated successfully!");
  console.log("📝 Next steps:");
  console.log("   1. Start the frontend: npm run dev");
  console.log("   2. Visit: http://localhost:3000/marketplace");
  console.log("   3. Connect your wallet and explore services");
}

if (require.main === module) {
  main();
}

module.exports = { updateEnvFile };
