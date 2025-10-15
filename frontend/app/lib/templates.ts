// Plantillas para ActivaChain
export interface ServiceTemplate {
  id: string
  title: string
  description: string
  category: number
  priceRange: {
    min: number
    max: number
  }
  minReputation: number
  tags: string[]
  icon: string
  color: string
}

export interface ProposalTemplate {
  id: string
  title: string
  description: string
  type: number
  icon: string
  color: string
}

export interface NFTTemplate {
  id: string
  name: string
  description: string
  category: string
  level: number
  score: number
  metadata: {
    image: string
    attributes: Array<{
      trait_type: string
      value: string
      rarity: number
    }>
  }
  icon: string
  color: string
  tags: string[]
}

// Plantillas de Servicios
export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: 'smart-contract-dev',
    title: 'Desarrollo de Smart Contracts',
    description: 'Creación de contratos inteligentes personalizados para tu proyecto DeFi',
    category: 0,
    priceRange: { min: 500, max: 2000 },
    minReputation: 100,
    tags: ['Solidity', 'DeFi', 'Smart Contracts'],
    icon: '💻',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ui-ux-design',
    title: 'Diseño UI/UX Web3',
    description: 'Diseño moderno y funcional para aplicaciones descentralizadas',
    category: 1,
    priceRange: { min: 300, max: 1200 },
    minReputation: 50,
    tags: ['UI/UX', 'Web3', 'Design'],
    icon: '🎨',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'marketing-strategy',
    title: 'Estrategia de Marketing DeFi',
    description: 'Plan de marketing completo para proyectos DeFi y Web3',
    category: 2,
    priceRange: { min: 800, max: 3000 },
    minReputation: 200,
    tags: ['Marketing', 'DeFi', 'Strategy'],
    icon: '📈',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'blockchain-consulting',
    title: 'Consultoría Blockchain',
    description: 'Asesoramiento estratégico para implementar blockchain en tu empresa',
    category: 3,
    priceRange: { min: 1000, max: 5000 },
    minReputation: 300,
    tags: ['Consulting', 'Blockchain', 'Strategy'],
    icon: '💼',
    color: 'from-purple-500 to-violet-500'
  }
]

// Plantillas de Propuestas
export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: 'treasury-proposal',
    title: 'Propuesta de Treasury',
    description: 'Gestión y distribución de fondos del treasury de la DAO',
    type: 1,
    icon: '💰',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'protocol-upgrade',
    title: 'Actualización de Protocolo',
    description: 'Mejoras técnicas y actualizaciones del protocolo',
    type: 2,
    icon: '⚙️',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'community-initiative',
    title: 'Iniciativa Comunitaria',
    description: 'Proyectos y actividades para fortalecer la comunidad',
    type: 3,
    icon: '👥',
    color: 'from-purple-500 to-pink-500'
  }
]

