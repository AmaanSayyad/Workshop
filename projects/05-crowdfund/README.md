# Mini-Project 05 — Crowdfunding / Tip Jar

> **Syllabus fit:** Exp 5, 6, 9, 10 — includes **payable ETH** transfers  
> **Contract:** [`CampusCrowdfund.sol`](./CampusCrowdfund.sol)  
> **Frontend route:** `/project/crowdfund`  
> **Network:** Sepolia  
> **Difficulty:** Intermediate (constructor args + `payable`)

---

## 1. Problem statement

Raise funds for a campus campaign (fest, innovation fund, tip jar) where:

- Anyone can donate Sepolia ETH
- Totals are transparent on-chain
- Owner withdraws the balance and closes the campaign

**Report one-liner:** *Ethereum crowdfunding smart contract with payable donations and owner withdrawal on Sepolia.*

---

## 2. Architecture

```
Donors                         Owner
  │                              │
  ├─ donate() payable            ├─ withdraw()
  ├─ plain ETH transfer          │
  └──────── CampusCrowdfund ─────┘
              │
         getInfo() → goal, raised, balance, closed
```

---

## 3. Critical: constructor arguments

This is the **only** workshop contract that needs Remix constructor inputs:

```solidity
constructor(string memory _name, uint256 _goalWei)
```

### Example (Remix)

```text
"Campus Innovation Fund", 1000000000000000
```

Meaning:

- Name: `Campus Innovation Fund`  
- Goal: `1000000000000000` wei = **0.001 ETH**

| Unit | Value |
|------|-------|
| 1 ETH | `1000000000000000000` wei |
| 0.001 ETH | `1000000000000000` wei |

---

## 4. Contract — deep dive

### State

```solidity
address public owner;
string public campaignName;
uint256 public goalWei;
uint256 public totalRaised;
bool public closed;
mapping(address => uint256) public donations;
```

### donate()

```solidity
function donate() external payable {
    require(!closed, "Closed");
    require(msg.value > 0, "Send ETH");
    donations[msg.sender] += msg.value;
    totalRaised += msg.value;
}
```

- **`payable`** — function can receive ETH  
- **`msg.value`** — amount sent with the transaction  

### receive()

Accepts plain transfers (send ETH to contract address) as donations too.

### withdraw()

Owner pulls **full balance**, sets `closed = true`, transfers ETH with low-level `.call`.

### Line-by-line concepts

1. Constructor sets immutable campaign parameters at deploy.  
2. `payable` / `msg.value` — how money moves on Ethereum.  
3. `address(this).balance` — contract’s ETH balance.  
4. Checks-effects-interactions: set `closed` before sending ETH.  
5. Per-donor `donations` mapping for transparency.  

---

## 5. Remix deploy

1. Paste `CampusCrowdfund.sol`  
2. Compile `0.8.20+`  
3. Deploy & Run → Injected Provider (Sepolia)  
4. In constructor fields enter name + goalWei  
5. Deploy → copy address → `/project/crowdfund`  

---

## 6. Frontend walkthrough

1. Connect MetaMask with Sepolia ETH  
2. Save contract address  
3. Donate `0.001` ETH  
4. **Read info** → Raised / Balance  
5. Owner → **Withdraw**  
6. Read again → Closed = true, Balance = 0  

---

## 7. Submission checklist

- [ ] Remix constructor args documented  
- [ ] Donate tx (show value on Etherscan)  
- [ ] Withdraw tx  
- [ ] Screenshot of getInfo before/after  
- [ ] Explain wei vs ETH in report  

---

## 8. Common errors

| Error | Fix |
|-------|-----|
| Deploy fails / wrong args | Strings need quotes in Remix; goal is integer wei |
| `Send ETH` | donate with `value > 0` |
| `Closed` | Campaign already withdrawn |
| `Only owner` on withdraw | Use deployer wallet |
| `Empty` | No balance to withdraw |

---

## 9. Security note (for report)

This is a **teaching** contract. Production crowdfunding needs: reentrancy guards, pull-over-push patterns, goal enforcement before withdraw, refunds, etc. Mention that in your conclusion for bonus marks.

---

## 10. Viva questions

1. What is `msg.value`?  
2. Why use wei instead of floating ETH in Solidity?  
3. What does `receive()` enable?  

---

## Files

| File | Role |
|------|------|
| `CampusCrowdfund.sol` | Remix deploy (with constructor) |
| `README.md` | This guide |
