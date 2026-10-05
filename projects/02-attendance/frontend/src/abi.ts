export const abi = [
  "function owner() view returns (address)",
  "function sessionCount() view returns (uint256)",
  "function createSession(string name) returns (uint256)",
  "function closeSession(uint256 sessionId)",
  "function checkIn(uint256 sessionId)",
  "function getSession(uint256 sessionId) view returns (string name, uint256 startTime, bool open, uint256 count, bool exists)"
] as const
