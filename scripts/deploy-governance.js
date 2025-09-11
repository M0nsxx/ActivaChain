const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying ActivaGovernance contract...");
  
  // Cargar direcciones existentes
  const existingAddresses = JSON.parse(fs.readFileSync('deployment-info-sepolia-complete.json', 'utf8'));
  
  // Deploy ActivaGovernance
  console.log("Deploying ActivaGovernance...");
  const ActivaGovernance = await hre.ethers.getContractFactory("ActivaGovernance");
  const activaGovernance = await ActivaGovernance.deploy(existingAddresses.contracts.activaToken);
  await activaGovernance.waitForDeployment();
  const governanceAddress = await activaGovernance.getAddress();
  console.log(`✅ ActivaGovernance deployed to sepolia: ${governanceAddress}`);
  
  // Actualizar el archivo de deployment
  existingAddresses.contracts.activaGovernance = governanceAddress;
  existingAddresses.timestamp = new Date().toISOString();
  
  fs.writeFileSync('deployment-info-sepolia-complete.json', JSON.stringify(existingAddresses, null, 2));
  console.log("📝 Updated deployment-info-sepolia-complete.json");
  
  // También actualizar el archivo de contratos del frontend
  updateFrontendContracts(existingAddresses);
  
  console.log("\n✅ ActivaGovernance deployment complete!");
}

function updateFrontendContracts(addresses) {
  const contractsContent = `// CONTRATOS REALES INTEGRADOS - ActivaChain
// Actualizado: ${new Date().toISOString()}

export const CONTRACTS = {
  sepolia: {
    activaToken: '${addresses.contracts.activaToken}',
    activaNFT: '${addresses.contracts.activaNFT}',
    marketplace: '${addresses.contracts.marketplace}',
    advancedReputation: '${addresses.contracts.advancedReputation}',
    gamification: '${addresses.contracts.gamificationSystem}',
    community: '${addresses.contracts.communitySystem}',
    governance: '${addresses.contracts.activaGovernance}',
    arbToken: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55' // ARB token en Sepolia
  },
  arbitrumSepolia: {
    activaToken: '0x11a16814c7E8079Cc010a1603C15b818c3411FC4',
    activaNFT: '0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9',
    marketplace: '0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F',
    advancedReputation: '0x9CFb165fd2b22FE011a03C0Afc5aEDD2Ae04f8a3',
    gamification: '0x75069e3b4e62966325Ac8ef2fEA48e8909225acF',
    community: '0x9231c39C19A4A938Da2E3D1D67AbaBDE77388b09',
    governance: '${addresses.contracts.activaGovernance}', // Mismo contrato en ambas redes
    arbToken: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55'
  }
} as const;

export type Network = keyof typeof CONTRACTS;
export type ContractName = keyof typeof CONTRACTS.sepolia;
`;

  fs.writeFileSync('frontend/app/lib/useContracts.ts', contractsContent);
  console.log("📝 Updated frontend/app/lib/useContracts.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
