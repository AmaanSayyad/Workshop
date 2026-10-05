// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 04 — Lost & Found / Campus Complaint Tracker
// Anyone opens a ticket; owner updates status (Open → InProgress → Resolved).
// =============================================================================
pragma solidity ^0.8.20;

/// @title ComplaintTracker
contract ComplaintTracker {
    address public owner;

    enum Status {
        Open,
        InProgress,
        Resolved,
        Closed
    }

    struct Ticket {
        address reporter;
        string category;    // "Lost", "Found", "Facility", etc.
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

    function createTicket(string calldata category, string calldata description) external returns (uint256) {
        uint256 id = ticketCount;
        tickets[id] = Ticket({
            reporter: msg.sender,
            category: category,
            description: description,
            status: Status.Open,
            createdAt: block.timestamp,
            exists: true
        });
        ticketCount += 1;
        emit TicketCreated(id, msg.sender, category);
        return id;
    }

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
