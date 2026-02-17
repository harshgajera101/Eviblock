// "use client";

// import { useState, useRef } from "react";
// import { ShieldCheck, ShieldAlert, UploadCloud, FileType, Loader2, Search, FileSearch } from "lucide-react";
// import { getContract } from "../../utils/ethereum";

// interface VerifyResult {
//   status: "idle" | "hashing" | "verifying" | "authentic" | "tampered" | "error";
//   hash?: string;
//   timestamp?: number;
//   uploader?: string;
//   message?: string;
// }

// export default function VerifyPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [result, setResult] = useState<VerifyResult>({ status: "idle" });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setResult({ status: "hashing" });

//     try {
//       // 1. Generate SHA-256 Hash Natively
//       const buffer = await selectedFile.arrayBuffer();
//       const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
//       const hashArray = Array.from(new Uint8Array(hashBuffer));
//       const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      
//       verifyOnBlockchain(hashHex);
//     } catch (error) {
//       console.error("Hashing error:", error);
//       setResult({ status: "error", message: "Failed to read and hash the file locally." });
//     }
//   };

//   const verifyOnBlockchain = async (generatedHash: string) => {
//     setResult({ status: "verifying", hash: generatedHash });

//     try {
//       const contract = await getContract();
//       if (!contract) {
//         setResult({ status: "error", message: "Could not connect to the blockchain network." });
//         return;
//       }

//       // Fetch the ledger to cross-reference the hash
//       const data = await contract.getAllEvidence();
      
//       // --- LOGIC UPDATE: Look for a match with or without the 'ENC|' prefix ---
//       const match = data.find((item: any) => 
//         item.fileHash === generatedHash || item.fileHash === `ENC|${generatedHash}`
//       );

//       if (match) {
//         setResult({
//           status: "authentic",
//           hash: generatedHash, // Pass the clean hash back to the UI
//           timestamp: Number(match.timestamp),
//           uploader: match.uploader
//         });
//       } else {
//         setResult({
//           status: "tampered",
//           hash: generatedHash
//         });
//       }
//     } catch (error: any) {
//       console.error("Verification error:", error);
//       setResult({ status: "error", message: "Error communicating with the smart contract." });
//     }
//   };

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp * 1000).toLocaleString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in-up">
      
//       {/* Header */}
//       <div className="mb-10 border-b border-slate-800 pb-6 text-center md:text-left">
//         <h1 className="text-3xl font-bold text-white font-mono flex items-center justify-center md:justify-start gap-3">
//           <FileSearch className="text-blue-500 w-8 h-8" />
//           Evidence Verification
//         </h1>
//         <p className="text-slate-400 mt-2 text-sm">
//           Upload a file to verify its integrity against the Ethereum blockchain ledger.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* Left Column: Upload Scanner */}
//         <div className="space-y-6">
//           <div 
//             className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group h-64"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
//             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <Search className="text-slate-400 w-8 h-8 group-hover:text-blue-400 transition-colors" />
//             </div>
//             <h3 className="text-lg font-medium text-white mb-1">Select File to Audit</h3>
//             <p className="text-xs text-slate-500 font-mono">File is hashed locally. No data leaves your device.</p>
//           </div>
//         </div>

//         {/* Right Column: Scan Results */}
//         <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-full min-h-[16rem]">
//           <h3 className="text-white font-mono font-bold border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
//             Audit Results
//           </h3>

//           <div className="flex-grow flex flex-col justify-center">
            
//             {result.status === "idle" && (
//               <div className="text-center text-slate-500 font-mono text-sm">
//                 Awaiting file input...
//               </div>
//             )}

//             {(result.status === "hashing" || result.status === "verifying") && (
//               <div className="flex flex-col items-center text-blue-400 space-y-4">
//                 <Loader2 className="w-10 h-10 animate-spin" />
//                 <p className="font-mono text-sm tracking-widest uppercase animate-pulse">
//                   {result.status === "hashing" ? "Generating SHA-256 Hash..." : "Querying Blockchain..."}
//                 </p>
//               </div>
//             )}

//             {result.status === "authentic" && (
//               <div className="space-y-4 animate-fade-in-up">
//                 <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex items-center gap-3 font-mono">
//                   <ShieldCheck className="w-8 h-8 shrink-0" />
//                   <div>
//                     <p className="font-bold tracking-wider">VERIFIED AUTHENTIC</p>
//                     <p className="text-xs text-emerald-500/80">Exact match found on-chain</p>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-xs font-mono">
//                   <p><span className="text-slate-500">Hash:</span> <span className="text-slate-300 break-all">{result.hash}</span></p>
//                   <p><span className="text-slate-500">Anchored:</span> <span className="text-slate-300">{result.timestamp ? formatDate(result.timestamp) : "N/A"}</span></p>
//                 </div>
//               </div>
//             )}

