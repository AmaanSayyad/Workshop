export const abi = [
  "function owner() view returns (address)",
  "function issueCertificate(string studentName, string courseName, bytes32 docHash) returns (uint256)",
  "function revokeCertificate(uint256 id)",
  "function verify(bytes32 docHash) view returns (bool valid, uint256 id, string studentName, string courseName, bool revoked)",
  "function getCertificate(uint256 id) view returns (string studentName, string courseName, bytes32 docHash, uint256 issuedAt, bool revoked, bool exists)"
] as const
