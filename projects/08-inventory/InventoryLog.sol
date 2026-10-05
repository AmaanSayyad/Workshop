// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 08 — Supply / Inventory / Custody Log
// Add items and transfer custody between wallets (lab equipment, kits, etc.).
// =============================================================================
pragma solidity ^0.8.20;

/// @title InventoryLog
contract InventoryLog {
    address public owner;

    struct Item {
        string name;
        string location;
        address custodian;  // who currently holds it
        bool exists;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemAdded(uint256 indexed id, string name, address custodian);
    event CustodyTransferred(uint256 indexed id, address indexed from, address indexed to);
    event LocationUpdated(uint256 indexed id, string location);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addItem(string calldata name, string calldata location, address custodian)
        external
        onlyOwner
        returns (uint256)
    {
        require(custodian != address(0), "Bad custodian");
        uint256 id = itemCount;
        items[id] = Item({name: name, location: location, custodian: custodian, exists: true});
        itemCount += 1;
        emit ItemAdded(id, name, custodian);
        return id;
    }

    /// @notice Current custodian (or owner) transfers item to someone else.
    function transferCustody(uint256 id, address to) external {
        require(items[id].exists, "Missing item");
        require(to != address(0), "Bad address");
        require(msg.sender == items[id].custodian || msg.sender == owner, "Not allowed");

        address from = items[id].custodian;
        items[id].custodian = to;
        emit CustodyTransferred(id, from, to);
    }

    function updateLocation(uint256 id, string calldata location) external {
        require(items[id].exists, "Missing item");
        require(msg.sender == items[id].custodian || msg.sender == owner, "Not allowed");
        items[id].location = location;
        emit LocationUpdated(id, location);
    }

    function getItem(uint256 id)
        external
        view
        returns (string memory name, string memory location, address custodian, bool exists)
    {
        Item storage i = items[id];
        return (i.name, i.location, i.custodian, i.exists);
    }
}
