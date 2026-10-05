# Solidity basics (read this before any mini-project)

Every `.sol` file in this repo uses the same building blocks. Learn them once here, then open any contract.

## 1. `// SPDX-License-Identifier: MIT`

- **What:** License for the source code (MIT = permissive).
- **Why written:** Remix / compilers warn without it. Helps others know reuse rules.
- **On-chain?** No — not stored in bytecode as logic.

## 2. `pragma solidity ^0.8.20;`

- **What:** Compiler version requirement.
- **Why:** Solidity syntax changes between versions. `^0.8.20` = “0.8.20 or newer 0.8.x”.
- **Why 0.8?** Safer arithmetic (overflow reverts by default).
- **Remix tip:** Match Compiler dropdown to `0.8.20+`.

## 3. `contract Name { ... }`

- **What:** Deployable program on Ethereum (like a class instance that never shuts down).
- **After deploy:** Gets an **address**. Users call functions with MetaMask.

## 4. Types you’ll see

| Type | Meaning |
|------|---------|
| `address` | Wallet / contract id (`0x` + 40 hex chars) |
| `uint256` | Whole number ≥ 0 (up to huge size) |
| `bool` | `true` / `false` |
| `string` | Text |
| `bytes32` | Fixed 32-byte value (often a hash) |
| `enum` | Named options (Open, Closed…) |

## 5. `struct`

Custom bundle of fields — like an object shape:

```solidity
struct Proposal {
    string title;
    uint256 yesVotes;
}
```

## 6. `mapping`

On-chain dictionary:

```solidity
mapping(uint256 => Proposal) public proposals;
// proposals[0] → first proposal
```

Cannot iterate keys unless you track them (e.g. with `proposalCount`).

## 7. Visibility

| Keyword | Who can call |
|---------|----------------|
| `public` | Anyone + auto getter for state vars |
| `external` | Only from outside the contract |
| `internal` | This contract + children |
| `private` | Only this contract |

## 8. `msg.sender` / `msg.value`

- `msg.sender` → wallet that called the function
- `msg.value` → ETH sent with the call (in wei)

## 9. `require(condition, "error")`

If condition is false → **revert** whole transaction (state undone). Used for access control & validation.

## 10. `modifier`

Reusable preamble:

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _; // run the function body
}
```

## 11. `constructor`

Runs **once** at deploy. Often sets `owner = msg.sender`.

## 12. `event` + `emit`

Logs for explorers / apps. Cheap history. `indexed` fields are filterable.

## 13. `view` / `pure` / `payable`

| Keyword | Meaning |
|---------|---------|
| `view` | Reads state, doesn’t change it (UI calls are free) |
| `pure` | No state read/write |
| `payable` | Function can receive ETH |

## 14. `memory` vs `calldata` vs `storage`

| Location | Use |
|----------|-----|
| `storage` | Permanent contract data |
| `memory` | Temporary copy |
| `calldata` | Read-only function inputs (cheap for `external`) |

## 15. Gas (why MetaMask pops up)

Changing storage costs gas. Reading with `view` from a wallet UI usually does not.

---

Next: open any `projects/*/…sol` — comments above each line explain that project’s logic.
