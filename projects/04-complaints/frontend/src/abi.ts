export const abi = [
  "function owner() view returns (address)",
  "function ticketCount() view returns (uint256)",
  "function createTicket(string category, string description) returns (uint256)",
  "function updateStatus(uint256 id, uint8 newStatus)",
  "function getTicket(uint256 id) view returns (address reporter, string category, string description, uint8 status, uint256 createdAt, bool exists)"
] as const
