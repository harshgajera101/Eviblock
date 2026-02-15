// "use client";

// import { useState, useEffect } from "react";
// import { ShieldCheck, Database, Clock, Fingerprint, Loader2, AlertTriangle, ExternalLink, Link as LinkIcon, Globe, FolderLock, Key, X, Unlock, FileImage, Eye, CheckCircle } from "lucide-react";
// import { getContract } from "../../utils/ethereum";
// import CryptoJS from "crypto-js"; // <-- NEW: Cryptography Library

// interface EvidenceRecord {
//   evidenceId: number;
//   ipfsHash: string;
//   fileHash: string;
//   uploader: string;
//   timestamp: number;
// }

// export default function DashboardPage() {
//   const [records, setRecords] = useState<EvidenceRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [walletAddress, setWalletAddress] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<"global" | "mine">("global");

//   // --- NEW: Decryption Modal States ---
//   const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
//   const [decryptKey, setDecryptKey] = useState<string>("");
//   const [decryptStatus, setDecryptStatus] = useState<"idle" | "fetching" | "decrypting" | "success" | "error">("idle");
//   const [decryptError, setDecryptError] = useState<string>("");
//   const [decryptedDataUrl, setDecryptedDataUrl] = useState<string>("");

//   useEffect(() => {
//     fetchEvidence();
//     checkWalletConnection();

//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//     }
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       }
//     };
//   }, []);

//   const checkWalletConnection = async () => {
//     if (window.ethereum) {
//       const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//       if (accounts.length > 0) {
//         setWalletAddress(accounts[0].toLowerCase());
//       }
//     }
//   };

//   const handleAccountsChanged = (accounts: string[]) => {
//     if (accounts.length > 0) {
//       setWalletAddress(accounts[0].toLowerCase());
//     } else {
//       setWalletAddress("");
//       setActiveTab("global");
//     }
//   };

//   const fetchEvidence = async () => {
//     try {
//       const contract = await getContract();
//       if (!contract) {
//         setError("Could not connect to the smart contract. Please ensure MetaMask is connected.");
//         setLoading(false);
//         return;
//       }

//       const data = await contract.getAllEvidence();
      
//       const formattedData = data.map((item: any) => ({
//         evidenceId: Number(item.evidenceId),
//         ipfsHash: item.ipfsHash,
//         fileHash: item.fileHash,
//         uploader: item.uploader,
//         timestamp: Number(item.timestamp),
//       })).reverse(); 

//       setRecords(formattedData);
//       setLoading(false);
//     } catch (err: any) {
//       console.error("Error fetching evidence:", err);
//       setError("Failed to load evidence records from the blockchain. Make sure your local node is running.");
//       setLoading(false);
//     }
//   };

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
//     });
//   };

//   const displayedRecords = activeTab === "mine" 
//     ? records.filter(record => record.uploader.toLowerCase() === walletAddress)
//     : records;

//   // --- NEW: Decryption Engine ---
//   const handleDecrypt = async () => {
//     if (!selectedRecord || !decryptKey) return;

//     setDecryptStatus("fetching");
//     setDecryptError("");

//     try {
//       // 1. Fetch the raw encrypted text file from IPFS
//       const gatewayUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${selectedRecord.ipfsHash}`;
//       const response = await fetch(gatewayUrl);
      
//       if (!response.ok) throw new Error("Failed to fetch payload from IPFS network.");
//       const encryptedText = await response.text();

//       setDecryptStatus("decrypting");

//       // 2. Mathematically decrypt the text back into the original Data URL
//       // We use a slight timeout to allow the UI to update to the 'decrypting' state before locking the thread
//       setTimeout(() => {
//         try {
//           const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, decryptKey);
//           const originalDataUrl = decryptedBytes.toString(CryptoJS.enc.Utf8);

//           if (!originalDataUrl || !originalDataUrl.startsWith("data:")) {
//             throw new Error("Invalid Secret Key or corrupted evidence payload.");
//           }

//           setDecryptedDataUrl(originalDataUrl);
//           setDecryptStatus("success");
//         } catch (e: any) {
//           console.error("Decryption mathematically failed:", e);
//           setDecryptStatus("error");
//           setDecryptError("Invalid Secret Key or corrupted evidence payload.");
//         }
//       }, 100);

