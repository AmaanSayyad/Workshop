export const abi = [
  "function createPoll(string question, string[] options) returns (uint256)",
  "function vote(uint256 pollId, uint256 optionIndex)",
  "function closePoll(uint256 pollId)",
  "function getPoll(uint256 pollId) view returns (string question, string[] options, uint256[] votes, bool open, bool exists)"
] as const
