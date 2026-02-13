// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title EvidenceRegistry
 * @dev A smart contract to store and verify digital evidence hashes.
 * This contract ensures that once evidence is added, it cannot be altered or deleted.
 */
contract EvidenceRegistry {

    // --- 1. Data Structures ---

    struct Evidence {
        uint256 evidenceId;
        string ipfsHash;      // Location of the file on IPFS
        string fileHash;      // SHA-256 hash of the original file content
        address uploader;     // Wallet address of the investigator
        uint256 timestamp;    // When the evidence was added
    }

    // Mapping to store evidence records by their ID
    mapping(uint256 => Evidence) public evidenceRecords;

    // Counter to generate unique IDs for each piece of evidence
    uint256 public evidenceCount;

    // --- 2. Events ---
    // Events allow the frontend to react when things happen on the blockchain
    event EvidenceAdded(uint256 indexed evidenceId, address indexed uploader, string fileHash);
    event EvidenceVerified(uint256 indexed evidenceId, bool isVerified);

    // --- 3. Core Functions ---

    /**
     * @notice Adds new evidence to the blockchain.
     * @dev The actual file is on IPFS; we only store the hashes here for integrity.
     * @param _ipfsHash The CID/Hash from IPFS where the file is stored.
     * @param _fileHash The SHA-256 hash of the file content.
     */
    function addEvidence(string memory _ipfsHash, string memory _fileHash) public {
        // Increment the ID counter
        evidenceCount++;

        // Store the evidence in the mapping
        evidenceRecords[evidenceCount] = Evidence({
            evidenceId: evidenceCount,
            ipfsHash: _ipfsHash,
            fileHash: _fileHash,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        // Emit an event so the UI knows it happened
        emit EvidenceAdded(evidenceCount, msg.sender, _fileHash);
    }

    /**
     * @notice Verifies if a provided file hash matches the stored hash.
     * @param _evidenceId The ID of the evidence to check.
     * @param _fileHash The hash of the file you are verifying.
     * @return bool Returns true if the hashes match (Authentic), false otherwise.
     */
    function verifyEvidence(uint256 _evidenceId, string memory _fileHash) public returns (bool) {
        // Retrieve the stored hash from the blockchain
        string memory storedHash = evidenceRecords[_evidenceId].fileHash;

        // Compare the stored hash with the provided hash
        // Note: In Solidity, we must hash strings to compare them
        bool isMatch = (keccak256(abi.encodePacked(storedHash)) == keccak256(abi.encodePacked(_fileHash)));

        emit EvidenceVerified(_evidenceId, isMatch);
        return isMatch;
    }

    /**
     * @notice Fetch all evidence details (Optional helper for UI).
     * @dev CAUTION: This is fine for a mini-project, but in production, 
     * returning arrays can be expensive (gas limits).
     */
    function getAllEvidence() public view returns (Evidence[] memory) {
        Evidence[] memory allEvidence = new Evidence[](evidenceCount);

        for (uint256 i = 1; i <= evidenceCount; i++) {
            allEvidence[i - 1] = evidenceRecords[i];
        }

        return allEvidence;
    }
    
    /**
     * @notice Get a single piece of evidence by ID.
     */
    function getEvidence(uint256 _evidenceId) public view returns (Evidence memory) {
        return evidenceRecords[_evidenceId];
    }
}