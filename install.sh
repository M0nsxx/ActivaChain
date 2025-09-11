#!/bin/bash

echo "🚀 Instalando ActivaChain - ETH Uruguay 2025"
echo "=============================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión 18+ requerida. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias principales
echo "📦 Instalando dependencias principales..."
npm install

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Compilar contratos
echo "🔧 Compilando contratos..."
npx hardhat compile

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus claves privadas y API keys"
fi

echo ""
echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus claves"
echo "2. Ejecuta: npm run deploy:both (para deployar a ambas redes)"
echo "3. Ejecuta: cd frontend && npm run dev (para iniciar el frontend)"
echo ""
echo "🎯 Para el hackathon:"
echo "- Deploy dual: Ethereum Sepolia + Arbitrum Sepolia"
echo "- Sistema de reputación para bounty Maldo"
echo "- Frontend con Reown AppKit"
echo ""
echo "¡Éxito en ETH Uruguay 2025! 🚀"
