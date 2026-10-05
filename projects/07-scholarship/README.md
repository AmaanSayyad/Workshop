# Mini-Project 07 — Scholarship / Fee Transparency Ledger

> **Syllabus fit:** Exp 9, 10  
> **Contract:** [`ScholarshipLedger.sol`](./ScholarshipLedger.sol)  
> **Frontend route:** `/project/scholarship`  
> **Network:** Sepolia  
> **Difficulty:** Beginner

---

## 1. Problem statement

Scholarship and fee allocations are often opaque. Build a **public ledger** where an admin records grants (student name, purpose, amount) that anyone can audit.

This demo records amounts in **wei** as transparent entries. It does **not** have to move real funds (recording ≠ payment). You can still explain how a production system might combine recording + payouts.

**Report one-liner:** *Public scholarship transparency ledger on Ethereum Sepolia for auditable campus grants.*

---

## 2. Architecture

```
Admin (owner)                      Public
      │                              │
      ├─ recordGrant(name, purpose, amountWei)
      │                              ├─ getGrant(id)
      │                              ├─ totalRecorded()
      └────── ScholarshipLedger ─────┘
```

---

## 3. Contract — deep dive

### Grant struct

```solidity
struct Grant {
    string studentName;
    string purpose;     // Tuition, Hostel, Research...
    uint256 amountWei;
    uint256 recordedAt;
    bool exists;
}
```

### Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `recordGrant` | Owner | Append a public grant row |
| `getGrant` | Public view | Read one grant |
| `grantCount` / `totalRecorded` | Public | Totals for dashboards |

### Line-by-line concepts

1. **Transparency without a private database admin UI** — chain is the database.  
2. **`amountWei > 0`** — reject empty records.  
3. **`totalRecorded`** — running sum for report charts.  
4. Owner-only writes, public reads — classic governance pattern.  

---

## 4. Remix deploy

1. Paste `ScholarshipLedger.sol`  
2. Deploy on Sepolia (no constructor args)  
3. Frontend `/project/scholarship`  

---

## 5. Frontend walkthrough

1. Connect owner wallet  
2. Record grant: name, `Tuition`, amount `1000000000000000` (0.001 ETH in wei)  
3. Read grant id `0`  
4. Record a second grant → show `totalRecorded` increased  

---

## 6. Submission checklist

- [ ] At least 2 `recordGrant` transactions  
- [ ] Screenshot of getGrant + totalRecorded  
- [ ] Explain wei amounts in the report  
- [ ] Discuss privacy tradeoff (names on public chain)  
- [ ] Contract address  

---

## 7. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` | Deployer must record |
| `Amount > 0` | Don’t submit 0 |
| Confused ETH/wei | Document conversion table |

---

## 8. Ethics / report angle (high marks)

Public chains expose names. For a real college system you might store **hashed student ids** instead of plain names. Mention this improvement in your conclusion.

---

## 9. Viva questions

1. Difference between recording a grant and transferring ETH?  
2. Who can read the ledger?  
3. How would you protect student privacy?  

---

## Files

| File | Role |
|------|------|
| `ScholarshipLedger.sol` | Remix deploy |
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

