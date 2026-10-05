export const abi = [
  "function owner() view returns (address)",
  "function donate() payable",
  "function withdraw()",
  "function getInfo() view returns (string name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)",
  "function donations(address) view returns (uint256)"
] as const
