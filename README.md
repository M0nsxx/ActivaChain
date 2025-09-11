# ActivaChain

A comprehensive DeFi platform built on Ethereum and Arbitrum networks featuring a decentralized marketplace, governance system, and reputation-based rewards.

## Features

- **Multi-Token Marketplace**: Buy and sell services using ETH and ARB tokens
- **Governance System**: Community-driven decision making with voting mechanisms
- **Reputation System**: Token-based rewards for active community participation
- **Multi-Network Support**: Ethereum Sepolia and Arbitrum Sepolia
- **PWA Ready**: Mobile-optimized progressive web application
- **Web3 Integration**: Built with Wagmi, Reown, and modern Web3 standards

## Tech Stack

### Smart Contracts
- Solidity ^0.8.19
- Hardhat development environment
- OpenZeppelin contracts
- Multi-network deployment support

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Wagmi v2 for Web3 integration
- Reown (WalletConnect) for wallet connections

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/M0nsxx/ActivaChain.git
cd ActivaChain
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
```

3. Set up environment variables:
```bash
cp env.example .env
cp frontend/env.local.example frontend/.env.local
```

4. Deploy contracts (optional):
```bash
npm run deploy:sepolia
# or
npm run deploy:arbitrum
```

5. Start the development server:
```bash
cd frontend && npm run dev
```

## Project Structure

```
ActivaChains/
├── contracts/           # Smart contracts
├── scripts/            # Deployment and utility scripts
├── test/               # Contract tests
├── frontend/           # Next.js application
│   ├── app/           # App router pages and components
│   ├── lib/           # Utility functions and hooks
│   └── public/        # Static assets
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Root dependencies
```

## Networks

- **Ethereum Sepolia**: Testnet for development and testing
- **Arbitrum Sepolia**: Layer 2 testnet for faster transactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.