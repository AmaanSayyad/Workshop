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

## 8. Explaining what happens (UI → MetaMask → Etherscan)

Use this section when demoing or writing your lab report. **One sentence:** you clicked a button in CampusVote → MetaMask signed a transaction → Sepolia ran `CampusVoting.sol` → Etherscan shows the receipt.

### Board diagram

```text
[CampusVote UI]  --ethers.js-->  [MetaMask signs]
                                      |
                                      v
                               [Sepolia network]
                                      |
                                      v
                         [CampusVoting.sol @ 0x7126…]
                           createProposal / vote
                                      |
                                      v
                         [Events: ProposalCreated / Voted]
                                      |
                                      v
                              [Etherscan receipt]
```

### Step 1 — Frontend (CampusVote)

On **Create / manage**, you type a question (e.g. `"Elect Club President"`) and click **Publish election**.

That button:

1. Uses the connected contract address (e.g. `0x7126…501B`)
2. Calls Solidity: `createProposal("Elect Club President")`
3. Asks MetaMask to send that call as a **transaction**

Toast **"Confirming…"** means: the tx was sent; the app is waiting for a block.

### Step 2 — MetaMask

MetaMask is the **signer**. Your wallet (e.g. `0xF724…c5b6`) pays a tiny bit of Sepolia ETH for gas and proves “this wallet authorized this call.”

| MetaMask text | Meaning |
|---------------|---------|
| **Transaction submitted** | Broadcast to Sepolia |
| **Interaction in progress** | Not mined yet |
| Green **Contract interaction** | Mined / finished |

MetaMask does **not** store the election. It only signs and sends.

### Step 3 — Etherscan Overview (Success)

When the block mines, Etherscan is the public receipt:

| Field | Meaning |
|--------|--------|
| **Status: Success** | Contract ran without reverting |
| **From** `0xF724…` | Who clicked / signed |
| **To** `0x7126…501B` | Your CampusVoting contract |
| **Value 0 ETH** | You didn’t send money — only a function call |
| **Transaction Action: Create Proposal** | Etherscan decoded the function name |

So: **wallet → voting contract → `createProposal` succeeded.**

### Step 4 — Input Data tab

This is the **exact call** encoded as bytes:

- Function: `createProposal(string)`
- Argument: `"Elect Club President"`

Frontend → ethers.js packs that string into hex → MetaMask sends it → nodes execute it. **Input Data** is that packing, readable on Etherscan.

### Step 5 — Logs tab (events)

Your contract emitted something like:

```text
ProposalCreated(proposalId = 2, title = "Elect Club President")
```

- **Events / Logs** = permanent, searchable history on-chain  
- **`proposalId` 2** = this is election **#2** (that’s why the UI uses **Election number `2`**)  
- Hex like `456c656374…` = ASCII for **"Elect Club President"**

**Teaching line:** storage holds the vote counts; events are the “receipt printout.”

### Step 6 — Vote flow (Use app)

Set **Election number** to the id from Logs (e.g. `2`), click **Yes** or **No**. Same pipeline:

**UI `vote(2, true/false)` → MetaMask → contract → `Voted` event**

In Logs you should see:

- Contract `0x7126…501B` (CampusVoting)
- Event **`Voted`**
- `proposalId = 2`
- voter = your wallet
- support true/false

**See live results** calls `getProposal(2)` and shows Yes/No tallies from storage.

### Don’t confuse this with `redeemDelegations`

Some MetaMask activity / Etherscan pages may also show:

- A different contract (e.g. `0xdb9b1…`)
- Function **`redeemDelegations`**
- Event **`RedeemedDelegation`**

That is **MetaMask’s own smart-account / delegation plumbing**, not your workshop contract.

For the lab report, point only at:

1. **To:** your CampusVoting address (`0x7126…` or the address you deployed)
2. Functions **`createProposal`** / **`vote`**
3. Logs: **`ProposalCreated`** / **`Voted`**

### 30-second viva answer

> The React app never stores votes. It asks MetaMask to call functions on the Sepolia contract. When the transaction succeeds, Etherscan shows Success, the function in Input Data, and the event in Logs. That’s proof the election and vote are on-chain.

---

## 9. Suggested demo script (5 minutes)

| Step | Who | Action |
|------|-----|--------|
| 1 | Instructor | Show live deployed DApp |
| 2 | Student A | Deploy in Remix |
| 3 | Student A | Create proposal from UI |
| 4 | Student B | Vote YES |
| 5 | Student C | Vote NO |
| 6 | Anyone | Read tallies + open Etherscan tx (Overview → Input Data → Logs) |

---

## 10. Lab submission checklist

- [ ] Problem statement in your own words  
- [ ] Contract address + Etherscan link  
- [ ] Screenshot: Remix deploy success  
- [ ] Tx hash: `createProposal`  
- [ ] Tx hash: `vote`  
- [ ] Screenshot: UI showing Yes/No counts  
- [ ] Screenshot or notes: Etherscan **Logs** (`ProposalCreated` / `Voted`)  
- [ ] 5+ notes copied from line-by-line section above  
- [ ] Architecture diagram (User → MetaMask → Frontend → Contract → Sepolia)  

---

## 11. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` | Use the **deployer** wallet for `createProposal` |
| `Already voted` | Each wallet votes once; switch account |
| `Proposal missing` | Create proposal first; use correct id (`0`, `1`, …) |
| Wrong network | Switch MetaMask to Sepolia |
| No gas | Get Sepolia ETH from faucet / instructor |
| Frontend buttons disabled | Connect contract + Sign in + Sepolia |
| Seeing `redeemDelegations` on Etherscan | Ignore it for the report — use CampusVoting txs only |

---

## 12. Extensions (optional for higher marks)

1. Add a proposal deadline (`block.timestamp`)  
2. Emit and listen to events in the UI  
3. Show `hasVoted` status for the connected wallet  
4. Multiple-choice options (see Mini-Project 09 Poll)  

---

## 13. Viva / oral questions

1. Why can’t two people share one MetaMask account and both vote?  
2. What is the difference between `view` and a state-changing function?  
3. Who can call `createProposal` and why?  
4. Where does the proposal data live after you close the laptop?  
5. What is the difference between **Input Data** and **Logs** on Etherscan?  

---

## 14. Files in this folder

| File | Role |
|------|------|
| `CampusVoting.sol` | Deploy this in Remix |
| `frontend/` | Vite + React app (`npm install` → `npm run dev`) |
| `README.md` | This guide |
