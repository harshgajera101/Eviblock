// "use client";

// import { useState, useEffect } from "react";
// import {
//   ShieldCheck,
//   Database,
//   Clock,
//   Fingerprint,
//   Loader2,
//   AlertTriangle,
//   ExternalLink,
//   Link as LinkIcon,
// } from "lucide-react";
// import { getContract } from "../../utils/ethereum";

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

//   const fetchEvidence = async () => {
//     try {
//       const contract = await getContract();
//       if (!contract) {
//         setError(
//           "Could not connect to the smart contract. Please ensure MetaMask is connected.",
//         );
//         setLoading(false);
//         return;
//       }

//       const data = await contract.getAllEvidence();

//       const formattedData = data
//         .map((item: any) => ({
//           evidenceId: Number(item.evidenceId),
//           ipfsHash: item.ipfsHash,
//           fileHash: item.fileHash,
//           uploader: item.uploader,
//           timestamp: Number(item.timestamp),
//         }))
//         .reverse();

//       setRecords(formattedData);
//       setLoading(false);
//     } catch (err: any) {
//       console.error("Error fetching evidence:", err);
//       setError(
//         "Failed to load evidence records from the blockchain. Make sure your local node is running.",
//       );
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvidence();
//   }, []);

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       timeZoneName: "short",
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto animate-fade-in-up">
//       {/* Header Section */}
//       <div className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
//             <Database className="text-blue-500 w-8 h-8" />
//             Immutable Ledger
//           </h1>
//           <p className="text-slate-400 mt-2 text-sm">
//             Live view of all digital evidence cryptographically secured on the
//             Ethereum network.
//           </p>
//         </div>

//         <div className="flex items-center gap-2 text-xs font-mono bg-blue-900/20 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/30">
//           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//           Total Records Anchored: {records.length}
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-24 text-blue-400">
//           <Loader2 className="w-12 h-12 animate-spin mb-4" />
//           <p className="font-mono text-sm tracking-widest uppercase">
//             Syncing with blockchain network...
//           </p>
//         </div>
//       ) : error ? (
//         <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-xl flex items-center gap-4 font-mono">
//           <AlertTriangle className="w-8 h-8 shrink-0" />
//           <p>{error}</p>
//         </div>
//       ) : records.length === 0 ? (
//         <div className="bg-slate-900/50 border border-slate-800 p-16 rounded-xl text-center shadow-lg">
//           <Database className="w-16 h-16 text-slate-700 mx-auto mb-6" />
//           <h3 className="text-white font-mono text-xl mb-3">
//             No Evidence Found
//           </h3>
//           <p className="text-slate-400 text-sm max-w-md mx-auto">
//             The blockchain ledger is currently empty. Navigate to the upload
//             page to secure your first piece of digital evidence.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {records.map((record) => (
//             <div
//               key={record.evidenceId}
//               className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all group"
//             >
//               <div className="flex flex-col md:flex-row justify-between gap-6">
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

//                 {/* Right side: Metadata */}
//                 <div className="md:w-5/12 space-y-4 md:pl-8 md:border-l md:border-slate-800">
//                   {/* ENHANCED IPFS SECTION */}
//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
//                       <Database className="w-3.5 h-3.5" /> IPFS File Access
//                     </p>
//                     <a
//                       /* Use the environment variable for the gateway domain */
//                       href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${record.ipfsHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 transition-colors px-3 py-2 rounded-lg border border-blue-500/30 hover:border-blue-400 w-full md:w-auto"
//                     >
//                       <LinkIcon className="w-4 h-4 shrink-0" />
//                       <span
//                         className="text-xs font-mono truncate max-w-[120px]"
//                         title={record.ipfsHash}
//                       >
//                         {record.ipfsHash}
//                       </span>
//                       <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1" />
//                     </a>
//                   </div>

//                   <div>
//                     <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">
//                       Uploader Wallet
//                     </p>
//                     <p
//                       className="text-slate-400 text-xs font-mono truncate bg-slate-950/50 px-2 py-1 rounded border border-slate-800/50 select-all"
//                       title={record.uploader}
//                     >
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
//     </div>
//   );
// }















"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Database, Clock, Fingerprint, Loader2, AlertTriangle, ExternalLink, Link as LinkIcon, Globe, FolderLock } from "lucide-react";
import { getContract } from "../../utils/ethereum";

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

  // 1. Fetch records and check connected wallet on load
  useEffect(() => {
    fetchEvidence();
    checkWalletConnection();

    // Listen for account changes in case they switch MetaMask wallets
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
      setActiveTab("global"); // Force back to global if they disconnect
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

  // 2. Filter logic: If "mine", only show records where uploader matches the connected wallet
  const displayedRecords = activeTab === "mine" 
    ? records.filter(record => record.uploader.toLowerCase() === walletAddress)
    : records;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Header Section */}
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

      {/* NEW: Navigation Tabs for "Global" vs "My Evidence" */}
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
          {displayedRecords.map((record) => (
            <div key={record.evidenceId} className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left side: ID and Hashes */}
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-sm font-mono font-bold border border-slate-700">
                      ID: #{record.evidenceId}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ON-CHAIN
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5" /> SHA-256 File Hash
                    </p>
                    <p className="text-slate-300 text-sm font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 break-all select-all">
                      {record.fileHash}
                    </p>
                  </div>
                </div>

                {/* Right side: Metadata */}
                <div className="md:w-5/12 space-y-4 md:pl-8 md:border-l md:border-slate-800">
                  
                  <div>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> IPFS File Access
                    </p>
                    <a 
                      href={`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 transition-colors px-3 py-2 rounded-lg border border-blue-500/30 hover:border-blue-400 w-full md:w-auto"
                    >
                      <LinkIcon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-mono truncate max-w-[120px]" title={record.ipfsHash}>
                        {record.ipfsHash}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1" />
                    </a>
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
          ))}
        </div>
      )}
    </div>
  );
}