// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ActivaToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingTimestamp;
    
    uint256 public constant REWARD_RATE = 100; // 10% APY
    uint256 public constant MIN_STAKING_PERIOD = 7 days;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    
    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake() external {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "No staked balance");
        require(
            block.timestamp >= stakingTimestamp[msg.sender] + MIN_STAKING_PERIOD,
            "Minimum staking period not met"
        );
        
        uint256 stakingDuration = block.timestamp - stakingTimestamp[msg.sender];
        uint256 reward = (balance * REWARD_RATE * stakingDuration) / (365 days * 1000);
        
        stakingBalance[msg.sender] = 0;
        stakingTimestamp[msg.sender] = 0;
        
        _transfer(address(this), msg.sender, balance);
        _mint(msg.sender, reward);
        
        emit Unstaked(msg.sender, balance, reward);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function getStakingInfo(address user) external view returns (uint256 balance, uint256 timestamp) {
        return (stakingBalance[user], stakingTimestamp[user]);
    }
}
