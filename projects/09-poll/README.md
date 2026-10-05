# Mini-Project 09 — Campus Event Poll / Prediction

> **Syllabus fit:** Exp 6, 9, 10  
> **Contract:** [`CampusPoll.sol`](./CampusPoll.sol)  
> **Frontend route:** `/project/poll`  
> **Network:** Sepolia  
> **Difficulty:** Intermediate (dynamic arrays)

---

## 1. Problem statement

Build a **multi-option campus poll** (event timing, fest theme, hackathon slot) where:

- Owner creates a question with **2–5 options**
- Each wallet votes once for an option index
- Results are public; owner can close the poll
- No real money (prediction-style polling only)

**Report one-liner:** *Multi-option decentralized polling DApp for campus decisions on Ethereum Sepolia.*

---

## 2. Architecture

```
Owner                              Voters
  │                                  │
  ├─ createPoll(question, options[]) ├─ vote(pollId, optionIndex)
  ├─ closePoll(id)                   │
  └──────────── CampusPoll ──────────┘
                     │
                getPoll() → options[], votes[]
```

---

## 3. Contract — deep dive

### Poll struct with arrays

```solidity
struct Poll {
    string question;
    string[] options;
    uint256[] votes;
    bool open;
    bool exists;
}
```

`options[i]` aligns with `votes[i]` — parallel arrays.

### createPoll constraints

```solidity
require(options.length >= 2 && options.length <= 5, "2-5 options");
```

Keeps gas and UI simple for a lab session.

### vote

```solidity
require(optionIndex < polls[pollId].options.length, "Bad option");
hasVoted[pollId][msg.sender] = true;
polls[pollId].votes[optionIndex] += 1;
```

### Line-by-line concepts

1. Dynamic arrays in storage (`push` in a loop at creation).  
2. Option **index** voting (0-based).  
3. One-vote mapping like the Voting project, but multi-choice.  
4. Closing freezes results for the report.  

---

## 4. Remix deploy

1. Paste `CampusPoll.sol`  
2. Deploy (no constructor args)  
3. Frontend `/project/poll`  

### Creating a poll from Remix (optional)

If testing in Remix before UI:

```text
question: "Best hackathon day?"
options: ["Friday","Saturday","Sunday"]
```

---

## 5. Frontend walkthrough

1. Owner creates poll  
   - Question: `Best slot for hackathon?`  
   - Options: `Friday,Saturday,Sunday` (comma-separated in UI)  
2. Students vote with option index `0`, `1`, or `2`  
3. Read results → screenshot tallies  
4. Owner closes poll  

---

## 6. Submission checklist

- [ ] createPoll tx  
- [ ] ≥2 vote txs from different wallets  
- [ ] Results screenshot  
- [ ] closePoll tx  
- [ ] Contract address  

---

## 7. Common errors

| Error | Fix |
|-------|-----|
| `2-5 options` | Provide between 2 and 5 comma-separated options |
| `Already voted` | Switch wallet |
| `Bad option` | Index must be `< options.length` |
| `Poll closed` | Create a new poll |
| `Only owner` | Deployer creates/closes |

---

## 8. Extensions

- Quadratic voting (advanced)  
- Commit–reveal for private voting  
- Auto-close at timestamp  

---

## 9. Viva questions

1. Difference between this poll and Project 01 yes/no voting?  
2. What does option index `0` mean?  
3. Why limit to 5 options in a student lab?  

---

## Files

| File | Role |
|------|------|
| `CampusPoll.sol` | Remix deploy |
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

