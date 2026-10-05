// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 04 — Complaint / Lost & Found Tracker
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEA: enum = named states that are numbers under the hood (0,1,2,3).
// =============================================================================
pragma solidity ^0.8.20;

/// @title ComplaintTracker
/// @notice Students open tickets; admin updates status.
contract ComplaintTracker {
    address public owner;

    // enum = finite list of named options (stored as uint8: 0,1,2,3)
    enum Status {
        Open,       // 0
        InProgress, // 1
        Resolved,   // 2
        Closed      // 3
    }

    struct Ticket {
        address reporter;     // who filed (msg.sender at create)
        string category;      // "Lost", "Facility", …
        string description;
        Status status;
        uint256 createdAt;
        bool exists;
    }

    mapping(uint256 => Ticket) public tickets;
    uint256 public ticketCount;

    event TicketCreated(uint256 indexed id, address indexed reporter, string category);
    event StatusUpdated(uint256 indexed id, Status status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Anyone can file a ticket.
    function createTicket(string calldata category, string calldata description) external returns (uint256) {
        uint256 id = ticketCount;
        tickets[id] = Ticket({
            reporter: msg.sender, // wallet that called this function
            category: category,
            description: description,
            status: Status.Open,  // start at enum value 0
            createdAt: block.timestamp,
            exists: true
        });
        ticketCount += 1;
        emit TicketCreated(id, msg.sender, category);
        return id;
    }

    /// @notice Only admin advances workflow (Open → InProgress → …).
    // Status newStatus is passed as 0..3 from the frontend
    function updateStatus(uint256 id, Status newStatus) external onlyOwner {
        require(tickets[id].exists, "Missing ticket");
        tickets[id].status = newStatus;
        emit StatusUpdated(id, newStatus);
    }

    function getTicket(uint256 id)
        external
        view
        returns (
            address reporter,
            string memory category,
            string memory description,
            Status status,
            uint256 createdAt,
            bool exists
        )
    {
        Ticket storage t = tickets[id];
        return (t.reporter, t.category, t.description, t.status, t.createdAt, t.exists);
    }
}
