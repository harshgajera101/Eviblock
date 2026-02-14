# 🛡️ Eviblock: Evidence Management System using Blockchain

Eviblock is a **zero-trust, blockchain-based chain of custody application** designed for digital forensics and secure evidence handling.

It allows users to cryptographically hash digital evidence locally and anchor those hashes to the Ethereum blockchain, ensuring:

- 🔐 Tamper-proof record keeping  
- 🔎 Instant integrity verification  
- 📜 Transparent audit trail  
- 🧾 Immutable chain of custody  

The system demonstrates how blockchain technology can eliminate evidence manipulation in centralized systems.

---

## 🚨 The Problem & 💡 Our Solution

### 🚨 The Problem
Traditional digital evidence systems rely on centralized storage. These systems are vulnerable to:

- Evidence tampering  
- Unauthorized modifications  
- Lack of transparency  
- Weak chain-of-custody tracking  
- Single point of failure  

Once evidence is uploaded, there is no cryptographic guarantee that it remains unchanged.

### 💡 How Eviblock Solves This
Eviblock introduces a decentralized, verifiable architecture:

- 📌 **Stores SHA-256 file hashes on blockchain** 
- 🌐 **Uses IPFS for decentralized storage** 
- 🧾 **Maintains immutable audit logs** 
- 🔍 **Enables public integrity verification** 

#### 🔑 Key Idea
**Files are stored off-chain. Hashes are stored on-chain.**

This ensures scalability while preserving immutability.

---

## 📖 Real-World Scenario

### 🧑‍⚖️ The Situation
A forensic photographer captures a crime scene image. In a traditional system, that file sits on a server. A malicious insider could alter it without detection.

### 🛡️ The Eviblock Approach
The image is uploaded to Eviblock:

1. A SHA-256 hash is generated locally in the browser.
2. The hash is anchored to the Ethereum blockchain.
3. Months later, the image is re-uploaded for verification.
4. The system re-hashes the file and compares it to the blockchain record.
5. If the hashes match → the image is mathematically proven authentic.

No trust required. Only cryptographic proof.

---

## 🔄 System Verification Flow

### ⚠️ Important Design Principle
Evidence files are **NOT stored on blockchain**. 

Only the following are stored on-chain:
- SHA-256 file hash  
- IPFS CID (Content Identifier)  

### 🔁 Step-by-Step Flow
1. User uploads a file locally.
2. The browser generates a SHA-256 cryptographic hash.
3. The file is uploaded to IPFS (decentralized storage).
4. The IPFS CID + SHA-256 hash are stored in the smart contract.
5. During verification:
   - The file is re-hashed.
   - The hash is compared with the blockchain record.
   - ✅ **Match** → Authentic  
   - ❌ **Mismatch** → Tampered  

This guarantees integrity without exposing file contents to the blockchain.

---

## 🏗️ System Architecture

Eviblock operates across two coordinated layers:

### 🔗 1. Blockchain Layer (Backend)
- **Network:** Hardhat Localhost (Ethereum EVM)  
- **Smart Contracts:** Solidity (`^0.8.28`)  
- **Blockchain Interaction:** Ethers.js (`v6`)  
- **Wallet Integration:** MetaMask  

This layer ensures immutability and decentralized trust.

### 💻 2. Client Application (Frontend)
- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS (Custom Cybersecurity Theme)  
- **Icons:** Lucide-React  
- **Typography:** Inter (UI) & JetBrains Mono (Data)  

This layer handles:
- Client-side hashing  
- Smart contract interaction  
- Ledger visualization  
- Verification interface  

---

## 📂 Project Directory Structure

```text
eviblock/
│
├── blockchain/                  # Smart Contract & Hardhat Environment
│   ├── contracts/
│   │   └── EvidenceRegistry.sol # Core Solidity smart contract
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
│   │   │   ├── dashboard/       # Ledger dashboard
│   │   │   ├── upload/          # Evidence upload page
│   │   │   ├── verify/          # Verification engine
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── utils/
│   │   │   ├── config.ts
│   │   │   ├── ethereum.ts
│   │   │   └── EvidenceRegistry.json
│   │   └── types.d.ts
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

### 1️⃣ Start the Blockchain (Terminal 1)

```bash
cd eviblock/blockchain
npm install
npx hardhat node

```

*Keep this terminal running.*

### 2️⃣ Deploy the Smart Contract (Terminal 2)

```bash
cd eviblock/blockchain
npx hardhat run scripts/deploy.ts --network localhost

```

*Copy the deployed contract address.*

### 3️⃣ Configure Frontend

Update `frontend/src/utils/config.ts`:
Replace `CONTRACT_ADDRESS` with your deployed address.

### 4️⃣ Start Frontend (Terminal 3)

```bash
cd eviblock/frontend
npm install
npm run dev

```

Visit: `http://localhost:3000`

### 5️⃣ Configure MetaMask

Add a new network in your MetaMask extension:

* **Network Name:** Hardhat Localhost
* **RPC URL:** `http://127.0.0.1:8545/`
* **Chain ID:** `31337`

*Import one of the private keys shown in Terminal 1.*

---

## 🔐 Security Design Highlights

* 🔒 Client-side hashing (zero raw data leakage)
* 🧾 Immutable blockchain records
* 🔍 Public verification without authority
* 🧮 Cryptographic integrity validation
* 📜 Transparent chain-of-custody logging

---

## 🚀 Project Vision & Future Scope

### 🎯 Vision

To eliminate evidence tampering in legal and investigative workflows by decentralizing trust.

### 🧩 Current Capabilities

* Client-side SHA-256 hashing
* Smart contract anchoring
* Real-time ledger dashboard
* Tamper-detection verification engine

### 🛣️ Future Roadmap

* IPFS production integration (Pinata / Web3.Storage)
* Deployment to Ethereum testnets (Sepolia)
* Multi-signature access verification
* Role-Based Access Control (RBAC)
* On-chain role auditing
* Public explorer-style transaction viewer

---

## 🎓 Academic Evaluation Points

Eviblock demonstrates:

* ⛓ **Blockchain immutability**
* 🔐 **Cryptographic hashing (SHA-256)**
* 🧾 **Decentralized integrity anchoring**
* 🏛 **Transparent audit trail**
* 🤝 **Trustless verification model**

This project serves as a practical academic implementation of blockchain for digital forensics and secure data integrity systems.

---

## 📌 Final Note

Eviblock is a blockchain integrity demonstration project. It is not intended for immediate real-world legal deployment but serves as a strong proof-of-concept for decentralized evidence management systems.
