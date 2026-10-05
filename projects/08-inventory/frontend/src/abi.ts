export const abi = [
  "function addItem(string name, string location, address custodian) returns (uint256)",
  "function transferCustody(uint256 id, address to)",
  "function updateLocation(uint256 id, string location)",
  "function getItem(uint256 id) view returns (string name, string location, address custodian, bool exists)"
] as const
