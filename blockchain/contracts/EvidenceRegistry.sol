// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EvidenceRegistry {
    // Role Mappings
    address public superAdmin;
    mapping(address => bool) public investigators;

    struct Evidence {
        uint256 evidenceId;
        string ipfsHash;
        string fileHash;
        address uploader;
        uint256 timestamp;
    }

    Evidence[] private ledger;

    // --- NEW PHASE 5: Pending Evidence Struct ---
    struct PendingRecord {
        uint256 pendingId;
        string ipfsHash;
        string fileHash;
        address proposer;
        uint256 timestamp;
        uint256 approvals;
        bool finalized;
    }

    // --- NEW PHASE 5: State Variables ---
    uint256 public pendingCount;
    mapping(uint256 => PendingRecord) public pendingRecords;
    mapping(uint256 => mapping(address => bool)) public hasApproved;

    // Events for Audit Trail
    event EvidenceAdded(uint256 indexed evidenceId, string ipfsHash, string fileHash, address indexed uploader);
    event RoleGranted(string role, address indexed account);
    event RoleRevoked(string role, address indexed account);
    
    // --- NEW PHASE 5: Events ---
    event EvidenceProposed(uint256 indexed pendingId, string ipfsHash, string fileHash, address indexed proposer);
    event EvidenceApproved(uint256 indexed pendingId, address indexed approver, uint256 currentApprovals);

    // Security Modifiers
    modifier onlyAdmin() {
        require(msg.sender == superAdmin, "Security Alert: Admins only.");
        _;
    }

    modifier onlyInvestigator() {
        require(investigators[msg.sender] || msg.sender == superAdmin, "Security Alert: Unauthorized wallet. Investigators only.");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
        investigators[msg.sender] = true; // The deployer is automatically an admin & investigator
    }

    // --- ROLE MANAGEMENT ---
    function grantInvestigator(address _account) public onlyAdmin {
        investigators[_account] = true;
        emit RoleGranted("Investigator", _account);
    }

    function revokeInvestigator(address _account) public onlyAdmin {
        investigators[_account] = false;
        emit RoleRevoked("Investigator", _account);
    }

    function checkIsInvestigator(address _account) public view returns (bool) {
        return investigators[_account] || _account == superAdmin;
    }

    // --- EVIDENCE MANAGEMENT (Single-Sig) ---
    function addEvidence(string memory _ipfsHash, string memory _fileHash) public onlyInvestigator {
        uint256 newId = ledger.length + 1;
        ledger.push(Evidence(newId, _ipfsHash, _fileHash, msg.sender, block.timestamp));
        emit EvidenceAdded(newId, _ipfsHash, _fileHash, msg.sender);
    }

    function getAllEvidence() public view returns (Evidence[] memory) {
        return ledger;
    }

    // --- NEW PHASE 5: MULTI-SIG MANAGEMENT ---
    function proposeEvidence(string memory _ipfsHash, string memory _fileHash) public onlyInvestigator {
        pendingCount++;
        pendingRecords[pendingCount] = PendingRecord({
            pendingId: pendingCount,
            ipfsHash: _ipfsHash,
            fileHash: _fileHash,
            proposer: msg.sender,
            timestamp: block.timestamp,
            approvals: 1, // Proposer automatically acts as the 1st signature
            finalized: false
        });

        hasApproved[pendingCount][msg.sender] = true;
        emit EvidenceProposed(pendingCount, _ipfsHash, _fileHash, msg.sender);
    }

    function approveEvidence(uint256 _pendingId) public onlyInvestigator {
        PendingRecord storage record = pendingRecords[_pendingId];
        require(record.pendingId != 0, "Security Alert: Record does not exist.");
        require(!record.finalized, "Security Alert: Record already finalized.");
        require(!hasApproved[_pendingId][msg.sender], "Security Alert: You have already approved this record.");

        hasApproved[_pendingId][msg.sender] = true;
        record.approvals++;

        emit EvidenceApproved(_pendingId, msg.sender, record.approvals);

        // Once it hits 2 signatures, move it to the permanent public ledger
        if (record.approvals >= 2) {
            record.finalized = true;
            
            uint256 newId = ledger.length + 1;
            ledger.push(Evidence(newId, record.ipfsHash, record.fileHash, record.proposer, block.timestamp));
            emit EvidenceAdded(newId, record.ipfsHash, record.fileHash, record.proposer);
        }
    }

    function getPendingEvidence() public view returns (PendingRecord[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= pendingCount; i++) {
            if (!pendingRecords[i].finalized) {
                activeCount++;
            }
        }

        PendingRecord[] memory activeRecords = new PendingRecord[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= pendingCount; i++) {
            if (!pendingRecords[i].finalized) {
                activeRecords[currentIndex] = pendingRecords[i];
                currentIndex++;
            }
        }
        return activeRecords;
    }
}