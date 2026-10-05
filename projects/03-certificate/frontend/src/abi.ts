export const abi = [
  "function issueCertificate(string studentName, string courseName, bytes32 docHash) returns (uint256)",
  "function verify(bytes32 docHash) view returns (bool valid, uint256 id, string studentName, string courseName, bool revoked)"
] as const
