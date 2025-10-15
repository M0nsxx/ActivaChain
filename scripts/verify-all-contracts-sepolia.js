const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verificando contratos en Ethereum Sepolia...");
  
  const API_KEY = "Q8EG2XBFE3GC8MXAVSD326T6TNVQXJ85BG";
  const ETHERSCAN_API = "https://api-sepolia.etherscan.io/api";
  
  // Contratos a verificar
  const contracts = [
    {
      name: "UnifiedReputationSystem",
      address: "0x24FF472f7fc79672A4C1032dF37B74B2981389bf",
      constructorArgs: []
    },
    {
      name: "ActivaToken", 
      address: "0x11a16814c7E8079Cc010a1603C15b818c3411FC4",
      constructorArgs: ["ActivaChain Token", "ACTIVA", ethers.parseEther("1000000")]
    },
    {
      name: "ActivaNFT",
      address: "0x45e5FDDa2B3215423B82b2502B388D5dA8944bA9", 
      constructorArgs: ["0x24FF472f7fc79672A4C1032dF37B74B2981389bf"]
    },
    {
      name: "ActivaMarketplaceMultiToken",
      address: "0xBc6f7ADb6Af52997CC9aF02E1B348083B5eA978F",
      constructorArgs: ["0x11a16814c7E8079Cc010a1603C15b818c3411FC4", "0x24FF472f7fc79672A4C1032dF37B74B2981389bf"]
    },
    {
      name: "ActivaGovernance",
      address: "0xf278be79d14CcF53157B045bdbb51D98d58964F9",
      constructorArgs: ["0x11a16814c7E8079Cc010a1603C15b818c3411FC4"]
    },
    {
      name: "GamificationSystem",
      address: "0x75069e3b4e62966325Ac8ef2fEA48e8909225acF",
      constructorArgs: []
    },
    {
      name: "CommunitySystem", 
      address: "0x9231c39C19A4A938Da2E3D1D67AbaBDE77388b09",
      constructorArgs: []
    },
    {
      name: "IPFSIntegration",
      address: "0x79ede9d4E531ea6b7bF5eF35c4b31ea69210107A",
      constructorArgs: []
    },
    {
      name: "PushNotificationSystem",
      address: "0x1fbD7E942b0e19dB7D74c6DF1CfdE7753A30841d", 
      constructorArgs: []
    },
    {
      name: "ExternalAPIIntegration",
      address: "0xe09D357311eDC869dbba5E043a3915413547F288",
      constructorArgs: []
    }
  ];

  console.log(`📋 Verificando ${contracts.length} contratos...\n`);

  for (const contract of contracts) {
    try {
      console.log(`🔍 Verificando ${contract.name}...`);
      console.log(`📍 Dirección: ${contract.address}`);
      
      // Verificar si ya está verificado
      const checkUrl = `${ETHERSCAN_API}?module=contract&action=getsourcecode&address=${contract.address}&apikey=${API_KEY}`;
      const checkResponse = await fetch(checkUrl);
      const checkData = await checkResponse.json();
      
      if (checkData.result && checkData.result[0] && checkData.result[0].SourceCode !== "") {
        console.log(`✅ ${contract.name} ya está verificado en Etherscan`);
        console.log(`🔗 https://sepolia.etherscan.io/address/${contract.address}\n`);
        continue;
      }
      
      // Obtener el código fuente compilado
      const contractFactory = await ethers.getContractFactory(contract.name);
      const sourceCode = contractFactory.bytecode;
      
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
        verificationParams.constructorArguements = contract.constructorArgs.map(arg => 
          typeof arg === 'string' ? arg : arg.toString()
        ).join(',');
      }
      
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
        console.log(`🔗 https://sepolia.etherscan.io/address/${contract.address}\n`);
      } else {
        console.log(`❌ Error verificando ${contract.name}: ${result.message}`);
        console.log(`🔗 https://sepolia.etherscan.io/address/${contract.address}\n`);
      }
      
    } catch (error) {
      console.log(`❌ Error procesando ${contract.name}: ${error.message}\n`);
    }
  }
  
  console.log("🎉 Verificación completada!");
  console.log("📋 Resumen de contratos:");
  contracts.forEach(contract => {
    console.log(`- ${contract.name}: https://sepolia.etherscan.io/address/${contract.address}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante la verificación:", error);
    process.exit(1);
  });
