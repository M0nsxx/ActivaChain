const { ethers } = require("hardhat");

const MARKETPLACE_ABI = [
  "function serviceCounter() external view returns (uint256)",
  "function services(uint256) external view returns (uint256 id, address provider, string title, string description, uint256 price, uint8 tokenType, uint8 category, bool isActive, uint256 minReputation)"
];

async function main() {
    console.log("🔍 Debugging Marketplace Services...\n");

    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    
    let marketplaceAddress;
    if (chainId == 11155111) { // Sepolia
        marketplaceAddress = "0xCa3bde2c1069ba384a7Cb47991f97B2f1D1DAfd8";
    } else if (chainId == 421614) { // Arbitrum Sepolia
        marketplaceAddress = "0x5eDa9b9B2711C40895f06A3A77cAD22A75f13FC1";
    }

    console.log(`📍 Marketplace: ${marketplaceAddress}`);
    
    const [deployer] = await ethers.getSigners();
    const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, deployer);

    const serviceCount = await marketplace.serviceCounter();
    console.log(`📊 Total services: ${serviceCount}\n`);

    console.log("🔍 DEBUGGING SERVICES:");
    console.log("=".repeat(80));

    for (let i = 1; i <= serviceCount; i++) {
        try {
            const service = await marketplace.services(i);
            const tokenTypes = ['ETH', 'USDC', 'ARB'];
            
            console.log(`Service ${i}:`);
            console.log(`  Title: ${service[2]}`);
            console.log(`  Price (raw): ${service[4]}`);
            console.log(`  Token Type: ${service[5]} (${tokenTypes[service[5]]})`);
            
            if (service[5] === 0) { // ETH
                console.log(`  Price (formatted): ${ethers.formatEther(service[4])} ETH`);
            } else if (service[5] === 1) { // USDC
                console.log(`  Price (formatted): ${ethers.formatUnits(service[4], 6)} USDC`);
            }
            
            console.log(`  Category: ${service[6]}`);
            console.log(`  Active: ${service[7]}`);
            console.log(`  Provider: ${service[1]}`);
            console.log("");
            
        } catch (error) {
            console.log(`❌ Error reading service ${i}:`, error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Debug failed:", error);
        process.exit(1);
    });