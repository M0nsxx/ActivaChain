# ActivaChain - Guía de Deployment 🚀

## 🎯 Resumen del Proyecto

**ActivaChain** es una plataforma Web3 que cierra la brecha de género en blockchain a través de educación y oportunidades económicas reales. Desarrollado para ETH Uruguay 2025.

### Características Principales
- ✅ **NFTs Soulbound**: Certificaciones intransferibles
- ✅ **Marketplace Descentralizado**: Servicios profesionales con stablecoins
- ✅ **Sistema de Reputación**: Con decay automático y ZK proofs
- ✅ **Dual Deployment**: Ethereum Sepolia + Arbitrum Sepolia
- ✅ **Frontend Glassmorphism**: UI moderna con efectos neurales

## 🏗️ Arquitectura Técnica

### Smart Contracts
1. **ActivaNFT.sol** - Certificaciones NFT Soulbound
2. **ActivaToken.sol** - Token $ACTIVA con staking
3. **ActivaMarketplace.sol** - Marketplace descentralizado
4. **ReputationSystem.sol** - Sistema de reputación (Bounty Maldo)
5. **MockUSDC.sol** - Stablecoin para testing

### Frontend
- **Next.js 14** con App Router
- **Reown AppKit** para wallet connection
- **Tailwind CSS** con glassmorphism
- **TypeScript** para type safety

## 🚀 Comandos de Deployment

### 1. Instalación Inicial
```bash
# Instalar dependencias principales
npm install --legacy-peer-deps

# Instalar dependencias del frontend
cd frontend && npm install --legacy-peer-deps && cd ..
```

### 2. Compilación
```bash
# Compilar contratos
npx hardhat compile
```

### 3. Testing
```bash
# Test rápido local
node test-quick.js

# Tests completos
npx hardhat test
```

### 4. Deployment

#### Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus claves:
# PRIVATE_KEY=tu_clave_privada
# SEPOLIA_RPC=tu_rpc_sepolia
# ETHERSCAN_API_KEY=tu_api_key
# ARBISCAN_API_KEY=tu_api_key
```

#### Deploy a Ambas Redes (CRÍTICO para bounty Maldo)
```bash
# Deploy automático a ambas redes
npm run deploy:both

# O deploy individual
npm run deploy:sepolia
npm run deploy:arbitrum
```

### 5. Frontend
```bash
# Iniciar desarrollo
cd frontend && npm run dev

# Build para producción
cd frontend && npm run build
```

## 📊 Resultados de Testing

### ✅ Tests Exitosos
```
🧪 Ejecutando tests rápidos de ActivaChain...
📦 Deployando contratos...
✅ Contratos deployados exitosamente
🎓 Probando mint de certificación NFT...
✅ Certificación minteada. Total: 1
🔐 Probando verificación ZK...
✅ Usuario verificado. Reputación: 500
💼 Probando creación de servicio...
✅ Servicio creado: Smart Contract Development
💰 Probando staking de tokens...
✅ Tokens staked: 100.0 ACTIVA

🎉 ¡Todos los tests pasaron exitosamente!
```

### 📋 Checklist de Funcionalidades
- [x] Mint de certificaciones NFT
- [x] Sistema de reputación con ZK proofs
- [x] Marketplace con creación de servicios
- [x] Staking de tokens $ACTIVA
- [x] Verificación de identidad
- [x] Compilación exitosa de contratos
- [x] Frontend con glassmorphism
- [x] Wallet connection con Reown AppKit

## 🌐 Redes Soportadas

### Ethereum Sepolia (Principal)
- **Chain ID**: 11155111
- **RPC**: https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
- **Explorer**: https://sepolia.etherscan.io

### Arbitrum Sepolia (Bounty Maldo)
- **Chain ID**: 421614
- **RPC**: https://sepolia-rollup.arbitrum.io/rpc
- **Explorer**: https://sepolia.arbiscan.io

## 🎯 Bounty Maldo - Sistema de Reputación

### Requisitos Cumplidos
- ✅ Deploy en Arbitrum Sepolia
- ✅ Sistema de reputación funcional
- ✅ Decay automático implementado
- ✅ ZK Proofs para verificación
- ✅ Endorsements entre usuarios
- ✅ Cross-chain compatibility

### Implementación Técnica
```solidity
// ReputationSystem.sol
- calculateDecay() - Decay automático cada 30 días
- verifyIdentityWithZK() - Verificación con ZK proofs
- endorseUser() - Sistema de endorsements
- updateReputation() - Actualización dinámica
```

## 📱 PWA Features

### Service Worker
- Cache de recursos estáticos
- Funcionamiento offline
- Actualizaciones automáticas

### Manifest
- Instalación como app nativa
- Iconos adaptativos
- Tema personalizado

## 🔧 Configuración de Producción

### Vercel Deployment
```bash
# Configurar variables de entorno en Vercel
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT=0x...
NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT=0x...
# ... más variables
```

### Variables de Entorno Requeridas
```env
# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id

# Ethereum Sepolia
NEXT_PUBLIC_SEPOLIA_ACTIVA_NFT=0x...
NEXT_PUBLIC_SEPOLIA_ACTIVA_TOKEN=0x...
NEXT_PUBLIC_SEPOLIA_MARKETPLACE=0x...
NEXT_PUBLIC_SEPOLIA_USDC=0x...
NEXT_PUBLIC_SEPOLIA_REPUTATION=0x...

# Arbitrum Sepolia
NEXT_PUBLIC_ARBITRUM_ACTIVA_NFT=0x...
NEXT_PUBLIC_ARBITRUM_ACTIVA_TOKEN=0x...
NEXT_PUBLIC_ARBITRUM_MARKETPLACE=0x...
NEXT_PUBLIC_ARBITRUM_USDC=0x...
NEXT_PUBLIC_ARBITRUM_REPUTATION=0x...
```

## 🏆 Estrategia para ETH Uruguay 2025

### Diferenciadores Clave
1. **Técnicos**: ZK proofs funcionales, dual deployment, UI excepcional
2. **Impacto**: Problema real con solución escalable
3. **Ejecución**: Demo funcional con transacciones reales
4. **Bounty Maldo**: Sistema de reputación innovador

### Timeline de Ejecución (18 horas)
- **0-3h**: ✅ Setup + Deploy contratos a AMBAS redes
- **3-9h**: ✅ Frontend con Reown AppKit + integración
- **9-12h**: ✅ Testing en testnets + debugging
- **12-15h**: ✅ UI polish + efectos neurales
- **15-17h**: ✅ Documentación + video demo
- **17-18h**: ✅ Preparación pitch + ensayo

## 📞 Contacto

- **GitHub**: [github.com/activachain]
- **Demo**: [activachain.vercel.app]
- **Email**: hello@activachain.io

---

**ActivaChain** - Cerrando la brecha de género en Web3, una transacción a la vez. 🚀

*Desarrollado con ❤️ para ETH Uruguay 2025*
