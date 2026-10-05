// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 09 — Campus Poll
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEA: dynamic arrays in storage (options[] parallel to votes[]).
// =============================================================================
pragma solidity ^0.8.20;

/// @title CampusPoll
/// @notice Multi-option polls (2–5 choices), one vote per wallet.
contract CampusPoll {
    address public owner;

    struct Poll {
        string question;
        string[] options; // dynamic array of choice labels
        uint256[] votes;  // same length as options; votes[i] for options[i]
        bool open;
        bool exists;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollCount;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event PollCreated(uint256 indexed id, string question);
    event Voted(uint256 indexed id, address indexed voter, uint256 optionIndex);
    event PollClosed(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Create poll with 2–5 options.
    // string[] calldata options = array passed from Remix/frontend
    function createPoll(string calldata question, string[] calldata options) external onlyOwner returns (uint256) {
        require(options.length >= 2 && options.length <= 5, "2-5 options");
        uint256 id = pollCount;

        // Assign fields on the struct in storage, then push array elements
        polls[id].question = question;
        polls[id].open = true;
        polls[id].exists = true;

        // for-loop copies each option and starts its vote count at 0
        for (uint256 i = 0; i < options.length; i++) {
            polls[id].options.push(options[i]);
            polls[id].votes.push(0);
        }

        pollCount += 1;
        emit PollCreated(id, question);
        return id;
    }

    /// @notice Vote for optionIndex (0 = first choice).
    function vote(uint256 pollId, uint256 optionIndex) external {
        require(polls[pollId].exists, "Missing poll");
        require(polls[pollId].open, "Poll closed");
        require(!hasVoted[pollId][msg.sender], "Already voted");
        require(optionIndex < polls[pollId].options.length, "Bad option");

        hasVoted[pollId][msg.sender] = true;
        polls[pollId].votes[optionIndex] += 1;
        emit Voted(pollId, msg.sender, optionIndex);
    }

    function closePoll(uint256 pollId) external onlyOwner {
        require(polls[pollId].exists, "Missing");
        polls[pollId].open = false;
        emit PollClosed(pollId);
    }

    function getPoll(uint256 pollId)
        external
        view
        returns (string memory question, string[] memory options, uint256[] memory votes, bool open, bool exists)
    {
        Poll storage p = polls[pollId];
        return (p.question, p.options, p.votes, p.open, p.exists);
    }
}
