# 🛡️ Eviblock: Evidence Management System using Blockchain

Eviblock is a **zero-trust, blockchain-based chain of custody application** designed for digital forensics and secure evidence handling.

It allows authorized investigators to cryptographically hash and optionally encrypt digital evidence locally, anchor those hashes to the Ethereum blockchain, and store the payload on the decentralized web (IPFS). 

This architecture ensures:
- 🔐 **Zero-Knowledge Privacy:** Client-side AES-256 encryption ensures data cannot be viewed without the secret key.
- 👥 **Role-Based Access Control:** Strict authorization layers for Admins, Investigators, and Auditors.
- 🔎 **Instant Integrity Verification:** Mathematical proof of authenticity.
- 🧾 **Immutable Chain of Custody:** Transparent, unalterable audit trails.

The system demonstrates how blockchain technology and cryptographic security can eliminate evidence manipulation in centralized systems.

---

## 🚨 The Problem & 💡 Our Solution

### 🚨 The Problem
Traditional digital evidence systems rely on centralized storage and single-signature trust. These systems are vulnerable to:
- Evidence tampering and unauthorized modifications
- Single points of failure (server crashes/hacks)
- Weak chain-of-custody tracking
- Insider threats where administrators can silently view or alter sensitive files.

### 💡 How Eviblock Solves This
Eviblock introduces a decentralized, cryptographically verifiable architecture:
- 📌 **Stores SHA-256 hashes on the blockchain** (Ethereum).
- 🌐 **Stores physical data on IPFS** (InterPlanetary File System).
- 🛡️ **Client-Side Encryption** guarantees that even the system developers cannot view sensitive payloads.
- 🛂 **Web3 Wallet Authentication** maps actions to undeniable cryptographic identities rather than hackable passwords.

#### 🔑 Key Idea
**Files are stored off-chain. Hashes are stored on-chain. Privacy is maintained client-side.**

---

## 📖 Real-World Scenario

### 🧑‍⚖️ The Situation
A forensic investigator captures a highly classified crime scene image. In a traditional system, that file sits on a centralized server where it could be leaked or tampered with.

### 🛡️ The Eviblock Approach
1. **The Investigator** connects their MetaMask wallet to Eviblock.
2. They select the image and toggle "Sensitive Evidence," providing a secret password.
3. **Locally in the browser**, the image is hashed (SHA-256) and then encrypted into unreadable ciphertext (AES-256).
4. The ciphertext is sent to the public IPFS network.
5. The clean file hash and IPFS CID are anchored to the Ethereum ledger.
6. **The Auditor (Judge/Lawyer)** later receives the password securely. They use the Eviblock "Decryption Chamber" to download the ciphertext, decrypt it locally, and instantly verify its hash against the blockchain ledger.

No trust required. Only cryptographic proof.

---

## 🔄 System Architecture & Flow

Eviblock operates across a highly coordinated Web3 stack:

### 🔗 1. Blockchain Layer (Backend)
- **Network:** Hardhat Localhost (Ethereum EVM)  
- **Smart Contracts:** Solidity (`^0.8.28`)  
- **Blockchain Interaction:** Ethers.js (`v6`)  
- **Identity & Auth:** MetaMask (Web3 Provider)
- **Features:** Role-based access mapping (Admin/Investigator) and event logging.

### 💻 2. Client Application (Frontend)
- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **Storage Network:** Pinata SDK (IPFS)
- **Cryptography:** CryptoJS (AES-256)
- **Styling:** Tailwind CSS (Custom Cybersecurity Theme)  

### 🔁 The 4-Step Architecture Flow
1. **Local Hashing & Encryption:** Files are hashed and optionally encrypted entirely in the browser.
2. **IPFS Pinning:** The payload is pinned to the decentralized IPFS network, generating a unique CID.
3. **Smart Contract Anchoring:** The file's hash, IPFS CID, and uploader wallet address are permanently locked onto the Ethereum blockchain.
4. **Public Verification:** Auditors can cross-reference physical files against the immutable ledger or use the Decryption Chamber to view classified payloads.

