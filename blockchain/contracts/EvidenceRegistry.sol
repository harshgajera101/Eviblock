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

    // Events for Audit Trail
    event EvidenceAdded(uint256 indexed evidenceId, string ipfsHash, string fileHash, address indexed uploader);
    event RoleGranted(string role, address indexed account);
    event RoleRevoked(string role, address indexed account);

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

    // --- EVIDENCE MANAGEMENT ---
    function addEvidence(string memory _ipfsHash, string memory _fileHash) public onlyInvestigator {
        uint256 newId = ledger.length + 1;
        ledger.push(Evidence(newId, _ipfsHash, _fileHash, msg.sender, block.timestamp));
        emit EvidenceAdded(newId, _ipfsHash, _fileHash, msg.sender);
    }

    function getAllEvidence() public view returns (Evidence[] memory) {
        return ledger;
    }
}