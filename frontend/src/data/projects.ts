export type MiniProject = {
  id: number
  slug: string
  title: string
  shortTitle: string
  problem: string
  syllabusFit: string
  contractFile: string
  remixConstructorArgs: string
  steps: string[]
}

export const PROJECTS: MiniProject[] = [
  {
    id: 1,
    slug: 'voting',
    title: 'College / Club Voting',
    shortTitle: 'Voting',
    problem:
      'Build a transparent campus election where each wallet can vote once on a proposal (yes/no).',
    syllabusFit: 'Exp 6, 9, 10 — Remix + MetaMask + full DApp',
    contractFile: 'projects/01-voting/CampusVoting.sol',
    remixConstructorArgs: '(none — empty constructor)',
    steps: [
      'Deploy CampusVoting in Remix on Sepolia',
      'As owner, createProposal("Elect Club President")',
      'Paste contract address in this UI',
      'Vote yes/no from student wallets',
      'Screenshot proposal tallies + Etherscan tx for submission',
    ],
  },
  {
    id: 2,
    slug: 'attendance',
    title: 'Event / Class Attendance Check-in',
    shortTitle: 'Attendance',
    problem:
      'Create class/event sessions and let students check in once with their wallet as proof of presence.',
    syllabusFit: 'Exp 6, 9, 10',
    contractFile: 'projects/02-attendance/AttendanceCheckIn.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy AttendanceCheckIn',
      'Owner creates a session (e.g. "Web3 Lab Hour")',
      'Students call checkIn(sessionId)',
      'Owner can closeSession when done',
      'Record session count for the report',
    ],
  },
  {
    id: 3,
    slug: 'certificate',
    title: 'Certificate / Credential Registry',
    shortTitle: 'Certificates',
    problem:
      'Issue certificates by storing a document hash on-chain so anyone can verify authenticity.',
    syllabusFit: 'Exp 6, 9, 10 — strong for academic writeups',
    contractFile: 'projects/03-certificate/CertificateRegistry.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy CertificateRegistry',
      'Compute keccak256 hash of certificate text in Remix or UI',
      'Owner issues certificate with name + course + hash',
      'Anyone verifies the same hash',
      'Optional: revoke a certificate',
    ],
  },
  {
    id: 4,
    slug: 'complaints',
    title: 'Lost & Found / Complaint Tracker',
    shortTitle: 'Complaints',
    problem:
      'Students open campus tickets (lost/found/facility); admin updates status on-chain.',
    syllabusFit: 'Exp 9, 10',
    contractFile: 'projects/04-complaints/ComplaintTracker.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy ComplaintTracker',
      'Create a ticket with category + description',
      'Owner updates status (Open → InProgress → Resolved)',
      'Read ticket back in UI for screenshots',
    ],
  },
  {
    id: 5,
    slug: 'crowdfund',
    title: 'Crowdfunding / Tip Jar',
    shortTitle: 'Crowdfund',
    problem:
      'Raise ETH for a campus campaign; track donations and let owner withdraw.',
    syllabusFit: 'Exp 5, 6, 9, 10 — includes payable ETH transfers',
    contractFile: 'projects/05-crowdfund/CampusCrowdfund.sol',
    remixConstructorArgs: '"Campus Innovation Fund", 1000000000000000  (name, goal in wei = 0.001 ETH)',
    steps: [
      'Deploy with constructor args (name + goalWei)',
      'Donate small Sepolia ETH amounts',
      'View totalRaised / balance',
      'Owner withdraws funds',
    ],
  },
  {
    id: 6,
    slug: 'peer-review',
    title: 'Peer Review / Project Rating',
    shortTitle: 'Peer Review',
    problem:
      'Students submit project titles; peers rate 1–5 stars once (no self-rating).',
    syllabusFit: 'Exp 9, 10',
    contractFile: 'projects/06-peer-review/PeerReview.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy PeerReview',
      'Submit a project from wallet A',
      'Rate from wallet B (score 1–5 + comment)',
      'Show average score in UI',
    ],
  },
  {
    id: 7,
    slug: 'scholarship',
    title: 'Scholarship / Fee Transparency Ledger',
    shortTitle: 'Scholarship',
    problem:
      'Admin publicly records scholarship grants so amounts and purposes are transparent.',
    syllabusFit: 'Exp 9, 10',
    contractFile: 'projects/07-scholarship/ScholarshipLedger.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy ScholarshipLedger',
      'Owner records grants (name, purpose, amountWei)',
      'Anyone reads grant list / totals',
      'Use in report as transparency use-case',
    ],
  },
  {
    id: 8,
    slug: 'inventory',
    title: 'Supply / Inventory Custody Log',
    shortTitle: 'Inventory',
    problem:
      'Track lab equipment: add items, update location, transfer custody between wallets.',
    syllabusFit: 'Exp 9, 10',
    contractFile: 'projects/08-inventory/InventoryLog.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy InventoryLog',
      'Owner adds item with custodian address',
      'Transfer custody to another wallet',
      'Update location string',
    ],
  },
  {
    id: 9,
    slug: 'poll',
    title: 'Campus Event Poll / Prediction',
    shortTitle: 'Poll',
    problem:
      'Create multi-option campus polls (2–5 options); one vote per wallet; no real money.',
    syllabusFit: 'Exp 6, 9, 10',
    contractFile: 'projects/09-poll/CampusPoll.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy CampusPoll',
      'Owner creates poll with question + options array',
      'Students vote for an option index',
      'Close poll and screenshot results',
    ],
  },
  {
    id: 10,
    slug: 'ai-model',
    title: 'AI Model / Dataset Hash Registry',
    shortTitle: 'AI Model Registry',
    problem:
      'Register ML model name, version, framework, and content hash for provenance (fits AIML).',
    syllabusFit: 'Exp 9, 10 — best fit for CSE (AI & ML)',
    contractFile: 'projects/10-ai-model/AIModelRegistry.sol',
    remixConstructorArgs: '(none)',
    steps: [
      'Deploy AIModelRegistry',
      'Hash model manifest text (keccak256)',
      'registerModel(name, version, hash, framework)',
      'verifyModel(hash) from another wallet',
    ],
  },
]

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug)
}
