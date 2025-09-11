const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying ActivaChains Marketplace Multi-Token...\n");

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
    
    console.log(`🔍 Debug: Chain ID is ${chainId} (type: ${typeof chainId})`);
    
    if (chainId == 11155111) { // Sepolia - usando == en lugar de ===
        console.log("🌐 Deploying to Ethereum Sepolia...");
        usdcAddress = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"; // Real USDC Sepolia 2025
        arbAddress = "0x912ce59144191c1204e64559fe8253a0e49e6548";  // Real ARB token (mainnet - for demo)
    } else if (chainId == 421614) { // Arbitrum Sepolia - usando == en lugar de ===
        console.log("🌐 Deploying to Arbitrum Sepolia...");
        usdcAddress = "0xf3c3351d6bd0098eeb33ca8f830faf2a141ea2e1"; // Real USDC Arbitrum Sepolia 2025
        arbAddress = "0x7de5bffc5370d93b974b67bab4492a9e13b8b3c1";  // Real ARB Arbitrum Sepolia 2025
    } else {
        console.log(`❌ Chain ID ${chainId} not supported yet. Supported: 11155111 (Sepolia), 421614 (Arbitrum Sepolia)`);
        throw new Error(`❌ Unsupported network: ${chainId}`);
    }

    console.log(`📍 USDC Token: ${usdcAddress}`);
    console.log(`📍 ARB Token: ${arbAddress}\n`);

    // Deploy Marketplace
    console.log("📋 Deploying MarketplaceMultiToken...");
    const MarketplaceMultiToken = await ethers.getContractFactory("MarketplaceMultiToken");
    const marketplace = await MarketplaceMultiToken.deploy(
        usdcAddress,  // Real USDC token address
        arbAddress    // Real ARB token address
    );

    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log(`✅ MarketplaceMultiToken deployed at: ${marketplaceAddress}`);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await marketplace.owner();
    const usdcToken = await marketplace.usdcToken();
    const arbToken = await marketplace.arbToken();
    const platformFee = await marketplace.platformFee();

    console.log(`👑 Owner: ${owner}`);
    console.log(`💵 USDC Token: ${usdcToken}`);
    console.log(`🏦 ARB Token: ${arbToken}`);
    console.log(`💸 Platform Fee: ${platformFee} basis points (${platformFee/100}%)`);

    // Create some test services for demonstration
    console.log("\n🛠️ Creating test services...");
    
    // Service 1: Smart Contract Development (USDC)
    const tx1 = await marketplace.createService(
        "Smart Contract Development",
        "Professional smart contract development for DeFi protocols, NFT collections, and custom blockchain solutions. Includes testing, deployment, and documentation.",
        ethers.parseUnits("500", 6), // $500 USDC
        1, // USDC
        0, // Development
        0  // No minimum reputation
    );
    await tx1.wait();
    console.log("✅ Service 1: Smart Contract Development (USDC)");

    // Service 2: Web3 UI/UX Design (USDC)
    const tx2 = await marketplace.createService(
        "Web3 UI/UX Design",
        "Modern and intuitive UI/UX design for decentralized applications. Specialized in DeFi interfaces, NFT marketplaces, and Web3 user experiences.",
        ethers.parseUnits("300", 6), // $300 USDC
        1, // USDC
        1, // Design
        0  // No minimum reputation
    );
    await tx2.wait();
    console.log("✅ Service 2: Web3 UI/UX Design (USDC)");

    // Service 3: DeFi Marketing Strategy (ETH)
    const tx3 = await marketplace.createService(
        "DeFi Marketing Strategy",
        "Comprehensive marketing strategy for DeFi protocols including tokenomics design, community building, and growth hacking techniques.",
        ethers.parseEther("0.3"), // 0.3 ETH
        0, // ETH
        2, // Marketing
        0  // No minimum reputation
    );
    await tx3.wait();
    console.log("✅ Service 3: DeFi Marketing Strategy (ETH)");

    // Service 4: Blockchain Consultation (USDC)
    const tx4 = await marketplace.createService(
        "Blockchain Strategy Consultation",
        "Strategic consultation for blockchain implementation, tokenomics design, and Web3 transformation. Perfect for enterprises and startups.",
        ethers.parseUnits("1000", 6), // $1000 USDC
        1, // USDC
        3, // Consulting
        100 // Minimum reputation required
    );
    await tx4.wait();
    console.log("✅ Service 4: Blockchain Strategy Consultation (USDC)");

    // Service 5: NFT Collection Development (USDC)
    const tx5 = await marketplace.createService(
        "NFT Collection Development",
        "End-to-end NFT collection development including smart contracts, metadata generation, rarity distribution, and marketplace integration.",
        ethers.parseUnits("800", 6), // $800 USDC
        1, // USDC
        0, // Development
        50 // Minimum reputation
    );
    await tx5.wait();
    console.log("✅ Service 5: NFT Collection Development (USDC)");

    // Service 6: Cross-Chain Bridge Development (ETH)
    const tx6 = await marketplace.createService(
        "Cross-Chain Bridge Implementation",
        "Professional implementation of cross-chain bridges with multi-layer security validation for seamless asset transfers between networks.",
        ethers.parseEther("2.0"), // 2.0 ETH
        0, // ETH
        0, // Development
        200 // High reputation required
    );
    await tx6.wait();
    console.log("✅ Service 6: Cross-Chain Bridge Implementation (ETH)");

    // Get final stats
    const serviceCounter = await marketplace.serviceCounter();
    console.log(`\n📊 Total services created: ${serviceCounter}`);

    // Network-specific information
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log(`🌐 Network: ${network.name} (${chainId})`);
    console.log(`📍 Marketplace: ${marketplaceAddress}`);
    console.log(`💵 USDC Token: ${usdcAddress}`);
    console.log(`🏦 ARB Token: ${arbAddress}`);
    console.log(`👤 Owner: ${owner}`);
    console.log(`📊 Services: ${serviceCounter}`);

    if (chainId === 11155111) {
        console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    } else if (chainId === 421614) {
        console.log(`🔗 Arbiscan: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    }

    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📝 Environment variables to update:");
    
    if (chainId === 11155111) {
        console.log(`NEXT_PUBLIC_SEPOLIA_MARKETPLACE=${marketplaceAddress}`);
        console.log(`NEXT_PUBLIC_SEPOLIA_USDC=${usdcAddress}`);
        console.log(`NEXT_PUBLIC_SEPOLIA_ARB=${arbAddress}`);
    } else if (chainId === 421614) {
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