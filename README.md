# MHSSCE Web3 DApp Workshop

Hands-on **Blockchain & DApp Development** materials for  
Anjuman-I-Islam’s M. H. Saboo Siddik College of Engineering — CSE (AI & ML).

Instructor: [Amaan Sayyad](https://github.com/AmaanSayyad) · [Portfolio](https://amaansayyad.com)

Each mini-project is a **standalone product app**: its own Solidity contract, a consumer-style React UI (wallet sign-in, human workflows, Settings for one-time deployment connection), and an in-depth README for the lab report.

Repo: [github.com/AmaanSayyad/Workshop](https://github.com/AmaanSayyad/Workshop)

---

## Structure

```text
projects/
  01-voting/          CampusVote app
  02-attendance/      CheckIn Lab app
  03-certificate/     Credence app
  04-complaints/      CampusDesk app
  05-crowdfund/       Fundraise app
  06-peer-review/     PeerMark app
  07-scholarship/     GrantBook app
  08-inventory/       KitKeep app
  09-poll/            PulsePoll app
  10-ai-model/        ModelProof app
docs/                 Workshop run sheet + checklists
```

Every project folder contains:

| File / folder | Purpose |
|---------------|---------|
| `*.sol` | Deploy in Remix on Sepolia |
| `README.md` | Deep guide (architecture, line-by-line, viva, submission) |
| `frontend/` | Standalone Vite + React + ethers app |

---

## Student flow (any one project)

1. Open that project’s `README.md` and pick the story for your report  
2. Deploy the `.sol` file in [Remix](https://remix.ethereum.org) → Sepolia  
3. Run **only that project’s** frontend:

```bash
cd projects/0X-name/frontend
npm install
npm run dev
```

4. Connect MetaMask → paste contract address → use the app  
5. Submit Etherscan links + screenshots for Exp 9 & 10  

---

## Apps at a glance

| # | Product | Folder | Look & feel |
|---|---------|--------|-------------|
| 01 | **CampusVote** | `01-voting` | Election booth · gold on charcoal |
| 02 | **CheckIn Lab** | `02-attendance` | Lab attendance · teal |
| 03 | **Credence** | `03-certificate` | Diploma registry · navy/gold |
| 04 | **CampusDesk** | `04-complaints` | Service desk · slate/amber |
| 05 | **Fundraise** | `05-crowdfund` | Campaign tips · emerald |
| 06 | **PeerMark** | `06-peer-review` | Ratings · warm coral |
| 07 | **GrantBook** | `07-scholarship` | Terminal ledger · green mono |
| 08 | **KitKeep** | `08-inventory` | Warehouse · industrial |
| 09 | **PulsePoll** | `09-poll` | Survey · blue |
| 10 | **ModelProof** | `10-ai-model` | ML provenance · cyan terminal |

---

## Syllabus

| Exp | Covered |
|-----|---------|
| 5–6 Remix, MetaMask, Sepolia | Yes |
| 9–10 Blockchain app / DApp mini-project | Yes (pick one) |
| 7–8 Hyperledger | Separate case study (not this repo) |

---

## Docs

- [`docs/WORKSHOP_RUN_SHEET.md`](./docs/WORKSHOP_RUN_SHEET.md)
- [`docs/SUBMISSION_CHECKLIST.md`](./docs/SUBMISSION_CHECKLIST.md)
- [`docs/LINE_BY_LINE.md`](./docs/LINE_BY_LINE.md)

## License

MIT
