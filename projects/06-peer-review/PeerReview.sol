// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 06 — Peer Review / Project Rating
// Rate a teammate or project 1–5 stars with an optional comment (once per rater).
// =============================================================================
pragma solidity ^0.8.20;

/// @title PeerReview
contract PeerReview {
    address public owner;

    struct Project {
        string title;
        address submitter;
        uint256 totalScore;   // sum of ratings
        uint256 ratingCount;  // number of ratings
        bool exists;
    }

    struct Rating {
        uint8 score;          // 1–5
        string comment;
        bool exists;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    // projectId => rater => Rating
    mapping(uint256 => mapping(address => Rating)) public ratings;

    event ProjectSubmitted(uint256 indexed id, address indexed submitter, string title);
    event Rated(uint256 indexed id, address indexed rater, uint8 score);

    constructor() {
        owner = msg.sender;
    }

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

    function rate(uint256 projectId, uint8 score, string calldata comment) external {
        require(projects[projectId].exists, "Missing project");
        require(score >= 1 && score <= 5, "Score 1-5");
        require(!ratings[projectId][msg.sender].exists, "Already rated");
        require(msg.sender != projects[projectId].submitter, "Cannot self-rate");

        ratings[projectId][msg.sender] = Rating({score: score, comment: comment, exists: true});
        projects[projectId].totalScore += score;
        projects[projectId].ratingCount += 1;

        emit Rated(projectId, msg.sender, score);
    }

    function getAverage(uint256 projectId) external view returns (uint256 avgTimes100, uint256 count) {
        Project storage p = projects[projectId];
        require(p.exists, "Missing");
        if (p.ratingCount == 0) return (0, 0);
        // avg * 100 for 2 decimal display without floats (e.g. 450 = 4.50)
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
