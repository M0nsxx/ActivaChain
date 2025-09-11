const { ethers } = require("hardhat");

// ABI para el token USDC mock que tiene función mint
const MOCK_TOKEN_ABI = [
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)"
];

async function main() {
    console.log("💰 Minting Test Tokens for Users...\n");

    // Get network info
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    console.log(`📡 Network: ${network.name} (Chain ID: ${chainId})`);

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Minter: ${deployer.address}`);

    // Get token addresses based on network
    let usdcAddress;
    if (chainId == 11155111) { // Sepolia
        usdcAddress = "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8"; // Official Sepolia USDC
        console.log("🌐 Connected to Ethereum Sepolia");
    } else if (chainId == 421614) { // Arbitrum Sepolia
        usdcAddress = "0xf3c3351d6bd0098eeb33ca8f830faf2a141ea2e1"; // Official Arbitrum Sepolia USDC
        console.log("🌐 Connected to Arbitrum Sepolia");
    } else {
        throw new Error(`❌ Unsupported network: ${chainId}`);
    }

    console.log(`💵 USDC Token: ${usdcAddress}\n`);

    // Connect to USDC token
    const usdcToken = new ethers.Contract(usdcAddress, MOCK_TOKEN_ABI, deployer);

    try {
        // Check if it's a mintable token
        const symbol = await usdcToken.symbol();
        console.log(`📋 Token symbol: ${symbol}`);
        
        // Try to mint tokens to deployer for testing
        const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDC
        console.log(`💰 Attempting to mint 10,000 ${symbol} to ${deployer.address}`);
        
        const tx = await usdcToken.mint(deployer.address, mintAmount);
        console.log(`⏳ Transaction: ${tx.hash}`);
        
        await tx.wait();
        console.log(`✅ Successfully minted 10,000 ${symbol}!`);
        
        // Check balance
        const balance = await usdcToken.balanceOf(deployer.address);
        console.log(`💰 New balance: ${ethers.formatUnits(balance, 6)} ${symbol}`);
        
    } catch (error) {
        console.error("❌ Error minting tokens:", error.message);
        console.log("\n💡 This might be an official USDC contract that doesn't have mint function.");
        console.log("💡 Try using official faucets instead:");
        
        if (chainId == 11155111) {
            console.log("🌐 Sepolia USDC faucet: https://faucet.circle.com/");
            console.log("🌐 Alternative: https://sepoliafaucet.com/");
        } else if (chainId == 421614) {
            console.log("🌐 Arbitrum Sepolia faucet: https://faucets.chain.link/arbitrum-sepolia");
        }
        
        // Check balance anyway
        try {
            const balance = await usdcToken.balanceOf(deployer.address);
            console.log(`💰 Current balance: ${ethers.formatUnits(balance, 6)} USDC`);
        } catch (balanceError) {
            console.log("❌ Could not check balance");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Script failed:", error);
        process.exit(1);
    });