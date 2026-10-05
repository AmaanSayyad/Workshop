# Mini-Project 04 — Lost & Found / Complaint Tracker

> **Syllabus fit:** Exp 9, 10  
> **Contract:** [`ComplaintTracker.sol`](./ComplaintTracker.sol)  
> **Frontend route:** `/project/complaints`  
> **Network:** Sepolia  
> **Difficulty:** Beginner

---

## 1. Problem statement

Campus lost-and-found or facility complaints often live in WhatsApp chaos. Build a **ticket tracker DApp** where:

- Any student opens a ticket (category + description)
- Admin (owner) updates status through a workflow
- Status history is publicly auditable on-chain

**Statuses:** `Open` → `InProgress` → `Resolved` → `Closed`

**Report one-liner:** *Decentralized campus complaint / lost-and-found ticketing system on Ethereum Sepolia.*

---

## 2. Architecture

```
Student                         Admin (owner)
   │                                 │
   ├─ createTicket(category, desc)   ├─ updateStatus(id, status)
   │                                 │
   └────────── ComplaintTracker.sol ─┘
                    │
              getTicket(id)
```

---

## 3. Contract — deep dive

### Enum Status

```solidity
enum Status { Open, InProgress, Resolved, Closed }
```

On-chain these are numbers: `0, 1, 2, 3`. The UI maps them back to labels.

### Ticket struct

```solidity
struct Ticket {
    address reporter;
    string category;
    string description;
    Status status;
    uint256 createdAt;
    bool exists;
}
```

`reporter = msg.sender` at creation — proves who filed it (that wallet).

### Functions

| Function | Who | Notes |
|----------|-----|-------|
| `createTicket` | Anyone | Starts at `Status.Open` |
| `updateStatus` | Owner only | Admin workflow |
| `getTicket` | Anyone (view) | Full ticket for screenshots |

### Line-by-line concepts

1. **`enum`** — named states instead of magic numbers in code.  
2. **`reporter`** — on-chain identity of the filer.  
3. **Owner updates status** — separation of concerns (file vs resolve).  
4. **Events** `TicketCreated`, `StatusUpdated` — lab evidence.  

---

## 4. Remix deploy

1. Paste `ComplaintTracker.sol`  
2. Compile & deploy on Sepolia (no args)  
3. Paste address in `/project/complaints`  

---

## 5. Frontend walkthrough

1. Student wallet → Create ticket (`Lost`, `Lost ID near Seminar Hall`)  
2. Note ticket id (`0` first time)  
3. Switch to **owner** wallet → Update status to `1` (InProgress)  
4. Update to `2` (Resolved)  
5. Read ticket → screenshot  

---

## 6. Submission checklist

- [ ] Create ticket tx  
- [ ] Update status tx  
- [ ] Read/UI screenshot with status label  
- [ ] Explain enum values 0–3 in report  
- [ ] Contract address + Etherscan  

---

## 7. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` on update | Use deployer account |
| `Missing ticket` | Wrong id |
| Status looks like a number | Map 0→Open in your writeup |

---

## 8. Extensions

- Only reporter or owner can comment (add `string` updates)  
- Category whitelist  
- SLA deadline field  

---

## 9. Viva questions

1. Why store complaints on-chain if text is public?  
2. Who should be `owner` in a real college deployment?  
3. Can a student change status? Why / why not?  

---

## Files

| File | Role |
|------|------|
| `ComplaintTracker.sol` | Remix deploy |
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

