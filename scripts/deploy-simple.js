const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Simple Marketplace...\n");

    // Get network info
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH\n`);

    // Real token addresses for testnets (2025)
    let usdcAddress, arbAddress;
    
    if (chainId == 11155111) { // Sepolia
        console.log("🌐 Deploying to Ethereum Sepolia...");
        usdcAddress = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"; // Real USDC Sepolia 2025
        arbAddress = "0x912ce59144191c1204e64559fe8253a0e49e6548";  // Real ARB token
    } else if (chainId == 421614) { // Arbitrum Sepolia
        console.log("🌐 Deploying to Arbitrum Sepolia...");
        usdcAddress = "0xf3c3351d6bd0098eeb33ca8f830faf2a141ea2e1"; // Real USDC Arbitrum Sepolia 2025
        arbAddress = "0x7de5bffc5370d93b974b67bab4492a9e13b8b3c1";  // Real ARB Arbitrum Sepolia 2025
    } else {
        throw new Error(`❌ Unsupported network: ${chainId}`);
    }

    console.log(`📍 USDC Token: ${usdcAddress}`);
    console.log(`📍 ARB Token: ${arbAddress}\n`);

    // Deploy Marketplace with lower gas
    console.log("📋 Deploying MarketplaceMultiToken...");
    const MarketplaceMultiToken = await ethers.getContractFactory("MarketplaceMultiToken");
    
    // Deploy with specific gas settings
    const marketplace = await MarketplaceMultiToken.deploy(
        usdcAddress,
        arbAddress,
        {
            gasLimit: 3000000, // 3M gas limit
            gasPrice: ethers.parseUnits("10", "gwei") // 10 gwei
        }
    );

    console.log("⏳ Waiting for deployment...");
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log(`✅ MarketplaceMultiToken deployed at: ${marketplaceAddress}`);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await marketplace.owner();
    console.log(`👑 Owner: ${owner}`);

    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log(`🌐 Network: ${network.name} (${chainId})`);
    console.log(`📍 Marketplace: ${marketplaceAddress}`);
    console.log(`💵 USDC Token: ${usdcAddress}`);
    console.log(`🏦 ARB Token: ${arbAddress}`);
    console.log(`👤 Owner: ${owner}`);

    if (chainId == 11155111) {
        console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    } else if (chainId == 421614) {
        console.log(`🔗 Arbiscan: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    }

    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📝 Environment variables to update:");
    
    if (chainId == 11155111) {
        console.log(`NEXT_PUBLIC_SEPOLIA_MARKETPLACE=${marketplaceAddress}`);
        console.log(`NEXT_PUBLIC_SEPOLIA_USDC=${usdcAddress}`);
        console.log(`NEXT_PUBLIC_SEPOLIA_ARB=${arbAddress}`);
    } else if (chainId == 421614) {
        console.log(`NEXT_PUBLIC_ARBITRUM_MARKETPLACE=${marketplaceAddress}`);
        console.log(`NEXT_PUBLIC_ARBITRUM_USDC=${usdcAddress}`);
        console.log(`NEXT_PUBLIC_ARBITRUM_ARB=${arbAddress}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });