# Mini-Project 02 — Event / Class Attendance Check-in

> **Syllabus fit:** Exp 6, 9, 10  
> **Contract:** [`AttendanceCheckIn.sol`](./AttendanceCheckIn.sol)  
> **Frontend route:** `/project/attendance`  
> **Network:** Sepolia  
> **Difficulty:** Beginner

---

## 1. Problem statement

Paper attendance sheets can be forged or lost. Build an **on-chain check-in DApp** where:

- Faculty/organizer opens a named session (class or event)
- Each student wallet checks in **once** while the session is open
- Organizer can close the session
- Attendance count is publicly readable

**Report one-liner:** *A blockchain-based attendance system using smart contracts on Ethereum Sepolia with Remix and a React frontend.*

---

## 2. Architecture

```
Owner (faculty)          Students
    │                        │
    ├─ createSession ────────┤
    ├─ closeSession          ├─ checkIn(sessionId)
    │                        │
    └────────── AttendanceCheckIn.sol (Sepolia) ──────────┘
                         │
                    getSession() → name, open, count
```

---

## 3. Learning outcomes

- Session lifecycle: create → open → check-in → close  
- Using `block.timestamp` as start time  
- Preventing double check-in with a mapping  
- Role split: owner vs student wallets  

---

## 4. Contract — deep dive

### Session struct

```solidity
struct Session {
    string name;
    uint256 startTime;
    bool open;
    uint256 count;
    bool exists;
}
```

| Field | Purpose |
|-------|---------|
| `name` | Human label, e.g. `"Web3 Lab Hour"` |
| `startTime` | Set to `block.timestamp` at creation |
| `open` | `true` accepts check-ins |
| `count` | Number of unique wallets checked in |
| `exists` | Distinguishes real sessions from empty slots |

### Key functions

| Function | Who | What |
|----------|-----|------|
| `createSession(name)` | Owner | Opens a new session, returns id |
| `checkIn(sessionId)` | Anyone | Marks presence once if open |
| `closeSession(sessionId)` | Owner | Sets `open = false` |
| `getSession(id)` | Anyone (view) | Returns all session fields |
| `checkedIn[id][addr]` | Anyone (view) | Whether a wallet checked in |

### Line-by-line concepts

1. **`onlyOwner`** — only deployer creates/closes sessions (faculty control).  
2. **`require(sessions[id].open)`** — no check-ins after close.  
3. **`require(!checkedIn[id][msg.sender])`** — one wallet = one attendance mark.  
4. **`count += 1`** — aggregate metric for screenshots/reports.  
5. **Events** `SessionCreated`, `CheckedIn`, `SessionClosed` — Etherscan evidence.

---

## 5. Remix deploy

1. Paste `AttendanceCheckIn.sol` into Remix  
2. Compiler `0.8.20+`  
3. Injected Provider → Sepolia → Deploy (**no constructor args**)  
4. Copy address → frontend `/project/attendance`  

---

## 6. Frontend walkthrough

1. Connect MetaMask (owner account)  
2. Paste address → Save & Use  
3. Create session: `"Blockchain Lab - 6 Oct"`  
4. Switch to a student account → **Check in**  
5. Read session → note `Count`  
6. Owner → **Close session** → student check-in should fail  

---

## 7. Submission checklist

- [ ] Session create tx  
- [ ] At least one check-in tx from a different wallet  
- [ ] Screenshot of `getSession` / UI count  
- [ ] Close session tx (optional but strong)  
- [ ] Contract address + Etherscan  
- [ ] Notes: what `open` and `checkedIn` prevent  

---

## 8. Common errors

| Error | Cause / fix |
|-------|-------------|
| `Only owner` | Wrong wallet for create/close |
| `Session closed` | Re-open by creating a **new** session |
| `Already checked in` | Same wallet tried twice |
| `Session missing` | Wrong session id |

---

## 9. Extensions

- Require check-in within N minutes of `startTime`  
- Export attendance list via events indexing  
- QR code that deep-links session id for students  

---

## 10. Viva questions

1. Why store attendance on blockchain instead of Google Forms?  
2. Can the owner fake a student’s check-in? (Yes — owner could use that wallet; discuss trust assumptions.)  
3. What happens to historical `count` after `closeSession`?  

---

## Files

| File | Role |
|------|------|
| `AttendanceCheckIn.sol` | Remix deploy target |
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

