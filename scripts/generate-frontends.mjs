/**
 * Generates 10 standalone Vite+React+ethers frontends with distinct UX.
 * Run: node scripts/generate-frontends.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const apps = [
  {
    id: '01-voting',
    slug: 'voting',
    pkg: 'campus-vote',
    title: 'CampusVote',
    tagline: 'Transparent campus elections on Sepolia',
    contractFile: 'CampusVoting.sol',
    contractName: 'CampusVoting',
    theme: {
      font: 'DM Sans',
      display: 'Fraunces',
      bg: '#0b1210',
      surface: '#14201a',
      ink: '#ecf4ee',
      muted: '#9bb5a6',
      accent: '#d4a017',
      accent2: '#3dd68c',
      radius: '12px',
      vibe: 'ballot',
    },
    abi: [
      'function owner() view returns (address)',
      'function proposalCount() view returns (uint256)',
      'function createProposal(string title) returns (uint256)',
      'function vote(uint256 proposalId, bool support)',
      'function getProposal(uint256 proposalId) view returns (string title, uint256 yesVotes, uint256 noVotes, bool exists)',
      'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
    ],
    panel: 'voting',
  },
  {
    id: '02-attendance',
    slug: 'attendance',
    pkg: 'checkin-lab',
    title: 'CheckIn Lab',
    tagline: 'Wallet-proven class & event attendance',
    contractFile: 'AttendanceCheckIn.sol',
    contractName: 'AttendanceCheckIn',
    theme: {
      font: 'Manrope',
      display: 'Space Grotesk',
      bg: '#06151a',
      surface: '#0d2430',
      ink: '#e7f6fb',
      muted: '#7fa8b8',
      accent: '#19c6b0',
      accent2: '#5ec8ff',
      radius: '16px',
      vibe: 'lab',
    },
    abi: [
      'function owner() view returns (address)',
      'function sessionCount() view returns (uint256)',
      'function createSession(string name) returns (uint256)',
      'function closeSession(uint256 sessionId)',
      'function checkIn(uint256 sessionId)',
      'function getSession(uint256 sessionId) view returns (string name, uint256 startTime, bool open, uint256 count, bool exists)',
    ],
    panel: 'attendance',
  },
  {
    id: '03-certificate',
    slug: 'certificate',
    pkg: 'credence',
    title: 'Credence',
    tagline: 'Issue & verify academic credentials on-chain',
    contractFile: 'CertificateRegistry.sol',
    contractName: 'CertificateRegistry',
    theme: {
      font: 'Source Sans 3',
      display: 'Libre Baskerville',
      bg: '#0a1628',
      surface: '#122240',
      ink: '#f3efe6',
      muted: '#a8b4c7',
      accent: '#c9a227',
      accent2: '#8ec5ff',
      radius: '8px',
      vibe: 'diploma',
    },
    abi: [
      'function owner() view returns (address)',
      'function issueCertificate(string studentName, string courseName, bytes32 docHash) returns (uint256)',
      'function revokeCertificate(uint256 id)',
      'function verify(bytes32 docHash) view returns (bool valid, uint256 id, string studentName, string courseName, bool revoked)',
      'function getCertificate(uint256 id) view returns (string studentName, string courseName, bytes32 docHash, uint256 issuedAt, bool revoked, bool exists)',
    ],
    panel: 'certificate',
  },
  {
    id: '04-complaints',
    slug: 'complaints',
    pkg: 'campus-desk',
    title: 'CampusDesk',
    tagline: 'Lost & found and facility tickets, on-chain',
    contractFile: 'ComplaintTracker.sol',
    contractName: 'ComplaintTracker',
    theme: {
      font: 'IBM Plex Sans',
      display: 'IBM Plex Sans',
      bg: '#12141a',
      surface: '#1c2030',
      ink: '#eef1f7',
      muted: '#9aa3b5',
      accent: '#ff8a3d',
      accent2: '#6ea8fe',
      radius: '10px',
      vibe: 'desk',
    },
    abi: [
      'function owner() view returns (address)',
      'function ticketCount() view returns (uint256)',
      'function createTicket(string category, string description) returns (uint256)',
      'function updateStatus(uint256 id, uint8 newStatus)',
      'function getTicket(uint256 id) view returns (address reporter, string category, string description, uint8 status, uint256 createdAt, bool exists)',
    ],
    panel: 'complaints',
  },
  {
    id: '05-crowdfund',
    slug: 'crowdfund',
    pkg: 'fundraise',
    title: 'Fundraise',
    tagline: 'Campus campaigns with transparent ETH tips',
    contractFile: 'CampusCrowdfund.sol',
    contractName: 'CampusCrowdfund',
    theme: {
      font: 'Sora',
      display: 'Sora',
      bg: '#07140f',
      surface: '#0f241c',
      ink: '#e9fff4',
      muted: '#8fb5a3',
      accent: '#22c55e',
      accent2: '#86efac',
      radius: '18px',
      vibe: 'finance',
    },
    abi: [
      'function owner() view returns (address)',
      'function donate() payable',
      'function withdraw()',
      'function getInfo() view returns (string name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)',
      'function donations(address) view returns (uint256)',
    ],
    panel: 'crowdfund',
  },
  {
    id: '06-peer-review',
    slug: 'peer-review',
    pkg: 'peermark',
    title: 'PeerMark',
    tagline: 'Rate classmate projects — 1 to 5, once',
    contractFile: 'PeerReview.sol',
    contractName: 'PeerReview',
    theme: {
      font: 'Outfit',
      display: 'Outfit',
      bg: '#140f0c',
      surface: '#241a14',
      ink: '#fff7f0',
      muted: '#b9a090',
      accent: '#ff6b35',
      accent2: '#ffd166',
      radius: '20px',
      vibe: 'rating',
    },
    abi: [
      'function submitProject(string title) returns (uint256)',
      'function rate(uint256 projectId, uint8 score, string comment)',
      'function getAverage(uint256 projectId) view returns (uint256 avgTimes100, uint256 count)',
      'function getProject(uint256 projectId) view returns (string title, address submitter, uint256 totalScore, uint256 ratingCount, bool exists)',
    ],
    panel: 'peer-review',
  },
  {
    id: '07-scholarship',
    slug: 'scholarship',
    pkg: 'grantbook',
    title: 'GrantBook',
    tagline: 'Public scholarship & fee transparency ledger',
    contractFile: 'ScholarshipLedger.sol',
    contractName: 'ScholarshipLedger',
    theme: {
      font: 'IBM Plex Mono',
      display: 'IBM Plex Sans',
      bg: '#050805',
      surface: '#0d160f',
      ink: '#d7ffe0',
      muted: '#7d9a84',
      accent: '#39ff14',
      accent2: '#a8ff80',
      radius: '4px',
      vibe: 'ledger',
    },
    abi: [
      'function recordGrant(string studentName, string purpose, uint256 amountWei) returns (uint256)',
      'function getGrant(uint256 id) view returns (string studentName, string purpose, uint256 amountWei, uint256 recordedAt, bool exists)',
      'function grantCount() view returns (uint256)',
      'function totalRecorded() view returns (uint256)',
    ],
    panel: 'scholarship',
  },
  {
    id: '08-inventory',
    slug: 'inventory',
    pkg: 'kitkeep',
    title: 'KitKeep',
    tagline: 'Lab equipment custody & location log',
    contractFile: 'InventoryLog.sol',
    contractName: 'InventoryLog',
    theme: {
      font: 'Roboto Condensed',
      display: 'Roboto Condensed',
      bg: '#0e141c',
      surface: '#1a2433',
      ink: '#eef3fa',
      muted: '#8b9bb0',
      accent: '#ff9f1c',
      accent2: '#4cc9f0',
      radius: '6px',
      vibe: 'industrial',
    },
    abi: [
      'function addItem(string name, string location, address custodian) returns (uint256)',
      'function transferCustody(uint256 id, address to)',
      'function updateLocation(uint256 id, string location)',
      'function getItem(uint256 id) view returns (string name, string location, address custodian, bool exists)',
    ],
    panel: 'inventory',
  },
  {
    id: '09-poll',
    slug: 'poll',
    pkg: 'pulse-poll',
    title: 'PulsePoll',
    tagline: 'Multi-option campus polls — no money, just signal',
    contractFile: 'CampusPoll.sol',
    contractName: 'CampusPoll',
    theme: {
      font: 'Plus Jakarta Sans',
      display: 'Plus Jakarta Sans',
      bg: '#0b1220',
      surface: '#151f33',
      ink: '#f5f8ff',
      muted: '#93a4c3',
      accent: '#3b82f6',
      accent2: '#38bdf8',
      radius: '14px',
      vibe: 'poll',
    },
    abi: [
      'function createPoll(string question, string[] options) returns (uint256)',
      'function vote(uint256 pollId, uint256 optionIndex)',
      'function closePoll(uint256 pollId)',
      'function getPoll(uint256 pollId) view returns (string question, string[] options, uint256[] votes, bool open, bool exists)',
    ],
    panel: 'poll',
  },
  {
    id: '10-ai-model',
    slug: 'ai-model',
    pkg: 'modelproof',
    title: 'ModelProof',
    tagline: 'Register ML model hashes for AIML provenance',
    contractFile: 'AIModelRegistry.sol',
    contractName: 'AIModelRegistry',
    theme: {
      font: 'JetBrains Mono',
      display: 'Syne',
      bg: '#05070b',
      surface: '#0d121c',
      ink: '#e6f7ff',
      muted: '#7f93a8',
      accent: '#00e5ff',
      accent2: '#7cfc00',
      radius: '2px',
      vibe: 'terminal',
    },
    abi: [
      'function registerModel(string name, string version, bytes32 contentHash, string framework) returns (uint256)',
      'function verifyModel(bytes32 contentHash) view returns (bool found, uint256 id, string name, string version, address publisher)',
      'function getModel(uint256 id) view returns (string name, string version, bytes32 contentHash, string framework, address publisher, uint256 publishedAt, bool exists)',
    ],
    panel: 'ai-model',
  },
]

function pkgJson(app) {
  return JSON.stringify(
    {
      name: app.pkg,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        ethers: '^6.15.0',
        react: '^19.2.0',
        'react-dom': '^19.2.0',
      },
      devDependencies: {
        '@types/react': '^19.2.0',
        '@types/react-dom': '^19.2.0',
        '@vitejs/plugin-react': '^5.0.0',
        typescript: '~5.9.0',
        vite: '^7.0.0',
      },
    },
    null,
    2,
  )
}

function viteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: '127.0.0.1' },
})
`
}

function tsconfigs() {
  return {
    'tsconfig.json': JSON.stringify(
      {
        files: [],
        references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
      },
      null,
      2,
    ),
    'tsconfig.app.json': JSON.stringify(
      {
        compilerOptions: {
          tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
          target: 'ES2022',
          useDefineForClassFields: true,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          verbatimModuleSyntax: true,
          moduleDetection: 'force',
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: false,
          noUnusedParameters: false,
          erasableSyntaxOnly: true,
          noFallthroughCasesInSwitch: true,
        },
        include: ['src'],
      },
      null,
      2,
    ),
    'tsconfig.node.json': JSON.stringify(
      {
        compilerOptions: {
          tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
          target: 'ES2023',
          lib: ['ES2023'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          verbatimModuleSyntax: true,
          moduleDetection: 'force',
          noEmit: true,
          strict: true,
        },
        include: ['vite.config.ts'],
      },
      null,
      2,
    ),
  }
}

function indexHtml(app) {
  const fonts = encodeURIComponent(`${app.theme.font}:wght@400;600;700|${app.theme.display}:wght@600;700`)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${app.title} · MHSSCE Web3</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=${fonts.replace(/ /g, '+')}&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
}

function styles(app) {
  const t = app.theme
  return `:root {
  --bg: ${t.bg};
  --surface: ${t.surface};
  --ink: ${t.ink};
  --muted: ${t.muted};
  --accent: ${t.accent};
  --accent2: ${t.accent2};
  --radius: ${t.radius};
  --font: "${t.font}", system-ui, sans-serif;
  --display: "${t.display}", Georgia, serif;
}

* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; }
body {
  font-family: var(--font);
  color: var(--ink);
  background:
    radial-gradient(800px 400px at 0% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%),
    radial-gradient(700px 360px at 100% 0%, color-mix(in srgb, var(--accent2) 14%, transparent), transparent 50%),
    var(--bg);
  line-height: 1.5;
}

.app { width: min(920px, calc(100% - 2rem)); margin: 0 auto 3rem; padding-top: 1.25rem; }
.topbar {
  display: flex; justify-content: space-between; gap: 1rem; align-items: center;
  padding: 0.85rem 1rem; border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  border-radius: calc(var(--radius) + 8px); background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(8px); position: sticky; top: 0.6rem; z-index: 5;
}
.brand { display: flex; flex-direction: column; }
.brand strong { font-family: var(--display); font-size: 1.15rem; letter-spacing: -0.02em; }
.brand span { color: var(--muted); font-size: 0.82rem; }
.hero { margin: 2rem 0 1.25rem; }
.hero h1 {
  font-family: var(--display); font-size: clamp(2.1rem, 5vw, 3.2rem);
  line-height: 1.05; margin: 0 0 0.55rem; letter-spacing: -0.03em;
}
.hero p { color: var(--muted); max-width: 46ch; margin: 0; font-size: 1.05rem; }
.chip {
  display: inline-block; margin-bottom: 0.75rem; padding: 0.25rem 0.65rem;
  border-radius: 999px; border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;
}
.panel {
  background: var(--surface); border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  border-radius: var(--radius); padding: 1.1rem 1.15rem; margin: 0.9rem 0;
}
.panel h2, .panel h3 { margin: 0 0 0.55rem; font-family: var(--display); }
label { display: block; margin-top: 0.65rem; color: var(--muted); font-size: 0.85rem; }
input, textarea, select {
  width: 100%; margin-top: 0.3rem; padding: 0.7rem 0.8rem; border-radius: calc(var(--radius) - 2px);
  border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
  background: color-mix(in srgb, #000 35%, var(--surface)); color: var(--ink); font: inherit;
}
.row { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 0.75rem; }
.btn {
  appearance: none; border: none; cursor: pointer; font: inherit; font-weight: 700;
  padding: 0.7rem 1rem; border-radius: 999px; background: var(--accent); color: #111;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn.ghost {
  background: transparent; color: var(--ink);
  border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
}
.pill {
  font-family: ui-monospace, monospace; font-size: 0.85rem;
  padding: 0.45rem 0.75rem; border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
}
.muted { color: var(--muted); }
.err { color: #ff6b6b; }
.ok { color: var(--accent2); }
.out, .status {
  margin-top: 0.8rem; padding: 0.8rem; border-radius: calc(var(--radius) - 2px);
  background: color-mix(in srgb, #000 30%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
  white-space: pre-wrap; word-break: break-word; font-size: 0.92rem;
}
.status { border-color: color-mix(in srgb, var(--accent2) 40%, transparent); }
a { color: var(--accent2); }
code {
  font-family: ui-monospace, monospace; font-size: 0.88em;
  background: color-mix(in srgb, #000 28%, transparent); padding: 0.1em 0.35em; border-radius: 4px;
}
.footer { margin-top: 2rem; color: var(--muted); font-size: 0.85rem; }
.meter {
  height: 10px; border-radius: 999px; background: color-mix(in srgb, #000 35%, var(--surface));
  overflow: hidden; margin-top: 0.6rem;
}
.meter > span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
.stars { letter-spacing: 0.15em; color: var(--accent); font-size: 1.4rem; }
.layout-split { display: grid; gap: 1rem; }
@media (min-width: 800px) {
  .layout-split { grid-template-columns: 1.1fr 0.9fr; align-items: start; }
}
`
}

function ethereumTs() {
  return `import { BrowserProvider, Contract, JsonRpcSigner, keccak256, toUtf8Bytes } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_HEX = '0xaa36a7'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

export function shortAddress(a: string) {
  return \`\${a.slice(0, 6)}…\${a.slice(-4)}\`
}

export function isAddressLike(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim())
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error('Install MetaMask to continue')
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const network = await provider.getNetwork()
  return { address: await signer.getAddress(), signer, chainId: network.chainId, provider }
}

export async function switchToSepolia() {
  if (!window.ethereum) throw new Error('Install MetaMask')
  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SEPOLIA_HEX }] })
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_HEX,
          chainName: 'Sepolia',
          nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://rpc.sepolia.org'],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        }],
      })
    } else throw err
  }
}

export function getContract(address: string, abi: readonly string[], signer: JsonRpcSigner) {
  return new Contract(address, abi, signer)
}

export function hashText(text: string) {
  return keccak256(toUtf8Bytes(text))
}

export function explorerTx(hash: string) {
  return \`https://sepolia.etherscan.io/tx/\${hash}\`
}

export const STORAGE_KEY = 'contract-address'
`
}

function abiTs(app) {
  return `export const abi = ${JSON.stringify(app.abi, null, 2)} as const
`
}

function mainTs() {
  return `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
}

function appTsx(app) {
  // Generate panel-specific App component
  const panels = {
    voting: votingApp,
    attendance: attendanceApp,
    certificate: certificateApp,
    complaints: complaintsApp,
    crowdfund: crowdfundApp,
    'peer-review': peerReviewApp,
    scholarship: scholarshipApp,
    inventory: inventoryApp,
    poll: pollApp,
    'ai-model': aiModelApp,
  }
  return panels[app.panel](app)
}

function shell(app, body) {
  return `import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import {
  SEPOLIA_CHAIN_ID,
  STORAGE_KEY,
  connectWallet,
  explorerTx,
  getContract,
  hashText,
  isAddressLike,
  shortAddress,
  switchToSepolia,
} from './ethereum'
import { abi } from './abi'
import { formatEther, parseEther } from 'ethers'

export default function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [contractAddr, setContractAddr] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  const isSepolia = chainId === SEPOLIA_CHAIN_ID

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) {
      setContractAddr(s)
      setSaved(s)
    }
  }, [])

  async function connect() {
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Wallet error')
    }
  }

  function saveAddress() {
    const v = contractAddr.trim()
    if (!isAddressLike(v)) {
      setStatus('Enter a valid 0x contract address')
      return
    }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v)
    setStatus('Contract address saved')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    setBusy(true)
    setStatus(label)
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus(label + ' — confirming…')
      await tx.wait()
      setStatus(label + ' — confirmed')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Tx failed')
    } finally {
      setBusy(false)
    }
  }, [])

  const ready = Boolean(signer && saved && isSepolia && !busy)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>${app.title}</strong>
          <span>Sepolia · ${app.contractName}</span>
        </div>
        <div className="row" style={{ margin: 0 }}>
          {address && !isSepolia && (
            <button type="button" className="btn ghost" onClick={() => void switchToSepolia().then(connect)}>
              Switch Sepolia
            </button>
          )}
          {address ? <span className="pill">{shortAddress(address)}</span> : (
            <button type="button" className="btn" onClick={() => void connect()}>Connect MetaMask</button>
          )}
        </div>
      </header>

      <section className="hero">
        <span className="chip">MHSSCE · CSE AIML</span>
        <h1>${app.title}</h1>
        <p>${app.tagline}</p>
      </section>

      <section className="panel">
        <h3>Contract</h3>
        <p className="muted">Deploy <code>${app.contractFile}</code> in Remix on Sepolia, then paste the address.</p>
        <div className="row">
          <input value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} placeholder="0x…" spellCheck={false} />
          <button type="button" className="btn" onClick={saveAddress}>Save</button>
        </div>
      </section>

      ${body}

      {(status || txHash) && (
        <div className="status">
          {status}
          {txHash && (
            <>
              {'\\n'}Tx: <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}…</a>
            </>
          )}
        </div>
      )}
      {out && <pre className="out">{out}</pre>}

      <p className="footer">Read the project README for line-by-line Solidity, submission checklist, and viva questions.</p>
    </div>
  )
}
`.replace('${BODY}', body)
}

// The shell function embeds body wrongly - let me fix by having each panel return full App

function votingApp(app) {
  return fullApp(app, `
  const [title, setTitle] = useState('Elect Club President')
  const [proposalId, setProposalId] = useState('0')
`, `
      <div className="layout-split">
        <section className="panel">
          <h3>Ballot desk</h3>
          <p className="muted">Owner creates proposals. Each wallet votes once.</p>
          <label>Proposal title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Create proposal', async () => getContract(saved!, abi, signer!).createProposal(title))}>Create proposal</button>
          </div>
          <label>Proposal id</label>
          <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Vote YES', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), true))}>Vote YES</button>
            <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Vote NO', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), false))}>Vote NO</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const p = await getContract(saved!, abi, signer!).getProposal(BigInt(proposalId))
              setOut(\`\${p.title}\\nYes \${p.yesVotes} · No \${p.noVotes}\`)
            }}>Read tallies</button>
          </div>
        </section>
        <section className="panel">
          <h3>How it feels live</h3>
          <p className="muted">Treat this like a real election booth: connect, cast, verify on Etherscan.</p>
          <ol className="muted">
            <li>Deploy as club admin</li>
            <li>Create one proposal</li>
            <li>Students vote from their wallets</li>
            <li>Screenshot tallies for lab marks</li>
          </ol>
        </section>
      </div>
`)
}

function attendanceApp(app) {
  return fullApp(app, `
  const [name, setName] = useState('Web3 Lab Hour')
  const [sessionId, setSessionId] = useState('0')
`, `
      <section className="panel">
        <h3>Session control</h3>
        <label>Session name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Create session', async () => getContract(saved!, abi, signer!).createSession(name))}>Open session</button>
        </div>
        <label>Session id</label>
        <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Check in', async () => getContract(saved!, abi, signer!).checkIn(BigInt(sessionId)))}>Check in</button>
          <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Close', async () => getContract(saved!, abi, signer!).closeSession(BigInt(sessionId)))}>Close</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const s = await getContract(saved!, abi, signer!).getSession(BigInt(sessionId))
            setOut(\`\${s.name}\\nOpen: \${s.open}\\nPresent: \${s.count}\`)
          }}>Attendance count</button>
        </div>
      </section>
`)
}

function certificateApp(app) {
  return fullApp(app, `
  const [content, setContent] = useState('Certificate: BE CSE AIML — Web3 Workshop 2026')
  const [student, setStudent] = useState('Student Name')
  const [course, setCourse] = useState('Blockchain Technologies Lab')
  const docHash = hashText(content)
`, `
      <section className="panel">
        <h3>Issue credential</h3>
        <label>Certificate text</label>
        <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
        <p className="muted">keccak256 → <code>{docHash}</code></p>
        <label>Student</label>
        <input value={student} onChange={(e) => setStudent(e.target.value)} />
        <label>Course</label>
        <input value={course} onChange={(e) => setCourse(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Issue', async () => getContract(saved!, abi, signer!).issueCertificate(student, course, docHash))}>Issue</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const v = await getContract(saved!, abi, signer!).verify(docHash)
            setOut(\`Valid: \${v.valid}\\n\${v.studentName} · \${v.courseName}\\nRevoked: \${v.revoked}\`)
          }}>Verify</button>
        </div>
      </section>
`)
}

function complaintsApp(app) {
  return fullApp(app, `
  const [category, setCategory] = useState('Lost')
  const [description, setDescription] = useState('Lost ID near Seminar Hall')
  const [ticketId, setTicketId] = useState('0')
  const [newStatus, setNewStatus] = useState('1')
  const labels = ['Open', 'InProgress', 'Resolved', 'Closed']
`, `
      <div className="layout-split">
        <section className="panel">
          <h3>New ticket</h3>
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
          <label>Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Create ticket', async () => getContract(saved!, abi, signer!).createTicket(category, description))}>File ticket</button>
          </div>
        </section>
        <section className="panel">
          <h3>Admin desk</h3>
          <label>Ticket id</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
          <label>Status (0-3)</label>
          <input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Update status', async () => getContract(saved!, abi, signer!).updateStatus(BigInt(ticketId), Number(newStatus)))}>Update</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const t = await getContract(saved!, abi, signer!).getTicket(BigInt(ticketId))
              setOut(\`#\${ticketId} \${labels[Number(t.status)]}\\n\${t.category}\\n\${t.description}\\nReporter \${t.reporter}\`)
            }}>Read</button>
          </div>
        </section>
      </div>
`)
}

function crowdfundApp(app) {
  return fullApp(app, `
  const [amount, setAmount] = useState('0.001')
  const [progress, setProgress] = useState(0)
`, `
      <section className="panel">
        <h3>Campaign</h3>
        <p className="muted">Remix constructor: <code>"Campus Innovation Fund", 1000000000000000</code></p>
        <div className="meter"><span style={{ width: \`\${Math.min(progress, 100)}%\` }} /></div>
        <label>Donate (ETH)</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Donate', async () => getContract(saved!, abi, signer!).donate({ value: parseEther(amount) }))}>Donate</button>
          <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Withdraw', async () => getContract(saved!, abi, signer!).withdraw())}>Withdraw</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const i = await getContract(saved!, abi, signer!).getInfo()
            const pct = i.goal > 0n ? Number((i.raised * 100n) / i.goal) : 0
            setProgress(pct)
            setOut(\`\${i.name}\\nGoal \${formatEther(i.goal)} ETH\\nRaised \${formatEther(i.raised)} ETH\\nBalance \${formatEther(i.balance)} ETH\\nClosed \${i.isClosed}\`)
          }}>Refresh</button>
        </div>
      </section>
`)
}

function peerReviewApp(app) {
  return fullApp(app, `
  const [title, setTitle] = useState('My DApp Mini Project')
  const [projectId, setProjectId] = useState('0')
  const [score, setScore] = useState('5')
  const [comment, setComment] = useState('Clear demo')
`, `
      <section className="panel">
        <h3>Submit</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Submit', async () => getContract(saved!, abi, signer!).submitProject(title))}>Submit project</button>
        </div>
      </section>
      <section className="panel">
        <h3>Rate <span className="stars">{'★'.repeat(Math.min(5, Math.max(1, Number(score) || 1)))}</span></h3>
        <p className="muted">Use a second MetaMask account — self-rate is blocked.</p>
        <label>Project id</label>
        <input value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        <label>Score 1–5</label>
        <input value={score} onChange={(e) => setScore(e.target.value)} />
        <label>Comment</label>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Rate', async () => getContract(saved!, abi, signer!).rate(BigInt(projectId), Number(score), comment))}>Rate</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const a = await getContract(saved!, abi, signer!).getAverage(BigInt(projectId))
            const p = await getContract(saved!, abi, signer!).getProject(BigInt(projectId))
            setOut(\`\${p.title}\\nAvg \${(Number(a.avgTimes100) / 100).toFixed(2)} (\${a.count} ratings)\`)
          }}>Average</button>
        </div>
      </section>
`)
}

function scholarshipApp(app) {
  return fullApp(app, `
  const [student, setStudent] = useState('Student Name')
  const [purpose, setPurpose] = useState('Tuition')
  const [amountWei, setAmountWei] = useState('1000000000000000')
  const [grantId, setGrantId] = useState('0')
`, `
      <section className="panel">
        <h3>&gt; record_grant</h3>
        <label>student</label>
        <input value={student} onChange={(e) => setStudent(e.target.value)} />
        <label>purpose</label>
        <input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <label>amount_wei</label>
        <input value={amountWei} onChange={(e) => setAmountWei(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Record', async () => getContract(saved!, abi, signer!).recordGrant(student, purpose, BigInt(amountWei)))}>Append ledger</button>
        </div>
        <label>grant_id</label>
        <div className="row">
          <input value={grantId} onChange={(e) => setGrantId(e.target.value)} />
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const g = await getContract(saved!, abi, signer!).getGrant(BigInt(grantId))
            const total = await getContract(saved!, abi, signer!).totalRecorded()
            setOut(\`\${g.studentName} | \${g.purpose}\\namount \${g.amountWei}\\ntotal_recorded \${total}\`)
          }}>Read</button>
        </div>
      </section>
`)
}

function inventoryApp(app) {
  return fullApp(app, `
  const [name, setName] = useState('Arduino Kit #12')
  const [location, setLocation] = useState('L3 Lab Shelf B')
  const [custodian, setCustodian] = useState('')
  const [itemId, setItemId] = useState('0')
  const [to, setTo] = useState('')
`, `
      <section className="panel">
        <h3>Receive stock</h3>
        <label>Item</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        <label>Custodian</label>
        <input value={custodian} onChange={(e) => setCustodian(e.target.value)} placeholder={address ?? '0x…'} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Add item', async () => getContract(saved!, abi, signer!).addItem(name, location, custodian.trim() || address!))}>Add item</button>
        </div>
      </section>
      <section className="panel">
        <h3>Transfer / relocate</h3>
        <label>Item id</label>
        <input value={itemId} onChange={(e) => setItemId(e.target.value)} />
        <label>Transfer to</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Transfer', async () => getContract(saved!, abi, signer!).transferCustody(BigInt(itemId), to.trim()))}>Transfer custody</button>
          <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Location', async () => getContract(saved!, abi, signer!).updateLocation(BigInt(itemId), location))}>Update location</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const i = await getContract(saved!, abi, signer!).getItem(BigInt(itemId))
            setOut(\`\${i.name}\\n@ \${i.location}\\nCustodian \${i.custodian}\`)
          }}>Inspect</button>
        </div>
      </section>
`)
}

function pollApp(app) {
  return fullApp(app, `
  const [question, setQuestion] = useState('Best slot for hackathon?')
  const [options, setOptions] = useState('Friday,Saturday,Sunday')
  const [pollId, setPollId] = useState('0')
  const [optionIndex, setOptionIndex] = useState('0')
`, `
      <section className="panel">
        <h3>Create poll</h3>
        <label>Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
        <label>Options (comma-separated)</label>
        <input value={options} onChange={(e) => setOptions(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Create poll', async () => {
            const opts = options.split(',').map((s) => s.trim()).filter(Boolean)
            return getContract(saved!, abi, signer!).createPoll(question, opts)
          })}>Publish poll</button>
        </div>
      </section>
      <section className="panel">
        <h3>Cast vote</h3>
        <label>Poll id</label>
        <input value={pollId} onChange={(e) => setPollId(e.target.value)} />
        <label>Option index</label>
        <input value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Vote', async () => getContract(saved!, abi, signer!).vote(BigInt(pollId), BigInt(optionIndex)))}>Vote</button>
          <button type="button" className="btn ghost" disabled={!ready} onClick={() => void run('Close', async () => getContract(saved!, abi, signer!).closePoll(BigInt(pollId)))}>Close</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const p = await getContract(saved!, abi, signer!).getPoll(BigInt(pollId))
            setOut(\`\${p.question}\\n\${p.options.map((o, i) => \`\${i}. \${o} — \${p.votes[i]}\`).join('\\n')}\`)
          }}>Results</button>
        </div>
      </section>
`)
}

function aiModelApp(app) {
  return fullApp(app, `
  const [name, setName] = useState('CampusSentimentBERT')
  const [version, setVersion] = useState('1.0.0')
  const [framework, setFramework] = useState('PyTorch')
  const [manifest, setManifest] = useState('model=CampusSentimentBERT;dataset=mhssce-reviews-2026;acc=0.91')
  const contentHash = hashText(manifest)
`, `
      <section className="panel">
        <h3>register_model()</h3>
        <label>name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>version</label>
        <input value={version} onChange={(e) => setVersion(e.target.value)} />
        <label>framework</label>
        <input value={framework} onChange={(e) => setFramework(e.target.value)} />
        <label>manifest</label>
        <textarea rows={3} value={manifest} onChange={(e) => setManifest(e.target.value)} />
        <p className="muted">hash <code>{contentHash}</code></p>
        <div className="row">
          <button type="button" className="btn" disabled={!ready} onClick={() => void run('Register', async () => getContract(saved!, abi, signer!).registerModel(name, version, contentHash, framework))}>Register</button>
          <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
            const v = await getContract(saved!, abi, signer!).verifyModel(contentHash)
            setOut(\`found=\${v.found}\\nid=\${v.id}\\n\${v.name}@\${v.version}\\npublisher=\${v.publisher}\`)
          }}>Verify</button>
        </div>
      </section>
`)
}

function fullApp(app, extraState, body) {
  return `import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID,
  STORAGE_KEY,
  connectWallet,
  explorerTx,
  getContract,
  hashText,
  isAddressLike,
  shortAddress,
  switchToSepolia,
} from './ethereum'
import { abi } from './abi'

export default function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [contractAddr, setContractAddr] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)
${extraState}

  const isSepolia = chainId === SEPOLIA_CHAIN_ID

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) {
      setContractAddr(s)
      setSaved(s)
    }
  }, [])

  async function connect() {
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Wallet error')
    }
  }

  function saveAddress() {
    const v = contractAddr.trim()
    if (!isAddressLike(v)) {
      setStatus('Enter a valid 0x contract address')
      return
    }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v)
    setStatus('Contract address saved')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    setBusy(true)
    setStatus(label)
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus(label + ' — confirming…')
      await tx.wait()
      setStatus(label + ' — confirmed')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Tx failed')
    } finally {
      setBusy(false)
    }
  }, [])

  const ready = Boolean(signer && saved && isSepolia && !busy)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>${app.title}</strong>
          <span>Sepolia · ${app.contractName}</span>
        </div>
        <div className="row" style={{ margin: 0 }}>
          {address && !isSepolia && (
            <button type="button" className="btn ghost" onClick={() => void switchToSepolia().then(connect)}>
              Switch Sepolia
            </button>
          )}
          {address ? <span className="pill">{shortAddress(address)}</span> : (
            <button type="button" className="btn" onClick={() => void connect()}>Connect MetaMask</button>
          )}
        </div>
      </header>

      <section className="hero">
        <span className="chip">MHSSCE · CSE AIML</span>
        <h1>${app.title}</h1>
        <p>${app.tagline}</p>
      </section>

      <section className="panel">
        <h3>Contract</h3>
        <p className="muted">Deploy <code>${app.contractFile}</code> in Remix on Sepolia, then paste the address.</p>
        <div className="row">
          <input value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} placeholder="0x…" spellCheck={false} />
          <button type="button" className="btn" onClick={saveAddress}>Save</button>
        </div>
      </section>

${body}

      {(status || txHash) && (
        <div className="status">
          {status}
          {txHash && (
            <>
              {'\\n'}Tx: <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}…</a>
            </>
          )}
        </div>
      )}
      {out && <pre className="out">{out}</pre>}

      <p className="footer">See this folder&apos;s README.md for deep Solidity notes, submission checklist, and viva questions.</p>
    </div>
  )
}
`
}

for (const app of apps) {
  const dir = path.join(root, 'projects', app.id, 'frontend')
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'package.json'), pkgJson(app))
  fs.writeFileSync(path.join(dir, 'vite.config.ts'), viteConfig())
  const tsc = tsconfigs()
  for (const [name, content] of Object.entries(tsc)) {
    fs.writeFileSync(path.join(dir, name), content)
  }
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml(app))
  fs.writeFileSync(path.join(dir, 'src', 'main.tsx'), mainTs())
  fs.writeFileSync(path.join(dir, 'src', 'styles.css'), styles(app))
  fs.writeFileSync(path.join(dir, 'src', 'ethereum.ts'), ethereumTs())
  fs.writeFileSync(path.join(dir, 'src', 'abi.ts'), abiTs(app))
  fs.writeFileSync(path.join(dir, 'src', 'App.tsx'), appTsx(app))
  fs.writeFileSync(
    path.join(dir, '.gitignore'),
    `node_modules\ndist\n.DS_Store\n.env\n.env.local\n`,
  )
  console.log('generated', app.id)
}

console.log('done', apps.length)
