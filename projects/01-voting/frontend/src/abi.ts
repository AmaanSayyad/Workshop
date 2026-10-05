export const abi = [
  "function createProposal(string title) returns (uint256)",
  "function vote(uint256 proposalId, bool support)",
  "function getProposal(uint256 proposalId) view returns (string title, uint256 yesVotes, uint256 noVotes, bool exists)"
] as const
