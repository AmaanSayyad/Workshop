export const abi = [
  "function donate() payable",
  "function withdraw()",
  "function getInfo() view returns (string name, uint256 goal, uint256 raised, uint256 balance, bool isClosed)"
] as const
