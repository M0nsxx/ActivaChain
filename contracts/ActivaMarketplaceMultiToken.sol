// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UnifiedReputationSystem.sol";

contract ActivaMarketplaceMultiToken is ReentrancyGuard, Ownable {
    
    enum PaymentToken {
        ETH,    // 0 - ETH nativo
        ARB     // 1 - ARB token
    }
    
    struct Service {
        uint256 id;
        address provider;
        string title;
        string description;
        uint256 price;
        PaymentToken paymentToken; // Token de pago
        uint8 category; // 1: Dev, 2: Design, 3: Marketing, 4: Consulting
        bool isActive;
        uint256 minReputation;
    }
    
    struct Order {
        uint256 serviceId;
        address buyer;
        address provider;
        uint256 amount;
        PaymentToken paymentToken;
        uint8 status; // 0: Pending, 1: InProgress, 2: Completed, 3: Disputed
        uint256 timestamp;
    }
    
    // Referencia al sistema de reputación unificado
    UnifiedReputationSystem public reputationSystem;
    
    // Tokens ERC20 soportados
    mapping(PaymentToken => IERC20) public supportedTokens;
    
    mapping(uint256 => Service) public services;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public providerServices;
    mapping(address => uint256) public providerEarnings;
    
    uint256 public serviceCounter;
    uint256 public orderCounter;
    uint256 public platformFee = 10; // 1% en basis points
    
    event ServiceCreated(uint256 indexed serviceId, address indexed provider, uint256 price, PaymentToken paymentToken);
    event OrderCreated(uint256 indexed orderId, address indexed buyer, uint256 serviceId, uint256 amount, PaymentToken paymentToken);
    event OrderCompleted(uint256 indexed orderId, uint256 amount);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    event TokenSupported(PaymentToken token, address tokenAddress);
    
    constructor(address _arb, address _reputationSystem) Ownable(msg.sender) {
        // Configurar tokens soportados
        supportedTokens[PaymentToken.ARB] = IERC20(_arb);
        // ETH nativo no necesita configuración
        
        // Configurar sistema de reputación unificado
        reputationSystem = UnifiedReputationSystem(_reputationSystem);
        
        emit TokenSupported(PaymentToken.ARB, _arb);
    }
    
    // Función para dar reputación (solo owner) - Ahora usa sistema unificado
    function giveReputation(address user, uint256 reputation) external onlyOwner {
        reputationSystem.updateReputation(user, reputation, true);
        emit ReputationUpdated(user, reputation);
    }
    
    // Función para crear servicio
    function createService(
        string memory _title,
        string memory _description,
        uint256 _price,
        PaymentToken _paymentToken,
        uint8 _category,
        uint256 _minReputation
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_category >= 1 && _category <= 4, "Invalid category");
        require(_paymentToken <= PaymentToken.ARB, "Invalid payment token");
        
        serviceCounter++;
        services[serviceCounter] = Service({
            id: serviceCounter,
            provider: msg.sender,
            title: _title,
            description: _description,
            price: _price,
            paymentToken: _paymentToken,
            category: _category,
            isActive: true,
            minReputation: _minReputation
        });
        
        providerServices[msg.sender].push(serviceCounter);
        emit ServiceCreated(serviceCounter, msg.sender, _price, _paymentToken);
    }
    
    // Función para comprar servicio con ETH
    function purchaseServiceWithETH(uint256 _serviceId) external payable nonReentrant {
        Service storage service = services[_serviceId];
        require(service.isActive, "Service is not active");
        require(service.paymentToken == PaymentToken.ETH, "Service requires different payment token");
        require(msg.value == service.price, "Incorrect payment amount");
        (uint256 userScore,,,,,) = reputationSystem.getReputation(msg.sender);
        require(userScore >= service.minReputation, "Insufficient reputation");
        
        orderCounter++;
        orders[orderCounter] = Order({
            serviceId: _serviceId,
            buyer: msg.sender,
            provider: service.provider,
            amount: msg.value,
            paymentToken: PaymentToken.ETH,
            status: 0, // Pending
            timestamp: block.timestamp
        });
        
        emit OrderCreated(orderCounter, msg.sender, _serviceId, msg.value, PaymentToken.ETH);
    }
    
    // Función para comprar servicio con ERC20
    function purchaseServiceWithERC20(uint256 _serviceId) external nonReentrant {
        Service storage service = services[_serviceId];
        require(service.isActive, "Service is not active");
        require(service.paymentToken != PaymentToken.ETH, "Service requires ETH payment");
        (uint256 userScore,,,,,) = reputationSystem.getReputation(msg.sender);
        require(userScore >= service.minReputation, "Insufficient reputation");
        
        IERC20 token = supportedTokens[service.paymentToken];
        require(address(token) != address(0), "Token not supported");
        
        // Transferir tokens del comprador al contrato
        require(token.transferFrom(msg.sender, address(this), service.price), "Token transfer failed");
        
        orderCounter++;
        orders[orderCounter] = Order({
            serviceId: _serviceId,
            buyer: msg.sender,
            provider: service.provider,
            amount: service.price,
            paymentToken: service.paymentToken,
            status: 0, // Pending
            timestamp: block.timestamp
        });
        
        emit OrderCreated(orderCounter, msg.sender, _serviceId, service.price, service.paymentToken);
    }
    
    // Función para completar orden
    function completeOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        require(order.provider == msg.sender, "Only provider can complete");
        require(order.status == 0, "Order not pending");
        
        order.status = 2; // Completed
        
        // Calcular comisión de plataforma
        uint256 platformCommission = (order.amount * platformFee) / 1000;
        uint256 providerAmount = order.amount - platformCommission;
        
        if (order.paymentToken == PaymentToken.ETH) {
            // Transferir ETH al provider
            payable(order.provider).transfer(providerAmount);
            // Transferir comisión al owner
            payable(owner()).transfer(platformCommission);
        } else {
            // Transferir tokens ERC20
            IERC20 token = supportedTokens[order.paymentToken];
            require(token.transfer(order.provider, providerAmount), "Provider transfer failed");
            require(token.transfer(owner(), platformCommission), "Platform transfer failed");
        }
        
        providerEarnings[order.provider] += providerAmount;
        
        // Aumentar reputación del provider usando sistema unificado
        reputationSystem.updateReputation(order.provider, 10, true);
        
        emit OrderCompleted(_orderId, order.amount);
        emit ReputationUpdated(order.provider, 10);
    }
    
    // Función para obtener servicios de un provider
    function getProviderServices(address provider) external view returns (uint256[] memory) {
        return providerServices[provider];
    }
    
    // Función para obtener detalles de servicio
    function getService(uint256 _serviceId) external view returns (Service memory) {
        return services[_serviceId];
    }
    
    // Función para obtener detalles de orden
    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }
    
    // Función para obtener balance del contrato en ETH
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Función para obtener balance del contrato en tokens ERC20
    function getTokenBalance(PaymentToken token) external view returns (uint256) {
        if (token == PaymentToken.ETH) {
            return address(this).balance;
        }
        IERC20 tokenContract = supportedTokens[token];
        return tokenContract.balanceOf(address(this));
    }
    
    // Función para retirar fondos ETH (solo owner)
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Función para retirar tokens ERC20 (solo owner)
    function withdrawToken(PaymentToken token) external onlyOwner {
        IERC20 tokenContract = supportedTokens[token];
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(tokenContract.transfer(owner(), balance), "Token withdrawal failed");
    }
    
    // Función para recibir ETH
    receive() external payable {}
}