// Plantillas de NFTs
export const NFT_TEMPLATES: NFTTemplate[] = [
  {
    id: 'web3-developer-cert',
    name: 'Certificación Desarrollador Web3',
    description: 'Certificación oficial de desarrollador Web3 con especialización en Solidity y DeFi',
    category: 'Certificación',
    level: 3,
    score: 100,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmWeb3DevCert',
      attributes: [
        { trait_type: 'Nivel', value: 'Avanzado', rarity: 15 },
        { trait_type: 'Especialización', value: 'Solidity', rarity: 25 },
        { trait_type: 'DeFi', value: 'Expert', rarity: 10 },
        { trait_type: 'Años Experiencia', value: '3+', rarity: 20 }
      ]
    },
    icon: '🏆',
    color: 'from-yellow-500 to-orange-500',
    tags: ['Desarrollo', 'Web3', 'Certificación', 'Solidity']
  },
  {
    id: 'defi-expert-badge',
    name: 'Badge Experto DeFi',
    description: 'Reconocimiento por expertise en protocolos DeFi y yield farming',
    category: 'Badge',
    level: 2,
    score: 75,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmDeFiExpert',
      attributes: [
        { trait_type: 'Protocolo', value: 'Uniswap', rarity: 30 },
        { trait_type: 'Yield Farming', value: 'Master', rarity: 20 },
        { trait_type: 'Liquidity', value: 'Provider', rarity: 25 },
        { trait_type: 'APY', value: '15%+', rarity: 15 }
      ]
    },
    icon: '🌾',
    color: 'from-green-500 to-emerald-500',
    tags: ['DeFi', 'Yield Farming', 'Liquidity', 'Expert']
  },
  {
    id: 'nft-artist-creator',
    name: 'NFT Artista Digital',
    description: 'Certificación de artista digital especializado en NFTs y arte generativo',
    category: 'Arte',
    level: 2,
    score: 80,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmNFTArtist',
      attributes: [
        { trait_type: 'Estilo', value: 'Generativo', rarity: 20 },
        { trait_type: 'Técnica', value: 'AI Art', rarity: 25 },
        { trait_type: 'Colección', value: '1/1', rarity: 10 },
        { trait_type: 'Rareza', value: 'Legendary', rarity: 5 }
      ]
    },
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    tags: ['Arte', 'NFT', 'Generativo', 'Digital']
  },
  {
    id: 'dao-governance-member',
    name: 'Miembro Gobernanza DAO',
    description: 'Reconocimiento por participación activa en gobernanza descentralizada',
    category: 'Gobernanza',
    level: 3,
    score: 90,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmDAOMember',
      attributes: [
        { trait_type: 'Votos', value: '50+', rarity: 20 },
        { trait_type: 'Propuestas', value: '5+', rarity: 15 },
        { trait_type: 'Influencia', value: 'Alta', rarity: 10 },
        { trait_type: 'Participación', value: 'Activa', rarity: 25 }
      ]
    },
    icon: '🏛️',
    color: 'from-purple-500 to-violet-500',
    tags: ['DAO', 'Gobernanza', 'Voting', 'Participación']
  },
  {
    id: 'blockchain-security-auditor',
    name: 'Auditor de Seguridad Blockchain',
    description: 'Certificación de auditor de seguridad especializado en smart contracts',
    category: 'Seguridad',
    level: 3,
    score: 95,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmSecurityAuditor',
      attributes: [
        { trait_type: 'Auditorías', value: '100+', rarity: 15 },
        { trait_type: 'Vulnerabilidades', value: 'Encontradas', rarity: 20 },
        { trait_type: 'Protocolos', value: 'Auditados', rarity: 25 },
        { trait_type: 'Reputación', value: 'Excelente', rarity: 10 }
      ]
    },
    icon: '🔒',
    color: 'from-red-500 to-pink-500',
    tags: ['Seguridad', 'Auditoría', 'Smart Contracts', 'Blockchain']
  },
  {
    id: 'web3-educator-mentor',
    name: 'Educador Web3',
    description: 'Reconocimiento por contribución a la educación Web3 y mentoring',
    category: 'Educación',
    level: 2,
    score: 85,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmWeb3Educator',
      attributes: [
        { trait_type: 'Estudiantes', value: '500+', rarity: 20 },
        { trait_type: 'Cursos', value: '10+', rarity: 25 },
        { trait_type: 'Mentoring', value: 'Activo', rarity: 15 },
        { trait_type: 'Impacto', value: 'Alto', rarity: 10 }
      ]
    },
    icon: '👨‍🏫',
    color: 'from-cyan-500 to-blue-500',
    tags: ['Educación', 'Mentoring', 'Web3', 'Comunidad']
  },
  {
    id: 'defi-yield-farmer',
    name: 'Yield Farmer DeFi',
    description: 'Certificación de yield farmer experto en protocolos DeFi',
    category: 'DeFi',
    level: 2,
    score: 70,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmYieldFarmer',
      attributes: [
        { trait_type: 'Protocolos', value: '20+', rarity: 25 },
        { trait_type: 'APY Promedio', value: '25%+', rarity: 15 },
        { trait_type: 'TVL', value: '$100K+', rarity: 20 },
        { trait_type: 'Estrategia', value: 'Avanzada', rarity: 10 }
      ]
    },
    icon: '🚜',
    color: 'from-green-500 to-teal-500',
    tags: ['DeFi', 'Yield Farming', 'APY', 'Estrategia']
  },
  {
    id: 'nft-collector-curator',
    name: 'Coleccionista NFT',
    description: 'Reconocimiento por colección y curaduría de NFTs de valor',
    category: 'Colección',
    level: 2,
    score: 65,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmNFTCollector',
      attributes: [
        { trait_type: 'Colección', value: '100+ NFTs', rarity: 20 },
        { trait_type: 'Valor', value: 'Alto', rarity: 15 },
        { trait_type: 'Curaduría', value: 'Expert', rarity: 25 },
        { trait_type: 'Rareza', value: 'Legendary', rarity: 10 }
      ]
    },
    icon: '🖼️',
    color: 'from-indigo-500 to-purple-500',
    tags: ['NFT', 'Colección', 'Curaduría', 'Arte']
  },
  {
    id: 'blockchain-researcher',
    name: 'Investigador Blockchain',
    description: 'Certificación de investigador especializado en tecnología blockchain',
    category: 'Investigación',
    level: 3,
    score: 88,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmBlockchainResearcher',
      attributes: [
        { trait_type: 'Publicaciones', value: '20+', rarity: 20 },
        { trait_type: 'Investigación', value: 'Avanzada', rarity: 15 },
        { trait_type: 'Innovación', value: 'Alta', rarity: 10 },
        { trait_type: 'Impacto', value: 'Académico', rarity: 25 }
      ]
    },
    icon: '🔬',
    color: 'from-blue-500 to-indigo-500',
    tags: ['Investigación', 'Blockchain', 'Academia', 'Innovación']
  },
  {
    id: 'web3-community-leader',
    name: 'Líder Comunidad Web3',
    description: 'Reconocimiento por liderazgo y contribución a comunidades Web3',
    category: 'Liderazgo',
    level: 3,
    score: 92,
    metadata: {
      image: 'https://ipfs.io/ipfs/QmCommunityLeader',
      attributes: [
        { trait_type: 'Comunidad', value: '1000+', rarity: 20 },
        { trait_type: 'Eventos', value: '50+', rarity: 25 },
        { trait_type: 'Influencia', value: 'Alta', rarity: 15 },
        { trait_type: 'Impacto', value: 'Positivo', rarity: 10 }
      ]
    },
    icon: '👑',
    color: 'from-yellow-500 to-orange-500',
    tags: ['Liderazgo', 'Comunidad', 'Web3', 'Impacto']
  }
]

