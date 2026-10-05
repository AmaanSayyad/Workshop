// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 06 — Peer Review
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEA: average without floats → store avg*100 as an integer.
// =============================================================================
pragma solidity ^0.8.20;

/// @title PeerReview
/// @notice Submit projects; peers rate 1–5 once (no self-rate).
contract PeerReview {
    address public owner;

    struct Project {
        string title;
        address submitter;  // who published it
        uint256 totalScore; // sum of all star ratings
        uint256 ratingCount;
        bool exists;
    }

    struct Rating {
        uint8 score;     // uint8 = 0..255; we only allow 1..5
        string comment;
        bool exists;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    // projectId → rater → their Rating
    mapping(uint256 => mapping(address => Rating)) public ratings;

    event ProjectSubmitted(uint256 indexed id, address indexed submitter, string title);
    event Rated(uint256 indexed id, address indexed rater, uint8 score);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Anyone can publish a project title.
    function submitProject(string calldata title) external returns (uint256) {
        uint256 id = projectCount;
        projects[id] = Project({
            title: title,
            submitter: msg.sender,
            totalScore: 0,
            ratingCount: 0,
            exists: true
        });
        projectCount += 1;
        emit ProjectSubmitted(id, msg.sender, title);
        return id;
    }

    /// @notice Rate someone else's project once.
    function rate(uint256 projectId, uint8 score, string calldata comment) external {
        require(projects[projectId].exists, "Missing project");
        require(score >= 1 && score <= 5, "Score 1-5");
        require(!ratings[projectId][msg.sender].exists, "Already rated");
        // prevent self-review
        require(msg.sender != projects[projectId].submitter, "Cannot self-rate");

        ratings[projectId][msg.sender] = Rating({score: score, comment: comment, exists: true});
        projects[projectId].totalScore += score;
        projects[projectId].ratingCount += 1;

        emit Rated(projectId, msg.sender, score);
    }

    /// @notice Returns average * 100 so UI can show 4.50 without floats.
    // Example: scores 5+4 → total 9, count 2 → (9*100)/2 = 450 → UI shows 4.50
    function getAverage(uint256 projectId) external view returns (uint256 avgTimes100, uint256 count) {
        Project storage p = projects[projectId];
        require(p.exists, "Missing");
        if (p.ratingCount == 0) return (0, 0);
        return ((p.totalScore * 100) / p.ratingCount, p.ratingCount);
    }

    function getProject(uint256 projectId)
        external
        view
        returns (string memory title, address submitter, uint256 totalScore, uint256 ratingCount, bool exists)
    {
        Project storage p = projects[projectId];
        return (p.title, p.submitter, p.totalScore, p.ratingCount, p.exists);
    }
}
