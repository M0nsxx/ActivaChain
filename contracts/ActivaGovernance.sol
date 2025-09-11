// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ActivaGovernance is Ownable, ReentrancyGuard {
    IERC20 public immutable activaToken;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool cancelled;
        uint8 proposalType; // 1: Treasury, 2: Protocol, 3: Community
        uint256 targetValue; // Para propuestas de treasury
        address targetAddress; // Para propuestas de treasury
        bytes data; // Para propuestas de protocol
    }
    
    struct Vote {
        bool hasVoted;
        uint8 support; // 0: Against, 1: For, 2: Abstain
        uint256 votes;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public votingPower;
    mapping(address => uint256) public lastVoteTime;
    
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant EXECUTION_DELAY = 1 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 ACTIVA tokens
    uint256 public constant QUORUM_THRESHOLD = 10000 * 10**18; // 10000 ACTIVA tokens
    uint256 public constant EXECUTION_THRESHOLD = 5000 * 10**18; // 5000 ACTIVA tokens
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 votes
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event VotingPowerUpdated(address indexed voter, uint256 newPower);
    
    constructor(address _activaToken) Ownable(msg.sender) {
        activaToken = IERC20(_activaToken);
    }
    
    function createProposal(
        string memory title,
        string memory description,
        uint8 proposalType,
        uint256 targetValue,
        address targetAddress,
        bytes memory data
    ) external returns (uint256) {
        require(activaToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD, "Insufficient tokens to propose");
        require(proposalType >= 1 && proposalType <= 3, "Invalid proposal type");
        
        uint256 proposalId = proposalCounter++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            executed: false,
            cancelled: false,
            proposalType: proposalType,
            targetValue: targetValue,
            targetAddress: targetAddress,
            data: data
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, block.timestamp, block.timestamp + VOTING_PERIOD);
        return proposalId;
    }
    
    function castVote(uint256 proposalId, uint8 support) external {
        require(support <= 2, "Invalid vote type");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        require(block.timestamp >= proposals[proposalId].startTime, "Voting not started");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting ended");
        require(!proposals[proposalId].cancelled, "Proposal cancelled");
        
        uint256 voterPower = getVotingPower(msg.sender);
        require(voterPower > 0, "No voting power");
        
        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            support: support,
            votes: voterPower
        });
        
        if (support == 0) {
            proposals[proposalId].againstVotes += voterPower;
        } else if (support == 1) {
            proposals[proposalId].forVotes += voterPower;
        } else {
            proposals[proposalId].abstainVotes += voterPower;
        }
        
        lastVoteTime[msg.sender] = block.timestamp;
        emit VoteCast(msg.sender, proposalId, support, voterPower);
    }
    
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(block.timestamp >= proposal.endTime + EXECUTION_DELAY, "Execution delay not met");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        require(totalVotes >= QUORUM_THRESHOLD, "Quorum not met");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        require(proposal.forVotes >= EXECUTION_THRESHOLD, "Execution threshold not met");
        
        proposal.executed = true;
        
        // Ejecutar la propuesta según su tipo
        if (proposal.proposalType == 1) {
            // Treasury proposal - transferir fondos
            require(proposal.targetAddress != address(0), "Invalid target address");
            require(proposal.targetValue > 0, "Invalid amount");
            // En un contrato real, aquí se transferirían los fondos del treasury
        } else if (proposal.proposalType == 2) {
            // Protocol proposal - ejecutar función
            require(proposal.data.length > 0, "No data provided");
            // En un contrato real, aquí se ejecutaría la función del protocolo
        }
        // Tipo 3 (Community) no requiere ejecución automática
        
        emit ProposalExecuted(proposalId);
    }
    
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Already cancelled");
        require(block.timestamp < proposal.endTime, "Voting ended");
        
        proposal.cancelled = true;
        emit ProposalCancelled(proposalId);
    }
    
    function getVotingPower(address voter) public view returns (uint256) {
        return activaToken.balanceOf(voter);
    }
    
    function getProposalState(uint256 proposalId) external view returns (string memory) {
        Proposal memory proposal = proposals[proposalId];
        
        if (proposal.cancelled) return "Cancelled";
        if (proposal.executed) return "Executed";
        if (block.timestamp < proposal.startTime) return "Pending";
        if (block.timestamp <= proposal.endTime) return "Active";
        if (block.timestamp <= proposal.endTime + EXECUTION_DELAY) return "Succeeded";
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        if (totalVotes < QUORUM_THRESHOLD) return "Defeated";
        if (proposal.forVotes <= proposal.againstVotes) return "Defeated";
        if (proposal.forVotes < EXECUTION_THRESHOLD) return "Defeated";
        
        return "Queued";
    }
    
    function getProposalVotes(uint256 proposalId) external view returns (
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        uint256 totalVotes
    ) {
        Proposal memory proposal = proposals[proposalId];
        forVotes = proposal.forVotes;
        againstVotes = proposal.againstVotes;
        abstainVotes = proposal.abstainVotes;
        totalVotes = forVotes + againstVotes + abstainVotes;
    }
    
    function getUserVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return votes[proposalId][voter];
    }
    
    function getProposalCount() external view returns (uint256) {
        return proposalCounter;
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256[] memory activeProposals = new uint256[](proposalCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < proposalCounter; i++) {
            if (block.timestamp >= proposals[i].startTime && 
                block.timestamp <= proposals[i].endTime && 
                !proposals[i].cancelled) {
                activeProposals[count] = i;
                count++;
            }
        }
        
        // Redimensionar el array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeProposals[i];
        }
        
        return result;
    }
}