//             {result.status === "tampered" && (
//               <div className="space-y-4 animate-fade-in-up">
//                 <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 font-mono">
//                   <ShieldAlert className="w-8 h-8 shrink-0" />
//                   <div>
//                     <p className="font-bold tracking-wider">INTEGRITY COMPROMISED</p>
//                     <p className="text-xs text-red-500/80">No matching record found</p>
//                   </div>
//                 </div>
//                 <div className="space-y-2 text-xs font-mono">
//                   <p className="text-slate-400">This file has been altered or was never secured on this network.</p>
//                   <p><span className="text-slate-500">Computed Hash:</span> <span className="text-slate-300 break-all">{result.hash}</span></p>
//                 </div>
//               </div>
//             )}

//             {result.status === "error" && (
//               <div className="text-red-400 text-sm font-mono text-center">
//                 {result.message}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }















"use client";

import { useState, useRef } from "react";
import { ShieldCheck, ShieldAlert, UploadCloud, FileType, Loader2, Search, FileSearch } from "lucide-react";
import { getContract } from "../../utils/ethereum";

interface VerifyResult {
  status: "idle" | "hashing" | "verifying" | "authentic" | "tampered" | "error";
  hash?: string;
  timestamp?: number;
  uploader?: string;
  message?: string;
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyResult>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult({ status: "hashing" });

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      
      verifyOnBlockchain(hashHex);
    } catch (error) {
      console.error("Hashing error:", error);
      setResult({ status: "error", message: "Failed to read and hash the file locally." });
    }
  };

  const verifyOnBlockchain = async (generatedHash: string) => {
    setResult({ status: "verifying", hash: generatedHash });

    try {
      const contract = await getContract();
      if (!contract) {
        setResult({ status: "error", message: "Could not connect to the blockchain network." });
        return;
      }

      const data = await contract.getAllEvidence();
      
      const match = data.find((item: any) => 
        item.fileHash === generatedHash || item.fileHash === `ENC|${generatedHash}`
      );

      if (match) {
        setResult({
          status: "authentic",
          hash: generatedHash, 
          timestamp: Number(match.timestamp),
          uploader: match.uploader
        });
      } else {
        setResult({
          status: "tampered",
          hash: generatedHash
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setResult({ status: "error", message: "Error communicating with the smart contract." });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8 sm:mb-10 border-b border-slate-800 pb-5 sm:pb-6 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono flex items-center justify-center md:justify-start gap-2 sm:gap-3">
          <FileSearch className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
          Evidence Verification
        </h1>
        <p className="text-slate-400 mt-2 text-xs sm:text-sm leading-relaxed">
          Upload a file to verify its integrity against the Ethereum blockchain ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-slate-900/50 bg-slate-900/30 rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group h-56 sm:h-64"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <Search className="text-slate-400 w-7 h-7 sm:w-8 sm:h-8 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white mb-1">Select File to Audit</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-mono">File is hashed locally. No data leaves your device.</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col h-full min-h-[16rem] shadow-lg">
          <h3 className="text-white font-mono text-sm sm:text-base font-bold border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
            Audit Results
          </h3>

          <div className="flex-grow flex flex-col justify-center">
            
            {result.status === "idle" && (
              <div className="text-center text-slate-500 font-mono text-xs sm:text-sm">
                Awaiting file input...
              </div>
            )}

            {(result.status === "hashing" || result.status === "verifying") && (
              <div className="flex flex-col items-center text-blue-400 space-y-3 sm:space-y-4">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
                <p className="font-mono text-[10px] sm:text-xs tracking-widest uppercase animate-pulse text-center">
                  {result.status === "hashing" ? "Generating SHA-256 Hash..." : "Querying Blockchain..."}
                </p>
              </div>
            )}

            {result.status === "authentic" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-3 sm:p-4 rounded-lg flex items-center gap-3 font-mono">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
                  <div>
                    <p className="font-bold tracking-wider text-xs sm:text-sm">VERIFIED AUTHENTIC</p>
                    <p className="text-[10px] sm:text-xs text-emerald-500/80">Exact match found on-chain</p>
                  </div>
                </div>
                <div className="space-y-2 text-[10px] sm:text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <p className="flex flex-col sm:block gap-1"><span className="text-slate-500">Hash: </span> <span className="text-slate-300 break-all">{result.hash}</span></p>
                  <p className="flex flex-col sm:block gap-1 mt-2 sm:mt-0"><span className="text-slate-500">Anchored: </span> <span className="text-slate-300">{result.timestamp ? formatDate(result.timestamp) : "N/A"}</span></p>
                </div>
              </div>
            )}

            {result.status === "tampered" && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 sm:p-4 rounded-lg flex items-center gap-3 font-mono">
                  <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
                  <div>
                    <p className="font-bold tracking-wider text-xs sm:text-sm">INTEGRITY COMPROMISED</p>
                    <p className="text-[10px] sm:text-xs text-red-500/80">No matching record found</p>
                  </div>
                </div>
                <div className="space-y-2 text-[10px] sm:text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <p className="text-slate-400 leading-relaxed mb-3">This file has been altered or was never secured on this network.</p>
                  <p className="flex flex-col sm:block gap-1"><span className="text-slate-500">Computed Hash: </span> <span className="text-slate-300 break-all">{result.hash}</span></p>
                </div>
              </div>
            )}

            {result.status === "error" && (
              <div className="text-red-400 text-xs sm:text-sm font-mono text-center p-3 border border-red-500/30 rounded-lg bg-red-900/10">
                {result.message}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}