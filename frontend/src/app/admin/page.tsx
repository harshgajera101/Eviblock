// "use client";

// import { useState, useEffect } from "react";
// import { ShieldAlert, UserPlus, UserMinus, Loader2, CheckCircle, Lock } from "lucide-react";
// import { getContract } from "../../utils/ethereum";

// export default function AdminPage() {
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
//   const [loading, setLoading] = useState(true);
//   const [targetAddress, setTargetAddress] = useState("");
//   const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     checkAdminStatus();
    
//     // Listen for MetaMask account switching
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', checkAdminStatus);
//     }
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', checkAdminStatus);
//       }
//     };
//   }, []);

//   const checkAdminStatus = async () => {
//     setLoading(true);
//     try {
//       const contract = await getContract();
//       if (window.ethereum && contract) {
//         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//         if (accounts.length > 0) {
//           // Fetch the superAdmin address directly from the smart contract
//           const superAdmin = await contract.superAdmin();
//           setIsAdmin(accounts[0].toLowerCase() === superAdmin.toLowerCase());
//         }
//       }
//     } catch (error) {
//       console.error("Error checking admin status:", error);
//     }
//     setLoading(false);
//   };

//   const handleRoleAction = async (action: "grant" | "revoke") => {
//     if (!targetAddress) return;
//     setStatus("processing");
//     setMessage("");
    
//     try {
//       const contract = await getContract();
//       if (!contract) throw new Error("Contract not connected.");
      
//       // Execute the appropriate smart contract function
//       const tx = action === "grant" 
//         ? await contract.grantInvestigator(targetAddress)
//         : await contract.revokeInvestigator(targetAddress);
        
//       await tx.wait(); // Wait for blockchain confirmation
      
//       setStatus("success");
//       setMessage(`Successfully ${action === "grant" ? "granted" : "revoked"} Investigator role for ${targetAddress.substring(0,6)}...`);
//       setTargetAddress("");
//     } catch (error: any) {
//       console.error(error);
//       setStatus("error");
//       setMessage(error?.message || "Transaction failed or rejected by user.");
//     }
//   };

//   // 1. Loading State
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-24 text-blue-400">
//         <Loader2 className="w-12 h-12 animate-spin mb-4" />
//         <p className="font-mono text-sm tracking-widest uppercase">Verifying Security Clearance...</p>
//       </div>
//     );
//   }

//   // 2. Unauthorized Hacker State
//   if (!isAdmin) {
//     return (
//       <div className="max-w-2xl mx-auto mt-20 bg-red-900/20 border border-red-500/50 p-10 rounded-xl text-center animate-fade-in-up shadow-[0_0_30px_rgba(239,68,68,0.15)]">
//         <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
//         <h2 className="text-2xl font-mono font-bold text-white mb-4">RESTRICTED AREA</h2>
//         <p className="text-slate-400 font-mono text-sm">
//           Your connected wallet does not have Super Admin privileges. This incident has been logged.
//         </p>
//       </div>
//     );
//   }

//   // 3. Authorized Admin State
//   return (
//     <div className="max-w-4xl mx-auto animate-fade-in-up">
//       <div className="mb-10 border-b border-slate-800 pb-6">
//         <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
//           <ShieldAlert className="text-blue-500 w-8 h-8" />
//           System Administration
//         </h1>
//         <p className="text-slate-400 mt-2 text-sm">
//           Manage Role-Based Access Control (RBAC) and network permissions.
//         </p>
//       </div>

//       <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-lg">
//         <h3 className="text-xl font-mono font-bold text-white mb-6 border-b border-slate-800 pb-4">
//           Investigator Authorization
//         </h3>
        
//         <div className="space-y-6">
//           <div>
//             <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-2">
//               Target MetaMask Address
//             </label>
//             <input 
//               type="text" 
//               placeholder="0x..." 
//               value={targetAddress}
//               onChange={(e) => setTargetAddress(e.target.value)}
//               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:border-blue-500 focus:outline-none transition-colors"
//             />
//           </div>

//           <div className="flex gap-4">
//             <button 
//               onClick={() => handleRoleAction("grant")}
//               disabled={!targetAddress || status === "processing"}
//               className="flex-1 flex items-center justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 disabled:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
//             >
//               {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
//               Grant Access
//             </button>
            
//             <button 
//               onClick={() => handleRoleAction("revoke")}
//               disabled={!targetAddress || status === "processing"}
//               className="flex-1 flex items-center justify-center gap-2 bg-red-900/80 hover:bg-red-800 disabled:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
//             >
//               {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserMinus className="w-5 h-5" />}
//               Revoke Access
//             </button>
//           </div>

//           {status === "success" && (
//             <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono mt-4">
//               <CheckCircle className="w-5 h-5 shrink-0" /> {message}
//             </div>
//           )}

//           {status === "error" && (
//             <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono mt-4">
//               <ShieldAlert className="w-5 h-5 shrink-0" /> {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, UserPlus, UserMinus, Loader2, CheckCircle, Lock, Users, ShieldCheck } from "lucide-react";
import { getContract } from "../../utils/ethereum";

