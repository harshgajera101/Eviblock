// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ShieldCheck, Upload, FileSearch, LayoutDashboard } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   const navItems = [
//     { name: "Upload", href: "/upload", icon: Upload },
//     { name: "Verify", href: "/verify", icon: ShieldCheck },
//     { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   ];

//   return (
//     <nav className="w-full border-b border-slate-800 bg-[#0F172A] sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo Area */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <div className="bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-colors">
//               <ShieldCheck className="text-blue-400 w-6 h-6" />
//             </div>
//             <span className="text-xl font-bold tracking-tight text-white">
//               Evi<span className="text-blue-500">Block</span>
//             </span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="flex gap-6">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md
//                     ${isActive 
//                       ? "text-blue-400 bg-blue-900/20" 
//                       : "text-slate-400 hover:text-white hover:bg-slate-800"
//                     }`}
//                 >
//                   <item.icon className="w-4 h-4" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// }












"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, Upload, FileSearch, LayoutDashboard, Wallet, ShieldAlert, LogOut } from "lucide-react";
import { getContract } from "../utils/ethereum"; // We need this to check admin status

export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if wallet is already connected when page loads
  useEffect(() => {
    checkConnection();
    // Listen for account changes in MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        checkAdminStatus(accounts[0]);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      checkAdminStatus(accounts[0]);
    } else {
      disconnectWallet();
    }
  };

  // Cryptographically verify if the connected wallet is the Super Admin
  const checkAdminStatus = async (address: string) => {
    try {
      console.log("🔍 DIAGNOSTIC: Checking wallet address:", address);
      const contract = await getContract();
      
      if (contract) {
        console.log("✅ DIAGNOSTIC: Contract successfully connected.");
        
        // Fetch the superAdmin from the blockchain
        const superAdmin = await contract.superAdmin();
        console.log("👑 DIAGNOSTIC: SuperAdmin from blockchain is:", superAdmin);
        
        const isMatch = address.toLowerCase() === superAdmin.toLowerCase();
        console.log("⚖️ DIAGNOSTIC: Do they match?", isMatch);
        
        setIsAdmin(isMatch);
      } else {
        console.log("❌ DIAGNOSTIC: getContract() returned null.");
      }
    } catch (error) {
      console.error("🚨 DIAGNOSTIC ERROR: Failed to fetch admin clearance:", error);
      setIsAdmin(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        checkAdminStatus(accounts[0]);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsAdmin(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Dynamic Navigation Items
  const navItems = [
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Verify", href: "/verify", icon: ShieldCheck },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    // The Admin tab is injected ONLY if the user is verified as Admin
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: ShieldAlert }] : []),
  ];

  return (
    <nav className="w-full border-b border-slate-800 bg-[#0F172A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-colors">
              <ShieldCheck className="text-blue-400 w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Evi<span className="text-blue-500">Block</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md
                      ${isActive ? "text-blue-400 bg-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Wallet Connection / Logout Area */}
            <div className="pl-4 border-l border-slate-700">
              {walletAddress ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {formatAddress(walletAddress)}
                  </div>
                  <button 
                    onClick={disconnectWallet}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-red-900/20 px-3 py-2 rounded-lg border border-transparent hover:border-red-500/30"
                    title="Disconnect Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}