export const abi = [
  "function registerModel(string name, string version, bytes32 contentHash, string framework) returns (uint256)",
  "function verifyModel(bytes32 contentHash) view returns (bool found, uint256 id, string name, string version, address publisher)"
] as const
