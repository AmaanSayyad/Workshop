// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 03 — Certificate Registry
// READ FIRST: docs/SOLIDITY_BASICS.md
// KEY IDEA: store a HASH of the certificate, not the whole PDF (too expensive).
// =============================================================================
pragma solidity ^0.8.20;
// pragma solidity ^0.8.20 → compiler must be 0.8.20+ (safer math).

/// @title CertificateRegistry
/// @notice Owner issues credentials by hash; anyone can verify.
contract CertificateRegistry {
    address public owner; // deployer / issuer college wallet

    // struct groups certificate fields into one type
    struct Certificate {
        string studentName;
        string courseName;
        bytes32 docHash;    // 32-byte fingerprint (keccak256 of content)
        uint256 issuedAt;   // block.timestamp when issued
        bool revoked;       // soft-delete flag (history stays)
        bool exists;
    }

    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCount;

    // Fast lookup: hash → id, plus a bool so id 0 isn't ambiguous
    mapping(bytes32 => uint256) private hashToId;
    mapping(bytes32 => bool) private hashRegistered;

    event CertificateIssued(uint256 indexed id, string studentName, bytes32 docHash);
    event CertificateRevoked(uint256 indexed id);

    modifier onlyOwner() {
        // msg.sender must be the issuer
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender; // who clicked Deploy
    }

    /// @param docHash keccak256 of certificate text (from frontend or Remix)
    // bytes32 = fixed 32 bytes — perfect for hashes
    function issueCertificate(
        string calldata studentName,
        string calldata courseName,
        bytes32 docHash
    ) external onlyOwner returns (uint256) {
        require(docHash != bytes32(0), "Empty hash"); // reject null hash
        require(!hashRegistered[docHash], "Hash already registered");

        uint256 id = certificateCount;
        certificates[id] = Certificate({
            studentName: studentName,
            courseName: courseName,
            docHash: docHash,
            issuedAt: block.timestamp,
            revoked: false,
            exists: true
        });
        hashToId[docHash] = id;
        hashRegistered[docHash] = true;
        certificateCount += 1;

        emit CertificateIssued(id, studentName, docHash);
        return id;
    }

    /// @notice Mark invalid without erasing history.
    function revokeCertificate(uint256 id) external onlyOwner {
        require(certificates[id].exists, "Missing");
        certificates[id].revoked = true;
        emit CertificateRevoked(id);
    }

    /// @notice Anyone checks if a document hash was issued and still valid.
    // view = no gas from UI for the read itself
    function verify(bytes32 docHash)
        external
        view
        returns (bool valid, uint256 id, string memory studentName, string memory courseName, bool revoked)
    {
        if (!hashRegistered[docHash]) {
            return (false, 0, "", "", false);
        }
        id = hashToId[docHash];
        Certificate storage c = certificates[id];
        // valid means registered AND not revoked
        return (!c.revoked, id, c.studentName, c.courseName, c.revoked);
    }

    function getCertificate(uint256 id)
        external
        view
        returns (
            string memory studentName,
            string memory courseName,
            bytes32 docHash,
            uint256 issuedAt,
            bool revoked,
            bool exists
        )
    {
        Certificate storage c = certificates[id];
        return (c.studentName, c.courseName, c.docHash, c.issuedAt, c.revoked, c.exists);
    }
}
