const { ethers } = require("hardhat");

// ABI mínimo para el marketplace - versión corregida
const MARKETPLACE_ABI = [
  "function createService(string memory title, string memory description, uint256 price, uint8 tokenType, uint8 category, uint256 minReputation) external",
  "function serviceCounter() external view returns (uint256)",
  "function services(uint256) external view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
];

async function main() {
    console.log("🔧 Fixing Marketplace and Creating Mixed Services...\n");

    // Get network info
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Creator: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH\n`);

    // Get marketplace address based on network
    let marketplaceAddress;
    if (chainId == 11155111) { // Sepolia
        marketplaceAddress = "0xCa3bde2c1069ba384a7Cb47991f97B2f1D1DAfd8";
        console.log("🌐 Connected to Ethereum Sepolia Marketplace");
    } else if (chainId == 421614) { // Arbitrum Sepolia
        marketplaceAddress = "0x5eDa9b9B2711C40895f06A3A77cAD22A75f13FC1";
        console.log("🌐 Connected to Arbitrum Sepolia Marketplace");
    } else {
        throw new Error(`❌ Unsupported network: ${chainId}`);
    }

    console.log(`📍 Marketplace: ${marketplaceAddress}\n`);

    // Connect to marketplace
    const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, deployer);

    // Check current service count
    const currentCount = await marketplace.serviceCounter();
    console.log(`📊 Current services: ${currentCount}\n`);

    // Define MIXED services (ETH, USDC, ARB) - precios más pequeños
    const services = [
        {
            title: "Smart Contract Audit",
            description: "Security audit for your smart contracts. Find vulnerabilities and gas optimizations.",
            price: ethers.parseEther("0.1"), // 0.1 ETH
            tokenType: 0, // ETH
            category: 0, // Development
            minReputation: 0
        },
        {
            title: "Web3 UI Design",
            description: "Modern UI/UX design for your DeFi or NFT project with Web3 best practices.",
            price: ethers.parseUnits("200", 6), // $200 USDC
            tokenType: 1, // USDC
            category: 1, // Design
            minReputation: 0
        },
        {
            title: "DeFi Marketing Plan",
            description: "Complete marketing strategy for your DeFi protocol launch and community growth.",
            price: ethers.parseEther("0.3"), // 0.3 ETH
            tokenType: 0, // ETH
            category: 2, // Marketing
            minReputation: 0
        },
        {
            title: "NFT Collection Setup",
            description: "End-to-end NFT collection: smart contract, metadata, minting site, and launch strategy.",
            price: ethers.parseUnits("500", 6), // $500 USDC
            tokenType: 1, // USDC
            category: 0, // Development
            minReputation: 0
        },
        {
            title: "Blockchain Consultation",
            description: "Strategic advice for blockchain implementation and tokenomics design.",
            price: ethers.parseEther("0.5"), // 0.5 ETH
            tokenType: 0, // ETH
            category: 3, // Consulting
            minReputation: 0
        }
    ];

    console.log("🚀 Creating mixed services (ETH + USDC)...\n");

    // Create services with better error handling
    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        
        try {
            console.log(`📝 Creating: "${service.title}"`);
            console.log(`   💰 Price: ${service.tokenType === 0 ? ethers.formatEther(service.price) + ' ETH' : ethers.formatUnits(service.price, 6) + ' USDC'}`);
            
            // Estimate gas first
            const gasEstimate = await marketplace.createService.estimateGas(
                service.title,
                service.description,
                service.price,
                service.tokenType,
                service.category,
                service.minReputation
            );
            
            console.log(`   ⛽ Gas estimate: ${gasEstimate}`);
            
            const tx = await marketplace.createService(
                service.title,
                service.description,
                service.price,
                service.tokenType,
                service.category,
                service.minReputation,
                {
                    gasLimit: gasEstimate * BigInt(120) / BigInt(100), // 20% extra
                    gasPrice: ethers.parseUnits("10", "gwei")
                }
            );
            
            console.log(`⏳ Transaction: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`✅ Service ${i + 1} created! Gas used: ${receipt.gasUsed}\n`);
            
        } catch (error) {
            console.error(`❌ Error creating service ${i + 1}:`, error.shortMessage || error.message);
            console.log("   📋 Continuing with next service...\n");
            continue;
        }
    }

    // Check final service count
    const finalCount = await marketplace.serviceCounter();
    console.log(`📊 Final service count: ${finalCount}`);
    console.log(`➕ Services added: ${finalCount - currentCount}`);

    // Display created services
    if (finalCount > 0) {
        console.log("\n📋 MARKETPLACE SERVICES:");
        console.log("=".repeat(60));
        
        for (let i = 1; i <= Math.min(Number(finalCount), 10); i++) {
            try {
                const service = await marketplace.services(i);
                const tokenTypes = ['ETH', 'USDC', 'ARB'];
                const categories = ['Development', 'Design', 'Marketing', 'Consulting'];
                
                console.log(`🎯 Service ${i}:`);
                console.log(`   Title: ${service[2]}`); // title
                console.log(`   Price: ${service[5] === 0 ? ethers.formatEther(service[4]) + ' ETH' : ethers.formatUnits(service[4], 6) + ' ' + tokenTypes[service[5]]}`);
                console.log(`   Category: ${categories[service[6]]}`);
                console.log(`   Active: ${service[7] ? '✅' : '❌'}`);
                console.log("");
            } catch (error) {
                console.log(`❌ Could not fetch service ${i}`);
            }
        }
    }

    console.log("✅ Marketplace fix completed!");
    
    if (chainId == 11155111) {
        console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    } else if (chainId == 421614) {
        console.log(`🔗 View on Arbiscan: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    }

    console.log("\n💡 TIPS FOR TRANSACTIONS:");
    console.log("1. Para servicios ETH: No necesitas approval, se paga directamente");
    console.log("2. Para servicios USDC: Necesitas hacer approve del token USDC primero");
    console.log("3. Usa MetaMask con Sepolia testnet");
    console.log("4. Obtén ETH de testnet del faucet de Sepolia");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Fix failed:", error);
        process.exit(1);
    });