# Mini-Project 01 — College / Club Voting DApp

> **Syllabus fit:** Exp 6 (Remix + MetaMask), Exp 9 (blockchain application), Exp 10 (DApp mini-project)  
> **Contract:** [`CampusVoting.sol`](./CampusVoting.sol)  
> **Frontend route:** `/project/voting`  
> **Network:** Ethereum Sepolia testnet  
> **Difficulty:** Beginner · Best first project for the whole class

---

## 1. Problem statement

Campus elections and club decisions are often opaque (“who counted the votes?”). Build a **transparent voting DApp** where:

- An admin (contract owner) creates proposals
- Each wallet can vote **once** (yes or no)
- Anyone can read tallies on-chain
- Results are immutable after votes are cast

**Report one-liner:** *Design and develop a decentralized campus voting application using Solidity, Remix, MetaMask, and a React frontend on Ethereum Sepolia.*

---

## 2. What you will build

```
[Student browser]
      │
      ├─ MetaMask (signs tx as msg.sender)
      │
      ├─ React UI (this workshop frontend)
      │       │
      │       └─ ethers.js → Contract(address, ABI, signer)
      │
      └─ CampusVoting.sol  (deployed on Sepolia)
              ├─ createProposal(title)   // owner only
              ├─ vote(id, support)       // one vote / wallet
              └─ getProposal(id)         // free read
```

---

## 3. Learning outcomes

After finishing this project you can explain:

1. What `msg.sender`, `owner`, and modifiers do  
2. How `struct` + `mapping` store data on-chain  
3. Why `view` functions cost no gas to call  
4. How Remix deploy → address → frontend connection works  
5. How to prove work with Etherscan transaction links  

---

## 4. Prerequisites

