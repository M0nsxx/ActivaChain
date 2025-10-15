// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UnifiedReputationSystem.sol";

contract ActivaNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct Certification {
        string courseName;
        uint256 completionDate;
        uint8 level; // 1: Básico, 2: Intermedio, 3: Avanzado
        uint256 score;
        bool isSoulbound;
    }
    
    mapping(uint256 => Certification) public certifications;
    mapping(address => uint256[]) public userCertifications;
    
    // Referencia al sistema de reputación unificado
    UnifiedReputationSystem public reputationSystem;
    
    event CertificationMinted(address indexed user, uint256 tokenId, string courseName);
    event ReputationUpdated(address indexed user, uint256 newScore);
    
    constructor(address _reputationSystem) ERC721("ActivaChain Certification", "ACTIVA-NFT") Ownable(msg.sender) {
        reputationSystem = UnifiedReputationSystem(_reputationSystem);
    }
    
    function mintCertification(
        address learner,
        string memory courseName,
        uint8 level,
        uint256 score,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(learner, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        certifications[newTokenId] = Certification({
            courseName: courseName,
            completionDate: block.timestamp,
            level: level,
            score: score,
            isSoulbound: true
        });
        
        userCertifications[learner].push(newTokenId);
        
        // Actualizar reputación usando sistema unificado
        uint256 reputationBonus = score * level;
        reputationSystem.updateReputation(learner, reputationBonus, true);
        
        emit CertificationMinted(learner, newTokenId, courseName);
        emit ReputationUpdated(learner, reputationBonus);
        
        return newTokenId;
    }
    
    // Override transfer functions to make it soulbound
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), 
            "ActivaNFT: Soulbound tokens cannot be transferred");
        return super._update(to, tokenId, auth);
    }
    
    function getUserCertifications(address user) external view returns (uint256[] memory) {
        return userCertifications[user];
    }
    
    function getCertificationDetails(uint256 tokenId) external view returns (Certification memory) {
        return certifications[tokenId];
    }
}
