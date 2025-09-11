// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// ERC1155 para minting de monedas ACTIVA y colecciones múltiples
contract ActivaMultiToken is ERC1155, Ownable, ReentrancyGuard {
    struct TokenInfo {
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
        uint256 price;
        address creator;
        uint256 season; // 1: Invierno 2025, 2: Primavera 2025, etc.
    }
    
    mapping(uint256 => TokenInfo) public tokenInfo;
    mapping(address => bool) public isMentor;
    mapping(address => uint256[]) public mentorCollections;
    mapping(uint256 => uint256) public tokenPrices;
    
    uint256 public tokenCounter;
    uint256 public constant MENTOR_BONUS = 100; // Bonus de reputación por ser mentor
    
    event TokenCreated(uint256 indexed tokenId, string name, address creator, uint256 season);
    event MentorRegistered(address indexed mentor, uint256[] collections);
    event TokenMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    
    constructor() ERC1155("") Ownable(msg.sender) {}
    
    function createToken(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 price,
        uint256 season,
        string memory uri
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(season >= 1 && season <= 4, "Invalid season");
        
        uint256 tokenId = tokenCounter++;
        
        tokenInfo[tokenId] = TokenInfo({
            name: name,
            symbol: symbol,
            maxSupply: maxSupply,
            currentSupply: 0,
            isActive: true,
            price: price,
            creator: msg.sender,
            season: season
        });
        
        tokenPrices[tokenId] = price;
        _setURI(uri);
        
        emit TokenCreated(tokenId, name, msg.sender, season);
        return tokenId;
    }
    
    function mintToken(uint256 tokenId, uint256 amount) external payable nonReentrant {
        TokenInfo storage info = tokenInfo[tokenId];
        require(info.isActive, "Token not active");
        require(info.currentSupply + amount <= info.maxSupply, "Exceeds max supply");
        require(msg.value >= info.price * amount, "Insufficient payment");
        
        info.currentSupply += amount;
        _mint(msg.sender, tokenId, amount, "");
        
        // Transferir pago al creador
        payable(info.creator).transfer(msg.value);
        
        emit TokenMinted(tokenId, msg.sender, amount);
    }
    
    function registerMentor(address mentor, uint256[] memory collections) external onlyOwner {
        require(!isMentor[mentor], "Already a mentor");
        
        isMentor[mentor] = true;
        mentorCollections[mentor] = collections;
        
        emit MentorRegistered(mentor, collections);
    }
    
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        return tokenInfo[tokenId];
    }
    
    function getMentorCollections(address mentor) external view returns (uint256[] memory) {
        return mentorCollections[mentor];
    }
    
    function getSeasonalTokens(uint256 season) external view returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](tokenCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < tokenCounter; i++) {
            if (tokenInfo[i].season == season) {
                tokens[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokens[i];
        }
        
        return result;
    }
}

// ERC721 para colecciones temáticas específicas
contract ActivaCollection is ERC721URIStorage, Ownable, ReentrancyGuard {
    struct CollectionInfo {
        string name;
        string description;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 price;
        address creator;
        uint256 season;
        bool isActive;
        mapping(address => bool) whitelist;
    }
    
    mapping(uint256 => CollectionInfo) public collections;
    mapping(address => uint256[]) public userCollections;
    mapping(uint256 => string) public collectionMetadata;
    
    uint256 public collectionCounter;
    uint256 public constant SEASONAL_BONUS = 50; // Bonus por colección estacional
    
    event CollectionCreated(uint256 indexed collectionId, string name, address creator);
    event NFTMinted(uint256 indexed tokenId, address indexed to, uint256 collectionId);
    event WhitelistUpdated(uint256 indexed collectionId, address indexed user, bool status);
    
    constructor() ERC721("ActivaCollection", "ACTIVA-COLL") Ownable(msg.sender) {}
    
    function createCollection(
        string memory name,
        string memory description,
        uint256 maxSupply,
        uint256 price,
        uint256 season,
        string memory baseURI
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(maxSupply > 0, "Max supply must be greater than 0");
        
        uint256 collectionId = collectionCounter++;
        
        CollectionInfo storage info = collections[collectionId];
        info.name = name;
        info.description = description;
        info.maxSupply = maxSupply;
        info.currentSupply = 0;
        info.price = price;
        info.creator = msg.sender;
        info.season = season;
        info.isActive = true;
        
        collectionMetadata[collectionId] = baseURI;
        
        emit CollectionCreated(collectionId, name, msg.sender);
        return collectionId;
    }
    
    function mintFromCollection(uint256 collectionId, string memory tokenURI) external payable nonReentrant {
        CollectionInfo storage info = collections[collectionId];
        require(info.isActive, "Collection not active");
        require(info.currentSupply < info.maxSupply, "Collection sold out");
        require(msg.value >= info.price, "Insufficient payment");
        
        uint256 tokenId = collectionId * 10000 + info.currentSupply;
        info.currentSupply++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        userCollections[msg.sender].push(collectionId);
        
        // Transferir pago al creador
        payable(info.creator).transfer(msg.value);
        
        emit NFTMinted(tokenId, msg.sender, collectionId);
    }
    
    function addToWhitelist(uint256 collectionId, address user) external {
        CollectionInfo storage info = collections[collectionId];
        require(msg.sender == info.creator || msg.sender == owner(), "Not authorized");
        
        info.whitelist[user] = true;
        emit WhitelistUpdated(collectionId, user, true);
    }
    
    function removeFromWhitelist(uint256 collectionId, address user) external {
        CollectionInfo storage info = collections[collectionId];
        require(msg.sender == info.creator || msg.sender == owner(), "Not authorized");
        
        info.whitelist[user] = false;
        emit WhitelistUpdated(collectionId, user, false);
    }
    
    function getCollectionInfo(uint256 collectionId) external view returns (
        string memory name,
        string memory description,
        uint256 maxSupply,
        uint256 currentSupply,
        uint256 price,
        address creator,
        uint256 season,
        bool isActive
    ) {
        CollectionInfo storage info = collections[collectionId];
        return (
            info.name,
            info.description,
            info.maxSupply,
            info.currentSupply,
            info.price,
            info.creator,
            info.season,
            info.isActive
        );
    }
    
    function getUserCollections(address user) external view returns (uint256[] memory) {
        return userCollections[user];
    }
    
    function isWhitelisted(uint256 collectionId, address user) external view returns (bool) {
        return collections[collectionId].whitelist[user];
    }
}