| Tool | Why |
|------|-----|
| Chrome / Brave | MetaMask extension |
| [MetaMask](https://metamask.io) | Wallet + Sepolia |
| Sepolia ETH | Pay gas (faucet or instructor) |
| [Remix](https://remix.ethereum.org) | Compile & deploy Solidity |
| Node.js 18+ | Run the shared frontend |

---

## 5. Smart contract — line-by-line

Open [`CampusVoting.sol`](./CampusVoting.sol) while reading this section.

### Header & version

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
```

- **SPDX** — license identifier (Remix warning goes away).  
- **pragma** — compiler must be **0.8.20 or higher**. In Remix: Solidity Compiler → select `0.8.20+`.

### State: owner

```solidity
address public owner;
```

- Stores the **deployer** wallet.  
- `public` auto-generates a getter `owner()` so the UI/Etherscan can read it.

### Struct: Proposal

```solidity
struct Proposal {
    string title;
    uint256 yesVotes;
    uint256 noVotes;
    bool exists;
}
```

A **struct** groups related fields. `exists` prevents voting on empty ids (default mapping values look like zeros).

### Storage maps

```solidity
mapping(uint256 => Proposal) public proposals;
uint256 public proposalCount;
mapping(uint256 => mapping(address => bool)) public hasVoted;
```

| Symbol | Meaning |
|--------|---------|
| `proposals[id]` | Proposal data for that id |
| `proposalCount` | Next id to assign (also total created) |
| `hasVoted[id][wallet]` | `true` if that wallet already voted |

Nested mapping = **one vote per wallet per proposal**.

### Events

```solidity
event ProposalCreated(uint256 indexed id, string title);
event Voted(uint256 indexed id, address indexed voter, bool support);
```

Events are written to transaction logs. Etherscan shows them; frontends can listen later. `indexed` fields are searchable filters.

### Modifier

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
}
```

Reusable access control. `_` means “run the rest of the function.”

### Constructor

```solidity
constructor() {
    owner = msg.sender;
}
```

Runs **once** at deploy. Whoever clicks **Deploy** in Remix becomes owner (usually the faculty/club admin wallet).

### createProposal

```solidity
function createProposal(string calldata title) external onlyOwner returns (uint256)
```

1. Take next `id = proposalCount`  
2. Write a new `Proposal` into storage  
3. Increment `proposalCount`  
4. Emit `ProposalCreated`  
5. Return the id  

`calldata` is cheaper for external string inputs.

### vote

```solidity
function vote(uint256 proposalId, bool support) external
```

Checks:

1. Proposal exists  
2. Caller has not voted  

Then marks `hasVoted`, increments `yesVotes` or `noVotes`, emits `Voted`.

### getProposal

```solidity
function getProposal(uint256 proposalId) external view returns (...)
```

`view` = read-only, **no gas** when called from frontend (node still serves the data). Perfect for refreshing tallies.

---

## 6. Deploy on Remix (step-by-step)

1. Open [Remix](https://remix.ethereum.org)  
2. Create file `CampusVoting.sol` → paste this folder’s contract  
3. **Solidity Compiler** → version `0.8.20`+ → **Compile**  
4. **Deploy & Run** → Environment: **Injected Provider - MetaMask**  
5. Confirm MetaMask is on **Sepolia**  
6. Constructor: **none** (leave blank)  
7. Click **Deploy** → confirm in MetaMask  
8. Copy the contract address (under “Deployed Contracts”)  
9. Open Sepolia Etherscan → paste address → bookmark for submission  

---

## 7. Connect the workshop frontend

```bash
cd frontend
npm install
npm run dev
```

1. Open the app  
2. Paste the Remix contract address → **Connect contract** (app verifies bytecode on-chain)  
3. **Sign in** with MetaMask on Sepolia  
4. As owner: create proposal (e.g. `Elect Club President`)  
5. Switch MetaMask account (or ask a classmate) → **Vote YES/NO**  
6. **See live results** → screenshot Yes/No counts  

Address is saved in the browser (`localStorage`). Redeploy? Click **Change** and paste the new address.

See also: [`docs/STUDENT_QUICKSTART.md`](../../docs/STUDENT_QUICKSTART.md)

---

## 8. Suggested demo script (5 minutes)

| Step | Who | Action |
|------|-----|--------|
| 1 | Instructor | Show live deployed DApp |
| 2 | Student A | Deploy in Remix |
| 3 | Student A | Create proposal from UI |
| 4 | Student B | Vote YES |
| 5 | Student C | Vote NO |
| 6 | Anyone | Read tallies + open Etherscan tx |

---

## 9. Lab submission checklist

- [ ] Problem statement in your own words  
- [ ] Contract address + Etherscan link  
- [ ] Screenshot: Remix deploy success  
- [ ] Tx hash: `createProposal`  
- [ ] Tx hash: `vote`  
- [ ] Screenshot: UI showing Yes/No counts  
- [ ] 5+ notes copied from line-by-line section above  
- [ ] Architecture diagram (User → MetaMask → Frontend → Contract → Sepolia)  

---

## 10. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` | Use the **deployer** wallet for `createProposal` |
| `Already voted` | Each wallet votes once; switch account |
| `Proposal missing` | Create proposal first; use correct id (`0`, `1`, …) |
| Wrong network | Switch MetaMask to Sepolia |
| No gas | Get Sepolia ETH from faucet / instructor |
| Frontend buttons disabled | Connect MetaMask + Save address + Sepolia |

---

## 11. Extensions (optional for higher marks)

1. Add a proposal deadline (`block.timestamp`)  
2. Emit and listen to events in the UI  
3. Show `hasVoted` status for the connected wallet  
4. Multiple-choice options (see Mini-Project 09 Poll)  

---

## 12. Viva / oral questions

1. Why can’t two people share one MetaMask account and both vote?  
2. What is the difference between `view` and a state-changing function?  
3. Who can call `createProposal` and why?  
4. Where does the proposal data live after you close the laptop?  

---

## 13. Files in this folder

| File | Role |
|------|------|
| `CampusVoting.sol` | Deploy this in Remix |
| `README.md` | This guide |

Shared UI lives in `/frontend` at the repo root (route `/project/voting`).
