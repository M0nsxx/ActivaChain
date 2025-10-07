// CONTRATOS REALES INTEGRADOS - ActivaChain
// Actualizado: 2025-09-11T22:05:24.455Z

import { useChainId } from 'wagmi'

export const CONTRACTS = {
  sepolia: {
    activaToken: '0x11a16814c7E8079Cc010a1603C15b818c3411FC4',
    activaNFT: '0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9',
    marketplace: '0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F',
    reputation: '0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D',
    advancedReputation: '0x9CFb165fd2b22FE011a03C0Afc5aEDD2Ae04f8a3',
    gamification: '0x75069e3b4e62966325Ac8ef2fEA48e8909225acF',
    community: '0x9231c39C19A4A938Da2E3D1D67AbaBDE77388b09',
    ipfsIntegration: '0x79ede9d4E531ea6b7bF5eF35c4b31ea69210107A',
    pushNotificationSystem: '0x1fbD7E942b0e19dB7D74c6DF1CfdE7753A30841d',
    externalAPIIntegration: '0xe09D357311eDC869dbba5E043a3915413547F288',
    governance: '0xf278be79d14CcF53157B045bdbb51D98d58964F9',
    arbToken: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55' // ARB token en Sepolia
  },
  arbitrumSepolia: {
    activaToken: '0xE4F74170231156d9937f3baaa672df35571B6A38',
    activaNFT: '0x715231b93296D57D052E1D458Fb32AEc56444765',
    marketplace: '0x624d15B024a707E5c0295A790763f192289301B2',
    reputation: '0x98f60Fc67C6eEf622A514b684164bBf31d25Bf52',
    advancedReputation: '0xf973036cFC966a5226625063859A2Eed3109563D',
    gamification: '0x5Eb409cB1bF3f97e88cE9038a531B59Ad994fC45',
    community: '0xb27AEF60ECAa4f0c9b7040c0C513CECbF2753fFD',
    ipfsIntegration: '0x4100faaA3f3bB8CD17AF2295Dd5A0724aBCB6927',
    pushNotificationSystem: '0x0Be3cC96475c95527D09842a877608316c5B148d',
    externalAPIIntegration: '0x35e3337B817bc14b99c5BdBF466e029000763CCd',
    governance: '0x0E927b4Dc048ff9ba425A4A778CC4342096deF11',
    arbToken: '0x912CE59144191C1204E64559FE8253a0e49E6548'
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
