const { ethers } = require("hardhat");

// ABI mínimo para el marketplace
const MARKETPLACE_ABI = [
  "function createService(string memory title, string memory description, uint256 price, uint8 tokenType, uint8 category, uint256 minReputation) external",
  "function serviceCounter() external view returns (uint256)",
  "function services(uint256) external view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
];

async function main() {
    console.log("🛠️ Creating Real Services for Marketplace...\n");

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

    // Define services to create
    const services = [
        {
            title: "Smart Contract Development & Audit",
            description: "Professional smart contract development for DeFi, NFTs, and DAOs. Includes security audit, gas optimization, and deployment on multiple networks. 10+ years experience in Solidity and Vyper.",
            price: ethers.parseUnits("750", 6), // $750 USDC
            tokenType: 1, // USDC
            category: 0, // Development
            minReputation: 0
        },
        {
            title: "Web3 UI/UX Design & Prototyping",
            description: "Modern, intuitive Web3 interface design. Specialized in DeFi dashboards, NFT marketplaces, and DAO governance interfaces. Includes Figma prototypes and React components.",
            price: ethers.parseUnits("450", 6), // $450 USDC
            tokenType: 1, // USDC
            category: 1, // Design
            minReputation: 0
        },
        {
            title: "DeFi Protocol Marketing & Strategy",
            description: "Complete marketing strategy for DeFi protocols. Includes tokenomics consultation, community building, social media strategy, and partnership development. 50+ successful launches.",
            price: ethers.parseEther("0.4"), // 0.4 ETH
            tokenType: 0, // ETH
            category: 2, // Marketing
            minReputation: 0
        },
        {
            title: "Blockchain Architecture Consulting",
            description: "Strategic blockchain consultation for enterprises. Layer 2 implementation, cross-chain bridge design, and scalability solutions. Former Ethereum Foundation advisor.",
            price: ethers.parseUnits("1200", 6), // $1200 USDC
            tokenType: 1, // USDC
            category: 3, // Consulting
            minReputation: 100
        },
        {
            title: "NFT Collection Launch (End-to-End)",
            description: "Complete NFT collection development: Smart contracts, metadata generation, rarity algorithms, minting dApp, and marketplace integration. Includes 10K+ unique traits system.",
            price: ethers.parseUnits("950", 6), // $950 USDC
            tokenType: 1, // USDC
            category: 0, // Development
            minReputation: 50
        },
        {
            title: "Cross-Chain Bridge Development",
            description: "Secure cross-chain bridge implementation with multi-signature validation, emergency pause mechanisms, and comprehensive testing suite. Ethereum ↔ Arbitrum ↔ Polygon support.",
            price: ethers.parseEther("1.8"), // 1.8 ETH
            tokenType: 0, // ETH
            category: 0, // Development
            minReputation: 200
        }
    ];

    console.log("🚀 Creating services...\n");

    // Create services with gas optimization
    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        
        try {
            console.log(`📝 Creating: "${service.title}"`);
            
            const tx = await marketplace.createService(
                service.title,
                service.description,
                service.price,
                service.tokenType,
                service.category,
                service.minReputation,
                {
                    gasLimit: 300000, // 300k gas limit
                    gasPrice: ethers.parseUnits("5", "gwei") // 5 gwei for faster confirmation
                }
            );
            
            console.log(`⏳ Transaction: ${tx.hash}`);
            await tx.wait();
            console.log(`✅ Service ${i + 1} created successfully!\n`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error creating service ${i + 1}:`, error.message);
            continue;
        }
    }

    // Check final service count
    const finalCount = await marketplace.serviceCounter();
    console.log(`📊 Final service count: ${finalCount}`);
    console.log(`➕ Services added: ${finalCount - currentCount}`);

    // Display some created services
    console.log("\n📋 CREATED SERVICES:");
    console.log("=".repeat(60));
    
    for (let i = 1; i <= Math.min(Number(finalCount), 6); i++) {
        try {
            const service = await marketplace.services(i);
            const tokenTypes = ['ETH', 'USDC', 'ARB'];
            const categories = ['Development', 'Design', 'Marketing', 'Consulting'];
            
            console.log(`🎯 Service ${i}:`);
            console.log(`   Title: ${service.title}`);
            console.log(`   Price: ${service.tokenType === 0 ? ethers.formatEther(service.price) + ' ETH' : ethers.formatUnits(service.price, 6) + ' ' + tokenTypes[service.tokenType]}`);
            console.log(`   Category: ${categories[service.category]}`);
            console.log(`   Active: ${service.isActive ? '✅' : '❌'}`);
            console.log("");
        } catch (error) {
            console.log(`❌ Could not fetch service ${i}`);
        }
    }

    console.log("✅ Service creation completed!");
    
    if (chainId == 11155111) {
        console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${marketplaceAddress}`);
    } else if (chainId == 421614) {
        console.log(`🔗 View on Arbiscan: https://sepolia.arbiscan.io/address/${marketplaceAddress}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Service creation failed:", error);
        process.exit(1);
    });