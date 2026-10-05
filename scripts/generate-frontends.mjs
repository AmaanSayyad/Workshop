/**
 * Generates 10 product-style frontends (not workshop UIs).
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
    pkg: 'campus-vote',
    title: 'CampusVote',
    productLine: 'Elections',
    tagline: 'Run fair campus elections everyone can trust.',
    hero: 'Your club. Your vote. Clear results.',
    contractFile: 'CampusVoting.sol',
    theme: {
      font: 'DM Sans',
      display: 'Fraunces',
      bg: '#f4f1ea',
      surface: '#ffffff',
      ink: '#1a1f16',
      muted: '#5f6b5a',
      accent: '#1f6f4a',
      accent2: '#c45c26',
      radius: '16px',
      dark: false,
    },
    abi: [
      'function owner() view returns (address)',
      'function proposalCount() view returns (uint256)',
      'function createProposal(string title) returns (uint256)',
      'function vote(uint256 proposalId, bool support)',
      'function getProposal(uint256 proposalId) view returns (string title, uint256 yesVotes, uint256 noVotes, bool exists)',
    ],
    kind: 'voting',
  },
  {
    id: '02-attendance',
    pkg: 'checkin-lab',
    title: 'CheckIn',
    productLine: 'Attendance',
    tagline: 'Mark presence in seconds — no paper sheets.',
    hero: 'Open a session. Students check in. Done.',
    contractFile: 'AttendanceCheckIn.sol',
    theme: {
      font: 'Manrope',
      display: 'Space Grotesk',
      bg: '#eef7f8',
      surface: '#ffffff',
      ink: '#0c2a32',
      muted: '#4d6b73',
      accent: '#0d9488',
      accent2: '#0369a1',
      radius: '18px',
      dark: false,
    },
    abi: [
      'function createSession(string name) returns (uint256)',
      'function closeSession(uint256 sessionId)',
      'function checkIn(uint256 sessionId)',
      'function getSession(uint256 sessionId) view returns (string name, uint256 startTime, bool open, uint256 count, bool exists)',
    ],
    kind: 'attendance',
  },
  {
    id: '03-certificate',
    pkg: 'credence',
    title: 'Credence',
    productLine: 'Credentials',
    tagline: 'Issue certificates students can verify forever.',
    hero: 'Authentic credentials. Instant verification.',
    contractFile: 'CertificateRegistry.sol',
    theme: {
      font: 'Source Sans 3',
      display: 'Libre Baskerville',
      bg: '#f7f4ef',
      surface: '#fffdf8',
      ink: '#1c2430',
      muted: '#6b7280',
      accent: '#9a7b2f',
      accent2: '#1e3a5f',
      radius: '12px',
      dark: false,
    },
    abi: [
      'function issueCertificate(string studentName, string courseName, bytes32 docHash) returns (uint256)',
      'function verify(bytes32 docHash) view returns (bool valid, uint256 id, string studentName, string courseName, bool revoked)',
    ],
    kind: 'certificate',
  },
  {
    id: '04-complaints',
    pkg: 'campus-desk',
    title: 'CampusDesk',
    productLine: 'Support',
    tagline: 'Lost & found and facility issues, tracked end to end.',
    hero: 'File a ticket. Track the fix.',
    contractFile: 'ComplaintTracker.sol',
    theme: {
      font: 'IBM Plex Sans',
      display: 'IBM Plex Sans',
      bg: '#f3f4f8',
      surface: '#ffffff',
      ink: '#111827',
      muted: '#6b7280',
      accent: '#ea580c',
      accent2: '#2563eb',
      radius: '14px',
      dark: false,
    },
    abi: [
      'function createTicket(string category, string description) returns (uint256)',
      'function updateStatus(uint256 id, uint8 newStatus)',
      'function getTicket(uint256 id) view returns (address reporter, string category, string description, uint8 status, uint256 createdAt, bool exists)',
    ],
    kind: 'complaints',
  },
  {
    id: '05-crowdfund',
    pkg: 'fundraise',
    title: 'Fundraise',
    productLine: 'Campaigns',
    tagline: 'Raise for campus causes with a transparent tip jar.',
    hero: 'Share the link. Watch support grow.',
    contractFile: 'CampusCrowdfund.sol',
    theme: {
      font: 'Sora',
      display: 'Sora',
      bg: '#ecfdf5',
      surface: '#ffffff',
      ink: '#064e3b',
      muted: '#047857',
      accent: '#059669',
      accent2: '#10b981',
      radius: '20px',
      dark: false,
    },
    abi: [
      'function donate() payable',
      'function withdraw()',
      'function getInfo() view returns (string name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)',
    ],
    kind: 'crowdfund',
  },
  {
    id: '06-peer-review',
    pkg: 'peermark',
    title: 'PeerMark',
    productLine: 'Reviews',
    tagline: 'Honest peer feedback for student projects.',
    hero: 'Submit. Get rated. Improve.',
    contractFile: 'PeerReview.sol',
    theme: {
      font: 'Outfit',
      display: 'Outfit',
      bg: '#fff7ed',
      surface: '#ffffff',
      ink: '#431407',
      muted: '#9a3412',
      accent: '#ea580c',
      accent2: '#f59e0b',
      radius: '22px',
      dark: false,
    },
    abi: [
      'function submitProject(string title) returns (uint256)',
      'function rate(uint256 projectId, uint8 score, string comment)',
      'function getAverage(uint256 projectId) view returns (uint256 avgTimes100, uint256 count)',
      'function getProject(uint256 projectId) view returns (string title, address submitter, uint256 totalScore, uint256 ratingCount, bool exists)',
    ],
    kind: 'peer-review',
  },
  {
    id: '07-scholarship',
    pkg: 'grantbook',
    title: 'GrantBook',
    productLine: 'Transparency',
    tagline: 'A public book of scholarships and fee support.',
    hero: 'See where support goes.',
    contractFile: 'ScholarshipLedger.sol',
    theme: {
      font: 'Newsreader',
      display: 'Newsreader',
      bg: '#f8faf8',
      surface: '#ffffff',
      ink: '#14532d',
      muted: '#3f6212',
      accent: '#166534',
      accent2: '#65a30d',
      radius: '10px',
      dark: false,
    },
    abi: [
      'function recordGrant(string studentName, string purpose, uint256 amountWei) returns (uint256)',
      'function getGrant(uint256 id) view returns (string studentName, string purpose, uint256 amountWei, uint256 recordedAt, bool exists)',
      'function totalRecorded() view returns (uint256)',
    ],
    kind: 'scholarship',
  },
  {
    id: '08-inventory',
    pkg: 'kitkeep',
    title: 'KitKeep',
    productLine: 'Inventory',
    tagline: 'Know who has which lab kit — and where it is.',
    hero: 'Track equipment. Transfer custody.',
    contractFile: 'InventoryLog.sol',
    theme: {
      font: 'Barlow',
      display: 'Barlow Condensed',
      bg: '#eef2f6',
      surface: '#ffffff',
      ink: '#0f172a',
      muted: '#475569',
      accent: '#f59e0b',
      accent2: '#0ea5e9',
      radius: '8px',
      dark: false,
    },
    abi: [
      'function addItem(string name, string location, address custodian) returns (uint256)',
      'function transferCustody(uint256 id, address to)',
      'function updateLocation(uint256 id, string location)',
      'function getItem(uint256 id) view returns (string name, string location, address custodian, bool exists)',
    ],
    kind: 'inventory',
  },
  {
    id: '09-poll',
    pkg: 'pulse-poll',
    title: 'Pulse',
    productLine: 'Polls',
    tagline: 'Quick campus polls with live results.',
    hero: 'Ask the campus. See the pulse.',
    contractFile: 'CampusPoll.sol',
    theme: {
      font: 'Plus Jakarta Sans',
      display: 'Plus Jakarta Sans',
      bg: '#eff6ff',
      surface: '#ffffff',
      ink: '#1e3a8a',
      muted: '#3b82f6',
      accent: '#2563eb',
      accent2: '#06b6d4',
      radius: '16px',
      dark: false,
    },
    abi: [
      'function createPoll(string question, string[] options) returns (uint256)',
      'function vote(uint256 pollId, uint256 optionIndex)',
      'function closePoll(uint256 pollId)',
      'function getPoll(uint256 pollId) view returns (string question, string[] options, uint256[] votes, bool open, bool exists)',
    ],
    kind: 'poll',
  },
  {
    id: '10-ai-model',
    pkg: 'modelproof',
    title: 'ModelProof',
    productLine: 'ML Provenance',
    tagline: 'Register model fingerprints so teams can prove what’s real.',
    hero: 'Prove your model. Verify theirs.',
    contractFile: 'AIModelRegistry.sol',
    theme: {
      font: 'IBM Plex Sans',
      display: 'Syne',
      bg: '#0b0f14',
      surface: '#121821',
      ink: '#e8f1ff',
      muted: '#8b9cb3',
      accent: '#22d3ee',
      accent2: '#a3e635',
      radius: '12px',
      dark: true,
    },
    abi: [
      'function registerModel(string name, string version, bytes32 contentHash, string framework) returns (uint256)',
      'function verifyModel(bytes32 contentHash) view returns (bool found, uint256 id, string name, string version, address publisher)',
    ],
    kind: 'ai-model',
  },
]

function writeBase(dir, app) {
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: app.pkg,
        private: true,
        version: '2.0.0',
        type: 'module',
        scripts: { dev: 'vite', build: 'tsc -b && vite build', preview: 'vite preview' },
        dependencies: { ethers: '^6.15.0', react: '^19.2.0', 'react-dom': '^19.2.0' },
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
    ),
  )
  fs.writeFileSync(
    path.join(dir, 'vite.config.ts'),
    `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({ plugins: [react()], server: { host: '127.0.0.1', port: 5173 } })\n`,
  )
  fs.writeFileSync(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify({ files: [], references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }] }, null, 2),
  )
  fs.writeFileSync(
    path.join(dir, 'tsconfig.app.json'),
    JSON.stringify(
      {
        compilerOptions: {
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
        },
        include: ['src'],
      },
      null,
      2,
    ),
  )
  fs.writeFileSync(
    path.join(dir, 'tsconfig.node.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2023',
          lib: ['ES2023'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          verbatimModuleSyntax: true,
          noEmit: true,
          strict: true,
        },
        include: ['vite.config.ts'],
      },
      null,
      2,
    ),
  )
  const fontHref = `https://fonts.googleapis.com/css2?family=${app.theme.font.replace(/ /g, '+')}:wght@400;500;600;700&family=${app.theme.display.replace(/ /g, '+')}:wght@600;700&display=swap`
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${app.title} — ${app.tagline}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontHref}" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,
  )
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\ndist\n.DS_Store\n.env\n')
  fs.writeFileSync(path.join(dir, '.env.example'), `VITE_APP_ID=\n`)
  fs.writeFileSync(
    path.join(dir, 'src', 'main.tsx'),
    `import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './styles.css'\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n`,
  )
  fs.writeFileSync(
    path.join(dir, 'src', 'abi.ts'),
    `export const abi = ${JSON.stringify(app.abi, null, 2)} as const\n`,
  )
  fs.writeFileSync(path.join(dir, 'src', 'ethereum.ts'), ethereumTs())
  fs.writeFileSync(path.join(dir, 'src', 'vite-env.d.ts'), `/// <reference types="vite/client" />\n`)
  fs.writeFileSync(path.join(dir, 'src', 'styles.css'), styles(app))
  fs.writeFileSync(path.join(dir, 'src', 'App.tsx'), appTsx(app))
}

function ethereumTs() {
  return `import { BrowserProvider, Contract, JsonRpcSigner, keccak256, toUtf8Bytes } from 'ethers'

export const SEPOLIA_CHAIN_ID = 11155111n
export const SEPOLIA_HEX = '0xaa36a7'
export const STORAGE_KEY = 'app-connection-id'

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
  if (!window.ethereum) throw new Error('A wallet extension is required to sign in')
  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const network = await provider.getNetwork()
  return { address: await signer.getAddress(), signer, chainId: network.chainId }
}

export async function switchToSepolia() {
  if (!window.ethereum) throw new Error('Wallet not found')
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
`
}

function styles(app) {
  const t = app.theme
  const soft = t.dark
    ? `radial-gradient(900px 480px at 10% -10%, color-mix(in srgb, ${t.accent} 22%, transparent), transparent 55%),
       radial-gradient(700px 420px at 90% 0%, color-mix(in srgb, ${t.accent2} 12%, transparent), transparent 50%),
       ${t.bg}`
    : `radial-gradient(900px 500px at 0% 0%, color-mix(in srgb, ${t.accent} 12%, transparent), transparent 50%),
       radial-gradient(800px 420px at 100% 0%, color-mix(in srgb, ${t.accent2} 10%, transparent), transparent 45%),
       linear-gradient(180deg, ${t.bg} 0%, color-mix(in srgb, ${t.bg} 70%, white) 100%)`

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
  --line: color-mix(in srgb, var(--ink) ${t.dark ? '14%' : '10%'}, transparent);
  --shadow: ${t.dark ? '0 18px 50px rgba(0,0,0,.35)' : '0 18px 50px rgba(20,30,40,.08)'};
}
*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%}
body{
  font-family:var(--font);color:var(--ink);background:${soft};line-height:1.5;
}
a{color:var(--accent2)}
.shell{width:min(1080px,calc(100% - 2rem));margin:0 auto 4rem}
.nav{
  display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:1rem 0;position:sticky;top:0;z-index:20;
  backdrop-filter:blur(12px);background:color-mix(in srgb, var(--bg) 82%, transparent);
}
.logo{display:flex;align-items:center;gap:.7rem}
.mark{
  width:36px;height:36px;border-radius:11px;display:grid;place-items:center;
  background:var(--accent);color:${t.dark ? '#041016' : '#fff'};font-weight:800;font-family:var(--display);
}
.logo strong{display:block;font-family:var(--display);font-size:1.15rem;letter-spacing:-.02em}
.logo small{color:var(--muted);font-size:.78rem}
.nav-actions{display:flex;gap:.55rem;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.btn{
  appearance:none;border:none;cursor:pointer;font:inherit;font-weight:700;
  padding:.72rem 1.05rem;border-radius:999px;background:var(--accent);color:${t.dark ? '#041016' : '#fff'};
}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn.secondary{background:transparent;color:var(--ink);border:1px solid var(--line)}
.btn.ghost{background:color-mix(in srgb, var(--accent) 12%, transparent);color:var(--accent)}
.pill{
  font-size:.85rem;padding:.45rem .8rem;border-radius:999px;border:1px solid var(--line);
  background:var(--surface);
}
.hero{
  display:grid;gap:1.5rem;padding:2.2rem 0 1.4rem;
}
@media(min-width:860px){
  .hero{grid-template-columns:1.2fr .8fr;align-items:end}
}
.kicker{color:var(--accent);font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .6rem}
.hero h1{
  font-family:var(--display);font-size:clamp(2.4rem,5.5vw,3.8rem);line-height:1.02;
  letter-spacing:-.04em;margin:0 0 .7rem;max-width:12ch;
}
.hero p{margin:0;color:var(--muted);font-size:1.08rem;max-width:36ch}
.hero-card{
  background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) + 6px);
  padding:1.2rem;box-shadow:var(--shadow);
}
.hero-card h3{margin:0 0 .35rem;font-family:var(--display)}
.hero-card p{margin:0;color:var(--muted);font-size:.95rem}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:1rem}
.stat{padding:.8rem;border-radius:12px;background:color-mix(in srgb, var(--accent) 8%, var(--surface));border:1px solid var(--line)}
.stat b{display:block;font-size:1.15rem}
.stat span{color:var(--muted);font-size:.8rem}
.workspace{display:grid;gap:1rem}
@media(min-width:860px){.workspace{grid-template-columns:1.15fr .85fr}}
.card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);
  padding:1.15rem 1.2rem;box-shadow:var(--shadow);
}
.card h2{margin:0 0 .35rem;font-family:var(--display);font-size:1.35rem}
.card .sub{margin:0 0 1rem;color:var(--muted)}
label{display:block;margin-top:.7rem;font-size:.84rem;color:var(--muted);font-weight:600}
input,textarea,select{
  width:100%;margin-top:.35rem;padding:.78rem .85rem;border-radius:12px;
  border:1px solid var(--line);background:${t.dark ? '#0a1018' : '#fbfcfe'};color:var(--ink);font:inherit;
}
.row{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:.9rem}
.toast{
  margin-top:1rem;padding:.85rem 1rem;border-radius:12px;border:1px solid var(--line);
  background:color-mix(in srgb, var(--accent2) 10%, var(--surface));
}
.toast a{font-weight:700}
.result{
  margin-top:.9rem;padding:1rem;border-radius:12px;background:${t.dark ? '#0a1018' : '#f8fafc'};
  border:1px solid var(--line);white-space:pre-wrap;word-break:break-word;
}
.meter{height:12px;border-radius:999px;background:color-mix(in srgb, var(--ink) 8%, transparent);overflow:hidden;margin:1rem 0}
.meter>i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2))}
.stars{color:var(--accent2);letter-spacing:.12em;font-size:1.35rem}
.modal-backdrop{
  position:fixed;inset:0;background:rgba(10,14,20,.45);display:grid;place-items:center;padding:1rem;z-index:50;
}
.modal{
  width:min(440px,100%);background:var(--surface);border-radius:18px;padding:1.2rem;border:1px solid var(--line);
  box-shadow:var(--shadow);
}
.modal h3{margin:0 0 .4rem;font-family:var(--display)}
.modal p{margin:0 0 .8rem;color:var(--muted);font-size:.92rem}
.footer{
  margin-top:2.5rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem;
  display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}
.empty{color:var(--muted);padding:1rem 0}
.option{
  display:flex;justify-content:space-between;align-items:center;gap:1rem;
  padding:.85rem 1rem;border:1px solid var(--line);border-radius:12px;margin-top:.55rem;cursor:pointer;
  background:${t.dark ? '#0a1018' : '#fff'};
}
.option:hover{border-color:color-mix(in srgb, var(--accent) 50%, var(--line))}
.badge{font-size:.75rem;font-weight:700;color:var(--accent);background:color-mix(in srgb, var(--accent) 12%, transparent);padding:.2rem .5rem;border-radius:999px}
`
}

function sharedHooks() {
  return `
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<bigint | null>(null)
  const [appId, setAppId] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)

  const isSepolia = chainId === SEPOLIA_CHAIN_ID
  const ready = Boolean(signer && saved && isSepolia && !busy)

  useEffect(() => {
    const fromEnv = import.meta.env.VITE_APP_ID as string | undefined
    const s = fromEnv && isAddressLike(fromEnv) ? fromEnv : localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) {
      setAppId(s)
      setSaved(s)
    }
  }, [])

  async function signIn() {
    try {
      const w = await connectWallet()
      setAddress(w.address)
      setSigner(w.signer)
      setChainId(w.chainId)
      if (w.chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
        const again = await connectWallet()
        setAddress(again.address)
        setSigner(again.signer)
        setChainId(again.chainId)
      }
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not sign in')
    }
  }

  function saveConnection() {
    const v = appId.trim()
    if (!isAddressLike(v)) {
      setStatus('Paste a valid app connection id (0x…)')
      return
    }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v)
    setSettingsOpen(false)
    setStatus('Connected to your deployment')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    if (!signer || !saved) {
      setStatus('Sign in and connect your deployment in Settings first')
      setSettingsOpen(true)
      return
    }
    if (!isSepolia) {
      setStatus('Switch your wallet network, then try again')
      return
    }
    setBusy(true)
    setStatus(label + '…')
    setTxHash(null)
    try {
      const tx = await fn()
      setTxHash(tx.hash)
      setStatus('Waiting for confirmation…')
      await tx.wait()
      setStatus(label + ' — done')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }, [signer, saved, isSepolia])
`
}

function chrome(app, body, extraState = '') {
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
${sharedHooks()}
${extraState}

  return (
    <div className="shell">
      <nav className="nav">
        <div className="logo">
          <div className="mark">${app.title.slice(0, 1)}</div>
          <div>
            <strong>${app.title}</strong>
            <small>${app.productLine}</small>
          </div>
        </div>
        <div className="nav-actions">
          <button type="button" className="btn secondary" onClick={() => setSettingsOpen(true)}>Settings</button>
          {address ? (
            <span className="pill">{shortAddress(address)}</span>
          ) : (
            <button type="button" className="btn" onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="kicker">${app.productLine}</p>
          <h1>${app.hero}</h1>
          <p>${app.tagline}</p>
        </div>
        <div className="hero-card">
          <h3>{address ? 'You are signed in' : 'Sign in to get started'}</h3>
          <p>{saved ? 'Everything below is ready to use.' : 'First time here? Open Settings, paste the app ID from your organizer, then continue as usual.'}</p>
          <div className="stats">
            <div className="stat"><b>{address ? 'Yes' : 'No'}</b><span>Account</span></div>
            <div className="stat"><b>{saved ? 'Yes' : 'No'}</b><span>Connected</span></div>
            <div className="stat"><b>{isSepolia || !address ? (address ? 'Ready' : '—') : 'Fix'}</b><span>Status</span></div>
          </div>
        </div>
      </header>

      <div className="workspace">
${body}
      </div>

      {(status || txHash) && (
        <div className="toast">
          {status}
          {txHash && (
            <>
              {' · '}
              <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">View receipt</a>
            </>
          )}
        </div>
      )}
      {result && <pre className="result">{result}</pre>}

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>App setup</h3>
            <p>Organizers paste the shared app ID once. After that, everyone just signs in and uses the product.</p>
            <label>App ID</label>
            <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            <div className="row">
              <button type="button" className="btn" onClick={saveConnection}>Save</button>
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© ${app.title}</span>
        <span>Built for real campus workflows</span>
      </footer>
    </div>
  )
}
`
}

function appTsx(app) {
  switch (app.kind) {
    case 'voting':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Create an election</h2>
          <p className="sub">Admins publish a question. Voters answer yes or no — once each.</p>
          <label>What are people voting on?</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Elect club president" />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing election', async () => getContract(saved!, abi, signer!).createProposal(title))}>Publish election</button>
          </div>
        </section>
        <section className="card">
          <h2>Cast your vote</h2>
          <p className="sub">Pick the election number you were given, then choose a side.</p>
          <label>Election number</label>
          <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Submitting yes', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), true))}>Vote Yes</button>
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Submitting no', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), false))}>Vote No</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const p = await getContract(saved!, abi, signer!).getProposal(BigInt(proposalId))
              setResult(\`\${p.title}\\n\\nYes  \${p.yesVotes}\\nNo   \${p.noVotes}\`)
            }}>See results</button>
          </div>
        </section>`,
        `  const [title, setTitle] = useState('Elect Club President')\n  const [proposalId, setProposalId] = useState('0')\n`,
      )
    case 'attendance':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Host a session</h2>
          <p className="sub">Teachers and organizers open a room, then close it when class ends.</p>
          <label>Session name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Opening session', async () => getContract(saved!, abi, signer!).createSession(name))}>Open session</button>
          </div>
        </section>
        <section className="card">
          <h2>I'm here</h2>
          <p className="sub">Students enter the session number shown on the board.</p>
          <label>Session number</label>
          <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Checking in', async () => getContract(saved!, abi, signer!).checkIn(BigInt(sessionId)))}>Check in</button>
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Closing session', async () => getContract(saved!, abi, signer!).closeSession(BigInt(sessionId)))}>End session</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const s = await getContract(saved!, abi, signer!).getSession(BigInt(sessionId))
              setResult(\`\${s.name}\\n\${s.open ? 'Accepting check-ins' : 'Closed'}\\nPresent: \${s.count}\`)
            }}>Who's here?</button>
          </div>
        </section>`,
        `  const [name, setName] = useState('Morning lab')\n  const [sessionId, setSessionId] = useState('0')\n`,
      )
    case 'certificate':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Issue a certificate</h2>
          <p className="sub">Write the credential text. We fingerprint it automatically for verification later.</p>
          <label>Certificate text</label>
          <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <label>Student name</label>
          <input value={student} onChange={(e) => setStudent(e.target.value)} />
          <label>Course</label>
          <input value={course} onChange={(e) => setCourse(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Issuing certificate', async () => getContract(saved!, abi, signer!).issueCertificate(student, course, hashText(content)))}>Issue</button>
          </div>
        </section>
        <section className="card">
          <h2>Verify a certificate</h2>
          <p className="sub">Paste the same certificate text a student shows you.</p>
          <label>Certificate text to verify</label>
          <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const v = await getContract(saved!, abi, signer!).verify(hashText(content))
              setResult(v.valid ? \`Authentic\\n\${v.studentName}\\n\${v.courseName}\` : 'Not found or revoked')
            }}>Verify now</button>
          </div>
        </section>`,
        `  const [content, setContent] = useState('Certificate of completion — Blockchain Lab 2026')\n  const [student, setStudent] = useState('')\n  const [course, setCourse] = useState('Blockchain Technologies')\n`,
      )
    case 'complaints':
      return chrome(
        app,
        `
        <section className="card">
          <h2>New request</h2>
          <p className="sub">Lost ID? Broken projector? File it in under a minute.</p>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Lost</option><option>Found</option><option>Facility</option><option>Other</option>
          </select>
          <label>What happened?</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Filing ticket', async () => getContract(saved!, abi, signer!).createTicket(category, description))}>Submit ticket</button>
          </div>
        </section>
        <section className="card">
          <h2>Staff updates</h2>
          <p className="sub">Admins move tickets through the workflow.</p>
          <label>Ticket number</label>
          <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
          <label>New status</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="0">Open</option>
            <option value="1">In progress</option>
            <option value="2">Resolved</option>
            <option value="3">Closed</option>
          </select>
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Updating ticket', async () => getContract(saved!, abi, signer!).updateStatus(BigInt(ticketId), Number(newStatus)))}>Update status</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const labels = ['Open','In progress','Resolved','Closed']
              const t = await getContract(saved!, abi, signer!).getTicket(BigInt(ticketId))
              setResult(\`Ticket #\${ticketId} · \${labels[Number(t.status)]}\\n\${t.category}\\n\${t.description}\`)
            }}>View ticket</button>
          </div>
        </section>`,
        `  const [category, setCategory] = useState('Lost')\n  const [description, setDescription] = useState('')\n  const [ticketId, setTicketId] = useState('0')\n  const [newStatus, setNewStatus] = useState('1')\n`,
      )
    case 'crowdfund':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Support this campaign</h2>
          <p className="sub">Every contribution is recorded. Progress updates live.</p>
          <div className="meter"><i style={{ width: \`\${Math.min(progress, 100)}%\` }} /></div>
          <label>Amount (ETH)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Sending support', async () => getContract(saved!, abi, signer!).donate({ value: parseEther(amount) }))}>Contribute</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const i = await getContract(saved!, abi, signer!).getInfo()
              const pct = i.goal > 0n ? Number((i.raised * 100n) / i.goal) : 0
              setProgress(pct)
              setResult(\`\${i.name}\\nRaised \${formatEther(i.raised)} / \${formatEther(i.goal)} ETH\\n\${i.isClosed ? 'Campaign closed' : 'Campaign open'}\`)
            }}>Refresh progress</button>
          </div>
        </section>
        <section className="card">
          <h2>Campaign owner</h2>
          <p className="sub">Withdraw when you're ready to use the funds.</p>
          <div className="row">
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Withdrawing funds', async () => getContract(saved!, abi, signer!).withdraw())}>Withdraw balance</button>
          </div>
        </section>`,
        `  const [amount, setAmount] = useState('0.001')\n  const [progress, setProgress] = useState(0)\n`,
      )
    case 'peer-review':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Share your project</h2>
          <p className="sub">Publish a title so classmates can leave a rating.</p>
          <label>Project title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing project', async () => getContract(saved!, abi, signer!).submitProject(title))}>Publish</button>
          </div>
        </section>
        <section className="card">
          <h2>Leave a review <span className="stars">{'★'.repeat(Math.min(5, Math.max(1, Number(score) || 1)))}</span></h2>
          <p className="sub">Sign in with a different account than the author.</p>
          <label>Project number</label>
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <label>Stars (1–5)</label>
          <input value={score} onChange={(e) => setScore(e.target.value)} />
          <label>Comment</label>
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Sending review', async () => getContract(saved!, abi, signer!).rate(BigInt(projectId), Number(score), comment))}>Submit review</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const a = await getContract(saved!, abi, signer!).getAverage(BigInt(projectId))
              const p = await getContract(saved!, abi, signer!).getProject(BigInt(projectId))
              setResult(\`\${p.title}\\nAverage \${(Number(a.avgTimes100)/100).toFixed(2)} from \${a.count} reviews\`)
            }}>See score</button>
          </div>
        </section>`,
        `  const [title, setTitle] = useState('')\n  const [projectId, setProjectId] = useState('0')\n  const [score, setScore] = useState('5')\n  const [comment, setComment] = useState('Loved the demo')\n`,
      )
    case 'scholarship':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Record a grant</h2>
          <p className="sub">Admins publish support decisions for anyone to read.</p>
          <label>Student</label>
          <input value={student} onChange={(e) => setStudent(e.target.value)} />
          <label>Purpose</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <label>Amount (wei)</label>
          <input value={amountWei} onChange={(e) => setAmountWei(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Recording grant', async () => getContract(saved!, abi, signer!).recordGrant(student, purpose, BigInt(amountWei)))}>Publish entry</button>
          </div>
        </section>
        <section className="card">
          <h2>Look up an entry</h2>
          <p className="sub">Browse the public ledger by entry number.</p>
          <label>Entry number</label>
          <input value={grantId} onChange={(e) => setGrantId(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const g = await getContract(saved!, abi, signer!).getGrant(BigInt(grantId))
              const total = await getContract(saved!, abi, signer!).totalRecorded()
              setResult(\`\${g.studentName}\\n\${g.purpose}\\nAmount \${g.amountWei}\\nLedger total \${total}\`)
            }}>Open entry</button>
          </div>
        </section>`,
        `  const [student, setStudent] = useState('')\n  const [purpose, setPurpose] = useState('Tuition support')\n  const [amountWei, setAmountWei] = useState('1000000000000000')\n  const [grantId, setGrantId] = useState('0')\n`,
      )
    case 'inventory':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Add equipment</h2>
          <p className="sub">Register a kit and assign who is responsible.</p>
          <label>Item name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
          <label>Custodian wallet</label>
          <input value={custodian} onChange={(e) => setCustodian(e.target.value)} placeholder={address ?? '0x…'} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Adding item', async () => getContract(saved!, abi, signer!).addItem(name, location, custodian.trim() || address!))}>Add to inventory</button>
          </div>
        </section>
        <section className="card">
          <h2>Move or hand off</h2>
          <p className="sub">Update location or transfer custody to another person.</p>
          <label>Item number</label>
          <input value={itemId} onChange={(e) => setItemId(e.target.value)} />
          <label>New custodian</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Transferring', async () => getContract(saved!, abi, signer!).transferCustody(BigInt(itemId), to.trim()))}>Transfer</button>
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Updating location', async () => getContract(saved!, abi, signer!).updateLocation(BigInt(itemId), location))}>Save location</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const i = await getContract(saved!, abi, signer!).getItem(BigInt(itemId))
              setResult(\`\${i.name}\\nLocated at \${i.location}\\nWith \${i.custodian}\`)
            }}>Inspect</button>
          </div>
        </section>`,
        `  const [name, setName] = useState('Arduino Kit')\n  const [location, setLocation] = useState('Lab shelf A')\n  const [custodian, setCustodian] = useState('')\n  const [itemId, setItemId] = useState('0')\n  const [to, setTo] = useState('')\n`,
      )
    case 'poll':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Ask the campus</h2>
          <p className="sub">Create a short poll with 2–5 choices.</p>
          <label>Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <label>Choices (comma separated)</label>
          <input value={options} onChange={(e) => setOptions(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing poll', async () => {
              const opts = options.split(',').map((s) => s.trim()).filter(Boolean)
              return getContract(saved!, abi, signer!).createPoll(question, opts)
            })}>Publish poll</button>
          </div>
        </section>
        <section className="card">
          <h2>Vote</h2>
          <p className="sub">Enter the poll number and the choice index (0 for first option).</p>
          <label>Poll number</label>
          <input value={pollId} onChange={(e) => setPollId(e.target.value)} />
          <label>Your choice index</label>
          <input value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Recording vote', async () => getContract(saved!, abi, signer!).vote(BigInt(pollId), BigInt(optionIndex)))}>Submit vote</button>
            <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Closing poll', async () => getContract(saved!, abi, signer!).closePoll(BigInt(pollId)))}>Close poll</button>
            <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
              const p = await getContract(saved!, abi, signer!).getPoll(BigInt(pollId))
              setResult(\`\${p.question}\\n\\n\${p.options.map((o, i) => \`\${o}: \${p.votes[i]}\`).join('\\n')}\`)
            }}>Live results</button>
          </div>
        </section>`,
        `  const [question, setQuestion] = useState('When should the fest be?')\n  const [options, setOptions] = useState('Friday,Saturday,Sunday')\n  const [pollId, setPollId] = useState('0')\n  const [optionIndex, setOptionIndex] = useState('0')\n`,
      )
    case 'ai-model':
      return chrome(
        app,
        `
        <section className="card">
          <h2>Register a model</h2>
          <p className="sub">Publish a fingerprint of your model card so others can verify provenance.</p>
          <label>Model name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Version</label>
          <input value={version} onChange={(e) => setVersion(e.target.value)} />
          <label>Framework</label>
          <input value={framework} onChange={(e) => setFramework(e.target.value)} />
          <label>Model card / manifest</label>
          <textarea rows={4} value={manifest} onChange={(e) => setManifest(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!ready} onClick={() => void run('Registering model', async () => getContract(saved!, abi, signer!).registerModel(name, version, hashText(manifest), framework))}>Register</button>
          </div>
        </section>
        <section className="card">
          <h2>Verify provenance</h2>
          <p className="sub">Paste a model card to check if it was registered.</p>
          <label>Manifest to verify</label>
          <textarea rows={4} value={manifest} onChange={(e) => setManifest(e.target.value)} />
          <div className="row">
            <button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const v = await getContract(saved!, abi, signer!).verifyModel(hashText(manifest))
              setResult(v.found ? \`Verified\\n\${v.name} @ \${v.version}\\nPublisher \${v.publisher}\` : 'No matching registration')
            }}>Verify</button>
          </div>
        </section>`,
        `  const [name, setName] = useState('CampusSentimentBERT')\n  const [version, setVersion] = useState('1.0.0')\n  const [framework, setFramework] = useState('PyTorch')\n  const [manifest, setManifest] = useState('model=CampusSentimentBERT;acc=0.91;seed=42')\n`,
      )
    default:
      throw new Error(app.kind)
  }
}

for (const app of apps) {
  const dir = path.join(root, 'projects', app.id, 'frontend')
  writeBase(dir, app)
  console.log('product ui', app.id, app.title)
}
console.log('done', apps.length)
