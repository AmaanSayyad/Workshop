/**
 * Generates 10 polished product frontends.
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
    features: ['One vote per person', 'Live tallies', 'Admin-controlled ballots'],
    visual: 'ballot',
    theme: {
      font: 'DM Sans',
      display: 'Fraunces',
      bg: '#eef6f1',
      surface: '#ffffff',
      ink: '#10241a',
      muted: '#4d6a5a',
      accent: '#0f766e',
      accent2: '#0ea5e9',
      radius: '18px',
      dark: false,
    },
    abi: [
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
    features: ['Instant check-in', 'Live headcount', 'Close when done'],
    visual: 'check',
    theme: {
      font: 'Manrope',
      display: 'Space Grotesk',
      bg: '#e8f7fb',
      surface: '#ffffff',
      ink: '#082f3a',
      muted: '#3f6772',
      accent: '#0891b2',
      accent2: '#14b8a6',
      radius: '20px',
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
    features: ['Tamper-proof', 'Instant verify', 'Student-ready'],
    visual: 'seal',
    theme: {
      font: 'Source Sans 3',
      display: 'Libre Baskerville',
      bg: '#f0f4fa',
      surface: '#ffffff',
      ink: '#152238',
      muted: '#5b6b82',
      accent: '#1d4ed8',
      accent2: '#b45309',
      radius: '14px',
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
    features: ['Fast filing', 'Status updates', 'Staff workflow'],
    visual: 'ticket',
    theme: {
      font: 'IBM Plex Sans',
      display: 'IBM Plex Sans',
      bg: '#f4f5f9',
      surface: '#ffffff',
      ink: '#111827',
      muted: '#6b7280',
      accent: '#ea580c',
      accent2: '#2563eb',
      radius: '16px',
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
    features: ['Live progress', 'Transparent tips', 'Owner withdraw'],
    visual: 'fund',
    theme: {
      font: 'Sora',
      display: 'Sora',
      bg: '#ecfdf5',
      surface: '#ffffff',
      ink: '#064e3b',
      muted: '#047857',
      accent: '#059669',
      accent2: '#34d399',
      radius: '22px',
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
    features: ['1–5 star ratings', 'No self-review', 'Clear averages'],
    visual: 'stars',
    theme: {
      font: 'Outfit',
      display: 'Outfit',
      bg: '#fff4e8',
      surface: '#ffffff',
      ink: '#3b1604',
      muted: '#9a4b1a',
      accent: '#ea580c',
      accent2: '#fbbf24',
      radius: '24px',
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
    features: ['Public ledger', 'Searchable entries', 'Running totals'],
    visual: 'book',
    theme: {
      font: 'Newsreader',
      display: 'Newsreader',
      bg: '#f3faf4',
      surface: '#ffffff',
      ink: '#14532d',
      muted: '#3f6212',
      accent: '#15803d',
      accent2: '#84cc16',
      radius: '12px',
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
    features: ['Custody trail', 'Locations', 'Fast handoff'],
    visual: 'box',
    theme: {
      font: 'Barlow',
      display: 'Barlow Condensed',
      bg: '#eef3f8',
      surface: '#ffffff',
      ink: '#0f172a',
      muted: '#475569',
      accent: '#d97706',
      accent2: '#0284c7',
      radius: '10px',
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
    features: ['2–5 options', 'Live counts', 'One vote each'],
    visual: 'pulse',
    theme: {
      font: 'Plus Jakarta Sans',
      display: 'Plus Jakarta Sans',
      bg: '#eaf2ff',
      surface: '#ffffff',
      ink: '#1e3a8a',
      muted: '#3b82f6',
      accent: '#2563eb',
      accent2: '#06b6d4',
      radius: '18px',
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
    features: ['Manifest hashing', 'Publisher proof', 'AIML-ready'],
    visual: 'model',
    theme: {
      font: 'IBM Plex Sans',
      display: 'Syne',
      bg: '#070b12',
      surface: '#101826',
      ink: '#e8f1ff',
      muted: '#8b9cb3',
      accent: '#22d3ee',
      accent2: '#a3e635',
      radius: '14px',
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
        version: '2.1.0',
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
  <meta name="theme-color" content="${app.theme.accent}" />
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
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\ndist\n.DS_Store\n.env\n*.tsbuildinfo\n')
  fs.writeFileSync(path.join(dir, '.env.example'), 'VITE_APP_ID=\n')
  fs.writeFileSync(
    path.join(dir, 'src', 'main.tsx'),
    `import { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './styles.css'\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)\n`,
  )
  fs.writeFileSync(path.join(dir, 'src', 'vite-env.d.ts'), `/// <reference types="vite/client" />\n`)
  fs.writeFileSync(path.join(dir, 'src', 'abi.ts'), `export const abi = ${JSON.stringify(app.abi, null, 2)} as const\n`)
  fs.writeFileSync(path.join(dir, 'src', 'ethereum.ts'), ethereumTs())
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
  if (!window.ethereum) throw new Error('Install a wallet to sign in')
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
  const btnInk = t.dark ? '#041016' : '#fff'
  return `:root {
  --bg:${t.bg};--surface:${t.surface};--ink:${t.ink};--muted:${t.muted};
  --accent:${t.accent};--accent2:${t.accent2};--radius:${t.radius};
  --font:"${t.font}",system-ui,sans-serif;--display:"${t.display}",Georgia,serif;
  --line:color-mix(in srgb,var(--ink) ${t.dark ? '16%' : '9%'},transparent);
  --shadow:${t.dark ? '0 24px 60px rgba(0,0,0,.45)' : '0 20px 50px rgba(15,23,42,.08)'};
  --glow:color-mix(in srgb,var(--accent) 28%,transparent);
}
*{box-sizing:border-box}
html,body,#root{margin:0;min-height:100%}
body{
  font-family:var(--font);color:var(--ink);line-height:1.5;
  background:
    radial-gradient(1000px 520px at -10% -20%, var(--glow), transparent 55%),
    radial-gradient(800px 480px at 110% 0%, color-mix(in srgb,var(--accent2) 18%, transparent), transparent 50%),
    ${t.dark ? t.bg : `linear-gradient(180deg, ${t.bg}, color-mix(in srgb, ${t.bg} 55%, white))`};
}
body::before{
  content:"";position:fixed;inset:0;pointer-events:none;opacity:${t.dark ? '.18' : '.35'};
  background-image:radial-gradient(color-mix(in srgb,var(--ink) 14%, transparent) 1px, transparent 1px);
  background-size:22px 22px;mask-image:linear-gradient(180deg,#000,transparent 85%);
}
a{color:var(--accent2)}
.shell{width:min(1120px,calc(100% - 1.5rem));margin:0 auto 4rem;position:relative;z-index:1}
.nav{
  display:flex;justify-content:space-between;align-items:center;gap:1rem;
  margin-top:.85rem;padding:.55rem .55rem .55rem 1rem;
  border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--surface) 88%, transparent);
  backdrop-filter:blur(16px);box-shadow:var(--shadow);position:sticky;top:.75rem;z-index:30;
  animation:rise .55s ease both;
}
.logo{display:flex;align-items:center;gap:.75rem}
.mark{
  width:40px;height:40px;border-radius:14px;display:grid;place-items:center;
  background:linear-gradient(145deg,var(--accent),color-mix(in srgb,var(--accent) 55%, var(--accent2)));
  color:${btnInk};font-weight:800;font-family:var(--display);box-shadow:0 8px 20px var(--glow);
}
.logo strong{display:block;font-family:var(--display);font-size:1.12rem;letter-spacing:-.02em}
.logo small{color:var(--muted);font-size:.75rem}
.nav-actions{display:flex;gap:.45rem;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.btn{
  appearance:none;border:0;cursor:pointer;font:inherit;font-weight:700;
  padding:.78rem 1.15rem;border-radius:999px;background:var(--accent);color:${btnInk};
  transition:transform .15s ease, box-shadow .2s ease, opacity .15s ease;
  box-shadow:0 10px 24px var(--glow);
}
.btn:hover:not(:disabled){transform:translateY(-1px)}
.btn:active:not(:disabled){transform:translateY(0)}
.btn:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}
.btn.secondary{background:transparent;color:var(--ink);border:1px solid var(--line);box-shadow:none}
.btn.ghost{background:color-mix(in srgb,var(--accent) 12%, transparent);color:var(--accent);box-shadow:none}
.btn.block{width:100%}
.pill{
  font-size:.84rem;padding:.5rem .85rem;border-radius:999px;border:1px solid var(--line);
  background:var(--surface);font-variant-numeric:tabular-nums;
}
.hero{display:grid;gap:1.4rem;padding:2.4rem 0 1.5rem;animation:rise .7s .05s ease both}
@media(min-width:900px){.hero{grid-template-columns:1.15fr .85fr;align-items:stretch}}
.kicker{display:inline-flex;align-items:center;gap:.4rem;margin:0 0 .85rem;padding:.28rem .7rem;border-radius:999px;
  background:color-mix(in srgb,var(--accent) 12%, transparent);color:var(--accent);font-size:.74rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.hero h1{font-family:var(--display);font-size:clamp(2.5rem,5.8vw,4rem);line-height:.98;letter-spacing:-.045em;margin:0 0 .85rem;max-width:11ch}
.hero-lead{margin:0;color:var(--muted);font-size:1.08rem;max-width:34ch}
.feature-row{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1.2rem}
.feature{
  padding:.4rem .7rem;border-radius:999px;border:1px solid var(--line);
  background:color-mix(in srgb,var(--surface) 80%, transparent);font-size:.82rem;color:var(--muted)
}
.visual{
  position:relative;overflow:hidden;border-radius:calc(var(--radius) + 8px);
  border:1px solid var(--line);background:var(--surface);box-shadow:var(--shadow);
  min-height:280px;display:grid;place-items:center;padding:1.4rem;animation:rise .75s .12s ease both;
}
.visual-inner{width:min(280px,100%);aspect-ratio:1;position:relative}
.visual-inner::before,.visual-inner::after{content:"";position:absolute;inset:8%;border-radius:28px;border:1px solid color-mix(in srgb,var(--accent) 35%, transparent)}
.visual-inner::after{inset:18%;border-radius:22px;background:
  radial-gradient(circle at 30% 30%, color-mix(in srgb,var(--accent2) 35%, transparent), transparent 45%),
  linear-gradient(145deg, color-mix(in srgb,var(--accent) 18%, transparent), transparent)}
.visual[data-kind="ballot"] .orb{position:absolute;inset:28%;border-radius:18px;background:var(--accent);opacity:.9}
.visual[data-kind="check"] .orb{position:absolute;left:32%;right:32%;top:28%;bottom:38%;border-radius:50%;border:6px solid var(--accent);border-top-color:transparent;transform:rotate(45deg)}
.visual[data-kind="seal"] .orb{position:absolute;inset:26%;border-radius:50%;border:8px double var(--accent)}
.visual[data-kind="ticket"] .orb{position:absolute;left:22%;right:22%;top:30%;bottom:30%;border-radius:14px;background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:.85}
.visual[data-kind="fund"] .orb{position:absolute;left:30%;right:30%;top:22%;bottom:22%;border-radius:999px;background:linear-gradient(180deg,var(--accent2),var(--accent))}
.visual[data-kind="stars"] .orb{position:absolute;inset:30%;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:var(--accent2)}
.visual[data-kind="book"] .orb{position:absolute;left:28%;right:28%;top:24%;bottom:24%;border-radius:8px;background:linear-gradient(90deg,transparent 48%,var(--line) 48% 52%,transparent 52%),linear-gradient(180deg,var(--accent),color-mix(in srgb,var(--accent) 40%, white))}
.visual[data-kind="box"] .orb{position:absolute;inset:28%;border-radius:8px;background:var(--accent);transform:perspective(200px) rotateX(18deg) rotateZ(-8deg)}
.visual[data-kind="pulse"] .orb{position:absolute;left:18%;right:18%;top:42%;height:16px;border-radius:999px;background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent)}
.visual[data-kind="model"] .orb{position:absolute;inset:26%;border-radius:16px;background:
  repeating-linear-gradient(0deg, transparent, transparent 10px, color-mix(in srgb,var(--accent) 35%, transparent) 10px 11px),
  repeating-linear-gradient(90deg, transparent, transparent 10px, color-mix(in srgb,var(--accent2) 25%, transparent) 10px 11px)}
.visual-caption{position:absolute;left:1rem;right:1rem;bottom:1rem;padding:.7rem .85rem;border-radius:14px;
  background:color-mix(in srgb,var(--surface) 92%, transparent);border:1px solid var(--line);backdrop-filter:blur(8px)}
.visual-caption strong{display:block;font-size:.92rem}
.visual-caption span{color:var(--muted);font-size:.8rem}
.setup-banner{
  display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;
  margin:0 0 1rem;padding:1rem 1.1rem;border-radius:16px;border:1px solid color-mix(in srgb,var(--accent) 35%, var(--line));
  background:color-mix(in srgb,var(--accent) 10%, var(--surface));animation:rise .5s ease both;
}
.setup-banner strong{display:block;margin-bottom:.15rem}
.setup-banner p{margin:0;color:var(--muted);font-size:.92rem}
.tabs{
  display:inline-flex;gap:.3rem;padding:.28rem;border-radius:999px;border:1px solid var(--line);
  background:color-mix(in srgb,var(--surface) 85%, transparent);margin:0 0 1rem;animation:rise .7s .15s ease both;
}
.tab{
  appearance:none;border:0;background:transparent;color:var(--muted);font:inherit;font-weight:700;
  padding:.55rem 1rem;border-radius:999px;cursor:pointer;
}
.tab.active{background:var(--accent);color:${btnInk};box-shadow:0 8px 18px var(--glow)}
.workspace{display:grid;gap:1rem;animation:rise .75s .18s ease both}
@media(min-width:900px){.workspace.two{grid-template-columns:1.05fr .95fr}}
.card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);
  padding:1.25rem 1.3rem;box-shadow:var(--shadow);transition:transform .2s ease, border-color .2s ease;
}
.card:hover{border-color:color-mix(in srgb,var(--accent) 28%, var(--line))}
.card h2{margin:0 0 .35rem;font-family:var(--display);font-size:1.4rem;letter-spacing:-.02em}
.card .sub{margin:0 0 1.05rem;color:var(--muted)}
.field{margin-top:.85rem}
label{display:block;font-size:.8rem;color:var(--muted);font-weight:700;letter-spacing:.02em}
input,textarea,select{
  width:100%;margin-top:.4rem;padding:.85rem .95rem;border-radius:14px;
  border:1px solid var(--line);background:${t.dark ? '#0a121c' : '#f8fafc'};color:var(--ink);font:inherit;
  transition:border-color .15s ease, box-shadow .15s ease;
}
input:focus,textarea:focus,select:focus{
  outline:none;border-color:color-mix(in srgb,var(--accent) 55%, var(--line));
  box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 16%, transparent);
}
.row{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}
.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin-top:1rem}
.choice{
  appearance:none;border:1px solid var(--line);background:${t.dark ? '#0a121c' : '#fff'};
  border-radius:16px;padding:1rem;cursor:pointer;text-align:left;font:inherit;color:var(--ink);
  transition:transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}
.choice:hover:not(:disabled){transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 45%, var(--line));box-shadow:var(--shadow)}
.choice:disabled{opacity:.45;cursor:not-allowed}
.choice b{display:block;font-size:1.05rem;margin-bottom:.2rem}
.choice span{color:var(--muted);font-size:.85rem}
.choice.yes{border-color:color-mix(in srgb,#16a34a 35%, var(--line))}
.choice.no{border-color:color-mix(in srgb,#dc2626 30%, var(--line))}
.meter{height:14px;border-radius:999px;background:color-mix(in srgb,var(--ink) 8%, transparent);overflow:hidden;margin:1rem 0}
.meter>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s ease}
.stars{color:var(--accent2);letter-spacing:.14em;font-size:1.4rem}
.toast{
  position:fixed;left:50%;bottom:1.25rem;transform:translateX(-50%);
  width:min(520px,calc(100% - 1.5rem));padding:.95rem 1.1rem;border-radius:16px;
  background:var(--ink);color:${t.dark ? '#041016' : '#fff'};z-index:60;box-shadow:var(--shadow);
  animation:toast-in .35s ease both;
}
.toast a{color:var(--accent2);font-weight:700}
.result{
  margin-top:1rem;padding:1.05rem 1.1rem;border-radius:16px;border:1px solid var(--line);
  background:${t.dark ? '#0a121c' : '#f8fafc'};white-space:pre-wrap;word-break:break-word;animation:rise .35s ease both;
}
.modal-backdrop{position:fixed;inset:0;background:rgba(8,12,18,.5);display:grid;place-items:center;padding:1rem;z-index:70;animation:fade .2s ease}
.modal{width:min(440px,100%);background:var(--surface);border-radius:20px;padding:1.25rem;border:1px solid var(--line);box-shadow:var(--shadow);animation:rise .25s ease}
.modal h3{margin:0 0 .35rem;font-family:var(--display)}
.modal p{margin:0 0 .9rem;color:var(--muted);font-size:.92rem}
.footer{margin-top:2.75rem;padding:1.1rem 0;border-top:1px solid var(--line);color:var(--muted);font-size:.84rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes toast-in{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}
@media(max-width:700px){
  .nav{border-radius:20px;align-items:stretch;flex-direction:column}
  .nav-actions{width:100%}
  .nav-actions .btn,.nav-actions .pill{flex:1;text-align:center}
  .choice-grid{grid-template-columns:1fr}
  .hero h1{max-width:none}
}
`
}

function sharedState() {
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
  const [tab, setTab] = useState<'create' | 'use'>('use')

  const isSepolia = chainId === SEPOLIA_CHAIN_ID
  const ready = Boolean(signer && saved && isSepolia && !busy)
  const setupHint = !address
    ? 'Sign in to continue'
    : !saved
      ? 'Connect the app ID in Settings before publishing'
      : !isSepolia
        ? 'Switch your wallet to Sepolia, then try again'
        : ''

  useEffect(() => {
    const fromEnv = import.meta.env.VITE_APP_ID as string | undefined
    const s = fromEnv && isAddressLike(fromEnv) ? fromEnv : localStorage.getItem(STORAGE_KEY)
    if (s && isAddressLike(s)) { setAppId(s); setSaved(s) }
  }, [])

  async function signIn() {
    try {
      const w = await connectWallet()
      setAddress(w.address); setSigner(w.signer); setChainId(w.chainId)
      if (w.chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
        const again = await connectWallet()
        setAddress(again.address); setSigner(again.signer); setChainId(again.chainId)
      }
      setStatus('')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not sign in')
    }
  }

  function saveConnection() {
    const v = appId.trim()
    if (!isAddressLike(v)) { setStatus('Paste a valid app ID'); return }
    localStorage.setItem(STORAGE_KEY, v)
    setSaved(v); setSettingsOpen(false); setStatus('App connected')
  }

  const run = useCallback(async (label: string, fn: () => Promise<ContractTransactionResponse>) => {
    if (!signer || !saved) {
      setSettingsOpen(true)
      setStatus('Sign in and connect the app ID in Settings first')
      return
    }
    if (!isSepolia) {
      setStatus('Switch your wallet to Sepolia, then retry')
      return
    }
    setBusy(true); setStatus(label + '…'); setTxHash(null)
    try {
      const tx = await fn(); setTxHash(tx.hash); setStatus('Confirming…'); await tx.wait(); setStatus(label + ' complete')
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Something went wrong')
    } finally { setBusy(false) }
  }, [signer, saved, isSepolia])
`
}

function chrome(app, createPane, usePane, extraState) {
  const features = app.features.map((f) => `<span className="feature">${f}</span>`).join('\n            ')
  return `import { useCallback, useEffect, useState } from 'react'
import type { ContractTransactionResponse, JsonRpcSigner } from 'ethers'
import { formatEther, parseEther } from 'ethers'
import {
  SEPOLIA_CHAIN_ID, STORAGE_KEY, connectWallet, explorerTx, getContract, hashText,
  isAddressLike, shortAddress, switchToSepolia,
} from './ethereum'
import { abi } from './abi'

export default function App() {
${sharedState()}
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
          {address ? <span className="pill">{shortAddress(address)}</span> : (
            <button type="button" className="btn" onClick={() => void signIn()}>Sign in</button>
          )}
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="kicker">${app.productLine}</p>
          <h1>${app.hero}</h1>
          <p className="hero-lead">${app.tagline}</p>
          <div className="feature-row">
            ${features}
          </div>
        </div>
        <div className="visual" data-kind="${app.visual}">
          <div className="visual-inner"><div className="orb" /></div>
          <div className="visual-caption">
            <strong>{address ? 'Signed in' : 'Guest mode'}</strong>
            <span>{saved ? (isSepolia || !address ? 'Ready to use' : 'Wrong network — switch to Sepolia') : 'Open Settings → paste App ID (contract address from Remix)'}</span>
          </div>
        </div>
      </header>

      {setupHint && (
        <div className="setup-banner">
          <div>
            <strong>Almost there</strong>
            <p>{setupHint}</p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (!address) void signIn()
              else setSettingsOpen(true)
            }}
          >
            {!address ? 'Sign in' : 'Open Settings'}
          </button>
        </div>
      )}

      <div className="tabs">
        <button type="button" className={tab === 'use' ? 'tab active' : 'tab'} onClick={() => setTab('use')}>Use app</button>
        <button type="button" className={tab === 'create' ? 'tab active' : 'tab'} onClick={() => setTab('create')}>Create / manage</button>
      </div>

      <div className="workspace">
        {tab === 'use' ? (
${usePane}
        ) : (
${createPane}
        )}
      </div>

      {result && <pre className="result">{result}</pre>}

      {status && (
        <div className="toast">
          {status}
          {txHash && <> · <a href={explorerTx(txHash)} target="_blank" rel="noreferrer">View receipt</a></>}
        </div>
      )}

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>App setup</h3>
            <p>Organizers paste the shared app ID once. After that, everyone signs in and uses the product.</p>
            <div className="field">
              <label>App ID</label>
              <input value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="0x…" spellCheck={false} />
            </div>
            <div className="row">
              <button type="button" className="btn" onClick={saveConnection}>Save</button>
              <button type="button" className="btn secondary" onClick={() => setSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>© ${app.title}</span>
        <span>Made for real campus workflows</span>
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
        `          <section className="card">
            <h2>Create an election</h2>
            <p className="sub">Publish a clear yes/no question for your club or class.</p>
            <div className="field">
              <label>Question</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Elect club president" />
            </div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing', async () => getContract(saved!, abi, signer!).createProposal(title))}>Publish election</button>
            </div>
          </section>`,
        `          <section className="card">
            <h2>Cast your vote</h2>
            <p className="sub">Enter the election number shared with you, then choose a side.</p>
            <div className="field">
              <label>Election number</label>
              <input value={proposalId} onChange={(e) => setProposalId(e.target.value)} />
            </div>
            <div className="choice-grid">
              <button type="button" className="choice yes" disabled={!ready} onClick={() => void run('Voting yes', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), true))}>
                <b>Yes</b><span>Support this proposal</span>
              </button>
              <button type="button" className="choice no" disabled={!ready} onClick={() => void run('Voting no', async () => getContract(saved!, abi, signer!).vote(BigInt(proposalId), false))}>
                <b>No</b><span>Reject this proposal</span>
              </button>
            </div>
            <div className="row">
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const p = await getContract(saved!, abi, signer!).getProposal(BigInt(proposalId))
                setResult(\`\${p.title}\\n\\nYes  \${p.yesVotes}\\nNo   \${p.noVotes}\`)
              }}>See live results</button>
            </div>
          </section>`,
        `  const [title, setTitle] = useState('Elect Club President')\n  const [proposalId, setProposalId] = useState('0')\n`,
      )
    case 'attendance':
      return chrome(
        app,
        `          <section className="card">
            <h2>Host a session</h2>
            <p className="sub">Open attendance for a class or event, then close it when finished.</p>
            <div className="field"><label>Session name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Opening session', async () => getContract(saved!, abi, signer!).createSession(name))}>Open session</button>
              <button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Closing session', async () => getContract(saved!, abi, signer!).closeSession(BigInt(sessionId)))}>End session</button>
            </div>
          </section>`,
        `          <section className="card">
            <h2>I'm here</h2>
            <p className="sub">Type the session number on the board and check in once.</p>
            <div className="field"><label>Session number</label><input value={sessionId} onChange={(e) => setSessionId(e.target.value)} /></div>
            <div className="row">
              <button type="button" className="btn block" disabled={!ready} onClick={() => void run('Checking in', async () => getContract(saved!, abi, signer!).checkIn(BigInt(sessionId)))}>Check in now</button>
            </div>
            <div className="row">
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const s = await getContract(saved!, abi, signer!).getSession(BigInt(sessionId))
                setResult(\`\${s.name}\\n\${s.open ? 'Open for check-ins' : 'Closed'}\\nPresent: \${s.count}\`)
              }}>See headcount</button>
            </div>
          </section>`,
        `  const [name, setName] = useState('Morning lab')\n  const [sessionId, setSessionId] = useState('0')\n`,
      )
    case 'certificate':
      return chrome(
        app,
        `          <section className="card">
            <h2>Issue a certificate</h2>
            <p className="sub">Write the credential once. Verification uses a fingerprint of this text.</p>
            <div className="field"><label>Certificate text</label><textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} /></div>
            <div className="field"><label>Student</label><input value={student} onChange={(e) => setStudent(e.target.value)} /></div>
            <div className="field"><label>Course</label><input value={course} onChange={(e) => setCourse(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Issuing', async () => getContract(saved!, abi, signer!).issueCertificate(student, course, hashText(content)))}>Issue certificate</button></div>
          </section>`,
        `          <section className="card">
            <h2>Verify authenticity</h2>
            <p className="sub">Paste the certificate text exactly as issued.</p>
            <div className="field"><label>Certificate text</label><textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const v = await getContract(saved!, abi, signer!).verify(hashText(content))
              setResult(v.valid ? \`Authentic\\n\${v.studentName}\\n\${v.courseName}\` : 'Not found or revoked')
            }}>Verify now</button></div>
          </section>`,
        `  const [content, setContent] = useState('Certificate of completion — Blockchain Lab 2026')\n  const [student, setStudent] = useState('')\n  const [course, setCourse] = useState('Blockchain Technologies')\n`,
      )
    case 'complaints':
      return chrome(
        app,
        `          <section className="card">
            <h2>Staff workspace</h2>
            <p className="sub">Update ticket status as you work through the queue.</p>
            <div className="field"><label>Ticket number</label><input value={ticketId} onChange={(e) => setTicketId(e.target.value)} /></div>
            <div className="field"><label>Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="0">Open</option><option value="1">In progress</option><option value="2">Resolved</option><option value="3">Closed</option>
              </select>
            </div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Updating', async () => getContract(saved!, abi, signer!).updateStatus(BigInt(ticketId), Number(newStatus)))}>Update status</button>
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const labels = ['Open','In progress','Resolved','Closed']
                const t = await getContract(saved!, abi, signer!).getTicket(BigInt(ticketId))
                setResult(\`Ticket #\${ticketId} · \${labels[Number(t.status)]}\\n\${t.category}\\n\${t.description}\`)
              }}>View ticket</button>
            </div>
          </section>`,
        `          <section className="card">
            <h2>New request</h2>
            <p className="sub">Lost ID? Broken projector? Tell us what happened.</p>
            <div className="field"><label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Lost</option><option>Found</option><option>Facility</option><option>Other</option>
              </select>
            </div>
            <div className="field"><label>Details</label><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue…" /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Filing ticket', async () => getContract(saved!, abi, signer!).createTicket(category, description))}>Submit ticket</button></div>
          </section>`,
        `  const [category, setCategory] = useState('Lost')\n  const [description, setDescription] = useState('')\n  const [ticketId, setTicketId] = useState('0')\n  const [newStatus, setNewStatus] = useState('1')\n`,
      )
    case 'crowdfund':
      return chrome(
        app,
        `          <section className="card">
            <h2>Campaign owner</h2>
            <p className="sub">Withdraw when you are ready to use the funds.</p>
            <div className="row"><button type="button" className="btn secondary" disabled={!ready} onClick={() => void run('Withdrawing', async () => getContract(saved!, abi, signer!).withdraw())}>Withdraw balance</button></div>
          </section>`,
        `          <section className="card">
            <h2>Support this campaign</h2>
            <p className="sub">Every contribution is recorded with live progress.</p>
            <div className="meter"><i style={{ width: \`\${Math.min(progress, 100)}%\` }} /></div>
            <div className="field"><label>Amount (ETH)</label><input value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="row">
              <button type="button" className="btn" disabled={!ready} onClick={() => void run('Sending support', async () => getContract(saved!, abi, signer!).donate({ value: parseEther(amount) }))}>Contribute</button>
              <button type="button" className="btn ghost" disabled={!signer || !saved} onClick={async () => {
                const i = await getContract(saved!, abi, signer!).getInfo()
                const pct = i.goal > 0n ? Number((i.raised * 100n) / i.goal) : 0
                setProgress(pct)
                setResult(\`\${i.name}\\nRaised \${formatEther(i.raised)} / \${formatEther(i.goal)} ETH\\n\${i.isClosed ? 'Closed' : 'Open'}\`)
              }}>Refresh progress</button>
            </div>
          </section>`,
        `  const [amount, setAmount] = useState('0.001')\n  const [progress, setProgress] = useState(0)\n`,
      )
    case 'peer-review':
      return chrome(
        app,
        `          <section className="card">
            <h2>Share your project</h2>
            <p className="sub">Publish a title so classmates can leave feedback.</p>
            <div className="field"><label>Project title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing', async () => getContract(saved!, abi, signer!).submitProject(title))}>Publish project</button></div>
          </section>`,
        `          <section className="card">
            <h2>Leave a review <span className="stars">{'★'.repeat(Math.min(5, Math.max(1, Number(score) || 1)))}</span></h2>
            <p className="sub">Use a different account than the author.</p>
            <div className="field"><label>Project number</label><input value={projectId} onChange={(e) => setProjectId(e.target.value)} /></div>
            <div className="field"><label>Stars (1–5)</label><input value={score} onChange={(e) => setScore(e.target.value)} /></div>
            <div className="field"><label>Comment</label><input value={comment} onChange={(e) => setComment(e.target.value)} /></div>
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
        `          <section className="card">
            <h2>Record a grant</h2>
            <p className="sub">Publish support decisions for anyone to read.</p>
            <div className="field"><label>Student</label><input value={student} onChange={(e) => setStudent(e.target.value)} /></div>
            <div className="field"><label>Purpose</label><input value={purpose} onChange={(e) => setPurpose(e.target.value)} /></div>
            <div className="field"><label>Amount (wei)</label><input value={amountWei} onChange={(e) => setAmountWei(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Recording', async () => getContract(saved!, abi, signer!).recordGrant(student, purpose, BigInt(amountWei)))}>Publish entry</button></div>
          </section>`,
        `          <section className="card">
            <h2>Look up an entry</h2>
            <p className="sub">Browse the public ledger by entry number.</p>
            <div className="field"><label>Entry number</label><input value={grantId} onChange={(e) => setGrantId(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const g = await getContract(saved!, abi, signer!).getGrant(BigInt(grantId))
              const total = await getContract(saved!, abi, signer!).totalRecorded()
              setResult(\`\${g.studentName}\\n\${g.purpose}\\nAmount \${g.amountWei}\\nLedger total \${total}\`)
            }}>Open entry</button></div>
          </section>`,
        `  const [student, setStudent] = useState('')\n  const [purpose, setPurpose] = useState('Tuition support')\n  const [amountWei, setAmountWei] = useState('1000000000000000')\n  const [grantId, setGrantId] = useState('0')\n`,
      )
    case 'inventory':
      return chrome(
        app,
        `          <section className="card">
            <h2>Add equipment</h2>
            <p className="sub">Register a kit and assign who is responsible.</p>
            <div className="field"><label>Item</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div className="field"><label>Custodian</label><input value={custodian} onChange={(e) => setCustodian(e.target.value)} placeholder={address ?? '0x…'} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Adding item', async () => getContract(saved!, abi, signer!).addItem(name, location, custodian.trim() || address!))}>Add to inventory</button></div>
          </section>`,
        `          <section className="card">
            <h2>Move or hand off</h2>
            <p className="sub">Update location or transfer custody.</p>
            <div className="field"><label>Item number</label><input value={itemId} onChange={(e) => setItemId(e.target.value)} /></div>
            <div className="field"><label>New custodian</label><input value={to} onChange={(e) => setTo(e.target.value)} /></div>
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
        `          <section className="card">
            <h2>Ask the campus</h2>
            <p className="sub">Create a short poll with 2–5 choices.</p>
            <div className="field"><label>Question</label><input value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
            <div className="field"><label>Choices (comma separated)</label><input value={options} onChange={(e) => setOptions(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Publishing poll', async () => {
              const opts = options.split(',').map((s) => s.trim()).filter(Boolean)
              return getContract(saved!, abi, signer!).createPoll(question, opts)
            })}>Publish poll</button></div>
          </section>`,
        `          <section className="card">
            <h2>Vote</h2>
            <p className="sub">Enter the poll number and choice index (0 = first option).</p>
            <div className="field"><label>Poll number</label><input value={pollId} onChange={(e) => setPollId(e.target.value)} /></div>
            <div className="field"><label>Choice index</label><input value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} /></div>
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
        `          <section className="card">
            <h2>Register a model</h2>
            <p className="sub">Publish a fingerprint of your model card for provenance.</p>
            <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Version</label><input value={version} onChange={(e) => setVersion(e.target.value)} /></div>
            <div className="field"><label>Framework</label><input value={framework} onChange={(e) => setFramework(e.target.value)} /></div>
            <div className="field"><label>Model card / manifest</label><textarea rows={4} value={manifest} onChange={(e) => setManifest(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!ready} onClick={() => void run('Registering', async () => getContract(saved!, abi, signer!).registerModel(name, version, hashText(manifest), framework))}>Register</button></div>
          </section>`,
        `          <section className="card">
            <h2>Verify provenance</h2>
            <p className="sub">Paste a model card to check if it was registered.</p>
            <div className="field"><label>Manifest</label><textarea rows={5} value={manifest} onChange={(e) => setManifest(e.target.value)} /></div>
            <div className="row"><button type="button" className="btn" disabled={!signer || !saved} onClick={async () => {
              const v = await getContract(saved!, abi, signer!).verifyModel(hashText(manifest))
              setResult(v.found ? \`Verified\\n\${v.name} @ \${v.version}\\nPublisher \${v.publisher}\` : 'No matching registration')
            }}>Verify</button></div>
          </section>`,
        `  const [name, setName] = useState('CampusSentimentBERT')\n  const [version, setVersion] = useState('1.0.0')\n  const [framework, setFramework] = useState('PyTorch')\n  const [manifest, setManifest] = useState('model=CampusSentimentBERT;acc=0.91;seed=42')\n`,
      )
    default:
      throw new Error(app.kind)
  }
}

for (const app of apps) {
  writeBase(path.join(root, 'projects', app.id, 'frontend'), app)
  console.log('ui+', app.id, app.title)
}
console.log('done', apps.length)
