const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🔍 Verificando contratos manualmente en Ethereum Sepolia...");
  
  const API_KEY = "Q8EG2XBFE3GC8MXAVSD326T6TNVQXJ85BG";
  const ETHERSCAN_API = "https://api-sepolia.etherscan.io/api";
  
  // Contratos a verificar
  const contracts = [
    {
      name: "UnifiedReputationSystem",
      address: "0x24FF472f7fc79672A4C1032dF37B74B2981389bf",
      constructorArgs: []
    }
  ];

  for (const contract of contracts) {
    try {
      console.log(`\n🔍 Verificando ${contract.name}...`);
      console.log(`📍 Dirección: ${contract.address}`);
      
      // Leer el código fuente del contrato
      const sourcePath = `contracts/${contract.name}.sol`;
      if (!fs.existsSync(sourcePath)) {
        console.log(`❌ Archivo fuente no encontrado: ${sourcePath}`);
        continue;
      }
      
      const sourceCode = fs.readFileSync(sourcePath, 'utf8');
      
      // Preparar parámetros para verificación
      const verificationParams = {
        apikey: API_KEY,
        module: "contract",
        action: "verifysourcecode",
        contractaddress: contract.address,
        sourceCode: sourceCode,
        codeformat: "solidity-single-file",
        contractname: contract.name,
        compilerversion: "v0.8.20+commit.a1b79de6",
        optimizationUsed: "0",
        runs: "200"
      };
      
      // Agregar constructor arguments si existen
      if (contract.constructorArgs && contract.constructorArgs.length > 0) {
        verificationParams.constructorArguements = contract.constructorArgs.join(',');
      }
      
      console.log("📤 Enviando solicitud de verificación...");
      
      // Enviar solicitud de verificación
      const formData = new URLSearchParams(verificationParams);
      const response = await fetch(ETHERSCAN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.status === "1") {
        console.log(`✅ ${contract.name} enviado para verificación`);
        console.log(`🆔 GUID: ${result.result}`);
        console.log(`🔗 https://sepolia.etherscan.io/address/${contract.address}`);
        
        // Esperar un poco y verificar el estado
        console.log("⏳ Esperando verificación...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const checkUrl = `${ETHERSCAN_API}?module=contract&action=getsourcecode&address=${contract.address}&apikey=${API_KEY}`;
        const checkResponse = await fetch(checkUrl);
        const checkData = await checkResponse.json();
        
        if (checkData.result && checkData.result[0] && checkData.result[0].SourceCode !== "") {
          console.log(`✅ ${contract.name} verificado exitosamente!`);
        } else {
          console.log(`⏳ ${contract.name} aún en proceso de verificación...`);
        }
        
      } else {
        console.log(`❌ Error verificando ${contract.name}: ${result.message}`);
        if (result.result) {
          console.log(`📋 Detalles: ${result.result}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error procesando ${contract.name}: ${error.message}`);
    }
  }
  
  console.log("\n🎉 Proceso de verificación completado!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });
