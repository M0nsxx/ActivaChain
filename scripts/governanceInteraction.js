const { ethers } = require("hardhat");

async function main() {
  console.log("🏛️ Interactuando con ActivaGovernance...");

  // Configuración
  const GOVERNANCE_ADDRESS = "0x..."; // Reemplazar con la dirección real
  const ACTIVA_TOKEN_ADDRESS = "0x..."; // Reemplazar con la dirección real

  // Obtener signers
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);

  // Conectar a los contratos
  const governance = await ethers.getContractAt("ActivaGovernance", GOVERNANCE_ADDRESS);
  const activaToken = await ethers.getContractAt("ActivaToken", ACTIVA_TOKEN_ADDRESS);

  console.log("\n📊 Estado inicial:");
  
  // Verificar balances de tokens
  const deployerBalance = await activaToken.balanceOf(deployer.address);
  const user1Balance = await activaToken.balanceOf(user1.address);
  const user2Balance = await activaToken.balanceOf(user2.address);

  console.log(`Deployer ACTIVA balance: ${ethers.formatEther(deployerBalance)}`);
  console.log(`User1 ACTIVA balance: ${ethers.formatEther(user1Balance)}`);
  console.log(`User2 ACTIVA balance: ${ethers.formatEther(user2Balance)}`);

  // Verificar poder de votación
  const deployerVotingPower = await governance.getVotingPower(deployer.address);
  const user1VotingPower = await governance.getVotingPower(user1.address);
  const user2VotingPower = await governance.getVotingPower(user2.address);

  console.log(`Deployer voting power: ${ethers.formatEther(deployerVotingPower)}`);
  console.log(`User1 voting power: ${ethers.formatEther(user1VotingPower)}`);
  console.log(`User2 voting power: ${ethers.formatEther(user2VotingPower)}`);

  // Crear una propuesta de ejemplo
  console.log("\n✨ Creando propuesta de ejemplo...");
  
  const proposalTx = await governance.connect(deployer).createProposal(
    "Aumentar comisión de plataforma al 3%",
    "Esta propuesta busca incrementar la comisión de la plataforma del 2.5% al 3% para mejorar la sostenibilidad del protocolo y financiar nuevas funcionalidades. Los fondos adicionales se utilizarán para: 1) Desarrollo de nuevas características, 2) Marketing y adopción, 3) Seguridad y auditorías, 4) Recompensas comunitarias.",
    2, // Tipo: Protocolo
    0, // Target value (no aplica para propuestas de protocolo)
    ethers.ZeroAddress, // Target address (no aplica)
    "0x" // Data (no aplica para esta propuesta)
  );

  const receipt = await proposalTx.wait();
  const proposalId = receipt.logs[0].args.proposalId;
  console.log(`✅ Propuesta creada con ID: ${proposalId}`);

  // Obtener información de la propuesta
  const proposal = await governance.proposals(proposalId);
  console.log("\n📋 Información de la propuesta:");
  console.log(`- ID: ${proposal.id}`);
  console.log(`- Título: ${proposal.title}`);
  console.log(`- Proponente: ${proposal.proposer}`);
  console.log(`- Tipo: ${proposal.proposalType}`);
  console.log(`- Inicio: ${new Date(Number(proposal.startTime) * 1000).toLocaleString()}`);
  console.log(`- Fin: ${new Date(Number(proposal.endTime) * 1000).toLocaleString()}`);

  // Simular votaciones
  console.log("\n🗳️ Simulando votaciones...");

  // User1 vota a favor
  if (user1VotingPower > 0) {
    const vote1Tx = await governance.connect(user1).castVote(proposalId, 1); // A favor
    await vote1Tx.wait();
    console.log("✅ User1 votó A FAVOR");
  }

  // User2 vota en contra
  if (user2VotingPower > 0) {
    const vote2Tx = await governance.connect(user2).castVote(proposalId, 0); // En contra
    await vote2Tx.wait();
    console.log("✅ User2 votó EN CONTRA");
  }

  // Deployer vota a favor
  const vote3Tx = await governance.connect(deployer).castVote(proposalId, 1); // A favor
  await vote3Tx.wait();
  console.log("✅ Deployer votó A FAVOR");

  // Obtener resultados de votación
  const votes = await governance.getProposalVotes(proposalId);
  console.log("\n📊 Resultados de votación:");
  console.log(`- A favor: ${ethers.formatEther(votes.forVotes)} ACTIVA`);
  console.log(`- En contra: ${ethers.formatEther(votes.againstVotes)} ACTIVA`);
  console.log(`- Abstención: ${ethers.formatEther(votes.abstainVotes)} ACTIVA`);
  console.log(`- Total: ${ethers.formatEther(votes.totalVotes)} ACTIVA`);

  // Verificar estado de la propuesta
  const state = await governance.getProposalState(proposalId);
  console.log(`- Estado: ${state}`);

  // Verificar votos individuales
  console.log("\n👥 Votos individuales:");
  const deployerVote = await governance.getUserVote(proposalId, deployer.address);
  const user1Vote = await governance.getUserVote(proposalId, user1.address);
  const user2Vote = await governance.getUserVote(proposalId, user2.address);

  console.log(`Deployer: ${deployerVote.hasVoted ? (deployerVote.support === 1 ? 'A FAVOR' : deployerVote.support === 0 ? 'EN CONTRA' : 'ABSTENCIÓN') : 'NO VOTÓ'} (${ethers.formatEther(deployerVote.votes)} ACTIVA)`);
  console.log(`User1: ${user1Vote.hasVoted ? (user1Vote.support === 1 ? 'A FAVOR' : user1Vote.support === 0 ? 'EN CONTRA' : 'ABSTENCIÓN') : 'NO VOTÓ'} (${ethers.formatEther(user1Vote.votes)} ACTIVA)`);
  console.log(`User2: ${user2Vote.hasVoted ? (user2Vote.support === 1 ? 'A FAVOR' : user2Vote.support === 0 ? 'EN CONTRA' : 'ABSTENCIÓN') : 'NO VOTÓ'} (${ethers.formatEther(user2Vote.votes)} ACTIVA)`);

  // Obtener propuestas activas
  const activeProposals = await governance.getActiveProposals();
  console.log(`\n🔄 Propuestas activas: ${activeProposals.length}`);

  // Obtener número total de propuestas
  const totalProposals = await governance.getProposalCount();
  console.log(`📈 Total de propuestas: ${totalProposals}`);

  console.log("\n🎉 ¡Interacción completada exitosamente!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en la interacción:", error);
    process.exit(1);
  });
