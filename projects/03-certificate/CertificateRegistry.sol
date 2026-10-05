// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 03 — Certificate / Credential Registry
// Issuer stores a hash of a certificate PDF; anyone can verify authenticity.
// =============================================================================
pragma solidity ^0.8.20;

/// @title CertificateRegistry
/// @notice Issue certificates by storing keccak256(hash of doc) + student name.
contract CertificateRegistry {
    address public owner;

    struct Certificate {
        string studentName;
        string courseName;
        bytes32 docHash;    // keccak256 of certificate file or JSON
        uint256 issuedAt;
        bool revoked;
        bool exists;
    }

    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCount;

    // docHash => certificate id
    mapping(bytes32 => uint256) private hashToId;
    mapping(bytes32 => bool) private hashRegistered;

    event CertificateIssued(uint256 indexed id, string studentName, bytes32 docHash);
    event CertificateRevoked(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @param docHash Use keccak256 of the certificate content (from Remix or frontend).
    function issueCertificate(
        string calldata studentName,
        string calldata courseName,
        bytes32 docHash
    ) external onlyOwner returns (uint256) {
        require(docHash != bytes32(0), "Empty hash");
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

    function revokeCertificate(uint256 id) external onlyOwner {
        require(certificates[id].exists, "Missing");
        certificates[id].revoked = true;
        emit CertificateRevoked(id);
    }

    /// @notice Anyone can verify a document hash.
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
