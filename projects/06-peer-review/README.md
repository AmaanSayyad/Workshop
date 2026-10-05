# Mini-Project 06 — Peer Review / Project Rating

> **Syllabus fit:** Exp 9, 10  
> **Contract:** [`PeerReview.sol`](./PeerReview.sol)  
> **Frontend route:** `/project/peer-review`  
> **Network:** Sepolia  
> **Difficulty:** Beginner–Intermediate

---

## 1. Problem statement

Students submit mini-projects and need peer feedback. Build a DApp where:

- Anyone submits a project title
- Peers rate **1–5 stars** once (with optional comment)
- Self-rating is blocked
- Average score is computed on-chain (as integer ×100)

**Report one-liner:** *Decentralized peer-review rating system for student projects on Ethereum Sepolia.*

---

## 2. Architecture

```
Submitter (wallet A)              Rater (wallet B)
        │                                │
        ├─ submitProject(title)          ├─ rate(id, score, comment)
        │                                │
        └────────── PeerReview.sol ──────┘
                       │
              getAverage(id) → avg*100, count
```

**You need two MetaMask accounts** for a proper demo.

---

## 3. Contract — deep dive

### Project struct

```solidity
struct Project {
    string title;
    address submitter;
    uint256 totalScore;
    uint256 ratingCount;
    bool exists;
}
```

### Rating struct

```solidity
struct Rating {
    uint8 score;      // 1–5
    string comment;
    bool exists;
}
```

### Important guardrails

```solidity
require(score >= 1 && score <= 5, "Score 1-5");
require(!ratings[projectId][msg.sender].exists, "Already rated");
require(msg.sender != projects[projectId].submitter, "Cannot self-rate");
```

### Average without floats

Solidity has no floats. `getAverage` returns:

```text
avgTimes100 = (totalScore * 100) / ratingCount
```

Example: scores 5 and 4 → total 9, count 2 → `450` → UI shows **4.50**.

### Line-by-line concepts

1. Two-account workflow for realistic demos.  
2. `uint8` for small score range.  
3. Integer average trick for UI decimals.  
4. Self-rate prevention = fairness rule encoded in code.  

---

## 4. Remix deploy

1. Paste `PeerReview.sol`  
2. Compile & deploy (no constructor args)  
3. Address → `/project/peer-review`  

---

## 5. Frontend walkthrough

1. Account A → Submit project `"My Voting DApp"`  
2. Switch MetaMask to Account B  
3. Rate project id `0` with score `5` + comment  
4. **Read average** → screenshot  

---

## 6. Submission checklist

- [ ] submitProject tx (wallet A)  
- [ ] rate tx (wallet B)  
- [ ] Screenshot of average  
- [ ] Explain why self-rate is blocked  
- [ ] Contract address  

---

## 7. Common errors

| Error | Fix |
|-------|-----|
| `Cannot self-rate` | Switch MetaMask account |
| `Already rated` | Use another rater wallet |
| `Score 1-5` | Don’t enter 0 or 6 |
| `Missing project` | Submit first |

---

## 8. Extensions

- Weighted ratings by faculty wallet  
- Reveal comments only after N ratings  
- Link project id to GitHub URL string  

---

## 9. Viva questions

1. Why can’t Solidity return `4.5` directly as a float?  
2. How does the contract know who submitted the project?  
3. Is anonymity possible? (Pseudonymous wallets — discuss.)  

---

## Files

| File | Role |
|------|------|
| `PeerReview.sol` | Remix deploy |
| `README.md` | This guide |