// Categorías de NFTs
export const NFT_CATEGORIES = {
  'Certificación': { icon: '🏆', color: 'from-yellow-500 to-orange-500' },
  'Badge': { icon: '🎖️', color: 'from-green-500 to-emerald-500' },
  'Arte': { icon: '🎨', color: 'from-pink-500 to-rose-500' },
  'Gobernanza': { icon: '🏛️', color: 'from-purple-500 to-violet-500' },
  'Seguridad': { icon: '🔒', color: 'from-red-500 to-pink-500' },
  'Educación': { icon: '👨‍🏫', color: 'from-cyan-500 to-blue-500' },
  'DeFi': { icon: '🌾', color: 'from-green-500 to-teal-500' },
  'Colección': { icon: '🖼️', color: 'from-indigo-500 to-purple-500' },
  'Investigación': { icon: '🔬', color: 'from-blue-500 to-indigo-500' },
  'Liderazgo': { icon: '👑', color: 'from-yellow-500 to-orange-500' }
}

// Niveles de NFTs
export const NFT_LEVELS = {
  1: { name: 'Básico', color: 'from-gray-500 to-gray-600', rarity: 50 },
  2: { name: 'Intermedio', color: 'from-blue-500 to-blue-600', rarity: 30 },
  3: { name: 'Avanzado', color: 'from-purple-500 to-purple-600', rarity: 15 },
  4: { name: 'Expert', color: 'from-yellow-500 to-orange-500', rarity: 5 }
}

// Función para obtener plantilla por ID
export function getServiceTemplate(id: string): ServiceTemplate | undefined {
  return SERVICE_TEMPLATES.find(template => template.id === id)
}

export function getProposalTemplate(id: string): ProposalTemplate | undefined {
  return PROPOSAL_TEMPLATES.find(template => template.id === id)
}

export function getNFTTemplate(id: string): NFTTemplate | undefined {
  return NFT_TEMPLATES.find(template => template.id === id)
}

// Función para filtrar plantillas por categoría
export function getNFTTemplatesByCategory(category: string): NFTTemplate[] {
  return NFT_TEMPLATES.filter(template => template.category === category)
}

// Función para obtener plantillas por nivel
export function getNFTTemplatesByLevel(level: number): NFTTemplate[] {
  return NFT_TEMPLATES.filter(template => template.level === level)
}
