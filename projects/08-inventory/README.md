# Mini-Project 08 — Supply / Inventory Custody Log

> **Syllabus fit:** Exp 9, 10  
> **Contract:** [`InventoryLog.sol`](./InventoryLog.sol)  
> **Frontend route:** `/project/inventory`  
> **Network:** Sepolia  
> **Difficulty:** Beginner–Intermediate

---

## 1. Problem statement

Lab equipment gets lost between students and shelves. Build an **inventory custody log** where:

- Admin adds items with a custodian wallet + location
- Custody can transfer between wallets
- Location string can be updated
- Anyone can audit who holds what

**Report one-liner:** *On-chain inventory and custody tracking for campus lab equipment on Sepolia.*

---

## 2. Architecture

```
Owner                         Custodian
  │                               │
  ├─ addItem(name, loc, addr)     ├─ transferCustody(id, to)
  │                               ├─ updateLocation(id, loc)
  └────────── InventoryLog ───────┘
                   │
              getItem(id)
```

Owner **or** current custodian may transfer / update location.

---

## 3. Contract — deep dive

### Item struct

```solidity
struct Item {
    string name;
    string location;
    address custodian;
    bool exists;
}
```

### Functions

| Function | Who | Purpose |
|----------|-----|---------|
| `addItem` | Owner | Register equipment |
| `transferCustody` | Custodian or owner | Hand over item |
| `updateLocation` | Custodian or owner | Move shelf/room string |
| `getItem` | Public view | Audit |

### Permission pattern

```solidity
require(msg.sender == items[id].custodian || msg.sender == owner, "Not allowed");
```

Shared authority — common in asset-tracking contracts.

### Line-by-line concepts

1. Custody as an **address**, not a name string.  
2. Events `ItemAdded`, `CustodyTransferred`, `LocationUpdated` for history.  
3. `address(0)` rejected as custodian.  
4. Public audit trail without a central spreadsheet.  

---

## 4. Remix deploy

1. Paste `InventoryLog.sol`  
2. Deploy (no constructor args)  
3. Frontend `/project/inventory`  

---

## 5. Frontend walkthrough

1. Owner adds item: `Arduino Kit #12`, location `L3 Lab Shelf B`, custodian = your address  
2. Transfer custody to classmate’s address  
3. Classmate updates location to `Home - Project Work`  
4. Read item → screenshot custodian change  

---

## 6. Submission checklist

- [ ] addItem tx  
- [ ] transferCustody tx  
- [ ] updateLocation tx  
- [ ] Before/after getItem screenshots  
- [ ] Contract address  

---

## 7. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` on add | Use deployer |
| `Not allowed` | Must be custodian or owner |
| `Bad custodian` / `Bad address` | Valid `0x` address required |
| `Missing item` | Wrong id |

---

## 8. Extensions

- Item categories / serial numbers  
- Require two-step transfer (propose + accept)  
- NFT representation of each item (advanced)  

---

## 9. Viva questions

1. Why identify custodian by wallet address?  
2. What is an event useful for after transfer?  
3. Can owner seize custody? (Yes — by design in this demo.)  

---

## Files

| File | Role |
|------|------|
| `InventoryLog.sol` | Remix deploy |
| `README.md` | This guide |

---

## Standalone frontend (this project only)

Each mini-project ships its **own** React app under `frontend/` — not a shared multi-app shell.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL → Connect MetaMask (Sepolia) → paste your Remix contract address → use the product UI.

