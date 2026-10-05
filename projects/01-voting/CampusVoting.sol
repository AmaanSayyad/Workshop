// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 01 — College / Club Voting DApp
//
// HOW TO READ THIS FILE (students):
//   1. Read the comment ABOVE each line / block first.
//   2. Then read the Solidity code.
//   3. Ask: "What would break if I deleted this?"
//
// Deploy in Remix on Sepolia, then open the CampusVote frontend.
// =============================================================================

// -----------------------------------------------------------------------------
// SPDX-License-Identifier: MIT
// WHY: Tells humans + tools which open-source license this code uses.
// MIT = free to use/modify with attribution. Remix shows a warning without it.
// Not executed on-chain — metadata only.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// pragma solidity ^0.8.20;
// WHY: Picks the Solidity *language version* the compiler must use.
//   - "pragma" = a compiler instruction ("pragma" ≈ "directive").
//   - "^0.8.20" means: use 0.8.20 or any newer 0.8.x, but NOT 0.9.0.
//   - 0.8.x adds safer math (overflows revert automatically).
// In Remix: set Compiler to 0.8.20 or higher before Compile.
// -----------------------------------------------------------------------------
pragma solidity ^0.8.20;

// -----------------------------------------------------------------------------
// /// @title / @notice
// WHY: NatSpec docs (like JSDoc). Tools/Etherscan can show them.
// They do NOT change runtime behavior.
// -----------------------------------------------------------------------------
/// @title CampusVoting
/// @notice One wallet = one vote. Owner creates proposals; anyone votes yes/no.

