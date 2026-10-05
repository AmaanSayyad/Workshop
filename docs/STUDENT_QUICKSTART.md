# Student quick start — any mini-project

Yes: each frontend runs on its own. Deploy the matching `.sol` in Remix, paste the address into the DApp, click **Connect contract**.

## Steps (same for all 10 projects)

### 1. Run the frontend

```bash
cd projects/01-voting/frontend   # or 02-attendance, 03-certificate, …
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 2. Deploy the contract in Remix

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create a file and paste the project’s `.sol` (e.g. `CampusVoting.sol`)
3. Compiler → **0.8.20+** → Compile
4. Deploy & Run → Environment: **Injected Provider - MetaMask**
5. Network in MetaMask: **Sepolia**
6. Click **Deploy** → approve in MetaMask
7. Under **Deployed Contracts**, copy the address (`0x…`)

### 3. Wire the DApp

1. In the frontend, find **Connect your contract**
2. Paste the Remix address
3. Click **Connect contract**
4. The app checks that bytecode exists on-chain, then saves the address
5. Click **Sign in** (MetaMask) if you haven’t already
6. Use the app — every button talks to *your* contract

Optional: **Use workshop demo** connects the instructor’s pre-deployed Sepolia address (no Remix needed for a quick try).

### 4. Redeploy?

Click **Change** / **Disconnect**, paste the new Remix address, connect again.

## Project folders

| Folder | Contract | Frontend |
|--------|----------|----------|
| `01-voting` | `CampusVoting.sol` | CampusVote |
| `02-attendance` | `AttendanceCheckIn.sol` | CheckIn |
| `03-certificate` | `CertificateRegistry.sol` | Credence |
| `04-complaints` | `ComplaintTracker.sol` | TicketBox |
| `05-crowdfund` | `CampusCrowdfund.sol` | FundLab |
| `06-peer-review` | `PeerReview.sol` | PeerStars |
| `07-scholarship` | `ScholarshipLedger.sol` | GrantBook |
| `08-inventory` | `InventoryLog.sol` | LabKit |
| `09-poll` | `CampusPoll.sol` | PulsePoll |
| `10-ai-model` | `AIModelRegistry.sol` | ModelMark |

## Need help?

| Problem | Fix |
|---------|-----|
| `npm install` fails | Install [Node.js 18+](https://nodejs.org) |
| Connect says “No contract found” | Deploy on **Sepolia** (not Remix VM), copy the new address |
| Buttons disabled | Contract connected + Sign in + MetaMask on Sepolia |
| Wrong contract / old address | Change → Disconnect → paste new address |