---

## 📂 Project Directory Structure

```text
eviblock/
│
├── blockchain/                  # Smart Contract & Hardhat Environment
│   ├── contracts/
│   │   └── EvidenceRegistry.sol # Core Solidity smart contract (with RBAC)
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── test/                    # Smart contract unit tests
│   ├── hardhat.config.ts        # Hardhat configuration
│   └── package.json
│
├── frontend/                    # Next.js Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── admin/           # RBAC Personnel Authorization Panel
│   │   │   ├── dashboard/       # Ledger dashboard & Decryption Chamber
│   │   │   ├── upload/          # Secure evidence upload engine
│   │   │   ├── verify/          # Zero-knowledge verification scanner
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   └── Navbar.tsx       # Dynamic navigation & Wallet connection
│   │   ├── utils/
│   │   │   ├── config.ts
│   │   │   ├── ethereum.ts
│   │   │   └── EvidenceRegistry.json
│   │   └── types.d.ts
│   ├── .env.local               # Pinata IPFS Environment Variables
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md

```

---

## ⚙️ How to Run Eviblock Locally

### 🧰 Prerequisites

* Node.js (v18+)
* MetaMask Browser Extension
* Pinata Account (for IPFS API Keys)

### 1️⃣ Configure Environment Variables

In the `frontend` directory, create a `.env.local` file and add your Pinata credentials:

```env
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_PINATA_GATEWAY=your_pinata_gateway_domain.mypinata.cloud

```

### 2️⃣ Start the Blockchain (Terminal 1)

```bash
cd eviblock/blockchain
npm install
npx hardhat node

```

*Keep this terminal running. It will provide 20 test wallets with 10,000 ETH each.*

### 3️⃣ Deploy the Smart Contract (Terminal 2)

```bash
cd eviblock/blockchain
npx hardhat run scripts/deploy.ts --network localhost

```

*Copy the deployed contract address.*

### 4️⃣ Configure Frontend

Update `frontend/src/utils/config.ts`:
Replace `CONTRACT_ADDRESS` with your newly deployed address.

### 5️⃣ Start Frontend (Terminal 3)

```bash
cd eviblock/frontend
npm install
npm run dev

```

Visit: `http://localhost:3000`

### 6️⃣ Configure MetaMask

Add a new network in your MetaMask extension:

* **Network Name:** Hardhat Localhost
* **RPC URL:** `http://127.0.0.1:8545/`
* **Chain ID:** `31337`

*Import Account #0 from Terminal 1 to act as the Super Admin, and Account #1 to act as an Investigator.*

---

## 🚀 Project Vision & Future Scope

### 🎯 Vision

To eliminate evidence tampering in legal and investigative workflows by decentralizing trust and prioritizing zero-knowledge privacy.

### 🧩 Current Capabilities (Phase 1-4 Completed)

* ✅ Client-side SHA-256 hashing
* ✅ IPFS integration via Pinata
* ✅ Web3 Wallet Authentication (MetaMask)
* ✅ Role-Based Access Control (Super Admin, Investigator, Auditor)
* ✅ Zero-Knowledge AES-256 Client-Side Encryption
* ✅ Tamper-detection verification engine

### 🛣️ Phase 2 Roadmap

* Multi-signature access verification (Requiring two investigators to sign off on uploads)
* Deployment to Ethereum public testnets (Sepolia)
* Advanced on-chain role auditing

---

## 🎓 Academic Evaluation Points

Eviblock demonstrates advanced Web3 concepts:

* ⛓ **Blockchain Immutability & State Management**
* 🔐 **Zero-Knowledge Architecture (AES-256)**
* 👥 **Smart Contract Role-Based Access Control (RBAC)**
* 🌐 **Decentralized Storage Protocols (IPFS)**
* 🤝 **Trustless Verification Models**

This project serves as a practical, enterprise-grade academic implementation of blockchain for digital forensics and secure data integrity systems.
