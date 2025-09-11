const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying ActivaChain to BOTH networks...");
  
  // Deploy to Ethereum Sepolia
  console.log("\n📍 Deploying to Ethereum Sepolia...");
  const sepoliaAddresses = await deployToNetwork("sepolia");
  
  // Deploy to Arbitrum Sepolia
  console.log("\n📍 Deploying to Arbitrum Sepolia...");
  const arbitrumAddresses = await deployToNetwork("arbitrumSepolia");
  
  // Save all addresses
  saveAddresses(sepoliaAddresses, arbitrumAddresses);
  
  console.log("\n✅ Deployment complete on BOTH networks!");
}

async function deployToNetwork(network) {
  const addresses = {};
  
  console.log(`\n🔧 Deploying contracts to ${network}...`);
  
  // Deploy ActivaNFT
  console.log("Deploying ActivaNFT...");
  const ActivaNFT = await hre.ethers.getContractFactory("ActivaNFT");
  const activaNFT = await ActivaNFT.deploy();
  await activaNFT.waitForDeployment();
  addresses.activaNFT = await activaNFT.getAddress();
  console.log(`✅ ActivaNFT deployed to ${network}: ${addresses.activaNFT}`);
  
  // Deploy ActivaToken
  console.log("Deploying ActivaToken...");
  const ActivaToken = await hre.ethers.getContractFactory("ActivaToken");
  const activaToken = await ActivaToken.deploy(
    "ActivaChain Token",
    "ACTIVA",
    hre.ethers.parseEther("1000000")
  );
  await activaToken.waitForDeployment();
  addresses.activaToken = await activaToken.getAddress();
  console.log(`✅ ActivaToken deployed to ${network}: ${addresses.activaToken}`);
  
  
  // Deploy Marketplace
  console.log("Deploying Marketplace...");
  const Marketplace = await hre.ethers.getContractFactory("ActivaMarketplaceMultiToken");
  const marketplace = await Marketplace.deploy(addresses.activaToken, addresses.activaNFT);
  await marketplace.waitForDeployment();
  addresses.marketplace = await marketplace.getAddress();
  console.log(`✅ Marketplace deployed to ${network}: ${addresses.marketplace}`);
  
  // Deploy AdvancedReputationSystem
  console.log("Deploying AdvancedReputationSystem...");
  const AdvancedReputationSystem = await hre.ethers.getContractFactory("AdvancedReputationSystem");
  const advancedReputationSystem = await AdvancedReputationSystem.deploy();
  await advancedReputationSystem.waitForDeployment();
  addresses.advancedReputationSystem = await advancedReputationSystem.getAddress();
  console.log(`✅ AdvancedReputationSystem deployed to ${network}: ${addresses.advancedReputationSystem}`);
  
  // Deploy GamificationSystem
  console.log("Deploying GamificationSystem...");
  const GamificationSystem = await hre.ethers.getContractFactory("GamificationSystem");
  const gamificationSystem = await GamificationSystem.deploy();
  await gamificationSystem.waitForDeployment();
  addresses.gamificationSystem = await gamificationSystem.getAddress();
  console.log(`✅ GamificationSystem deployed to ${network}: ${addresses.gamificationSystem}`);
  
  // Deploy CommunitySystem
  console.log("Deploying CommunitySystem...");
  const CommunitySystem = await hre.ethers.getContractFactory("CommunitySystem");
  const communitySystem = await CommunitySystem.deploy();
  await communitySystem.waitForDeployment();
  addresses.communitySystem = await communitySystem.getAddress();
  console.log(`✅ CommunitySystem deployed to ${network}: ${addresses.communitySystem}`);
  
  // Deploy ActivaGovernance
  console.log("Deploying ActivaGovernance...");
  const ActivaGovernance = await hre.ethers.getContractFactory("ActivaGovernance");
  const activaGovernance = await ActivaGovernance.deploy(addresses.activaToken);
  await activaGovernance.waitForDeployment();
  addresses.activaGovernance = await activaGovernance.getAddress();
  console.log(`✅ ActivaGovernance deployed to ${network}: ${addresses.activaGovernance}`);
  
  return addresses;
}

function saveAddresses(sepoliaAddresses, arbitrumAddresses) {
  const envContent = `
# Ethereum Sepolia Addresses
NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT=${sepoliaAddresses.activaNFT}
NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN=${sepoliaAddresses.activaToken}
NEXT_PUBLIC_SEPOLIA_MARKETPLACE=${sepoliaAddresses.marketplace}
NEXT_PUBLIC_SEPOLIA_ADVANCED_REPUTATION=${sepoliaAddresses.advancedReputationSystem}
NEXT_PUBLIC_SEPOLIA_GAMIFICATION=${sepoliaAddresses.gamificationSystem}
NEXT_PUBLIC_SEPOLIA_COMMUNITY=${sepoliaAddresses.communitySystem}
NEXT_PUBLIC_SEPOLIA_GOVERNANCE=${sepoliaAddresses.activaGovernance}

# Arbitrum Sepolia Addresses
NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT=${arbitrumAddresses.activaNFT}
NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN=${arbitrumAddresses.activaToken}
NEXT_PUBLIC_ARBITRUM_MARKETPLACE=${arbitrumAddresses.marketplace}
NEXT_PUBLIC_ARBITRUM_ADVANCED_REPUTATION=${arbitrumAddresses.advancedReputationSystem}
NEXT_PUBLIC_ARBITRUM_GAMIFICATION=${arbitrumAddresses.gamificationSystem}
NEXT_PUBLIC_ARBITRUM_COMMUNITY=${arbitrumAddresses.communitySystem}
NEXT_PUBLIC_ARBITRUM_GOVERNANCE=${arbitrumAddresses.activaGovernance}

# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here

# Network RPCs
NEXT_PUBLIC_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_ARBITRUM_RPC=https://sepolia-rollup.arbitrum.io/rpc
`;

  fs.writeFileSync('.env.local', envContent);
  console.log("\n📝 Contract addresses saved to .env.local");
  
  // Also save to a JSON file for easy access
  const addressesJson = {
    sepolia: sepoliaAddresses,
    arbitrumSepolia: arbitrumAddresses,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addressesJson, null, 2));
  console.log("📄 Contract addresses also saved to deployed-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
