export const abi = [
  "function submitProject(string title) returns (uint256)",
  "function rate(uint256 projectId, uint8 score, string comment)",
  "function getAverage(uint256 projectId) view returns (uint256 avgTimes100, uint256 count)",
  "function getProject(uint256 projectId) view returns (string title, address submitter, uint256 totalScore, uint256 ratingCount, bool exists)"
] as const