interface Personnel {
  address: string;
  role: "Super Admin" | "Investigator";
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [targetAddress, setTargetAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  
  // New state for the user list
  const [registry, setRegistry] = useState<Personnel[]>([]);

  useEffect(() => {
    checkAdminStatus();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkAdminStatus);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkAdminStatus);
      }
    };
  }, []);

  const checkAdminStatus = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (window.ethereum && contract) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const superAdmin = await contract.superAdmin();
          const isUserAdmin = accounts[0].toLowerCase() === superAdmin.toLowerCase();
          setIsAdmin(isUserAdmin);
          
          if (isUserAdmin) {
            await fetchRegistry(contract, superAdmin);
          }
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
    setLoading(false);
  };

  // Scans blockchain events to build the user list
  const fetchRegistry = async (contract: any, superAdmin: string) => {
    try {
      const grantFilter = contract.filters.RoleGranted();
      const revokeFilter = contract.filters.RoleRevoked();

      // Fetch all historical events
      const grantedLogs = await contract.queryFilter(grantFilter);
      const revokedLogs = await contract.queryFilter(revokeFilter);

      let activeInvestigators = new Set<string>();

      // Add granted addresses
      grantedLogs.forEach((log: any) => {
        if (log.args && log.args[1]) activeInvestigators.add(log.args[1].toLowerCase());
      });

      // Remove revoked addresses
      revokedLogs.forEach((log: any) => {
        if (log.args && log.args[1]) activeInvestigators.delete(log.args[1].toLowerCase());
      });

      // Format the final array
      const personnelList: Personnel[] = [
        { address: superAdmin.toLowerCase(), role: "Super Admin" }
      ];

      activeInvestigators.forEach((address) => {
        // Prevent listing the admin twice if they granted themselves the role
        if (address !== superAdmin.toLowerCase()) {
          personnelList.push({ address, role: "Investigator" });
        }
      });

      setRegistry(personnelList);
    } catch (error) {
      console.error("Error fetching registry logs:", error);
    }
  };

  const handleRoleAction = async (action: "grant" | "revoke") => {
    if (!targetAddress) return;
    setStatus("processing");
    setMessage("");
    
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Contract not connected.");
      
      const tx = action === "grant" 
        ? await contract.grantInvestigator(targetAddress)
        : await contract.revokeInvestigator(targetAddress);
        
      await tx.wait(); 
      
      setStatus("success");
      setMessage(`Successfully ${action === "grant" ? "granted" : "revoked"} Investigator role for ${targetAddress.substring(0,6)}...`);
      setTargetAddress("");
      
      // Refresh the list
      const superAdmin = await contract.superAdmin();
      await fetchRegistry(contract, superAdmin);
      
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error?.message || "Transaction failed or rejected by user.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-blue-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase">Verifying Security Clearance...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-red-900/20 border border-red-500/50 p-10 rounded-xl text-center animate-fade-in-up shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-mono font-bold text-white mb-4">RESTRICTED AREA</h2>
        <p className="text-slate-400 font-mono text-sm">
          Your connected wallet does not have Super Admin privileges. This incident has been logged.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-3 mb-4 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
          <ShieldAlert className="text-blue-500 w-8 h-8" />
          System Administration
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Manage Role-Based Access Control (RBAC) and network permissions.
        </p>
      </div>

      {/* LEFT COLUMN: Role Management */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-lg h-full">
          <h3 className="text-xl font-mono font-bold text-white mb-6 border-b border-slate-800 pb-4">
            Investigator Authorization
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-2">
                Target MetaMask Address
              </label>
              <input 
                type="text" 
                placeholder="0x..." 
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleRoleAction("grant")}
                disabled={!targetAddress || status === "processing"}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 disabled:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                Grant Access
              </button>
              
              <button 
                onClick={() => handleRoleAction("revoke")}
                disabled={!targetAddress || status === "processing"}
                className="flex-1 flex items-center justify-center gap-2 bg-red-900/80 hover:bg-red-800 disabled:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserMinus className="w-5 h-5" />}
                Revoke Access
              </button>
            </div>

            {status === "success" && (
              <div className="bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono mt-4">
                <CheckCircle className="w-5 h-5 shrink-0" /> {message}
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 text-sm font-mono mt-4">
                <ShieldAlert className="w-5 h-5 shrink-0" /> {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Personnel Registry */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg h-full">
        <h3 className="text-lg font-mono font-bold text-white mb-4 border-b border-slate-800 pb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Personnel Registry
        </h3>
        
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {registry.map((person, index) => (
            <div key={index} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {person.role === "Super Admin" ? (
                  <span className="bg-purple-900/40 text-purple-400 border border-purple-500/30 text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Super Admin
                  </span>
                ) : (
                  <span className="bg-blue-900/40 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    Investigator
                  </span>
                )}
              </div>
              <p className="text-slate-300 font-mono text-xs break-all">
                {person.address}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}