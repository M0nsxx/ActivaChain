# 🛒 ActivaChain Marketplace

## Descripción

El marketplace descentralizado de ActivaChain es una plataforma Web3 que permite a las usuarias ofrecer y contratar servicios profesionales utilizando tecnología blockchain. La plataforma está diseñada con un enfoque brutalmente hermoso, utilizando glassmorphism y efectos neurales para crear una experiencia visual única.

## ✨ Características Principales

### 🎨 Diseño Visual
- **Glassmorphism**: Efectos de vidrio esmerilado con transparencias y blur
- **Efectos Neurales**: Partículas animadas y conexiones dinámicas
- **Gradientes Dinámicos**: Colores que cambian y se adaptan al contenido
- **Animaciones Fluidas**: Transiciones suaves y efectos de hover avanzados

### 💼 Funcionalidades del Marketplace
- **Creación de Servicios**: Los usuarios pueden crear y publicar servicios
- **Categorización**: Servicios organizados por categorías (Desarrollo, Diseño, Marketing, Consultoría)
- **Sistema de Reputación**: Badges y niveles basados en blockchain
- **Pagos en USDC**: Transacciones seguras con tokens estables
- **Dashboard Interactivo**: Panel de control con estadísticas en tiempo real

### 🔗 Integración Blockchain
- **Smart Contracts**: Contratos inteligentes para transacciones seguras
- **Reputación On-Chain**: Sistema de reputación inmutable
- **Pagos Descentralizados**: Sin intermediarios tradicionales
- **Transparencia Total**: Todas las transacciones son públicas y verificables

## 🏗️ Arquitectura Técnica

### Frontend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Estilos utilitarios con clases personalizadas
- **Framer Motion**: Animaciones avanzadas
- **Wagmi**: Integración con Web3

### Smart Contracts
- **Solidity**: Lenguaje de contratos inteligentes
- **OpenZeppelin**: Bibliotecas de seguridad probadas
- **Hardhat**: Entorno de desarrollo y testing

### Componentes Principales

#### 🎯 Páginas
- `/marketplace` - Página principal del marketplace
- `/marketplace/dashboard` - Dashboard personal del usuario

#### 🧩 Componentes
- `GlassCard` - Tarjetas con efecto glassmorphism
- `NeuralParticles` - Partículas animadas de fondo
- `NeuralConnections` - Conexiones visuales entre elementos
- `MarketplaceStats` - Estadísticas en tiempo real
- `FeaturedServices` - Servicios destacados con carrusel
- `LiveTransactions` - Transacciones en tiempo real
- `ServiceCategories` - Categorías de servicios interactivas
- `NetworkStatus` - Estado de la red blockchain
- `ReputationCard` - Sistema de reputación y badges

## 🎨 Efectos Visuales

### Glassmorphism
```css
.glass-morphism {
  backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl;
}
```

### Efectos Neurales
- Partículas flotantes con colores dinámicos
- Conexiones animadas entre nodos
- Pulsos de luz y efectos de glow
- Gradientes que cambian en tiempo real

### Animaciones
- `animate-neural-pulse` - Pulso neural
- `animate-float` - Flotación suave
- `animate-marketplace-glow` - Resplandor del marketplace
- `animate-service-card-hover` - Efecto hover en tarjetas

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Wallet Web3 (MetaMask, WalletConnect, etc.)
- Tokens USDC para transacciones

### Instalación
```bash
cd frontend
npm install
npm run dev
```

### Configuración
1. Configurar variables de entorno en `.env.local`
2. Conectar wallet a la red correcta
3. Aprobar tokens USDC si es necesario

## 📊 Categorías de Servicios

### 💻 Desarrollo
- Smart Contracts
- DApps
- Protocolos DeFi
- Auditorías de código

### 🎨 Diseño
- UI/UX para Web3
- Branding digital
- NFTs y arte digital
- Interfaces descentralizadas

### 📈 Marketing
- Estrategias DeFi
- Community Building
- Tokenomics
- Growth Hacking

### 💼 Consultoría
- Estrategia Blockchain
- Implementación Web3
- Análisis de mercado
- Asesoramiento legal

## 🏆 Sistema de Reputación

### Niveles
- **Principiante** (0-100 puntos)
- **Intermedia** (100-300 puntos)
- **Experta** (300-500 puntos)
- **Maestra** (500+ puntos)

### Badges
- 🎯 Primera Venta
- ⭐ Vendedor Estrella
- 🏆 Experto
- 👨‍🏫 Mentor

### Beneficios
- Comisiones reducidas
- Acceso a servicios premium
- Soporte prioritario
- Visibilidad mejorada

## 🔧 Desarrollo

### Estructura de Archivos
```
frontend/
├── app/
│   ├── marketplace/
│   │   ├── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   └── components/
│       ├── GlassCard.tsx
│       ├── NeuralParticles.tsx
│       ├── MarketplaceStats.tsx
│       ├── FeaturedServices.tsx
│       ├── LiveTransactions.tsx
│       ├── ServiceCategories.tsx
│       ├── NetworkStatus.tsx
│       └── ReputationCard.tsx
└── styles/
    └── globals.css
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Testing
npm run test
```

## 🎯 Roadmap

### Fase 1 ✅
- [x] Diseño base con glassmorphism
- [x] Componentes principales
- [x] Integración Web3 básica
- [x] Sistema de reputación

### Fase 2 🚧
- [ ] Chat en tiempo real
- [ ] Sistema de disputas
- [ ] Notificaciones push
- [ ] Mobile app (PWA)

### Fase 3 📋
- [ ] IA para matching de servicios
- [ ] Integración con más blockchains
- [ ] Sistema de staking
- [ ] Gobernanza descentralizada

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: support@activachain.com
- 💬 Discord: [ActivaChain Community](https://discord.gg/activachain)
- 📱 Twitter: [@ActivaChain](https://twitter.com/activachain)

---

**ActivaChain Marketplace** - Construyendo el futuro del trabajo descentralizado para mujeres en Web3 🚀
