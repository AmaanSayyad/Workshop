// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 07 — Scholarship Transparency Ledger
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEA: recording amounts ≠ sending ETH. This is a public log only.
// =============================================================================
pragma solidity ^0.8.20;

/// @title ScholarshipLedger
/// @notice Admin publishes grant rows; anyone can read.
contract ScholarshipLedger {
    address public owner;

    struct Grant {
        string studentName;
        string purpose;     // "Tuition", "Hostel", …
        uint256 amountWei;  // recorded amount (symbolic on testnet is fine)
        uint256 recordedAt;
        bool exists;
    }

    mapping(uint256 => Grant) public grants;
    uint256 public grantCount;
    uint256 public totalRecorded; // running sum of amountWei

    event GrantRecorded(uint256 indexed id, string studentName, uint256 amountWei);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Append one public grant entry.
    function recordGrant(
        string calldata studentName,
        string calldata purpose,
        uint256 amountWei
    ) external onlyOwner returns (uint256) {
        require(amountWei > 0, "Amount > 0");
        uint256 id = grantCount;
        grants[id] = Grant({
            studentName: studentName,
            purpose: purpose,
            amountWei: amountWei,
            recordedAt: block.timestamp,
            exists: true
        });
        grantCount += 1;
        totalRecorded += amountWei;
        emit GrantRecorded(id, studentName, amountWei);
        return id;
    }

    function getGrant(uint256 id)
        external
        view
        returns (
            string memory studentName,
            string memory purpose,
            uint256 amountWei,
            uint256 recordedAt,
            bool exists
        )
    {
        Grant storage g = grants[id];
        return (g.studentName, g.purpose, g.amountWei, g.recordedAt, g.exists);
    }
}
