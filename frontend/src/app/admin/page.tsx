"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, UserPlus, UserMinus, Loader2, CheckCircle, Lock } from "lucide-react";
import { getContract } from "../../utils/ethereum";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [targetAddress, setTargetAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAdminStatus();
    
    // Listen for MetaMask account switching
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
          // Fetch the superAdmin address directly from the smart contract
          const superAdmin = await contract.superAdmin();
          setIsAdmin(accounts[0].toLowerCase() === superAdmin.toLowerCase());
        }
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
    setLoading(false);
  };

  const handleRoleAction = async (action: "grant" | "revoke") => {
    if (!targetAddress) return;
    setStatus("processing");
    setMessage("");
    
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Contract not connected.");
      
      // Execute the appropriate smart contract function
      const tx = action === "grant" 
        ? await contract.grantInvestigator(targetAddress)
        : await contract.revokeInvestigator(targetAddress);
        
      await tx.wait(); // Wait for blockchain confirmation
      
      setStatus("success");
      setMessage(`Successfully ${action === "grant" ? "granted" : "revoked"} Investigator role for ${targetAddress.substring(0,6)}...`);
      setTargetAddress("");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error?.message || "Transaction failed or rejected by user.");
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-blue-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase">Verifying Security Clearance...</p>
      </div>
    );
  }

  // 2. Unauthorized Hacker State
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

  // 3. Authorized Admin State
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
          <ShieldAlert className="text-blue-500 w-8 h-8" />
          System Administration
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Manage Role-Based Access Control (RBAC) and network permissions.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 shadow-lg">
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
  );
}