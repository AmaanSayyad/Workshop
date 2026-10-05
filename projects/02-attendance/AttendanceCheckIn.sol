// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 02 — Attendance Check-in
// READ FIRST: docs/SOLIDITY_BASICS.md (pragma, struct, mapping, msg.sender…)
// =============================================================================
// SPDX = license metadata (not executed). MIT = permissive open source.
pragma solidity ^0.8.20;
// pragma = "use Solidity 0.8.20+". Locks compiler language rules.

/// @title AttendanceCheckIn
/// @notice Faculty opens a session; each student wallet checks in once.
contract AttendanceCheckIn {
    // address = 20-byte account id. public = auto getter owner().
    address public owner;

    // struct = custom object shape grouping related fields.
    struct Session {
        string name;        // human label, e.g. "Morning Lab"
        uint256 startTime;  // seconds since Unix epoch (block.timestamp)
        bool open;          // true → check-ins allowed
        uint256 count;      // how many unique wallets checked in
        bool exists;        // distinguishes real sessions from empty mapping slots
    }

    // mapping = on-chain dictionary: sessionId → Session
    mapping(uint256 => Session) public sessions;
    uint256 public sessionCount; // next id AND total created

    // nested mapping: sessionId → student address → already checked in?
    mapping(uint256 => mapping(address => bool)) public checkedIn;

    // events = logs for Etherscan / apps (indexed = searchable)
    event SessionCreated(uint256 indexed id, string name);
    event SessionClosed(uint256 indexed id);
    event CheckedIn(uint256 indexed id, address indexed student);

    // modifier = reusable require() wrapper; "_" runs the function body
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // constructor runs ONCE at deploy; deployer becomes owner
    constructor() {
        owner = msg.sender;
    }

    /// @notice Admin opens a new attendance window.
    // external = callable from outside. calldata = cheap read-only string input.
    function createSession(string calldata name) external onlyOwner returns (uint256) {
        uint256 id = sessionCount;
        sessions[id] = Session({
            name: name,
            startTime: block.timestamp, // current chain time
            open: true,
            count: 0,
            exists: true
        });
        sessionCount += 1;
        emit SessionCreated(id, name);
        return id;
    }

    /// @notice Admin stops further check-ins.
    function closeSession(uint256 sessionId) external onlyOwner {
        require(sessions[sessionId].exists, "Session missing");
        sessions[sessionId].open = false;
        emit SessionClosed(sessionId);
    }

    /// @notice Student marks presence with their wallet (once).
    function checkIn(uint256 sessionId) external {
        require(sessions[sessionId].exists, "Session missing");
        require(sessions[sessionId].open, "Session closed");
        require(!checkedIn[sessionId][msg.sender], "Already checked in");

        checkedIn[sessionId][msg.sender] = true;
        sessions[sessionId].count += 1;
        emit CheckedIn(sessionId, msg.sender);
    }

    /// @notice view = read-only, free from frontend.
    function getSession(uint256 sessionId)
        external
        view
        returns (string memory name, uint256 startTime, bool open, uint256 count, bool exists)
    {
        Session storage s = sessions[sessionId]; // storage = reference to on-chain data
        return (s.name, s.startTime, s.open, s.count, s.exists);
    }
}
