// ABIs de los contratos ActivaChain
export const MARKETPLACE_ABI = [
  {
    "inputs": [],
    "name": "serviceCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "serviceId", "type": "uint256"}],
    "name": "getService",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "provider", "type": "address"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "price", "type": "uint256"},
          {"name": "paymentToken", "type": "uint8"},
          {"name": "category", "type": "uint8"},
          {"name": "isActive", "type": "bool"},
          {"name": "minReputation", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "serviceId", "type": "uint256"}],
    "name": "purchaseServiceWithETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "serviceId", "type": "uint256"}],
    "name": "purchaseServiceWithERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "price", "type": "uint256"},
      {"name": "paymentToken", "type": "uint8"},
      {"name": "category", "type": "uint8"},
      {"name": "minReputation", "type": "uint256"}
    ],
    "name": "createService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "orderId", "type": "uint256"}],
    "name": "completeOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "provider", "type": "address"}],
    "name": "getProviderServices",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "orderId", "type": "uint256"}],
    "name": "getOrder",
    "outputs": [
      {
        "components": [
          {"name": "serviceId", "type": "uint256"},
          {"name": "buyer", "type": "address"},
          {"name": "provider", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "paymentToken", "type": "uint8"},
          {"name": "status", "type": "uint8"},
          {"name": "timestamp", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "userReputation",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const ACTIVA_TOKEN_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getStakingInfo",
    "outputs": [
      {"name": "balance", "type": "uint256"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const ARB_TOKEN_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const ADVANCED_REPUTATION_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getReputation",
    "outputs": [
      {"name": "score", "type": "uint256"},
      {"name": "endorsementCount", "type": "uint256"},
      {"name": "isVerified", "type": "bool"},
      {"name": "verificationLevel", "type": "uint256"},
      {"name": "userActivityStreak", "type": "uint256"},
      {"name": "timeSinceLastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getDetailedReputation",
    "outputs": [
      {"name": "baseScore", "type": "uint256"},
      {"name": "timeDecay", "type": "uint256"},
      {"name": "endorsementBonus", "type": "uint256"},
      {"name": "activityScore", "type": "uint256"},
      {"name": "totalScore", "type": "uint256"},
      {"name": "lastUpdate", "type": "uint256"},
      {"name": "lastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "endorseUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "proofHash", "type": "bytes32"},
      {"name": "proof", "type": "bytes"},
      {"name": "verificationLevel", "type": "uint256"}
    ],
    "name": "verifyIdentityWithZK",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const GAMIFICATION_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserProfile",
    "outputs": [
      {"name": "totalPoints", "type": "uint256"},
      {"name": "level", "type": "uint256"},
      {"name": "experience", "type": "uint256"},
      {"name": "achievements", "type": "uint256"},
      {"name": "badges", "type": "uint256"},
      {"name": "streak", "type": "uint256"},
      {"name": "lastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserAchievements",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserBadges",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "achievementId", "type": "uint256"}],
    "name": "getAchievementInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "icon", "type": "string"},
      {"name": "points", "type": "uint256"},
      {"name": "category", "type": "uint256"},
      {"name": "isActive", "type": "bool"},
      {"name": "unlockCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "badgeId", "type": "uint256"}],
    "name": "getBadgeInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "imageURI", "type": "string"},
      {"name": "rarity", "type": "uint256"},
      {"name": "requirements", "type": "uint256"},
      {"name": "isActive", "type": "bool"},
      {"name": "earnCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const GOVERNANCE_ABI = [
  {
    "inputs": [],
    "name": "proposalCounter",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "proposalId", "type": "uint256"}],
    "name": "getProposal",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "proposer", "type": "address"},
          {"name": "startTime", "type": "uint256"},
          {"name": "endTime", "type": "uint256"},
          {"name": "forVotes", "type": "uint256"},
          {"name": "againstVotes", "type": "uint256"},
          {"name": "abstainVotes", "type": "uint256"},
          {"name": "proposalType", "type": "uint8"},
          {"name": "executed", "type": "bool"},
          {"name": "cancelled", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "proposalType", "type": "uint8"},
      {"name": "duration", "type": "uint256"}
    ],
    "name": "createProposal",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "proposalId", "type": "uint256"},
      {"name": "support", "type": "uint8"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "proposalId", "type": "uint256"}],
    "name": "executeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getVotingPower",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "proposalId", "type": "uint256"},
      {"name": "account", "type": "address"}
    ],
    "name": "hasVoted",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const COMMUNITY_ABI = [
  {
    "inputs": [{"name": "mentor", "type": "address"}],
    "name": "getMentorInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "bio", "type": "string"},
      {"name": "specializations", "type": "string[]"},
      {"name": "experience", "type": "uint256"},
      {"name": "rating", "type": "uint256"},
      {"name": "totalMentees", "type": "uint256"},
      {"name": "isActive", "type": "bool"},
      {"name": "hourlyRate", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "workshopId", "type": "uint256"}],
    "name": "getWorkshopInfo",
    "outputs": [
      {"name": "organizer", "type": "address"},
      {"name": "title", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "startTime", "type": "uint256"},
      {"name": "endTime", "type": "uint256"},
      {"name": "maxParticipants", "type": "uint256"},
      {"name": "currentParticipants", "type": "uint256"},
      {"name": "price", "type": "uint256"},
      {"name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveWorkshops",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ABI para UnifiedReputationSystem
export const UNIFIED_REPUTATION_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getReputation",
    "outputs": [
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "uint256", "name": "endorsementCount", "type": "uint256"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint8", "name": "verificationLevel", "type": "uint8"},
      {"internalType": "uint256", "name": "userActivityStreak", "type": "uint256"},
      {"internalType": "uint256", "name": "timeSinceLastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getDetailedReputation",
    "outputs": [
      {"internalType": "uint256", "name": "baseScore", "type": "uint256"},
      {"internalType": "uint256", "name": "timeDecay", "type": "uint256"},
      {"internalType": "uint256", "name": "totalScore", "type": "uint256"},
      {"internalType": "uint256", "name": "lastUpdate", "type": "uint256"},
      {"internalType": "uint256", "name": "lastActivity", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "proofHash", "type": "bytes32"},
      {"internalType": "bytes", "name": "proof", "type": "bytes"},
      {"internalType": "uint8", "name": "verificationLevel", "type": "uint8"}
    ],
    "name": "verifyIdentityWithZK",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "endorseUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "recordActivity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "points", "type": "uint256"},
      {"internalType": "bool", "name": "isPositive", "type": "bool"}
    ],
    "name": "updateReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// ABI para ActivaNFT (ERC721)
export const ACTIVA_NFT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "learner", "type": "address"},
      {"internalType": "string", "name": "courseName", "type": "string"},
      {"internalType": "uint8", "name": "level", "type": "uint8"},
      {"internalType": "uint256", "name": "score", "type": "uint256"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "mintCertification",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCertifications",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getCertificationDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "courseName", "type": "string"},
          {"internalType": "uint256", "name": "completionDate", "type": "uint256"},
          {"internalType": "uint8", "name": "level", "type": "uint8"},
          {"internalType": "uint256", "name": "score", "type": "uint256"},
          {"internalType": "bool", "name": "isSoulbound", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const