// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ShieldCheck, UploadCloud, FileType, Loader2, AlertTriangle, CheckCircle, Key, Lock } from "lucide-react";
// import { requestAccount, getContract } from "../../utils/ethereum";
// import { PinataSDK } from "pinata-web3";
// import CryptoJS from "crypto-js"; // <-- NEW: Cryptography Library

// // Initialize Pinata SDK (Using environment variables for both JWT and Gateway)
// const pinata = new PinataSDK({
//   pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
//   pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
// });

// export default function UploadPage() {
//   const [isInvestigator, setIsInvestigator] = useState<boolean | null>(null);

//   const [file, setFile] = useState<File | null>(null);
//   const [fileHash, setFileHash] = useState<string>("");
//   const [secretKey, setSecretKey] = useState<string>(""); // <-- NEW: Secret Key State
//   const [status, setStatus] = useState<"idle" | "hashing" | "encrypting" | "uploading_ipfs" | "uploading_chain" | "success" | "error">("idle");
//   const [txHash, setTxHash] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");
  
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- SECURITY CHECK ON LOAD (From our previous RBAC implementation) ---
//   useEffect(() => {
//     checkClearance();
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', checkClearance);
//     }
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', checkClearance);
//       }
//     };
//   }, []);

//   const checkClearance = async () => {
//     try {
//       if (!window.ethereum) {
//         setIsInvestigator(false);
//         return;
//       }
//       const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//       if (accounts.length === 0) {
//         setIsInvestigator(false);
//         return;
//       }
      
//       const contract = await getContract();
//       if (contract) {
//         const authorized = await contract.checkIsInvestigator(accounts[0]);
//         setIsInvestigator(authorized);
//       }
//     } catch (error) {
//       console.error("Clearance check failed:", error);
//       setIsInvestigator(false);
//     }
//   };

//   // 1. Handle File Selection & Generate SHA-256 Hash
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setStatus("hashing");
//     setErrorMessage("");

//     try {
//       const buffer = await selectedFile.arrayBuffer();
//       const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
//       const hashArray = Array.from(new Uint8Array(hashBuffer));
//       const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      
//       setFileHash(hashHex);
//       setStatus("idle");
//     } catch (error) {
//       console.error("Hashing error:", error);
//       setStatus("error");
//       setErrorMessage("Failed to generate local file hash.");
//     }
//   };

//   // --- NEW: Client-Side AES-256 Encryption Function ---
//   const encryptFile = (fileToEncrypt: File, key: string): Promise<File> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         try {
//           // Convert the file to a Data URL (base64) and encrypt it using the password
//           const encryptedString = CryptoJS.AES.encrypt(reader.result as string, key).toString();
          
//           // Create a new text file containing the encrypted gibberish
//           const blob = new Blob([encryptedString], { type: "text/plain" });
//           const encryptedFile = new File([blob], fileToEncrypt.name + ".enc", { type: "text/plain" });
          
//           resolve(encryptedFile);
//         } catch (e) {
//           reject(e);
//         }
//       };
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(fileToEncrypt);
//     });
//   };

//   // 2. Upload to IPFS & Blockchain
//   const handleSecureUpload = async () => {
//     if (!file || !fileHash) return;
    
//     // Enforce Secret Key Usage
//     if (!secretKey) {
//       setStatus("error");
//       setErrorMessage("A Secret Encryption Key is required to zero-knowledge secure this file.");
//       return;
//     }
    
//     setErrorMessage("");

//     try {
//       // Connect Wallet First
//       const account = await requestAccount();
//       if (!account) throw new Error("Please connect your MetaMask wallet.");

//       // STEP A: Encrypt the File Locally
//       setStatus("encrypting");
//       const securedFile = await encryptFile(file, secretKey);

//       // STEP B: Upload the Encrypted Gibberish to IPFS via Pinata
//       setStatus("uploading_ipfs");
//       const uploadRequest = await pinata.upload.file(securedFile);
//       const realIpfsCid = uploadRequest.IpfsHash;

//       // STEP C: Secure on Blockchain
//       setStatus("uploading_chain");
//       const contract = await getContract();
//       if (!contract) throw new Error("Could not connect to the smart contract.");