//     } catch (err: any) {
//       console.error("Network error:", err);
//       setDecryptStatus("error");
//       setDecryptError(err.message || "Failed to process the decryption request.");
//     }
//   };

//   const closeModal = () => {
//     setSelectedRecord(null);
//     setDecryptKey("");
//     setDecryptStatus("idle");
//     setDecryptError("");
//     setDecryptedDataUrl("");
//   };

//   return (
//     <div className="max-w-6xl mx-auto animate-fade-in-up relative">
//       {/* Header Section */}
//       <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
//             <Database className="text-blue-500 w-8 h-8" />
//             Immutable Ledger
//           </h1>
//           <p className="text-slate-400 mt-2 text-sm">
//             Live view of all digital evidence cryptographically secured on the Ethereum network.
//           </p>
//         </div>
        
//         <div className="flex items-center gap-2 text-xs font-mono bg-blue-900/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30">
//           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//           Total Records Anchored: {records.length}
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab("global")}
//           className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${
//             activeTab === "global" 
//               ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
//               : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
//           }`}
//         >
//           <Globe className="w-4 h-4" />
//           Global Ledger
//         </button>
        
//         <button
//           onClick={() => setActiveTab("mine")}
//           disabled={!walletAddress}
//           className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${
//             activeTab === "mine" 
//               ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
//               : !walletAddress 
//                 ? "bg-slate-900/20 text-slate-600 border border-slate-800/50 cursor-not-allowed"
//                 : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
//           }`}
//           title={!walletAddress ? "Connect wallet to view your evidence" : ""}
//         >
//           <FolderLock className="w-4 h-4" />
//           My Evidence
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-24 text-blue-400">
//           <Loader2 className="w-12 h-12 animate-spin mb-4" />
//           <p className="font-mono text-sm tracking-widest uppercase">Syncing with blockchain network...</p>
//         </div>
//       ) : error ? (
//         <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-xl flex items-center gap-4 font-mono">
//           <AlertTriangle className="w-8 h-8 shrink-0" />
//           <p>{error}</p>
//         </div>
//       ) : displayedRecords.length === 0 ? (
//         <div className="bg-slate-900/50 border border-slate-800 p-16 rounded-xl text-center shadow-lg">
//           <Database className="w-16 h-16 text-slate-700 mx-auto mb-6" />
//           <h3 className="text-white font-mono text-xl mb-3">No Evidence Found</h3>
//           <p className="text-slate-400 text-sm max-w-md mx-auto">
//             {activeTab === "mine" 
//               ? "You haven't uploaded any evidence with this wallet address yet." 
//               : "The blockchain ledger is currently empty."}
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {displayedRecords.map((record) => (
//             <div key={record.evidenceId} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all group relative overflow-hidden">
//               <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                
//                 {/* Left side: ID and Hashes */}
//                 <div className="flex-grow space-y-4">
//                   <div className="flex items-center gap-4">
//                     <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-sm font-mono font-bold border border-slate-700">
//                       ID: #{record.evidenceId}
//                     </span>
//                     <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/30">
//                       <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ON-CHAIN
//                     </span>
//                   </div>
                  
//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
//                       <Fingerprint className="w-3.5 h-3.5" /> SHA-256 File Hash
//                     </p>
//                     <p className="text-slate-300 text-sm font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 break-all select-all">
//                       {record.fileHash}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right side: Metadata & Actions */}
//                 <div className="md:w-5/12 space-y-4 md:pl-8 md:border-l md:border-slate-800">
                  
//                   {/* DATA ACCESS CONTROLS */}
//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
//                       <Database className="w-3.5 h-3.5" /> Encrypted Payload Access
//                     </p>
                    
//                     <div className="flex flex-col xl:flex-row gap-2">
//                       <button 
//                         onClick={() => setSelectedRecord(record)}
//                         className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors px-3 py-2 rounded-lg border border-emerald-500/50 shadow-lg text-xs font-mono"
//                       >
//                         <Unlock className="w-4 h-4 shrink-0" />
//                         Decrypt & View
//                       </button>

//                       <a 
//                         href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${record.ipfsHash}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         title="View raw encrypted ciphertext on IPFS"
//                         className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-3 py-2 rounded-lg border border-slate-700 text-xs font-mono"
//                       >
//                         <ExternalLink className="w-4 h-4 shrink-0" />
//                         Raw IPFS Hash
//                       </a>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">Uploader Wallet</p>
//                     <p className="text-slate-400 text-xs font-mono truncate bg-slate-950/50 px-2 py-1 rounded border border-slate-800/50 select-all" title={record.uploader}>
//                       {record.uploader}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
//                       <Clock className="w-3.5 h-3.5" /> Network Timestamp
//                     </p>
//                     <p className="text-slate-300 text-xs font-mono">
//                       {formatDate(record.timestamp)}
//                     </p>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* --- DECRYPTION MODAL --- */}
//       {selectedRecord && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-md p-4 animate-fade-in-up">
//           <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
//             {/* Modal Header */}
//             <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
//               <h3 className="text-white font-mono font-bold flex items-center gap-2">
//                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
//                 Decryption Chamber
//               </h3>
//               <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              
//               {/* Evidence Context */}
//               <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6">
//                 <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Target Payload CID</p>
//                 <p className="text-blue-400 text-sm font-mono truncate">{selectedRecord.ipfsHash}</p>
//               </div>

//               {/* State 1: Awaiting Password */}
//               {decryptStatus === "idle" || decryptStatus === "error" ? (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs text-emerald-500 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2">
//                       <Key className="w-4 h-4" /> Enter AES-256 Secret Key
//                     </label>
//                     <input 
//                       type="password" 
//                       placeholder="Access required..." 
//                       value={decryptKey}
//                       onChange={(e) => setDecryptKey(e.target.value)}
//                       className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-emerald-400 font-mono text-base focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-slate-600"
//                       autoFocus
//                     />
//                   </div>
                  
//                   {decryptStatus === "error" && (
//                     <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm font-mono">
//                       <AlertTriangle className="w-5 h-5 shrink-0" /> 
//                       <p>{decryptError}</p>
//                     </div>
//                   )}

//                   <button 
//                     onClick={handleDecrypt}
//                     disabled={!decryptKey}
//                     className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3.5 px-4 rounded-lg font-bold font-mono transition-colors"
//                   >
//                     <Unlock className="w-5 h-5" /> Execute Decryption
//                   </button>
//                 </div>
//               ) : null}

//               {/* State 2: Processing (Fetching or Decrypting) */}
//               {(decryptStatus === "fetching" || decryptStatus === "decrypting") && (
//                 <div className="flex flex-col items-center justify-center py-12 text-emerald-500 space-y-4">
//                   <Loader2 className="w-12 h-12 animate-spin" />
//                   <p className="font-mono text-sm tracking-widest uppercase">
//                     {decryptStatus === "fetching" ? "Pulling encrypted payload from IPFS..." : "Cracking AES-256 cipher locally..."}
//                   </p>
//                 </div>
//               )}

//               {/* State 3: Success! Display the Image */}
//               {decryptStatus === "success" && decryptedDataUrl && (
//                 <div className="space-y-4 animate-fade-in-up">
//                   <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm font-mono mb-4">
//                     <CheckCircle className="w-5 h-5 shrink-0" /> 
//                     Payload successfully decrypted. Viewing strictly classified data.
//                   </div>
                  
//                   <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center p-2">
//                     {/* Render as an image since we uploaded Data URLs from images */}
//                     <img 
//                       src={decryptedDataUrl} 
//                       alt="Decrypted Evidence" 
//                       className="max-w-full max-h-[50vh] object-contain rounded"
//                     />
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

















"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Database, Lock, Clock, Fingerprint, Loader2, AlertTriangle, ExternalLink, Link as LinkIcon, Globe, FolderLock, Key, X, Unlock, FileImage, Eye, CheckCircle } from "lucide-react";
import { getContract } from "../../utils/ethereum";
import CryptoJS from "crypto-js";

interface EvidenceRecord {
  evidenceId: number;
  ipfsHash: string;
  fileHash: string;
  uploader: string;
  timestamp: number;
}

export default function DashboardPage() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"global" | "mine">("global");

  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [decryptKey, setDecryptKey] = useState<string>("");
  const [decryptStatus, setDecryptStatus] = useState<"idle" | "fetching" | "decrypting" | "success" | "error">("idle");
  const [decryptError, setDecryptError] = useState<string>("");
  const [decryptedDataUrl, setDecryptedDataUrl] = useState<string>("");

  useEffect(() => {
    fetchEvidence();
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0].toLowerCase());
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0].toLowerCase());
    } else {
      setWalletAddress("");
      setActiveTab("global");
    }
  };

  const fetchEvidence = async () => {
    try {
      const contract = await getContract();
      if (!contract) {
        setError("Could not connect to the smart contract. Please ensure MetaMask is connected.");
        setLoading(false);
        return;
      }

      const data = await contract.getAllEvidence();
      
      const formattedData = data.map((item: any) => ({
        evidenceId: Number(item.evidenceId),
        ipfsHash: item.ipfsHash,
        fileHash: item.fileHash,
        uploader: item.uploader,
        timestamp: Number(item.timestamp),
      })).reverse(); 

      setRecords(formattedData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching evidence:", err);
      setError("Failed to load evidence records from the blockchain. Make sure your local node is running.");
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    });
  };

  const displayedRecords = activeTab === "mine" 
    ? records.filter(record => record.uploader.toLowerCase() === walletAddress)
    : records;

  const handleDecrypt = async () => {
    if (!selectedRecord || !decryptKey) return;

    setDecryptStatus("fetching");
    setDecryptError("");

    try {
      const gatewayUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${selectedRecord.ipfsHash}`;
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) throw new Error("Failed to fetch payload from IPFS network.");
      const encryptedText = await response.text();

      setDecryptStatus("decrypting");

      setTimeout(() => {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, decryptKey);
          const originalDataUrl = decryptedBytes.toString(CryptoJS.enc.Utf8);

          if (!originalDataUrl || !originalDataUrl.startsWith("data:")) {
            throw new Error("Invalid Secret Key or corrupted evidence payload.");
          }

          setDecryptedDataUrl(originalDataUrl);
          setDecryptStatus("success");
        } catch (e: any) {
          console.error("Decryption mathematically failed:", e);
          setDecryptStatus("error");
          setDecryptError("Invalid Secret Key or corrupted evidence payload.");
        }
      }, 100);

    } catch (err: any) {
      console.error("Network error:", err);
      setDecryptStatus("error");
      setDecryptError(err.message || "Failed to process the decryption request.");
    }
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setDecryptKey("");
    setDecryptStatus("idle");
    setDecryptError("");
    setDecryptedDataUrl("");
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up relative">
      <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
            <Database className="text-blue-500 w-8 h-8" />
            Immutable Ledger
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Live view of all digital evidence cryptographically secured on the Ethereum network.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono bg-blue-900/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Total Records Anchored: {records.length}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${
            activeTab === "global" 
              ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
              : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          Global Ledger
        </button>
        
        <button
          onClick={() => setActiveTab("mine")}
          disabled={!walletAddress}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${
            activeTab === "mine" 
              ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
              : !walletAddress 
                ? "bg-slate-900/20 text-slate-600 border border-slate-800/50 cursor-not-allowed"
                : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
          title={!walletAddress ? "Connect wallet to view your evidence" : ""}
        >
          <FolderLock className="w-4 h-4" />
          My Evidence
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-blue-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-mono text-sm tracking-widest uppercase">Syncing with blockchain network...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-xl flex items-center gap-4 font-mono">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <p>{error}</p>
        </div>
      ) : displayedRecords.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 p-16 rounded-xl text-center shadow-lg">
          <Database className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h3 className="text-white font-mono text-xl mb-3">No Evidence Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {activeTab === "mine" 
              ? "You haven't uploaded any evidence with this wallet address yet." 
              : "The blockchain ledger is currently empty."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayedRecords.map((record) => {
            // --- NEW: Identify Encrypted Records and Clean Hash ---
            const isEncrypted = record.fileHash.startsWith("ENC|");
            const displayHash = isEncrypted ? record.fileHash.replace("ENC|", "") : record.fileHash;

            return (
              <div key={record.evidenceId} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  
                  {/* Left side: ID and Hashes */}
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-sm font-mono font-bold border border-slate-700">
                        ID: #{record.evidenceId}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ON-CHAIN
                      </span>
                      {isEncrypted && (
                        <span className="flex items-center gap-1.5 text-purple-400 text-xs font-mono bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">
                          <Lock className="w-3.5 h-3.5" /> AES-256
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5" /> SHA-256 File Hash
                      </p>
                      <p className="text-slate-300 text-sm font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 break-all select-all">
                        {displayHash}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Metadata & Actions */}
                  <div className="md:w-5/12 space-y-4 md:pl-8 md:border-l md:border-slate-800">
                    
                    {/* DATA ACCESS CONTROLS (CONDITIONAL) */}
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" /> {isEncrypted ? "Encrypted Payload Access" : "IPFS File Access"}
                      </p>
                      
                      <div className="flex flex-col xl:flex-row gap-2">
                        {isEncrypted ? (
                          <>
                            <button 
                              onClick={() => setSelectedRecord(record)}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors px-3 py-2 rounded-lg border border-emerald-500/50 shadow-lg text-xs font-mono"
                            >
                              <Unlock className="w-4 h-4 shrink-0" />
                              Decrypt & View
                            </button>
                            <a 
                              href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${record.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View raw encrypted ciphertext on IPFS"
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-3 py-2 rounded-lg border border-slate-700 text-xs font-mono"
                            >
                              <ExternalLink className="w-4 h-4 shrink-0" />
                              Raw IPFS Hash
                            </a>
                          </>
                        ) : (
                          <a 
                            href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${record.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors px-3 py-2 rounded-lg border border-slate-700 text-xs font-mono"
                          >
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            View Evidence
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">Uploader Wallet</p>
                      <p className="text-slate-400 text-xs font-mono truncate bg-slate-950/50 px-2 py-1 rounded border border-slate-800/50 select-all" title={record.uploader}>
                        {record.uploader}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Network Timestamp
                      </p>
                      <p className="text-slate-300 text-xs font-mono">
                        {formatDate(record.timestamp)}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- DECRYPTION MODAL --- */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-md p-4 animate-fade-in-up">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-mono font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Decryption Chamber
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-6">
                <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Target Payload CID</p>
                <p className="text-blue-400 text-sm font-mono truncate">{selectedRecord.ipfsHash}</p>
              </div>

              {decryptStatus === "idle" || decryptStatus === "error" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-emerald-500 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Key className="w-4 h-4" /> Enter AES-256 Secret Key
                    </label>
                    <input 
                      type="password" 
                      placeholder="Access required..." 
                      value={decryptKey}
                      onChange={(e) => setDecryptKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-emerald-400 font-mono text-base focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-slate-600"
                      autoFocus
                    />
                  </div>
                  
                  {decryptStatus === "error" && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-start gap-2 text-sm font-mono">
                      <AlertTriangle className="w-5 h-5 shrink-0" /> 
                      <p>{decryptError}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleDecrypt}
                    disabled={!decryptKey}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3.5 px-4 rounded-lg font-bold font-mono transition-colors"
                  >
                    <Unlock className="w-5 h-5" /> Execute Decryption
                  </button>
                </div>
              ) : null}

              {(decryptStatus === "fetching" || decryptStatus === "decrypting") && (
                <div className="flex flex-col items-center justify-center py-12 text-emerald-500 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin" />
                  <p className="font-mono text-sm tracking-widest uppercase">
                    {decryptStatus === "fetching" ? "Pulling encrypted payload from IPFS..." : "Cracking AES-256 cipher locally..."}
                  </p>
                </div>
              )}

              {decryptStatus === "success" && decryptedDataUrl && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm font-mono mb-4">
                    <CheckCircle className="w-5 h-5 shrink-0" /> 
                    Payload successfully decrypted. Viewing strictly classified data.
                  </div>
                  
                  <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center p-2">
                    <img 
                      src={decryptedDataUrl} 
                      alt="Decrypted Evidence" 
                      className="max-w-full max-h-[50vh] object-contain rounded"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}