export type ExplainLine = { line: string; explain: string }

export const EXPLANATIONS: Record<
  string,
  { contract: ExplainLine[]; frontend: ExplainLine[] }
> = {
  voting: {
    contract: [
      { line: 'pragma solidity ^0.8.20;', explain: 'Compiler version — use 0.8.20+ in Remix.' },
      { line: 'address public owner;', explain: 'Stores deployer wallet. `public` auto-creates a getter.' },
      { line: 'struct Proposal { ... }', explain: 'Custom type bundling title + vote counts + exists flag.' },
      { line: 'mapping(uint256 => Proposal) public proposals;', explain: 'Dictionary: proposal id → Proposal data in storage.' },
      { line: 'mapping(...) public hasVoted;', explain: 'Tracks one-vote-per-wallet per proposal.' },
      { line: 'event ProposalCreated(...)', explain: 'Logs for Etherscan/UI. Indexed fields are searchable.' },
      { line: 'modifier onlyOwner()', explain: 'Reusable check: only deployer can create proposals.' },
      { line: 'constructor() { owner = msg.sender; }', explain: 'Runs once at deploy. `msg.sender` = who clicked Deploy.' },
      { line: 'createProposal(title)', explain: 'Writes a new Proposal at proposals[id], increments count.' },
      { line: 'vote(proposalId, support)', explain: 'Requires proposal exists + not voted; increments yes or no.' },
      { line: 'getProposal(id)', explain: 'View function — free to call, returns fields for the UI.' },
    ],
    frontend: [
      { line: 'connect MetaMask', explain: 'Browser injects window.ethereum; ethers BrowserProvider wraps it.' },
      { line: 'paste contract address', explain: 'Frontend needs the deployed address — ABI alone is not enough.' },
      { line: 'new Contract(address, abi, signer)', explain: 'Typed handle to call createProposal / vote / getProposal.' },
      { line: 'await tx.wait()', explain: 'Wait until Sepolia miners include the transaction.' },
      { line: 'read getProposal', explain: 'After voting, refresh tallies from chain (source of truth).' },
    ],
  },
  attendance: {
    contract: [
      { line: 'struct Session', explain: 'One class/event: name, open flag, check-in count.' },
      { line: 'createSession(name)', explain: 'Owner opens a session; startTime = block.timestamp.' },
      { line: 'checkIn(sessionId)', explain: 'Student wallet marks presence once while session is open.' },
      { line: 'closeSession(id)', explain: 'Owner stops further check-ins.' },
      { line: 'checkedIn[id][addr]', explain: 'Prevents double check-in by the same wallet.' },
    ],
    frontend: [
      { line: 'createSession from owner wallet', explain: 'Only the deployer address can create/close.' },
      { line: 'checkIn from student wallets', explain: 'Switch MetaMask accounts to simulate many students.' },
      { line: 'getSession', explain: 'Shows live attendance count for screenshots.' },
    ],
  },
  certificate: {
    contract: [
      { line: 'bytes32 docHash', explain: 'Fixed 32-byte fingerprint of certificate content (keccak256).' },
      { line: 'issueCertificate(...)', explain: 'Owner writes student + course + hash; rejects duplicate hashes.' },
      { line: 'verify(docHash)', explain: 'Anyone checks if hash was issued and not revoked.' },
      { line: 'revokeCertificate(id)', explain: 'Owner marks invalid without deleting history.' },
      { line: 'hashRegistered mapping', explain: 'O(1) uniqueness check for hashes.' },
    ],
    frontend: [
      { line: 'hashText(content)', explain: 'ethers.keccak256(toUtf8Bytes(text)) mirrors Solidity hashing of strings.' },
      { line: 'issue then verify', explain: 'Issue with wallet A (owner); verify from any wallet.' },
    ],
  },
  complaints: {
    contract: [
      { line: 'enum Status', explain: 'Named states: Open, InProgress, Resolved, Closed (0–3).' },
      { line: 'createTicket(...)', explain: 'Any wallet opens a ticket; reporter = msg.sender.' },
      { line: 'updateStatus(id, status)', explain: 'Only owner advances workflow status.' },
      { line: 'getTicket(id)', explain: 'Returns full ticket for UI display.' },
    ],
    frontend: [
      { line: 'status as uint8', explain: 'Enums are numbers on-chain; UI maps 0→Open, 1→InProgress, etc.' },
      { line: 'create then update', explain: 'Student creates; admin account updates status.' },
    ],
  },
  crowdfund: {
    contract: [
      { line: 'constructor(name, goalWei)', explain: 'Set campaign name + goal at deploy (Remix constructor inputs).' },
      { line: 'donate() payable', explain: '`msg.value` is ETH sent with the call; added to totalRaised.' },
      { line: 'receive() external payable', explain: 'Accepts plain ETH transfers as donations too.' },
      { line: 'withdraw()', explain: 'Owner pulls full balance and closes campaign.' },
      { line: 'donations[addr]', explain: 'Per-wallet donation total for transparency.' },
    ],
    frontend: [
      { line: 'donate({ value: parseEther("0.001") })', explain: 'Attach Sepolia ETH to the transaction.' },
      { line: 'getInfo()', explain: 'Shows goal, raised, contract balance, closed flag.' },
    ],
  },
  'peer-review': {
    contract: [
      { line: 'submitProject(title)', explain: 'Anyone lists a project; submitter stored.' },
      { line: 'rate(id, score, comment)', explain: '1–5 stars once; cannot rate your own project.' },
      { line: 'getAverage', explain: 'Returns avg*100 so UI can show 4.50 without floats in Solidity.' },
    ],
    frontend: [
      { line: 'two MetaMask accounts', explain: 'Account A submits; Account B rates — required by self-rate guard.' },
      { line: 'display avgTimes100 / 100', explain: 'Convert integer average to decimal for the report.' },
    ],
  },
  scholarship: {
    contract: [
      { line: 'recordGrant(...)', explain: 'Owner appends a public grant row (name, purpose, amount).' },
      { line: 'totalRecorded', explain: 'Running sum of all recorded amounts.' },
      { line: 'getGrant(id)', explain: 'Public read — transparency without a database admin.' },
    ],
    frontend: [
      { line: 'amount in wei', explain: '1 ETH = 10^18 wei. For demos use small numbers like 1000000000000000.' },
      { line: 'list by grantCount', explain: 'Loop ids 0..count-1 reading getGrant for the table.' },
    ],
  },
  inventory: {
    contract: [
      { line: 'addItem(name, location, custodian)', explain: 'Owner registers equipment and who holds it.' },
      { line: 'transferCustody(id, to)', explain: 'Current custodian or owner hands item to another wallet.' },
      { line: 'updateLocation(id, loc)', explain: 'Custodian updates physical location string.' },
    ],
    frontend: [
      { line: 'custodian must be 0x address', explain: 'Use a classmate MetaMask address as custodian.' },
      { line: 'transfer then getItem', explain: 'Prove custody change with before/after screenshots.' },
    ],
  },
  poll: {
    contract: [
      { line: 'createPoll(question, options[])', explain: 'Owner sets 2–5 options; parallel votes array.' },
      { line: 'vote(pollId, optionIndex)', explain: 'One vote per wallet; index must be in range.' },
      { line: 'closePoll(id)', explain: 'Owner freezes voting.' },
      { line: 'getPoll', explain: 'Returns question, options[], votes[] for charts/tables.' },
    ],
    frontend: [
      { line: 'options.split(",")', explain: 'UI collects comma-separated options then passes string[].' },
      { line: 'vote by index', explain: 'Button for option 0, 1, 2… maps to optionIndex.' },
    ],
  },
  'ai-model': {
    contract: [
      { line: 'registerModel(name, version, hash, framework)', explain: 'Anyone publishes provenance; hash must be unique.' },
      { line: 'contentHash bytes32', explain: 'Fingerprint of weights/manifest — not the model file itself.' },
      { line: 'verifyModel(hash)', explain: 'Check if a hash was registered and by whom.' },
      { line: 'publisher = msg.sender', explain: 'On-chain attribution of who registered the model.' },
    ],
    frontend: [
      { line: 'hash model card text', explain: 'Hash a README/manifest string — same idea as certificate hashing.' },
      { line: 'AIML report angle', explain: 'Write how blockchain proves model provenance for your mini-project.' },
    ],
  },
}