//       const transaction = await contract.addEvidence(realIpfsCid, fileHash);
//       const receipt = await transaction.wait();
      
//       setTxHash(receipt.hash);
//       setStatus("success");
//       setSecretKey(""); // Clear the password from memory for security

//     } catch (error: any) {
//       console.error("Upload error caught:", error);
//       setStatus("error");
      
//       const rawError = error?.message || String(error);
//       let friendlyMessage = "Transaction failed or was rejected by the network.";

//       if (rawError.includes("Unauthorized") || rawError.includes("Investigators only")) {
//         friendlyMessage = "Access Denied: You do not have Investigator privileges to anchor evidence. Please contact an Admin.";
//       } else if (rawError.includes("user rejected") || rawError.includes("ACTION_REJECTED")) {
//         friendlyMessage = "Transaction was cancelled in MetaMask.";
//       } else if (rawError.includes("insufficient funds")) {
//         friendlyMessage = "Insufficient funds in your wallet to pay for the network fee.";
//       }
      
//       setErrorMessage(friendlyMessage);
//     }
//   };

//   // --- RENDER STATES (From RBAC) ---
//   if (isInvestigator === null) {
//     return (
//       <div className="flex flex-col items-center justify-center py-24 text-blue-400">
//         <Loader2 className="w-12 h-12 animate-spin mb-4" />
//         <p className="font-mono text-sm tracking-widest uppercase">Verifying Investigator Credentials...</p>
//       </div>
//     );
//   }

//   if (isInvestigator === false) {
//     return (
//       <div className="max-w-2xl mx-auto mt-20 bg-slate-900/50 border border-slate-800 p-10 rounded-xl text-center animate-fade-in-up shadow-lg">
//         <Lock className="w-16 h-16 text-slate-500 mx-auto mb-6" />
//         <h2 className="text-2xl font-mono font-bold text-white mb-4">ACCESS DENIED</h2>
//         <p className="text-slate-400 font-mono text-sm mb-6">
//           You must be an authorized Investigator to upload digital evidence to the ledger. If you require access, please contact the System Administrator.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in-up">
//       <div className="mb-10 border-b border-slate-800 pb-6">
//         <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
//           <UploadCloud className="text-blue-500 w-8 h-8" />
//           Secure Evidence Upload
//         </h1>
//         <p className="text-slate-400 mt-2 text-sm">
//           Encrypt files locally, upload to decentralized IPFS storage, and anchor integrity hashes to Ethereum.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           <div 
//             className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-900/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
//             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <FileType className="text-slate-400 w-8 h-8 group-hover:text-blue-400 transition-colors" />
//             </div>
//             <h3 className="text-lg font-medium text-white mb-1">Select Evidence File</h3>
//             <p className="text-xs text-slate-500 font-mono">File will be hosted on IPFS.</p>
//           </div>

//           {status === "error" && (
//             <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start gap-3 text-sm font-mono w-full overflow-hidden">
//               <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
//               <p className="break-words whitespace-pre-wrap flex-1 leading-relaxed">
//                 {errorMessage}
//               </p>
//             </div>
//           )}

//           {status === "success" && (
//             <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-sm font-mono break-all w-full overflow-hidden">
//               <div className="flex items-center gap-3 text-emerald-300 font-bold mb-1">
//                 <CheckCircle className="w-5 h-5 shrink-0" /> EVIDENCE SECURED ON-CHAIN
//               </div>
//               <p className="text-emerald-500/80">Transaction Hash:</p>
//               <p className="text-xs break-words">{txHash}</p>
//             </div>
//           )}
//         </div>

//         <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-full w-full overflow-hidden">
//           <h3 className="text-white font-mono font-bold border-b border-slate-800 pb-3 mb-4">Security Metadata</h3>
          
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
//                     <Loader2 className="w-4 h-4 animate-spin" /> Generating hash...
//                   </span>
//                 ) : (
//                   fileHash || "Awaiting file selection..."
//                 )}
//               </div>
//             </div>

