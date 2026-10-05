# Mini-Project 10 — AI Model / Dataset Hash Registry

> **Syllabus fit:** Exp 9, 10 — **best fit for CSE (AI & ML)**  
> **Contract:** [`AIModelRegistry.sol`](./AIModelRegistry.sol)  
> **Frontend route:** `/project/ai-model`  
> **Network:** Sepolia  
> **Difficulty:** Beginner–Intermediate

---

## 1. Problem statement

ML models and datasets are easy to copy without attribution. Build a **provenance registry** where researchers register:

- Model name + version  
- Framework (PyTorch, TensorFlow, …)  
- `keccak256` content hash of a model card / manifest  
- Publisher wallet (`msg.sender`)

Anyone can later **verify** a hash to see if that exact artifact was registered and by whom.

**Report one-liner:** *Blockchain-based AI model provenance registry using content hashing on Ethereum Sepolia — bridging AIML and Web3.*

---

## 2. Why this fits AIML students

| AIML concept | Blockchain mapping |
|--------------|--------------------|
| Model card / README | Manifest string hashed |
| Dataset fingerprint | Same hashing idea |
| Experiment tracking | `version` + `publishedAt` |
| Authorship | `publisher` address |

You are **not** storing model weights on-chain (too large). You store a **fingerprint**.

---

## 3. Architecture

```
Publisher (anyone)                 Verifier
        │                              │
        ├─ registerModel(...)          ├─ verifyModel(hash)
        │                              ├─ getModel(id)
        └──────── AIModelRegistry ─────┘
```

Unlike certificates (owner-only issue), **any wallet** can register a model — good for open research demos.

---

## 4. Contract — deep dive

### ModelRecord struct

```solidity
struct ModelRecord {
    string name;
    string version;
    bytes32 contentHash;
    string framework;
    address publisher;
    uint256 publishedAt;
    bool exists;
}
```

### Uniqueness

```solidity
mapping(bytes32 => bool) private hashRegistered;
require(!hashRegistered[contentHash], "Hash already registered");
```

Same weights/manifest hash cannot be claimed twice.

### Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `registerModel` | Anyone | Publish provenance |
| `verifyModel` | Public view | Lookup by hash |
| `getModel` | Public view | Lookup by id |

### Line-by-line concepts

1. AIML provenance ≠ hosting files on Ethereum.  
2. `publisher = msg.sender` — cryptographic attribution to a keypair.  
3. Hash uniqueness prevents duplicate claims.  
4. Frontend live-hashes the manifest as you type (same as certificates).  

---

## 5. Remix deploy

1. Paste `AIModelRegistry.sol`  
2. Compile `0.8.20+`  
3. Deploy on Sepolia (no constructor args)  
4. Frontend `/project/ai-model`  

---

## 6. Frontend walkthrough

1. Connect MetaMask  
2. Save contract address  
3. Fill:
   - Name: `CampusSentimentBERT`  
   - Version: `1.0.0`  
   - Framework: `PyTorch`  
   - Manifest text (auto-hashed)  
4. **Register model**  
5. **Verify hash** → Found + publisher address  
6. Change one character in manifest → verify fails — great report screenshot  

### Example manifest

```text
model=CampusSentimentBERT;dataset=mhssce-reviews-2026;acc=0.91;seed=42
```

---

## 7. Submission checklist

- [ ] registerModel tx  
- [ ] verifyModel screenshot (success)  
- [ ] Optional: tamper test screenshot (fail)  
- [ ] Writeup linking AIML model cards to hashing  
- [ ] Contract address + Etherscan  
- [ ] Discuss: what should be hashed (weights vs card)?  

---

## 8. Common errors

| Error | Fix |
|-------|-----|
| `Hash already registered` | Change version/manifest |
| `Empty hash` / `Name required` | Fill fields |
| Verify not found | Exact same manifest text required |

---

## 9. Extensions (AIML-flavored)

- Store dataset hash separately from model hash  
- Link to Hugging Face URL string  
- Faculty attestation: second signature/role for “approved models”  
- Integrate with IPFS CID field  

---

## 10. Viva questions

1. Why not upload `.pt` / `.h5` weights to the smart contract?  
2. If two people register different names with the same hash, what happens?  
3. How does this help academic integrity for ML coursework?  

---

## Files

| File | Role |
|------|------|
| `AIModelRegistry.sol` | Remix deploy |
| `README.md` | This guide |
