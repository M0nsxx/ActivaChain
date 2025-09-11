const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying ActivaGovernance contract to Arbitrum Sepolia...");
  
  // Cargar direcciones existentes de Arbitrum
  const existingAddresses = JSON.parse(fs.readFileSync('deployment-info-arbitrum-real.json', 'utf8'));
  
  // Deploy ActivaGovernance
  console.log("Deploying ActivaGovernance...");
  const ActivaGovernance = await hre.ethers.getContractFactory("ActivaGovernance");
  const activaGovernance = await ActivaGovernance.deploy(existingAddresses.contracts.activaToken);
  await activaGovernance.waitForDeployment();
  const governanceAddress = await activaGovernance.getAddress();
  console.log(`✅ ActivaGovernance deployed to arbitrumSepolia: ${governanceAddress}`);
  
  // Actualizar el archivo de deployment
  existingAddresses.contracts.activaGovernance = governanceAddress;
  existingAddresses.timestamp = new Date().toISOString();
  
  fs.writeFileSync('deployment-info-arbitrum-real.json', JSON.stringify(existingAddresses, null, 2));
  console.log("📝 Updated deployment-info-arbitrum-real.json");
  
  // También actualizar el archivo de contratos del frontend
  updateFrontendContracts();
  
  console.log("\n✅ ActivaGovernance deployment to Arbitrum complete!");
}

function updateFrontendContracts() {
  // Cargar direcciones de ambas redes
  const sepoliaAddresses = JSON.parse(fs.readFileSync('deployment-info-sepolia-complete.json', 'utf8'));
  const arbitrumAddresses = JSON.parse(fs.readFileSync('deployment-info-arbitrum-real.json', 'utf8'));
  
  const contractsContent = `// CONTRATOS REALES INTEGRADOS - ActivaChain
// Actualizado: ${new Date().toISOString()}

import { useChainId } from 'wagmi'

export const CONTRACTS = {
  sepolia: {
    activaToken: '${sepoliaAddresses.contracts.activaToken}',
    activaNFT: '${sepoliaAddresses.contracts.activaNFT}',
    marketplace: '${sepoliaAddresses.contracts.marketplace}',
    advancedReputation: '${sepoliaAddresses.contracts.advancedReputation}',
    gamification: '${sepoliaAddresses.contracts.gamificationSystem}',
    community: '${sepoliaAddresses.contracts.communitySystem}',
    governance: '${sepoliaAddresses.contracts.activaGovernance}',
    arbToken: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55' // ARB token en Sepolia
  },
  arbitrumSepolia: {
    activaToken: '${arbitrumAddresses.contracts.activaToken}',
    activaNFT: '${arbitrumAddresses.contracts.activaNFT}',
    marketplace: '${arbitrumAddresses.contracts.marketplace}',
    advancedReputation: '${arbitrumAddresses.contracts.advancedReputation}',
    gamification: '${arbitrumAddresses.contracts.gamificationSystem}',
    community: '${arbitrumAddresses.contracts.communitySystem}',
    governance: '${arbitrumAddresses.contracts.activaGovernance}',
    arbToken: '${arbitrumAddresses.contracts.arb}'
  }
} as const;

export type Network = keyof typeof CONTRACTS;
export type ContractName = keyof typeof CONTRACTS.sepolia;

// Hook para obtener las direcciones de contratos según la red actual
export function useContracts() {
  const chainId = useChainId()
  
  // Determinar la red actual
  const network: Network = chainId === 11155111 ? 'sepolia' : 
                          chainId === 421614 ? 'arbitrumSepolia' : 'sepolia'
  
  return CONTRACTS[network]
}
`;

  fs.writeFileSync('frontend/app/lib/useContracts.ts', contractsContent);
  console.log("📝 Updated frontend/app/lib/useContracts.ts with both networks");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
