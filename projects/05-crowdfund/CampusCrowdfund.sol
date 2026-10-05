// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 05 — Simple Crowdfunding / Tip Jar
// Anyone donates ETH; owner withdraws when goal is reached (or anytime — demo).
// =============================================================================
pragma solidity ^0.8.20;

/// @title CampusCrowdfund
contract CampusCrowdfund {
    address public owner;
    string public campaignName;
    uint256 public goalWei;       // fundraising goal in wei
    uint256 public totalRaised;   // total donated
    bool public closed;

    mapping(address => uint256) public donations;

    event Donated(address indexed donor, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event CampaignClosed();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string memory _name, uint256 _goalWei) {
        owner = msg.sender;
        campaignName = _name;
        goalWei = _goalWei;
    }

    /// @notice Send ETH with this call (msg.value).
    function donate() external payable {
        require(!closed, "Closed");
        require(msg.value > 0, "Send ETH");
        donations[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    // Accept plain ETH transfers as donations too
    receive() external payable {
        require(!closed, "Closed");
        require(msg.value > 0, "Send ETH");
        donations[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Empty");
        closed = true;
        emit CampaignClosed();
        emit Withdrawn(owner, bal);
        (bool ok, ) = payable(owner).call{value: bal}("");
        require(ok, "Transfer failed");
    }

    function getInfo()
        external
        view
        returns (string memory name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)
    {
        return (campaignName, goalWei, totalRaised, address(this).balance, closed);
    }
}
