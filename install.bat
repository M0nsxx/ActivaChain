@echo off
echo 🚀 Instalando ActivaChain - ETH Uruguay 2025
echo ==============================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

REM Instalar dependencias principales
echo 📦 Instalando dependencias principales...
npm install

REM Instalar dependencias del frontend
echo 📦 Instalando dependencias del frontend...
cd frontend
npm install
cd ..

REM Compilar contratos
echo 🔧 Compilando contratos...
npx hardhat compile

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy env.example .env
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tus claves privadas y API keys
)

echo.
echo ✅ Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Edita el archivo .env con tus claves
echo 2. Ejecuta: npm run deploy:both (para deployar a ambas redes)
echo 3. Ejecuta: cd frontend ^&^& npm run dev (para iniciar el frontend)
echo.
echo 🎯 Para el hackathon:
echo - Deploy dual: Ethereum Sepolia + Arbitrum Sepolia
echo - Sistema de reputación para bounty Maldo
echo - Frontend con Reown AppKit
echo.
echo ¡Éxito en ETH Uruguay 2025! 🚀
pause
