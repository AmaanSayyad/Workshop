// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 01 — College / Club Voting DApp
// Deploy this in Remix → Sepolia → paste address into the frontend.
// =============================================================================
pragma solidity ^0.8.20;

/// @title CampusVoting
/// @notice One wallet = one vote. Owner creates proposals; anyone can vote yes/no.
contract CampusVoting {
    // --- Who deployed the contract (faculty / club admin) ---
    address public owner;

    // --- One proposal on the ballot ---
    struct Proposal {
        string title;       // e.g. "Elect Club President: Ali"
        uint256 yesVotes;   // count of yes
        uint256 noVotes;    // count of no
        bool exists;        // true once created
    }

    // proposalId => Proposal
    mapping(uint256 => Proposal) public proposals;

    // How many proposals have been created
    uint256 public proposalCount;

    // proposalId => voter address => already voted?
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // --- Events (show up on Etherscan / frontend listeners) ---
    event ProposalCreated(uint256 indexed id, string title);
    event Voted(uint256 indexed id, address indexed voter, bool support);

    // Restrict admin actions to the deployer
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender; // deployer becomes owner
    }

    /// @notice Owner creates a new proposal. Returns its id.
    function createProposal(string calldata title) external onlyOwner returns (uint256) {
        uint256 id = proposalCount;
        proposals[id] = Proposal({
            title: title,
            yesVotes: 0,
            noVotes: 0,
            exists: true
        });
        proposalCount += 1;
        emit ProposalCreated(id, title);
        return id;
    }

    /// @notice Cast one yes (true) or no (false) vote on a proposal.
    function vote(uint256 proposalId, bool support) external {
        require(proposals[proposalId].exists, "Proposal missing");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposals[proposalId].yesVotes += 1;
        } else {
            proposals[proposalId].noVotes += 1;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    /// @notice Read proposal details in one call (handy for frontend).
    function getProposal(uint256 proposalId)
        external
        view
        returns (string memory title, uint256 yesVotes, uint256 noVotes, bool exists)
    {
        Proposal storage p = proposals[proposalId];
        return (p.title, p.yesVotes, p.noVotes, p.exists);
    }
}
