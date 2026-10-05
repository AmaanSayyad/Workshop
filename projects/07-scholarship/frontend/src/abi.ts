export const abi = [
  "function recordGrant(string studentName, string purpose, uint256 amountWei) returns (uint256)",
  "function getGrant(uint256 id) view returns (string studentName, string purpose, uint256 amountWei, uint256 recordedAt, bool exists)",
  "function totalRecorded() view returns (uint256)"
] as const
