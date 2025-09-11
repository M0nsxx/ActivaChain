const fs = require('fs');
const path = require('path');

// Nuevas direcciones desplegadas en Arbitrum Sepolia
const arbitrumAddresses = {
  NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT: '0x715231b93296D57D052E1D458Fb32AEc56444765',
  NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN: '0xE4F74170231156d9937f3baaa672df35571B6A38',
  NEXT_PUBLIC_ARBITRUM_MARKETPLACE: '0x624d15B024a707E5c0295A790763f192289301B2',
  NEXT_PUBLIC_ARBITRUM_REPUTATION: '0x98f60Fc67C6eEf622A514b684164bBf31d25Bf52'
};

// Direcciones de Sepolia (ya existentes)
const sepoliaAddresses = {
  NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT: '0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9',
  NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN: '0x11a16814c7E8079Cc010a1603C15b818c3411FC4',
  NEXT_PUBLIC_SEPOLIA_MARKETPLACE: '0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F',
  NEXT_PUBLIC_SEPOLIA_REPUTATION: '0xC68535Ee239f2A46Fdc08c236c86cb6451b6E01D'
};

// Crear archivo .env.local para el frontend
const frontendEnvPath = path.join(__dirname, '..', 'frontend', '.env.local');
const envContent = `# Reown AppKit - Project ID temporal para desarrollo
NEXT_PUBLIC_REOWN_PROJECT_ID=c2b93e3f5a3a9b146ef83026c4d17a67

# Contract addresses - SEPOLIA (ACTUALIZADAS 2025-09-11)
NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT=${sepoliaAddresses.NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT}
NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN=${sepoliaAddresses.NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN}
NEXT_PUBLIC_SEPOLIA_MARKETPLACE=${sepoliaAddresses.NEXT_PUBLIC_SEPOLIA_MARKETPLACE}
NEXT_PUBLIC_SEPOLIA_REPUTATION=${sepoliaAddresses.NEXT_PUBLIC_SEPOLIA_REPUTATION}

# Contract addresses - ARBITRUM SEPOLIA (ACTUALIZADAS 2025-09-11)
NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT=${arbitrumAddresses.NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT}
NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN=${arbitrumAddresses.NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN}
NEXT_PUBLIC_ARBITRUM_MARKETPLACE=${arbitrumAddresses.NEXT_PUBLIC_ARBITRUM_MARKETPLACE}
NEXT_PUBLIC_ARBITRUM_REPUTATION=${arbitrumAddresses.NEXT_PUBLIC_ARBITRUM_REPUTATION}
`;

try {
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log('✅ Archivo .env.local del frontend actualizado con ambas redes');
  console.log('📍 Ubicación:', frontendEnvPath);
  console.log('\n📋 Direcciones Sepolia:');
  Object.entries(sepoliaAddresses).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  console.log('\n📋 Direcciones Arbitrum:');
  Object.entries(arbitrumAddresses).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
} catch (error) {
  console.error('❌ Error al actualizar el archivo .env.local:', error);
}
