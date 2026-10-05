# Mini-Project 03 — Certificate / Credential Registry

> **Syllabus fit:** Exp 6, 9, 10 — excellent for academic writeups  
> **Contract:** [`CertificateRegistry.sol`](./CertificateRegistry.sol)  
> **Frontend route:** `/project/certificate`  
> **Network:** Sepolia  
> **Difficulty:** Beginner–Intermediate

---

## 1. Problem statement

Paper certificates are easy to forge. Build a registry where the college (owner) **issues** a certificate by storing a **document hash** on-chain, and anyone can **verify** authenticity later.

You do **not** upload the PDF to Ethereum (too expensive). You store `keccak256` of the certificate content — a 32-byte fingerprint.

**Report one-liner:** *On-chain certificate issuance and verification using content hashing on Ethereum Sepolia.*

---

## 2. Why hashing?

| Approach | On-chain size | Privacy | Cost |
|----------|---------------|---------|------|
| Store full PDF | Huge | Public forever | Very high |
| Store `bytes32` hash | 32 bytes | Content stays off-chain | Cheap |

If someone alters even one character of the certificate text, the hash changes → verification fails.

---

## 3. Architecture

```
Owner (issuer)                         Verifier (anyone)
     │                                        │
     ├─ issueCertificate(name, course, hash)  ├─ verify(hash)
     ├─ revokeCertificate(id)                 │
     └────────── CertificateRegistry ─────────┘
```

Frontend helper: `hashText(text)` = `keccak256(toUtf8Bytes(text))` via ethers.

---

## 4. Contract — deep dive

### Certificate struct

```solidity
struct Certificate {
    string studentName;
    string courseName;
    bytes32 docHash;
    uint256 issuedAt;
    bool revoked;
    bool exists;
}
```

### Uniqueness

```solidity
mapping(bytes32 => bool) private hashRegistered;
```

Same hash cannot be issued twice — prevents duplicate certificates for identical content.

### Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `issueCertificate(student, course, hash)` | Owner | Register credential |
| `revokeCertificate(id)` | Owner | Soft-invalidate (history remains) |
| `verify(hash)` | Public view | Returns valid?, id, names, revoked? |
| `getCertificate(id)` | Public view | Full record by id |

### Line-by-line concepts

1. **`bytes32`** — fixed 32-byte hash type.  
2. **`require(!hashRegistered[docHash])`** — uniqueness.  
3. **`revoked` flag** — do not delete; auditors can still see history.  
4. **`verify` returns tuple** — UI can bind fields easily.  
5. **`issuedAt = block.timestamp`** — when it was issued on-chain.

---

## 5. Remix deploy

1. Paste `CertificateRegistry.sol`  
2. Compile `0.8.20+`  
3. Deploy on Sepolia (no constructor args)  
4. Copy address → `/project/certificate`  

### Optional: hash in Remix

In Remix console you can also compute hashes, but the workshop UI hashes live as you type.

---

## 6. Frontend walkthrough

1. Connect **owner** wallet  
2. Paste address → Save  
3. Edit certificate text → watch live `keccak256` update  
4. Fill student + course → **Issue (owner)**  
5. **Verify hash** → should show Valid  
6. Change one letter in the text → Verify fails (hash changed) — great screenshot for report  

---

## 7. Submission checklist

- [ ] Issue tx + Etherscan  
- [ ] Screenshot of hash + verify success  
- [ ] Screenshot of verify fail after tampering text (optional, impressive)  
- [ ] Explain hashing vs storing PDF in your report  
- [ ] Contract address  

---

## 8. Common errors

| Error | Fix |
|-------|-----|
| `Only owner` | Issue with deployer wallet |
| `Hash already registered` | Change certificate text slightly |
| `Empty hash` | Don’t use empty string content |
| Verify buttons disabled | Connect MetaMask |

---

## 9. Extensions

- Store IPFS CID next to hash  
- Batch issue for a whole class  
- Role: multiple issuers (`mapping` of authorized issuers)  

---

## 10. Viva questions

1. Why not store the entire certificate on Ethereum?  
2. What is collision resistance (briefly)?  
3. Difference between revoke and delete?  

---

## Files

| File | Role |
|------|------|
| `CertificateRegistry.sol` | Deploy in Remix |
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

