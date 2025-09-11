# Configuración de Reown AppKit para ActivaChain

## 🚀 Pasos para Configurar Reown AppKit

### 1. Crear Proyecto en Reown
1. Ve a [https://cloud.reown.com/](https://cloud.reown.com/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia tu **Project ID**

### 2. Configurar Variables de Entorno

#### Opción A: Archivo .env.local (Recomendado)
```bash
# En el directorio frontend/
cp env.local.example .env.local
```

Luego edita `.env.local` y agrega tu Project ID:
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_aqui
```

#### Opción B: Variables de Sistema
```bash
# Windows PowerShell
$env:NEXT_PUBLIC_REOWN_PROJECT_ID="tu_project_id_aqui"

# Windows CMD
set NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_aqui

# Linux/Mac
export NEXT_PUBLIC_REOWN_PROJECT_ID="tu_project_id_aqui"
```

### 3. Reiniciar el Servidor de Desarrollo
```bash
cd frontend
npm run dev
```

## 🔧 Configuración Adicional

### Redes Soportadas
El proyecto está configurado para soportar:
- **Ethereum Sepolia** (Chain ID: 11155111)
- **Arbitrum Sepolia** (Chain ID: 421614)

### Características Habilitadas
- ✅ Analytics
- ✅ Email login
- ✅ Social logins (Google, Facebook, GitHub)
- ✅ Email show wallets
- ✅ Tema oscuro personalizado

## 🎨 Personalización del Tema

El tema está configurado con los colores de ActivaChain:
- **Color principal**: #9333EA (Púrpura)
- **Color secundario**: #EC4899 (Rosa)
- **Modo**: Oscuro
- **Fuente**: Inter

## 🚨 Solución de Problemas

### Error: "Failed to fetch remote project configuration"
- Verifica que tu Project ID sea correcto
- Asegúrate de que el proyecto esté activo en Reown Cloud
- Revisa tu conexión a internet

### Error: "useNetwork is not a function"
- Ya corregido en la versión actual
- Usa `useChainId` en lugar de `useNetwork`

### Error: "Invalid next.config.js options"
- Ya corregido en la versión actual
- Removido `experimental.appDir`

## 📱 Para el Hackathon

### Configuración Rápida
1. **Crea proyecto en Reown** (5 minutos)
2. **Copia Project ID** (1 minuto)
3. **Configura .env.local** (1 minuto)
4. **Reinicia servidor** (1 minuto)

### Demo sin Project ID
Si no tienes tiempo de configurar Reown, el frontend mostrará una pantalla de configuración en lugar de fallar.

## 🔗 Links Útiles

- [Reown Cloud](https://cloud.reown.com/)
- [Reown AppKit Docs](https://docs.reown.com/appkit)
- [Wagmi v2 Migration](https://wagmi.sh/react/migration-guide)

---

**¡ActivaChain listo para ETH Uruguay 2025!** 🚀
