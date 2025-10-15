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
      accounts: ["cdf3a5b835fbba21d85927c43246285f2cefdcf4d665c3cdc7335f1da05d2450"]
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: ["cdf3a5b835fbba21d85927c43246285f2cefdcf4d665c3cdc7335f1da05d2450"]
    }
  },
  etherscan: {
    apiKey: "Q8EG2XBFE3GC8MXAVSD326T6TNVQXJ85BG"
  }
};
