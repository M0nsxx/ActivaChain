require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/9_JhUBBHvDHoh6YqQ8Ow7",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "1EI4KGE2DIUPZF2XND8V5AUFVPE1E9X3JK",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "1EI4KGE2DIUPZF2XND8V5AUFVPE1E9X3JK"
    }
  }
};
