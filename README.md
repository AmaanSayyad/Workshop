# MHSSCE Web3 DApp Workshop

Hands-on **Blockchain & DApp Development** lab materials for  
[Anjuman-I-Islam’s M. H. Saboo Siddik College of Engineering](https://www.mhssce.ac.in/) — Department of CSE (AI & ML).

Instructor: [Amaan Sayyad](https://github.com/AmaanSayyad) · [amaansayyad.com](https://amaansayyad.com)

Students pick **any one** of **10 mini-projects**, deploy its Solidity contract on **Ethereum Sepolia** (Remix + MetaMask), connect the shared React frontend, and complete **Exp 9 & 10**.

---

## Repository structure

```text
├── README.md                 ← you are here
├── frontend/                 ← shared React + ethers UI (all 10 projects)
├── docs/                     ← run sheet, submission checklist, study guide
└── projects/
    ├── 01-voting/            ← CampusVoting.sol + in-depth README
    ├── 02-attendance/
    ├── 03-certificate/
    ├── 04-complaints/
    ├── 05-crowdfund/
    ├── 06-peer-review/
    ├── 07-scholarship/
    ├── 08-inventory/
    ├── 09-poll/
    └── 10-ai-model/
```

Each project folder is **self-contained for learning**: the `.sol` file to deploy + a detailed `README.md` (problem, architecture, line-by-line Solidity, Remix steps, frontend steps, submission, viva Qs).

---

## Mini-projects

| # | Folder | Title | Frontend route |
|---|--------|-------|----------------|
| 01 | [`projects/01-voting`](./projects/01-voting) | College / Club Voting | `/project/voting` |
| 02 | [`projects/02-attendance`](./projects/02-attendance) | Attendance Check-in | `/project/attendance` |
| 03 | [`projects/03-certificate`](./projects/03-certificate) | Certificate Registry | `/project/certificate` |
| 04 | [`projects/04-complaints`](./projects/04-complaints) | Complaint Tracker | `/project/complaints` |
| 05 | [`projects/05-crowdfund`](./projects/05-crowdfund) | Crowdfunding / Tip Jar | `/project/crowdfund` |
| 06 | [`projects/06-peer-review`](./projects/06-peer-review) | Peer Review Ratings | `/project/peer-review` |
| 07 | [`projects/07-scholarship`](./projects/07-scholarship) | Scholarship Ledger | `/project/scholarship` |
| 08 | [`projects/08-inventory`](./projects/08-inventory) | Inventory Custody Log | `/project/inventory` |
| 09 | [`projects/09-poll`](./projects/09-poll) | Campus Poll | `/project/poll` |
| 10 | [`projects/10-ai-model`](./projects/10-ai-model) | AI Model Hash Registry | `/project/ai-model` |

---

## Quick start

### 1. MetaMask + Sepolia ETH

Install MetaMask → network **Sepolia** → faucet (or ask instructor).

### 2. Deploy your chosen contract

1. Open the project folder README (e.g. `projects/01-voting/README.md`)  
2. Copy the `.sol` file into [Remix](https://remix.ethereum.org)  
3. Compiler **0.8.20+** → Injected Provider → Deploy on Sepolia  
4. Crowdfund only: constructor `"Campus Innovation Fund", 1000000000000000`  

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Connect MetaMask → open your project card → paste contract address → **Save & Use**.

---

## Syllabus mapping

| Lab exp | Covered? | How |
|---------|----------|-----|
| 5 Deploy on testnet + interact | Yes | Sepolia + frontend |
| 6 Remix + MetaMask | Yes | Every project |
| 7 Hyperledger Fabric | No | Separate case-study lab |
| 8 Platform case studies | Partial | Discuss in report |
| 9 Creating a blockchain app | Yes | Full flow |
| 10 DApp mini-project | Yes | Main deliverable |

---

## Docs

- [`docs/WORKSHOP_RUN_SHEET.md`](./docs/WORKSHOP_RUN_SHEET.md) — instructor timeline  
- [`docs/SUBMISSION_CHECKLIST.md`](./docs/SUBMISSION_CHECKLIST.md) — student marks sheet  
- [`docs/LINE_BY_LINE.md`](./docs/LINE_BY_LINE.md) — cross-project study notes  

---

## Stack

Solidity `^0.8.20` · React + TypeScript + Vite · ethers v6 · Sepolia

## License

MIT — classroom use for MHSSCE Web3 workshop.
