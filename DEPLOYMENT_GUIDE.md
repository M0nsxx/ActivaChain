# 🚀 Guía de Deployment - ActivaChain Marketplace

## Descripción

Esta guía te permitirá desplegar completamente el marketplace de ActivaChain con 20 servicios demo reales y funcionales en testnet, actualizados para 2025.

## 📋 Prerrequisitos

### 1. Configuración del Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
```

### 2. Variables de Entorno Requeridas
```bash
# .env
PRIVATE_KEY=tu_private_key_aqui
SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/TU_KEY
ARBITRUM_RPC=https://sepolia-rollup.arbitrum.io/rpc
ETHERSCAN_API_KEY=tu_etherscan_key
ARBISCAN_API_KEY=tu_arbiscan_key
NEXT_PUBLIC_REOWN_PROJECT_ID=c2b93e3f5a3a9b146ef83026c4d17a67
```

### 3. Fondos de Testnet
- **Ethereum Sepolia**: Obtén ETH de [Sepolia Faucet](https://sepoliafaucet.com/)
- **Arbitrum Sepolia**: Obtén ETH de [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia)

## 🛠️ Deployment Completo

### Opción 1: Deployment Automático (Recomendado)
```bash
# Compilar contratos
npm run compile

# Deploy completo con servicios demo (Ethereum Sepolia)
npm run deploy:full:sepolia

# Deploy completo con servicios demo (Arbitrum Sepolia)
npm run deploy:full:arbitrum
```

### Opción 2: Deployment Manual
```bash
# 1. Deploy contratos básicos
npm run deploy:sepolia

# 2. Poblar marketplace con servicios
npm run populate

# 3. Actualizar variables de entorno
npm run update-env
```

## 📊 Servicios Demo Incluidos

### 💻 Desarrollo (5 servicios)
1. **Desarrollo de Smart Contracts DeFi Avanzados** - $2,500 USDC
2. **Desarrollo de DApps con Next.js y Web3** - $1,800 USDC
3. **Auditoría de Smart Contracts** - $3,500 USDC
4. **Desarrollo de NFTs con Metadata Dinámica** - $1,200 USDC
5. **Desarrollo de Bridge Cross-Chain** - $5,000 USDC

### 🎨 Diseño (5 servicios)
1. **Diseño de UI/UX para Aplicaciones Web3** - $800 USDC
2. **Branding y Identidad Visual para Proyectos DeFi** - $600 USDC
3. **Diseño de NFTs y Arte Digital** - $400 USDC
4. **Diseño de Landing Pages para ICOs** - $700 USDC
5. **Diseño de Interfaces para DAOs** - $1,000 USDC

### 📈 Marketing (5 servicios)
1. **Estrategia de Marketing DeFi Completa** - $1,500 USDC
2. **Community Management para Web3** - $500 USDC
3. **Content Marketing para Blockchain** - $800 USDC
4. **Influencer Marketing en Web3** - $1,200 USDC
5. **Growth Hacking para DApps** - $1,000 USDC

### 💼 Consultoría (5 servicios)
1. **Consultoría Estratégica Blockchain** - $2,000 USDC
2. **Tokenomics y Economía de Tokens** - $1,800 USDC
3. **Consultoría Legal Web3** - $3,000 USDC
4. **Consultoría de Seguridad Blockchain** - $2,500 USDC
5. **Consultoría de Gobernanza DAO** - $1,500 USDC

## 🔧 Características Técnicas

### Contratos Desplegados
- **MockUSDC**: Token ERC20 para pagos
- **ActivaNFT**: Certificaciones Soulbound
- **ReputationSystem**: Sistema de reputación
- **ActivaMarketplace**: Marketplace principal
- **ActivaToken**: Token de gobernanza

### Funcionalidades Implementadas
- ✅ Creación de servicios
- ✅ Compra de servicios con USDC
- ✅ Sistema de reputación
- ✅ Certificaciones NFT
- ✅ Pagos descentralizados
- ✅ Gestión de órdenes

## 🌐 Verificación del Deployment

### 1. Verificar Contratos
```bash
# Verificar en Etherscan (Ethereum Sepolia)
npm run verify:sepolia

# Verificar en Arbiscan (Arbitrum Sepolia)
npm run verify:arbitrum
```

### 2. Verificar Servicios
```bash
# El script mostrará el número de servicios creados
# Verificar en el frontend: http://localhost:3000/marketplace
```

## 🚀 Iniciar Frontend

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### URLs Importantes
- **Marketplace**: http://localhost:3000/marketplace
- **Dashboard**: http://localhost:3000/marketplace/dashboard
- **Aprender**: http://localhost:3000/aprender

## 📱 Uso del Marketplace

### Para Compradores
1. Conectar wallet (MetaMask, WalletConnect, etc.)
2. Navegar por servicios disponibles
3. Filtrar por categoría o buscar
4. Comprar servicios con USDC
5. Gestionar órdenes en el dashboard

### Para Proveedores
1. Obtener certificaciones para reputación
2. Crear servicios en el marketplace
3. Gestionar órdenes recibidas
4. Completar servicios y recibir pagos

## 🔍 Monitoreo y Debugging

### Logs de Deployment
```bash
# Ver logs detallados
npm run deploy:full:sepolia 2>&1 | tee deployment.log
```

### Verificar Estado
```bash
# Verificar servicios creados
npx hardhat console --network sepolia
> const marketplace = await ethers.getContractAt("ActivaMarketplace", "DIRECCION_MARKETPLACE")
> await marketplace.serviceCounter()
```

### Archivos Generados
- `deployment-info.json`: Información del deployment
- `.env.local`: Variables de entorno actualizadas
- `deployment.log`: Logs del deployment

## 🛡️ Seguridad

### Mejores Prácticas
- ✅ Usar direcciones de testnet
- ✅ No exponer private keys
- ✅ Verificar contratos en exploradores
- ✅ Usar solo fondos de testnet
- ✅ Validar transacciones antes de confirmar

### Validaciones Implementadas
- Reputación mínima para crear servicios
- Reputación mínima para comprar servicios
- Protección contra reentrancy
- Validación de pagos USDC
- Sistema de órdenes seguro

## 📞 Soporte

### Problemas Comunes
1. **Error de gas**: Aumentar gas limit
2. **Fondos insuficientes**: Obtener más ETH de faucet
3. **Contrato no encontrado**: Verificar deployment
4. **Variables de entorno**: Ejecutar `npm run update-env`

### Recursos
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Wagmi Documentation](https://wagmi.sh/)
- [ActivaChain GitHub](https://github.com/activachain)

## 🎉 ¡Listo!

Después del deployment exitoso, tendrás:
- ✅ 20 servicios demo reales y funcionales
- ✅ Marketplace completamente operativo
- ✅ Sistema de reputación activo
- ✅ Pagos en USDC funcionando
- ✅ Frontend con glassmorphism y efectos neurales

**¡Disfruta explorando el futuro del trabajo descentralizado!** 🚀

---
**ActivaChain Marketplace** - Construyendo el futuro del trabajo Web3 para mujeres 💎
