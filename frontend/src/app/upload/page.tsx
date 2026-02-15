// "use client";

// import { useState, useRef } from "react";
// import { ShieldCheck, UploadCloud, FileType, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
// import { requestAccount, getContract } from "../../utils/ethereum";

// export default function UploadPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [fileHash, setFileHash] = useState<string>("");
//   const [status, setStatus] = useState<"idle" | "hashing" | "uploading" | "success" | "error">("idle");
//   const [txHash, setTxHash] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // 1. Handle File Selection & Generate SHA-256 Hash
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setStatus("hashing");
//     setErrorMessage("");

//     try {
//       // Generate SHA-256 Hash natively in the browser
//       const buffer = await selectedFile.arrayBuffer();
//       const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
//       const hashArray = Array.from(new Uint8Array(hashBuffer));
//       const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      
//       setFileHash(hashHex);
//       setStatus("idle");
//     } catch (error) {
//       console.error("Hashing error:", error);
//       setStatus("error");
//       setErrorMessage("Failed to generate file hash. Please try again.");
//     }
//   };

//   // 2. Upload Evidence to Blockchain
//   const handleSecureUpload = async () => {
//     if (!file || !fileHash) return;
//     setStatus("uploading");
//     setErrorMessage("");

//     try {
//       // Connect to MetaMask
//       const account = await requestAccount();
//       if (!account) throw new Error("Please connect your MetaMask wallet.");

//       // For academic demonstration, we simulate IPFS generation
//       // In production, this would be an API call to Web3.Storage or Pinata
//       const mockIpfsHash = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

//       // Connect to Smart Contract
//       const contract = await getContract();
//       if (!contract) throw new Error("Could not connect to the smart contract.");

//       // Execute Smart Contract Transaction
//       const transaction = await contract.addEvidence(mockIpfsHash, fileHash);
      
//       // Wait for block confirmation
//       const receipt = await transaction.wait();
      
//       setTxHash(receipt.hash);
//       setStatus("success");

//     } catch (error: any) {
//       console.error("Upload error:", error);
//       setStatus("error");
//       setErrorMessage(error?.message || "Transaction failed or was rejected by the user.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in-up">
      
//       {/* Header */}
//       <div className="mb-10 border-b border-slate-800 pb-6">
//         <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
//           <UploadCloud className="text-blue-500 w-8 h-8" />
//           Secure Evidence Upload
//         </h1>
//         <p className="text-slate-400 mt-2 text-sm">
//           Cryptographically hash your digital evidence and anchor it to the Ethereum blockchain.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* Left Column: File Selection */}
//         <div className="space-y-6">
//           <div 
//             className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <input 
//               type="file" 
//               className="hidden" 
//               ref={fileInputRef} 
//               onChange={handleFileChange}
//             />
//             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <FileType className="text-slate-400 w-8 h-8 group-hover:text-blue-400 transition-colors" />
//             </div>
//             <h3 className="text-lg font-medium text-white mb-1">Select Evidence File</h3>
//             <p className="text-xs text-slate-500 font-mono">Supports all digital formats. File remains local during hashing.</p>
//           </div>

//           {/* Dynamic Status Messages */}
//           {status === "error" && (
//             <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono">
//               <AlertTriangle className="w-5 h-5 shrink-0" />
//               {errorMessage}
//             </div>
//           )}

//           {status === "success" && (
//             <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-sm font-mono break-all">
//               <div className="flex items-center gap-3 text-emerald-300 font-bold mb-1">
//                 <CheckCircle className="w-5 h-5 shrink-0" />
//                 EVIDENCE SECURED ON-CHAIN
//               </div>
//               <p className="text-emerald-500/80">Transaction Hash:</p>
//               <p className="text-xs">{txHash}</p>
//             </div>
//           )}
//         </div>

//         {/* Right Column: Metadata & Actions */}
//         <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
//           <h3 className="text-white font-mono font-bold border-b border-slate-800 pb-3 mb-4">
//             Security Metadata
//           </h3>
          
//           <div className="flex-grow space-y-4">
//             <div>
//               <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">Target File</label>
//               <div className="text-slate-300 text-sm mt-1 bg-slate-950 p-2 rounded border border-slate-800 truncate">
//                 {file ? file.name : "No file selected"}
//               </div>
//             </div>