// -----------------------------------------------------------------------------
// contract CampusVoting { ... }
// WHY: A "contract" is like a class that lives forever on the blockchain.
// After deploy, it gets an address (0x...). Users call its functions via txs.
// -----------------------------------------------------------------------------
contract CampusVoting {
    // =========================================================================
    // STATE VARIABLES
    // Data stored permanently in contract storage (costs gas to change).
    // =========================================================================

    // -------------------------------------------------------------------------
    // address public owner;
    // WHY "address"? Ethereum accounts are 20-byte addresses (0x + 40 hex).
    // WHY "public"? Solidity auto-creates a getter: owner() anyone can call.
    // WHY store owner? So only the deployer/admin can create proposals.
    // -------------------------------------------------------------------------
    address public owner;

    // -------------------------------------------------------------------------
    // struct Proposal { ... }
    // WHY "struct"? A custom type that groups related fields — like a
    // TypeScript interface / Java class with only data fields.
    // Without struct you'd need 4 separate mappings (messy).
    // -------------------------------------------------------------------------
    struct Proposal {
        // string = dynamic UTF-8 text (title of the election)
        string title;
        // uint256 = unsigned integer 0 .. 2^256-1 (no negatives)
        // Used for vote counts — can't go below 0.
        uint256 yesVotes;
        uint256 noVotes;
        // bool exists = false by default for empty mapping slots.
        // We set true when created so we can detect "missing proposal".
        bool exists;
    }

    // -------------------------------------------------------------------------
    // mapping(uint256 => Proposal) public proposals;
    // WHY "mapping"? On-chain dictionary / hashmap.
    // Key = proposal id (0, 1, 2…), Value = Proposal struct.
    // You CANNOT loop mappings in Solidity without tracking keys separately.
    // -------------------------------------------------------------------------
    mapping(uint256 => Proposal) public proposals;

    // -------------------------------------------------------------------------
    // uint256 public proposalCount;
    // WHY: Next free id AND total number created.
    // First proposal uses id 0, then we do proposalCount += 1.
    // -------------------------------------------------------------------------
    uint256 public proposalCount;

    // -------------------------------------------------------------------------
    // mapping(uint256 => mapping(address => bool)) public hasVoted;
    // WHY nested mapping?
    //   hasVoted[proposalId][voterAddress] == true means already voted.
    // Prevents double voting with the same wallet on the same proposal.
    // -------------------------------------------------------------------------
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // =========================================================================
    // EVENTS
    // Logs written into the transaction receipt (cheap history for UIs).
    // Etherscan shows them; frontends can subscribe later.
    // "indexed" = searchable filter field (up to 3 indexed per event).
    // =========================================================================
    event ProposalCreated(uint256 indexed id, string title);
    event Voted(uint256 indexed id, address indexed voter, bool support);

    // =========================================================================
    // MODIFIERS
    // Reusable checks wrapped around functions (like middleware).
    // =========================================================================

    // -------------------------------------------------------------------------
    // modifier onlyOwner()
    // WHY: Don't copy-paste "require(msg.sender == owner)" everywhere.
    // require(...) reverts the whole tx if condition is false.
    // msg.sender = the wallet that called this function.
    // "_" = "run the rest of the function body here".
    // -------------------------------------------------------------------------
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // =========================================================================
    // CONSTRUCTOR
    // Runs ONCE at deploy time. Never again.
    // =========================================================================

    // -------------------------------------------------------------------------
    // constructor() { owner = msg.sender; }
    // WHY: Whoever clicks Deploy in Remix becomes the owner/admin.
    // msg.sender during constructor = the deployer wallet.
    // -------------------------------------------------------------------------
    constructor() {
        owner = msg.sender;
    }

    // =========================================================================
    // WRITE FUNCTIONS (change state → costs gas → needs MetaMask confirm)
    // =========================================================================

    /// @notice Owner creates a new proposal. Returns its numeric id.
    // -------------------------------------------------------------------------
    // external = can be called from outside (wallets / other contracts),
    //            NOT from other functions inside this contract.
    // onlyOwner = applies the modifier above.
    // string calldata title:
    //   calldata = read-only input data (cheaper than memory for external args).
    // returns (uint256) = gives the new proposal id back to the caller.
    // -------------------------------------------------------------------------
    function createProposal(string calldata title) external onlyOwner returns (uint256) {
        // Use current count as the new id (0, then 1, then 2…)
        uint256 id = proposalCount;

        // Write a full Proposal into storage at proposals[id]
        proposals[id] = Proposal({
            title: title,
            yesVotes: 0,
            noVotes: 0,
            exists: true
        });

        // Next proposal will get the next id
        proposalCount += 1;

        // Announce creation on-chain (for explorers / indexers)
        emit ProposalCreated(id, title);

        return id;
    }

    /// @notice Cast one yes (true) or no (false) vote.
    // -------------------------------------------------------------------------
    // Anyone can call (no onlyOwner) — that's the point of voting.
    // bool support: true = Yes, false = No.
    // -------------------------------------------------------------------------
    function vote(uint256 proposalId, bool support) external {
        // Guard 1: proposal must exist
        require(proposals[proposalId].exists, "Proposal missing");
        // Guard 2: this wallet must not have voted already
        // "!" means NOT — so require(!alreadyVoted)
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        // Mark voter BEFORE counting (checks-effects pattern — safer habits)
        hasVoted[proposalId][msg.sender] = true;

        // Branch on yes vs no
        if (support) {
            proposals[proposalId].yesVotes += 1;
        } else {
            proposals[proposalId].noVotes += 1;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    // =========================================================================
    // READ FUNCTION (view = no state change = no gas when called from UI)
    // =========================================================================

    /// @notice Fetch one proposal in a single call (frontend-friendly).
    // -------------------------------------------------------------------------
    // view = promise not to modify storage.
    // returns (... multiple values ...) = Solidity can return tuples.
    // string memory = temporary copy in memory (needed when returning strings).
    // storage p = reference to the struct sitting in contract storage (no copy).
    // -------------------------------------------------------------------------
    function getProposal(uint256 proposalId)
        external
        view
        returns (string memory title, uint256 yesVotes, uint256 noVotes, bool exists)
    {
        Proposal storage p = proposals[proposalId];
        return (p.title, p.yesVotes, p.noVotes, p.exists);
    }
}
