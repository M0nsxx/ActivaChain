// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ExternalAPIIntegration is Ownable, ReentrancyGuard {
    struct APIConfig {
        string name;
        string baseURL;
        string apiKey;
        bool isActive;
        uint256 rateLimit;
        uint256 lastCall;
        uint256 callCount;
    }
    
    struct APICall {
        uint256 id;
        string endpoint;
        string method;
        string requestData;
        string responseData;
        uint256 timestamp;
        bool success;
        address caller;
    }
    
    struct CircleConfig {
        string apiKey;
        string environment; // "sandbox" or "production"
        bool isActive;
    }
    
    struct ShefiConfig {
        string apiKey;
        string baseURL;
        bool isActive;
    }
    
    struct TalentProtocolConfig {
        string apiKey;
        string baseURL;
        bool isActive;
    }
    
    mapping(string => APIConfig) public apiConfigs;
    mapping(uint256 => APICall) public apiCalls;
    mapping(address => uint256[]) public userAPICalls;
    
    CircleConfig public circleConfig;
    ShefiConfig public shefiConfig;
    TalentProtocolConfig public talentProtocolConfig;
    
    uint256 public apiCallCounter;
    uint256 public MAX_API_CALLS_PER_DAY = 1000;
    uint256 public API_CALL_FEE = 0.0001 ether;
    
    event APIConfigUpdated(string indexed apiName, bool isActive);
    event APICallMade(uint256 indexed callId, string endpoint, bool success);
    event CircleConfigUpdated(bool isActive);
    event ShefiConfigUpdated(bool isActive);
    event TalentProtocolConfigUpdated(bool isActive);
    
    constructor() Ownable(msg.sender) {
        initializeAPIConfigs();
    }
    
    function initializeAPIConfigs() internal {
        // Configuración de Circle API para USDC
        circleConfig = CircleConfig({
            apiKey: "",
            environment: "sandbox",
            isActive: false
        });
        
        // Configuración de Shefi API
        shefiConfig = ShefiConfig({
            apiKey: "",
            baseURL: "https://api.shefi.org",
            isActive: false
        });
        
        // Configuración de Talent Protocol API
        talentProtocolConfig = TalentProtocolConfig({
            apiKey: "",
            baseURL: "https://api.talentprotocol.com",
            isActive: false
        });
    }
    
    function updateAPIConfig(
        string memory apiName,
        string memory baseURL,
        string memory apiKey,
        bool isActive,
        uint256 rateLimit
    ) external onlyOwner {
        apiConfigs[apiName] = APIConfig({
            name: apiName,
            baseURL: baseURL,
            apiKey: apiKey,
            isActive: isActive,
            rateLimit: rateLimit,
            lastCall: 0,
            callCount: 0
        });
        
        emit APIConfigUpdated(apiName, isActive);
    }
    
    function updateCircleConfig(
        string memory apiKey,
        string memory environment,
        bool isActive
    ) external onlyOwner {
        circleConfig.apiKey = apiKey;
        circleConfig.environment = environment;
        circleConfig.isActive = isActive;
        
        emit CircleConfigUpdated(isActive);
    }
    
    function updateShefiConfig(
        string memory apiKey,
        bool isActive
    ) external onlyOwner {
        shefiConfig.apiKey = apiKey;
        shefiConfig.isActive = isActive;
        
        emit ShefiConfigUpdated(isActive);
    }
    
    function updateTalentProtocolConfig(
        string memory apiKey,
        bool isActive
    ) external onlyOwner {
        talentProtocolConfig.apiKey = apiKey;
        talentProtocolConfig.isActive = isActive;
        
        emit TalentProtocolConfigUpdated(isActive);
    }
    
    function makeAPICall(
        string memory apiName,
        string memory endpoint,
        string memory method,
        string memory requestData
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= API_CALL_FEE, "Insufficient API call fee");
        require(apiConfigs[apiName].isActive, "API not active");
        require(apiConfigs[apiName].callCount < MAX_API_CALLS_PER_DAY, "Daily API limit reached");
        
        // Verificar rate limit
        require(
            block.timestamp >= apiConfigs[apiName].lastCall + apiConfigs[apiName].rateLimit,
            "Rate limit exceeded"
        );
        
        uint256 callId = apiCallCounter++;
        
        // Simular llamada API (en producción, esto se haría off-chain)
        string memory responseData = simulateAPICall(apiName, endpoint, method, requestData);
        bool success = bytes(responseData).length > 0;
        
        apiCalls[callId] = APICall({
            id: callId,
            endpoint: endpoint,
            method: method,
            requestData: requestData,
            responseData: responseData,
            timestamp: block.timestamp,
            success: success,
            caller: msg.sender
        });
        
        userAPICalls[msg.sender].push(callId);
        
        // Actualizar contadores
        apiConfigs[apiName].lastCall = block.timestamp;
        apiConfigs[apiName].callCount++;
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit APICallMade(callId, endpoint, success);
        return callId;
    }
    
    function simulateAPICall(
        string memory apiName,
        string memory endpoint,
        string memory method,
        string memory requestData
    ) internal pure returns (string memory) {
        // Simulación de respuesta API
        if (keccak256(bytes(apiName)) == keccak256(bytes("circle"))) {
            return '{"status":"success","data":{"transactionId":"0x123..."}}';
        } else if (keccak256(bytes(apiName)) == keccak256(bytes("shefi"))) {
            return '{"status":"success","data":{"cohortId":"123","enrolled":true}}';
        } else if (keccak256(bytes(apiName)) == keccak256(bytes("talent"))) {
            return '{"status":"success","data":{"profileId":"456","verified":true}}';
        }
        
        return '{"status":"error","message":"API not found"}';
    }
    
    function getCircleUSDCBalance(address user) external view returns (uint256) {
        require(circleConfig.isActive, "Circle API not active");
        
        // En producción, esto haría una llamada real a Circle API
        // Por ahora, retornamos un valor simulado
        return 1000 * 10**6; // 1000 USDC (6 decimales)
    }
    
    function transferUSDCViaCircle(
        address to,
        uint256 amount
    ) external payable nonReentrant returns (uint256) {
        require(circleConfig.isActive, "Circle API not active");
        require(msg.value >= API_CALL_FEE, "Insufficient API call fee");
        
        // Simular transferencia USDC via Circle
        uint256 callId = apiCallCounter++;
        
        apiCalls[callId] = APICall({
            id: callId,
            endpoint: "/v1/transfers",
            method: "POST",
            requestData: string(abi.encodePacked('{"to":"', to, '","amount":', amount, '}')),
            responseData: '{"status":"success","transactionId":"0xabc123..."}',
            timestamp: block.timestamp,
            success: true,
            caller: msg.sender
        });
        
        userAPICalls[msg.sender].push(callId);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit APICallMade(callId, "/v1/transfers", true);
        return callId;
    }
    
    function enrollInShefiCohort(
        uint256 cohortId,
        string memory applicationData
    ) external payable nonReentrant returns (uint256) {
        require(shefiConfig.isActive, "Shefi API not active");
        require(msg.value >= API_CALL_FEE, "Insufficient API call fee");
        
        uint256 callId = apiCallCounter++;
        
        apiCalls[callId] = APICall({
            id: callId,
            endpoint: "/v1/cohorts/enroll",
            method: "POST",
            requestData: string(abi.encodePacked('{"cohortId":', cohortId, ',"data":"', applicationData, '"}')),
            responseData: '{"status":"success","enrollmentId":"789","cohortId":"123"}',
            timestamp: block.timestamp,
            success: true,
            caller: msg.sender
        });
        
        userAPICalls[msg.sender].push(callId);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit APICallMade(callId, "/v1/cohorts/enroll", true);
        return callId;
    }
    
    function createTalentProfile(
        string memory profileData
    ) external payable nonReentrant returns (uint256) {
        require(talentProtocolConfig.isActive, "Talent Protocol API not active");
        require(msg.value >= API_CALL_FEE, "Insufficient API call fee");
        
        uint256 callId = apiCallCounter++;
        
        apiCalls[callId] = APICall({
            id: callId,
            endpoint: "/v1/profiles",
            method: "POST",
            requestData: profileData,
            responseData: '{"status":"success","profileId":"456","verified":true}',
            timestamp: block.timestamp,
            success: true,
            caller: msg.sender
        });
        
        userAPICalls[msg.sender].push(callId);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit APICallMade(callId, "/v1/profiles", true);
        return callId;
    }
    
    function getAPICall(uint256 callId) external view returns (
        string memory endpoint,
        string memory method,
        string memory requestData,
        string memory responseData,
        uint256 timestamp,
        bool success,
        address caller
    ) {
        APICall storage call = apiCalls[callId];
        return (
            call.endpoint,
            call.method,
            call.requestData,
            call.responseData,
            call.timestamp,
            call.success,
            call.caller
        );
    }
    
    function getUserAPICalls(address user) external view returns (uint256[] memory) {
        return userAPICalls[user];
    }
    
    function getAPIConfig(string memory apiName) external view returns (
        string memory name,
        string memory baseURL,
        bool isActive,
        uint256 rateLimit,
        uint256 lastCall,
        uint256 callCount
    ) {
        APIConfig storage config = apiConfigs[apiName];
        return (
            config.name,
            config.baseURL,
            config.isActive,
            config.rateLimit,
            config.lastCall,
            config.callCount
        );
    }
    
    function getCircleConfig() external view returns (
        string memory apiKey,
        string memory environment,
        bool isActive
    ) {
        return (
            circleConfig.apiKey,
            circleConfig.environment,
            circleConfig.isActive
        );
    }
    
    function getShefiConfig() external view returns (
        string memory apiKey,
        string memory baseURL,
        bool isActive
    ) {
        return (
            shefiConfig.apiKey,
            shefiConfig.baseURL,
            shefiConfig.isActive
        );
    }
    
    function getTalentProtocolConfig() external view returns (
        string memory apiKey,
        string memory baseURL,
        bool isActive
    ) {
        return (
            talentProtocolConfig.apiKey,
            talentProtocolConfig.baseURL,
            talentProtocolConfig.isActive
        );
    }
    
    function resetDailyAPICount(string memory apiName) external onlyOwner {
        apiConfigs[apiName].callCount = 0;
    }
    
    function updateAPICallFee(uint256 newFee) external onlyOwner {
        API_CALL_FEE = newFee;
    }
    
    function updateMaxAPICallsPerDay(uint256 newLimit) external onlyOwner {
        MAX_API_CALLS_PER_DAY = newLimit;
    }
}