//             <div>
//               <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">SHA-256 Hash Output</label>
//               <div className="text-slate-300 text-xs mt-1 bg-slate-950 p-3 rounded border border-slate-800 font-mono break-all min-h-[60px] flex items-center">
//                 {status === "hashing" ? (
//                   <span className="flex items-center gap-2 text-blue-400 animate-pulse">
//                     <Loader2 className="w-4 h-4 animate-spin" /> Generating cryptographic hash...
//                   </span>
//                 ) : (
//                   fileHash || "Awaiting file selection..."
//                 )}
//               </div>
//             </div>
//           </div>

//           <button 
//             onClick={handleSecureUpload}
//             disabled={!file || status === "uploading" || status === "hashing" || status === "success"}
//             className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
//           >
//             {status === "uploading" ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Interacting with Smart Contract...
//               </>
//             ) : status === "success" ? (
//               <>
//                 <ShieldCheck className="w-5 h-5" />
//                 Integrity Locked
//               </>
//             ) : (
//               <>
//                 <ShieldCheck className="w-5 h-5" />
//                 Sign & Store on Blockchain
//               </>
//             )}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }










"use client";

import { useState, useRef } from "react";
import { ShieldCheck, UploadCloud, FileType, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { requestAccount, getContract } from "../../utils/ethereum";
import { PinataSDK } from "pinata-web3";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "gateway.pinata.cloud",
});

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "hashing" | "uploading_ipfs" | "uploading_chain" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle File Selection & Generate SHA-256 Hash
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus("hashing");
    setErrorMessage("");

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      
      setFileHash(hashHex);
      setStatus("idle");
    } catch (error) {
      console.error("Hashing error:", error);
      setStatus("error");
      setErrorMessage("Failed to generate local file hash.");
    }
  };

  // 2. Upload to IPFS & Blockchain
  const handleSecureUpload = async () => {
    if (!file || !fileHash) return;
    setErrorMessage("");

    try {
      // Connect Wallet First
      const account = await requestAccount();
      if (!account) throw new Error("Please connect your MetaMask wallet.");

      // STEP A: Upload to IPFS via Pinata
      setStatus("uploading_ipfs");
      const uploadRequest = await pinata.upload.file(file);
      const realIpfsCid = uploadRequest.IpfsHash;

      // STEP B: Secure on Blockchain
      setStatus("uploading_chain");
      const contract = await getContract();
      if (!contract) throw new Error("Could not connect to the smart contract.");

      // Pass the real IPFS CID to the smart contract
      const transaction = await contract.addEvidence(realIpfsCid, fileHash);
      const receipt = await transaction.wait();
      
      setTxHash(receipt.hash);
      setStatus("success");

    } catch (error: any) {
      console.error("Upload error:", error);
      setStatus("error");
      setErrorMessage(error?.message || "Transaction failed or was rejected.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
          <UploadCloud className="text-blue-500 w-8 h-8" />
          Secure Evidence Upload
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Upload files to decentralized IPFS storage and anchor integrity hashes to Ethereum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileType className="text-slate-400 w-8 h-8 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Select Evidence File</h3>
            <p className="text-xs text-slate-500 font-mono">File will be hosted on IPFS.</p>
          </div>

          {status === "error" && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {errorMessage}
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-sm font-mono break-all">
              <div className="flex items-center gap-3 text-emerald-300 font-bold mb-1">
                <CheckCircle className="w-5 h-5 shrink-0" /> EVIDENCE SECURED ON-CHAIN
              </div>
              <p className="text-emerald-500/80">Transaction Hash:</p>
              <p className="text-xs">{txHash}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-white font-mono font-bold border-b border-slate-800 pb-3 mb-4">Security Metadata</h3>
          
          <div className="flex-grow space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">Target File</label>
              <div className="text-slate-300 text-sm mt-1 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                {file ? file.name : "No file selected"}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-mono uppercase tracking-wider">SHA-256 Hash Output</label>
              <div className="text-slate-300 text-xs mt-1 bg-slate-950 p-3 rounded border border-slate-800 font-mono break-all min-h-[60px] flex items-center">
                {status === "hashing" ? (
                  <span className="flex items-center gap-2 text-blue-400 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating hash...
                  </span>
                ) : (
                  fileHash || "Awaiting file selection..."
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSecureUpload}
            disabled={!file || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {status === "uploading_ipfs" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Pinning to IPFS...</>
            ) : status === "uploading_chain" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Anchoring to Blockchain...</>
            ) : status === "success" ? (
              <><ShieldCheck className="w-5 h-5" /> Integrity Locked</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Sign & Store</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}