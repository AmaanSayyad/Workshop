// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 02 — Event / Class Attendance Check-in
// Students mark presence with their wallet. Organizer opens/closes sessions.
// =============================================================================
pragma solidity ^0.8.20;

/// @title AttendanceCheckIn
/// @notice Create sessions (class/event) and let wallets check in once.
contract AttendanceCheckIn {
    address public owner;

    struct Session {
        string name;        // e.g. "Web3 Workshop - Morning"
        uint256 startTime;  // unix timestamp when created
        bool open;          // true = accepting check-ins
        uint256 count;      // how many checked in
        bool exists;
    }

    mapping(uint256 => Session) public sessions;
    uint256 public sessionCount;

    // sessionId => student => checked in?
    mapping(uint256 => mapping(address => bool)) public checkedIn;

    event SessionCreated(uint256 indexed id, string name);
    event SessionClosed(uint256 indexed id);
    event CheckedIn(uint256 indexed id, address indexed student);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createSession(string calldata name) external onlyOwner returns (uint256) {
        uint256 id = sessionCount;
        sessions[id] = Session({
            name: name,
            startTime: block.timestamp,
            open: true,
            count: 0,
            exists: true
        });
        sessionCount += 1;
        emit SessionCreated(id, name);
        return id;
    }

    function closeSession(uint256 sessionId) external onlyOwner {
        require(sessions[sessionId].exists, "Session missing");
        sessions[sessionId].open = false;
        emit SessionClosed(sessionId);
    }

    function checkIn(uint256 sessionId) external {
        require(sessions[sessionId].exists, "Session missing");
        require(sessions[sessionId].open, "Session closed");
        require(!checkedIn[sessionId][msg.sender], "Already checked in");

        checkedIn[sessionId][msg.sender] = true;
        sessions[sessionId].count += 1;
        emit CheckedIn(sessionId, msg.sender);
    }

    function getSession(uint256 sessionId)
        external
        view
        returns (string memory name, uint256 startTime, bool open, uint256 count, bool exists)
    {
        Session storage s = sessions[sessionId];
        return (s.name, s.startTime, s.open, s.count, s.exists);
    }
}
