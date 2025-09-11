# ⚡ Quick Start - ActivaChain Marketplace

## 🚀 Deployment Rápido (3 comandos)

```bash
# 1. Instalar dependencias
npm install

# 2. Deploy completo con 20 servicios demo
npm run deploy:full:sepolia

# 3. Iniciar frontend
cd frontend && npm install && npm run dev
```

## 📋 Configuración Mínima

### Variables de Entorno (.env)
```bash
PRIVATE_KEY=tu_private_key_aqui
SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/TU_KEY
NEXT_PUBLIC_REOWN_PROJECT_ID=c2b93e3f5a3a9b146ef83026c4d17a67
```

### Fondos de Testnet
- **Ethereum Sepolia**: [Sepolia Faucet](https://sepoliafaucet.com/)
- **Arbitrum Sepolia**: [Arbitrum Faucet](https://faucet.quicknode.com/arbitrum/sepolia)

## 🎯 Servicios Demo Incluidos (20 total)

### 💻 Desarrollo (5 servicios)
- Smart Contracts DeFi Avanzados - $2,500
- DApps con Next.js y Web3 - $1,800
- Auditoría de Smart Contracts - $3,500
- NFTs con Metadata Dinámica - $1,200
- Bridge Cross-Chain - $5,000

### 🎨 Diseño (5 servicios)
- UI/UX para Aplicaciones Web3 - $800
- Branding para Proyectos DeFi - $600
- NFTs y Arte Digital - $400
- Landing Pages para ICOs - $700
- Interfaces para DAOs - $1,000

### 📈 Marketing (5 servicios)
- Estrategia de Marketing DeFi - $1,500
- Community Management Web3 - $500
- Content Marketing Blockchain - $800
- Influencer Marketing Web3 - $1,200
- Growth Hacking para DApps - $1,000

### 💼 Consultoría (5 servicios)
- Consultoría Estratégica Blockchain - $2,000
- Tokenomics y Economía de Tokens - $1,800
- Consultoría Legal Web3 - $3,000
- Consultoría de Seguridad Blockchain - $2,500
- Consultoría de Gobernanza DAO - $1,500

## 🔧 Comandos Útiles

```bash
# Deployment
npm run deploy:full:sepolia          # Deploy completo en Sepolia
npm run deploy:full:arbitrum         # Deploy completo en Arbitrum
npm run populate                     # Solo poblar marketplace
npm run test:marketplace             # Test del marketplace
npm run update-env                   # Actualizar variables de entorno

# Frontend
cd frontend
npm run dev                          # Servidor de desarrollo
npm run build                        # Build de producción
npm run start                        # Servidor de producción
```

## 🌐 URLs Importantes

- **Marketplace**: http://localhost:3000/marketplace
- **Dashboard**: http://localhost:3000/marketplace/dashboard
- **Aprender**: http://localhost:3000/aprender
- **Home**: http://localhost:3000

## ✅ Verificación del Deployment

```bash
# Verificar servicios creados
npm run test:marketplace

# Verificar en el frontend
# 1. Conectar wallet
# 2. Navegar a /marketplace
# 3. Ver 20 servicios disponibles
# 4. Probar filtros y búsqueda
```

## 🎨 Características del Frontend

- **Glassmorphism**: Efectos de vidrio esmerilado
- **Efectos Neurales**: Partículas animadas y conexiones
- **Responsive**: Optimizado para móvil y desktop
- **Web3 Integration**: Wagmi + Reown AppKit
- **Real-time**: Transacciones en vivo
- **Accessibility**: Navegación por teclado y aria-labels

## 🛡️ Seguridad

- ✅ Solo testnet (no mainnet)
- ✅ Contratos verificados
- ✅ Protección contra reentrancy
- ✅ Validación de pagos
- ✅ Sistema de reputación

## 📞 Soporte

### Problemas Comunes
1. **Error de gas**: Aumentar gas limit
2. **Fondos insuficientes**: Obtener ETH de faucet
3. **Variables de entorno**: Ejecutar `npm run update-env`

### Archivos Importantes
- `deployment-info.json`: Información del deployment
- `.env.local`: Variables de entorno
- `DEPLOYMENT_GUIDE.md`: Guía completa
- `MARKETPLACE_README.md`: Documentación del marketplace

## 🎉 ¡Listo!

Después del deployment tendrás:
- ✅ 20 servicios demo reales y funcionales
- ✅ Marketplace completamente operativo
- ✅ Sistema de reputación activo
- ✅ Pagos en USDC funcionando
- ✅ Frontend con efectos visuales impresionantes

**¡Disfruta explorando el futuro del trabajo descentralizado!** 🚀

---
**ActivaChain Marketplace** - Web3 para mujeres 💎
