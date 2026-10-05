/** Minimal ABIs for all workshop contracts (ethers v6 compatible). */

export const votingAbi = [
  'function owner() view returns (address)',
  'function proposalCount() view returns (uint256)',
  'function createProposal(string title) returns (uint256)',
  'function vote(uint256 proposalId, bool support)',
  'function getProposal(uint256 proposalId) view returns (string title, uint256 yesVotes, uint256 noVotes, bool exists)',
  'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
  'event ProposalCreated(uint256 indexed id, string title)',
  'event Voted(uint256 indexed id, address indexed voter, bool support)',
] as const

export const attendanceAbi = [
  'function owner() view returns (address)',
  'function sessionCount() view returns (uint256)',
  'function createSession(string name) returns (uint256)',
  'function closeSession(uint256 sessionId)',
  'function checkIn(uint256 sessionId)',
  'function checkedIn(uint256 sessionId, address student) view returns (bool)',
  'function getSession(uint256 sessionId) view returns (string name, uint256 startTime, bool open, uint256 count, bool exists)',
] as const

export const certificateAbi = [
  'function owner() view returns (address)',
  'function certificateCount() view returns (uint256)',
  'function issueCertificate(string studentName, string courseName, bytes32 docHash) returns (uint256)',
  'function revokeCertificate(uint256 id)',
  'function verify(bytes32 docHash) view returns (bool valid, uint256 id, string studentName, string courseName, bool revoked)',
  'function getCertificate(uint256 id) view returns (string studentName, string courseName, bytes32 docHash, uint256 issuedAt, bool revoked, bool exists)',
] as const

export const complaintAbi = [
  'function owner() view returns (address)',
  'function ticketCount() view returns (uint256)',
  'function createTicket(string category, string description) returns (uint256)',
  'function updateStatus(uint256 id, uint8 newStatus)',
  'function getTicket(uint256 id) view returns (address reporter, string category, string description, uint8 status, uint256 createdAt, bool exists)',
] as const

export const crowdfundAbi = [
  'function owner() view returns (address)',
  'function campaignName() view returns (string)',
  'function goalWei() view returns (uint256)',
  'function totalRaised() view returns (uint256)',
  'function closed() view returns (bool)',
  'function donations(address) view returns (uint256)',
  'function donate() payable',
  'function withdraw()',
  'function getInfo() view returns (string name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)',
] as const

export const peerReviewAbi = [
  'function owner() view returns (address)',
  'function projectCount() view returns (uint256)',
  'function submitProject(string title) returns (uint256)',
  'function rate(uint256 projectId, uint8 score, string comment)',
  'function getAverage(uint256 projectId) view returns (uint256 avgTimes100, uint256 count)',
  'function getProject(uint256 projectId) view returns (string title, address submitter, uint256 totalScore, uint256 ratingCount, bool exists)',
] as const

export const scholarshipAbi = [
  'function owner() view returns (address)',
  'function grantCount() view returns (uint256)',
  'function totalRecorded() view returns (uint256)',
  'function recordGrant(string studentName, string purpose, uint256 amountWei) returns (uint256)',
  'function getGrant(uint256 id) view returns (string studentName, string purpose, uint256 amountWei, uint256 recordedAt, bool exists)',
] as const

export const inventoryAbi = [
  'function owner() view returns (address)',
  'function itemCount() view returns (uint256)',
  'function addItem(string name, string location, address custodian) returns (uint256)',
  'function transferCustody(uint256 id, address to)',
  'function updateLocation(uint256 id, string location)',
  'function getItem(uint256 id) view returns (string name, string location, address custodian, bool exists)',
] as const

export const pollAbi = [
  'function owner() view returns (address)',
  'function pollCount() view returns (uint256)',
  'function createPoll(string question, string[] options) returns (uint256)',
  'function vote(uint256 pollId, uint256 optionIndex)',
  'function closePoll(uint256 pollId)',
  'function hasVoted(uint256 pollId, address voter) view returns (bool)',
  'function getPoll(uint256 pollId) view returns (string question, string[] options, uint256[] votes, bool open, bool exists)',
] as const

export const aiModelAbi = [
  'function owner() view returns (address)',
  'function modelCount() view returns (uint256)',
  'function registerModel(string name, string version, bytes32 contentHash, string framework) returns (uint256)',
  'function verifyModel(bytes32 contentHash) view returns (bool found, uint256 id, string name, string version, address publisher)',
  'function getModel(uint256 id) view returns (string name, string version, bytes32 contentHash, string framework, address publisher, uint256 publishedAt, bool exists)',
] as const
