// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract IPFSIntegration is Ownable, ReentrancyGuard {
    struct IPFSFile {
        string hash;
        string name;
        string fileType;
        uint256 size;
        address uploader;
        uint256 uploadTime;
        bool isPublic;
        mapping(address => bool) accessGranted;
    }
    
    struct IPFSCollection {
        string name;
        string description;
        string[] fileHashes;
        address owner;
        bool isPublic;
        uint256 createdTime;
    }
    
    mapping(string => IPFSFile) public ipfsFiles;
    mapping(uint256 => IPFSCollection) public ipfsCollections;
    mapping(address => string[]) public userFiles;
    mapping(address => uint256[]) public userCollections;
    mapping(string => bool) public hashExists;
    
    uint256 public collectionCounter;
    uint256 public MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    uint256 public UPLOAD_FEE = 0.001 ether;
    
    event FileUploaded(string indexed hash, address indexed uploader, string name);
    event CollectionCreated(uint256 indexed collectionId, address indexed owner, string name);
    event AccessGranted(string indexed hash, address indexed user);
    event AccessRevoked(string indexed hash, address indexed user);
    
    constructor() Ownable(msg.sender) {}
    
    function uploadFile(
        string memory hash,
        string memory name,
        string memory fileType,
        uint256 size,
        bool isPublic
    ) external payable nonReentrant {
        require(!hashExists[hash], "File already exists");
        require(bytes(hash).length > 0, "Hash cannot be empty");
        require(size <= MAX_FILE_SIZE, "File too large");
        require(msg.value >= UPLOAD_FEE, "Insufficient upload fee");
        
        IPFSFile storage file = ipfsFiles[hash];
        file.hash = hash;
        file.name = name;
        file.fileType = fileType;
        file.size = size;
        file.uploader = msg.sender;
        file.uploadTime = block.timestamp;
        file.isPublic = isPublic;
        
        hashExists[hash] = true;
        userFiles[msg.sender].push(hash);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit FileUploaded(hash, msg.sender, name);
    }
    
    function createCollection(
        string memory name,
        string memory description,
        string[] memory fileHashes,
        bool isPublic
    ) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(fileHashes.length > 0, "Collection must have files");
        
        // Verificar que el usuario es propietario de todos los archivos
        for (uint256 i = 0; i < fileHashes.length; i++) {
            require(ipfsFiles[fileHashes[i]].uploader == msg.sender, "Not owner of all files");
        }
        
        uint256 collectionId = collectionCounter++;
        
        IPFSCollection storage collection = ipfsCollections[collectionId];
        collection.name = name;
        collection.description = description;
        collection.fileHashes = fileHashes;
        collection.owner = msg.sender;
        collection.isPublic = isPublic;
        collection.createdTime = block.timestamp;
        
        userCollections[msg.sender].push(collectionId);
        
        emit CollectionCreated(collectionId, msg.sender, name);
    }
    
    function grantAccess(string memory hash, address user) external {
        require(ipfsFiles[hash].uploader == msg.sender, "Not file owner");
        require(!ipfsFiles[hash].isPublic, "File is already public");
        
        ipfsFiles[hash].accessGranted[user] = true;
        
        emit AccessGranted(hash, user);
    }
    
    function revokeAccess(string memory hash, address user) external {
        require(ipfsFiles[hash].uploader == msg.sender, "Not file owner");
        
        ipfsFiles[hash].accessGranted[user] = false;
        
        emit AccessRevoked(hash, user);
    }
    
    function makeFilePublic(string memory hash) external {
        require(ipfsFiles[hash].uploader == msg.sender, "Not file owner");
        
        ipfsFiles[hash].isPublic = true;
    }
    
    function makeFilePrivate(string memory hash) external {
        require(ipfsFiles[hash].uploader == msg.sender, "Not file owner");
        
        ipfsFiles[hash].isPublic = false;
    }
    
    function hasAccess(string memory hash, address user) external view returns (bool) {
        IPFSFile storage file = ipfsFiles[hash];
        return file.isPublic || file.accessGranted[user] || file.uploader == user;
    }
    
    function getFileInfo(string memory hash) external view returns (
        string memory name,
        string memory fileType,
        uint256 size,
        address uploader,
        uint256 uploadTime,
        bool isPublic
    ) {
        IPFSFile storage file = ipfsFiles[hash];
        return (
            file.name,
            file.fileType,
            file.size,
            file.uploader,
            file.uploadTime,
            file.isPublic
        );
    }
    
    function getCollectionInfo(uint256 collectionId) external view returns (
        string memory name,
        string memory description,
        string[] memory fileHashes,
        address owner,
        bool isPublic,
        uint256 createdTime
    ) {
        IPFSCollection storage collection = ipfsCollections[collectionId];
        return (
            collection.name,
            collection.description,
            collection.fileHashes,
            collection.owner,
            collection.isPublic,
            collection.createdTime
        );
    }
    
    function getUserFiles(address user) external view returns (string[] memory) {
        return userFiles[user];
    }
    
    function getUserCollections(address user) external view returns (uint256[] memory) {
        return userCollections[user];
    }
    
    function getPublicFiles() external view returns (string[] memory) {
        // Esta función requeriría un array adicional para almacenar archivos públicos
        // Por simplicidad, retornamos un array vacío
        return new string[](0);
    }
    
    function getPublicCollections() external view returns (uint256[] memory) {
        uint256[] memory publicCollections = new uint256[](collectionCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < collectionCounter; i++) {
            if (ipfsCollections[i].isPublic) {
                publicCollections[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = publicCollections[i];
        }
        
        return result;
    }
    
    function updateUploadFee(uint256 newFee) external onlyOwner {
        UPLOAD_FEE = newFee;
    }
    
    function updateMaxFileSize(uint256 newSize) external onlyOwner {
        MAX_FILE_SIZE = newSize;
    }
}