//             {/* --- NEW UI: Secret Key Input --- */}
//             <div>
//               <label className="text-xs text-emerald-500 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-1.5 mt-4">
//                 <Key className="w-3.5 h-3.5" /> AES-256 Secret Key
//               </label>
//               <input 
//                 type="password" 
//                 placeholder="Enter password to encrypt file..." 
//                 value={secretKey}
//                 onChange={(e) => setSecretKey(e.target.value)}
//                 disabled={status === "encrypting" || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
//                 className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-slate-600 disabled:opacity-50"
//               />
//               <p className="text-[10px] text-slate-500 font-mono mt-1">
//                 Warning: If you lose this key, the evidence cannot be decrypted by anyone.
//               </p>
//             </div>
//           </div>

//           <button 
//             onClick={handleSecureUpload}
//             disabled={!file || status === "encrypting" || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
//             className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-colors shrink-0"
//           >
//             {status === "encrypting" ? (
//               <><Loader2 className="w-5 h-5 animate-spin" /> Encrypting File...</>
//             ) : status === "uploading_ipfs" ? (
//               <><Loader2 className="w-5 h-5 animate-spin" /> Pinning to IPFS...</>
//             ) : status === "uploading_chain" ? (
//               <><Loader2 className="w-5 h-5 animate-spin" /> Anchoring to Blockchain...</>
//             ) : status === "success" ? (
//               <><ShieldCheck className="w-5 h-5" /> Integrity Locked</>
//             ) : (
//               <><ShieldCheck className="w-5 h-5" /> Encrypt & Store</>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, UploadCloud, FileType, Loader2, AlertTriangle, CheckCircle, Key, Lock, Unlock } from "lucide-react";
import { requestAccount, getContract } from "../../utils/ethereum";
import { PinataSDK } from "pinata-web3";
import CryptoJS from "crypto-js";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export default function UploadPage() {
  const [isInvestigator, setIsInvestigator] = useState<boolean | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>("");
  
  // --- NEW: Toggle State ---
  const [isSensitive, setIsSensitive] = useState<boolean>(false); 
  const [secretKey, setSecretKey] = useState<string>(""); 
  
  const [status, setStatus] = useState<"idle" | "hashing" | "encrypting" | "uploading_ipfs" | "uploading_chain" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkClearance();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkClearance);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkClearance);
      }
    };
  }, []);

  const checkClearance = async () => {
    try {
      if (!window.ethereum) {
        setIsInvestigator(false);
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        setIsInvestigator(false);
        return;
      }
      
      const contract = await getContract();
      if (contract) {
        const authorized = await contract.checkIsInvestigator(accounts[0]);
        setIsInvestigator(authorized);
      }
    } catch (error) {
      console.error("Clearance check failed:", error);
      setIsInvestigator(false);
    }
  };

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

  const encryptFile = (fileToEncrypt: File, key: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const encryptedString = CryptoJS.AES.encrypt(reader.result as string, key).toString();
          const blob = new Blob([encryptedString], { type: "text/plain" });
          const encryptedFile = new File([blob], fileToEncrypt.name + ".enc", { type: "text/plain" });
          resolve(encryptedFile);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(fileToEncrypt);
    });
  };

  const handleSecureUpload = async () => {
    if (!file || !fileHash) return;
    
    // Require secret key ONLY if sensitive toggle is on
    if (isSensitive && !secretKey) {
      setStatus("error");
      setErrorMessage("A Secret Encryption Key is required for sensitive evidence.");
      return;
    }
    
    setErrorMessage("");

    try {
      const account = await requestAccount();
      if (!account) throw new Error("Please connect your MetaMask wallet.");

      let realIpfsCid = "";
      let finalFileHash = fileHash;

      if (isSensitive) {
        // --- ENCRYPTED FLOW ---
        setStatus("encrypting");
        const securedFile = await encryptFile(file, secretKey);
        
        setStatus("uploading_ipfs");
        const uploadRequest = await pinata.upload.file(securedFile);
        realIpfsCid = uploadRequest.IpfsHash;
        
        // Add a prefix to the hash so the Dashboard knows it's encrypted
        finalFileHash = `ENC|${fileHash}`; 
      } else {
        // --- NORMAL FLOW ---
        setStatus("uploading_ipfs");
        const uploadRequest = await pinata.upload.file(file);
        realIpfsCid = uploadRequest.IpfsHash;
      }

      setStatus("uploading_chain");
      const contract = await getContract();
      if (!contract) throw new Error("Could not connect to the smart contract.");

      const transaction = await contract.addEvidence(realIpfsCid, finalFileHash);
      const receipt = await transaction.wait();
      
      setTxHash(receipt.hash);
      setStatus("success");
      setSecretKey(""); 

    } catch (error: any) {
      console.error("Upload error caught:", error);
      setStatus("error");
      
      const rawError = error?.message || String(error);
      let friendlyMessage = "Transaction failed or was rejected by the network.";

      if (rawError.includes("Unauthorized") || rawError.includes("Investigators only")) {
        friendlyMessage = "Access Denied: You do not have Investigator privileges to anchor evidence. Please contact an Admin.";
      } else if (rawError.includes("user rejected") || rawError.includes("ACTION_REJECTED")) {
        friendlyMessage = "Transaction was cancelled in MetaMask.";
      } else if (rawError.includes("insufficient funds")) {
        friendlyMessage = "Insufficient funds in your wallet to pay for the network fee.";
      }
      
      setErrorMessage(friendlyMessage);
    }
  };

  if (isInvestigator === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-blue-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase">Verifying Investigator Credentials...</p>
      </div>
    );
  }

  if (isInvestigator === false) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-slate-900/50 border border-slate-800 p-10 rounded-xl text-center animate-fade-in-up shadow-lg">
        <Lock className="w-16 h-16 text-slate-500 mx-auto mb-6" />
        <h2 className="text-2xl font-mono font-bold text-white mb-4">ACCESS DENIED</h2>
        <p className="text-slate-400 font-mono text-sm mb-6">
          You must be an authorized Investigator to upload digital evidence to the ledger. If you require access, please contact the System Administrator.
        </p>
      </div>
    );
  }

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
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start gap-3 text-sm font-mono w-full overflow-hidden">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
              <p className="break-words whitespace-pre-wrap flex-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex flex-col gap-2 text-sm font-mono break-all w-full overflow-hidden">
              <div className="flex items-center gap-3 text-emerald-300 font-bold mb-1">
                <CheckCircle className="w-5 h-5 shrink-0" /> EVIDENCE SECURED ON-CHAIN
              </div>
              <p className="text-emerald-500/80">Transaction Hash:</p>
              <p className="text-xs break-words">{txHash}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col h-full w-full overflow-hidden">
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

            {/* --- NEW UI: Sensitive Data Toggle --- */}
            {file && (
              <div className="mt-4 flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    {isSensitive ? <Lock className="w-4 h-4 text-emerald-400" /> : <Unlock className="w-4 h-4 text-slate-500" />}
                    Sensitive Evidence
                  </h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isSensitive} 
                    onChange={() => setIsSensitive(!isSensitive)} 
                    disabled={status === "encrypting" || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            )}

            {/* --- Conditionally Rendered Secret Key Input --- */}
            {isSensitive && (
              <div className="animate-fade-in-up">
                <label className="text-xs text-emerald-500 font-mono uppercase tracking-wider flex items-center gap-1.5 mb-1.5 mt-2">
                  <Key className="w-3.5 h-3.5" /> AES-256 Secret Key
                </label>
                <input 
                  type="password" 
                  placeholder="Enter password to encrypt file..." 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  disabled={status === "encrypting" || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-slate-600 disabled:opacity-50"
                />
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Warning: If you lose this key, the evidence cannot be decrypted by anyone.
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={handleSecureUpload}
            disabled={!file || status === "encrypting" || status === "uploading_ipfs" || status === "uploading_chain" || status === "success"}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 px-4 rounded-lg font-medium transition-colors shrink-0"
          >
            {status === "encrypting" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Encrypting File...</>
            ) : status === "uploading_ipfs" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Pinning to IPFS...</>
            ) : status === "uploading_chain" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Anchoring to Blockchain...</>
            ) : status === "success" ? (
              <><ShieldCheck className="w-5 h-5" /> Integrity Locked</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> {isSensitive ? "Encrypt & Store" : "Sign & Store"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}