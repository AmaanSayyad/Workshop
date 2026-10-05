// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 05 — Crowdfunding / Tip Jar
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEAS: payable, msg.value, wei, receive(), constructor args.
// =============================================================================
pragma solidity ^0.8.20;

/// @title CampusCrowdfund
/// @notice Collect Sepolia ETH donations; owner withdraws.
contract CampusCrowdfund {
    address public owner;
    string public campaignName;
    // wei = smallest ETH unit. 1 ETH = 10^18 wei. Solidity has no decimals.
    uint256 public goalWei;
    uint256 public totalRaised;
    bool public closed;

    // how much each address donated
    mapping(address => uint256) public donations;

    event Donated(address indexed donor, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event CampaignClosed();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // -------------------------------------------------------------------------
    // constructor with ARGUMENTS
    // WHY: campaign name + goal are fixed at deploy time (Remix constructor UI).
    // string memory = temporary string in memory during construction.
    // Example Remix args: "Campus Innovation Fund", 1000000000000000
    // -------------------------------------------------------------------------
    constructor(string memory _name, uint256 _goalWei) {
        owner = msg.sender;
        campaignName = _name;
        goalWei = _goalWei;
    }

    /// @notice Donate by attaching ETH to this call.
    // payable = this function is allowed to receive ETH
    // msg.value = amount of ETH (in wei) sent with the transaction
    function donate() external payable {
        require(!closed, "Closed");
        require(msg.value > 0, "Send ETH");
        donations[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    // receive() runs when someone sends plain ETH with empty calldata
    receive() external payable {
        require(!closed, "Closed");
        require(msg.value > 0, "Send ETH");
        donations[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    /// @notice Owner pulls all ETH out and closes the campaign.
    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance; // ETH held by THIS contract
        require(bal > 0, "Empty");
        closed = true; // effects before interaction (safer pattern)
        emit CampaignClosed();
        emit Withdrawn(owner, bal);
        // low-level call sends ETH; (bool ok,) captures success flag
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
