# Line-by-line study guide

This mirrors the in-app explanation panels and the per-project READMEs under `projects/`.

**Prefer the project folder README** for full depth (architecture, Remix, viva, submission). Use this file as a quick cross-project cheat sheet while reading `projects/*/…sol` and `frontend/src/`.

## Shared DApp pipeline (all 10 projects)

1. **Solidity contract** — business rules + storage on Ethereum.
2. **Remix compile/deploy** — bytecode goes on Sepolia; you get an address.
3. **ABI** — JSON/human list of functions the frontend may call (`frontend/src/lib/abis.ts`).
4. **MetaMask** — signs transactions as `msg.sender`.
5. **ethers `Contract`** — `getContract(address, abi, signer)` in `frontend/src/lib/ethereum.ts`.
6. **UI panel** — forms in `frontend/src/dapps/panels.tsx` call write/read methods.
7. **Etherscan** — proof for lab submission.

## Contract 01 — Voting (`CampusVoting`)

| Line / idea | Meaning |
|-------------|---------|
| `pragma solidity ^0.8.20` | Language version for Remix compiler |
| `address public owner` | Deployer wallet; auto getter |
| `struct Proposal` | Title + yes/no counts |
| `mapping(uint256 => Proposal)` | Id → proposal storage |
| `hasVoted[id][addr]` | One vote per wallet |
| `onlyOwner` modifier | Guard for `createProposal` |
| `constructor` | Sets `owner = msg.sender` |
| `vote(id, support)` | Increments yes or no |
| `getProposal` | Free view for UI |

## Contract 02 — Attendance

| Idea | Meaning |
|------|---------|
| `Session` | Named event/class with open flag |
| `createSession` | Owner opens attendance window |
| `checkIn` | Student wallet marks presence once |
| `closeSession` | Stops further check-ins |

## Contract 03 — Certificate registry

| Idea | Meaning |
|------|---------|
| `bytes32 docHash` | keccak256 fingerprint of document text |
| `issueCertificate` | Owner registers student + course + hash |
| `verify` | Public authenticity check |
| `revokeCertificate` | Soft-invalidate without deleting |

## Contract 04 — Complaint tracker

| Idea | Meaning |
|------|---------|
| `enum Status` | Open / InProgress / Resolved / Closed |
| `createTicket` | Any wallet opens a ticket |
| `updateStatus` | Owner advances workflow |

## Contract 05 — Crowdfund

| Idea | Meaning |
|------|---------|
| `constructor(name, goalWei)` | Set at Remix deploy time |
| `donate() payable` | Attach ETH via `msg.value` |
| `withdraw` | Owner pulls balance, closes |

## Contract 06 — Peer review

| Idea | Meaning |
|------|---------|
| `submitProject` | List a project title |
| `rate` | 1–5 once; no self-rate |
| `getAverage` | avg×100 for two-decimal UI |

## Contract 07 — Scholarship ledger

| Idea | Meaning |
|------|---------|
| `recordGrant` | Public transparency row |
| `totalRecorded` | Sum of amounts |

## Contract 08 — Inventory

| Idea | Meaning |
|------|---------|
| `addItem` | Register equipment + custodian |
| `transferCustody` | Hand to another wallet |
| `updateLocation` | Update physical location string |

## Contract 09 — Campus poll

| Idea | Meaning |
|------|---------|
| `createPoll(question, options[])` | 2–5 options |
| `vote(pollId, optionIndex)` | One vote per wallet |
| `getPoll` | Returns options + vote counts |

## Contract 10 — AI model registry

| Idea | Meaning |
|------|---------|
| `registerModel` | Name, version, framework, content hash |
| `verifyModel` | Provenance check by hash |
| AIML angle | On-chain model card / dataset fingerprint |

## Frontend files to study

| File | Role |
|------|------|
| `src/data/projects.ts` | Catalog of all 10 problems |
| `src/data/explanations.ts` | Line-by-line copy shown in UI |
| `src/lib/abis.ts` | Function signatures for ethers |
| `src/lib/ethereum.ts` | Connect, Sepolia switch, hashing helpers |
| `src/context/WalletContext.tsx` | Shared MetaMask state |
| `src/dapps/panels.tsx` | All interactive forms |
| `src/pages/HomePage.tsx` | Project selector |
| `src/pages/ProjectPage.tsx` | Checklist + panel + explanations |

## ethers call pattern (every write action)

```ts
const c = getContract(address, someAbi, signer)
const tx = await c.someMethod(...args)
await tx.wait()
```

## Hashing pattern (certificates + AI models)

```ts
import { keccak256, toUtf8Bytes } from 'ethers'
const hash = keccak256(toUtf8Bytes(text))
```

Same idea as Solidity `keccak256(bytes(...))` for UTF-8 text.
