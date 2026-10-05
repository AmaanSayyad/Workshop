// SPDX-License-Identifier: MIT
// =============================================================================
// MINI-PROJECT 10 — AI Model / Dataset Hash Registry (AIML-friendly)
// Researchers register model name + version + content hash for provenance.
// =============================================================================
pragma solidity ^0.8.20;

/// @title AIModelRegistry
contract AIModelRegistry {
    address public owner;

    struct ModelRecord {
        string name;
        string version;
        bytes32 contentHash;  // keccak256 of weights/manifest
        string framework;     // "PyTorch", "TensorFlow", etc.
        address publisher;
        uint256 publishedAt;
        bool exists;
    }

    mapping(uint256 => ModelRecord) public models;
    uint256 public modelCount;

    mapping(bytes32 => uint256) private hashToId;
    mapping(bytes32 => bool) private hashRegistered;

    event ModelRegistered(
        uint256 indexed id,
        string name,
        string version,
        bytes32 contentHash,
        address indexed publisher
    );

    constructor() {
        owner = msg.sender;
    }

    function registerModel(
        string calldata name,
        string calldata version,
        bytes32 contentHash,
        string calldata framework
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(contentHash != bytes32(0), "Empty hash");
        require(!hashRegistered[contentHash], "Hash already registered");

        uint256 id = modelCount;
        models[id] = ModelRecord({
            name: name,
            version: version,
            contentHash: contentHash,
            framework: framework,
            publisher: msg.sender,
            publishedAt: block.timestamp,
            exists: true
        });
        hashToId[contentHash] = id;
        hashRegistered[contentHash] = true;
        modelCount += 1;

        emit ModelRegistered(id, name, version, contentHash, msg.sender);
        return id;
    }

    function verifyModel(bytes32 contentHash)
        external
        view
        returns (bool found, uint256 id, string memory name, string memory version, address publisher)
    {
        if (!hashRegistered[contentHash]) {
            return (false, 0, "", "", address(0));
        }
        id = hashToId[contentHash];
        ModelRecord storage m = models[id];
        return (true, id, m.name, m.version, m.publisher);
    }

    function getModel(uint256 id)
        external
        view
        returns (
            string memory name,
            string memory version,
            bytes32 contentHash,
            string memory framework,
            address publisher,
            uint256 publishedAt,
            bool exists
        )
    {
        ModelRecord storage m = models[id];
        return (m.name, m.version, m.contentHash, m.framework, m.publisher, m.publishedAt, m.exists);
    }
}
