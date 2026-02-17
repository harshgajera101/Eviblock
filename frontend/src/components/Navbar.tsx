// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { ShieldCheck, Upload, FileSearch, LayoutDashboard, Wallet, ShieldAlert, LogOut, Menu, X } from "lucide-react";
// import { getContract } from "../utils/ethereum";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [walletAddress, setWalletAddress] = useState<string>("");
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
//   // --- NEW: Mobile Menu State ---
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Close mobile menu automatically when the route changes
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [pathname]);

//   // Check if wallet is already connected when page loads
//   useEffect(() => {
//     checkConnection();
//     // Listen for account changes in MetaMask
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//     }
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       }
//     };
//   }, []);

//   const checkConnection = async () => {
//     if (window.ethereum) {
//       const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//       if (accounts.length > 0) {
//         setWalletAddress(accounts[0]);
//         checkAdminStatus(accounts[0]);
//       }
//     }
//   };

//   const handleAccountsChanged = (accounts: string[]) => {
//     if (accounts.length > 0) {
//       setWalletAddress(accounts[0]);
//       checkAdminStatus(accounts[0]);
//     } else {
//       disconnectWallet();
//     }
//   };

//   // Cryptographically verify if the connected wallet is the Super Admin
//   const checkAdminStatus = async (address: string) => {
//     try {
//       const contract = await getContract();
      
//       if (contract) {
//         const superAdmin = await contract.superAdmin();
//         const isMatch = address.toLowerCase() === superAdmin.toLowerCase();
//         setIsAdmin(isMatch);
//       }
//     } catch (error) {
//       console.error("🚨 DIAGNOSTIC ERROR: Failed to fetch admin clearance:", error);
//       setIsAdmin(false);
//     }
//   };

//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         setWalletAddress(accounts[0]);
//         checkAdminStatus(accounts[0]);
//       } catch (error) {
//         console.error("Connection failed", error);
//       }
//     } else {
//       alert("Please install MetaMask!");
//     }
//   };

//   const disconnectWallet = () => {
//     setWalletAddress("");
//     setIsAdmin(false);
//   };

//   const formatAddress = (address: string) => {
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };

//   // Dynamic Navigation Items
//   const navItems = [
//     { name: "Upload", href: "/upload", icon: Upload },
//     { name: "Verify", href: "/verify", icon: ShieldCheck },
//     { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//     // The Admin tab is injected ONLY if the user is verified as Admin
//     ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: ShieldAlert }] : []),
//   ];

//   return (
//     <nav className="w-full border-b border-slate-800 bg-[#0F172A] sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">
//         <div className="flex justify-between items-center h-16">
          
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-2 group shrink-0">
//             <div className="bg-blue-900/30 p-1.5 sm:p-2 rounded-lg group-hover:bg-blue-800/50 transition-colors">
//               <ShieldCheck className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
//             </div>
//             <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
//               Evi<span className="text-blue-500">Block</span>
//             </span>
//           </Link>

//           {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
//           <div className="hidden md:flex items-center gap-6">
//             <div className="flex gap-2">
//               {navItems.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md
//                       ${isActive ? "text-blue-400 bg-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
//                   >
//                     <item.icon className="w-4 h-4" />
//                     <span>{item.name}</span>
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* Desktop Wallet Connection / Logout */}
//             <div className="pl-4 border-l border-slate-700">
//               {walletAddress ? (
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono text-slate-300">
//                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                     {formatAddress(walletAddress)}
//                   </div>
//                   <button 
//                     onClick={disconnectWallet}
//                     className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-red-900/20 px-3 py-2 rounded-lg border border-transparent hover:border-red-500/30 active:scale-95"
//                     title="Disconnect Session"
//                   >
//                     <LogOut className="w-3.5 h-3.5" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button 
//                   onClick={connectWallet}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95"
//                 >
//                   <Wallet className="w-4 h-4" />
//                   Connect
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* --- MOBILE MENU TOGGLE BUTTON (Hidden on Desktop) --- */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-slate-400 hover:text-white p-2 focus:outline-none transition-colors"
//             >
//               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* --- MOBILE DROPDOWN MENU --- */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-4 animate-fade-in-up">
//           <div className="flex flex-col gap-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-3 text-sm font-medium transition-colors px-4 py-3 rounded-lg
//                     ${isActive ? "text-blue-400 bg-blue-900/20 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Mobile Wallet Controls */}
//           <div className="pt-4 border-t border-slate-800">
//             {walletAddress ? (
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-sm font-mono text-slate-300 w-full">
//                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                   {formatAddress(walletAddress)}
//                 </div>
//                 <button 
//                   onClick={() => { disconnectWallet(); setIsMobileMenuOpen(false); }}
//                   className="flex items-center justify-center gap-2 text-sm font-medium text-red-400 transition-colors bg-red-900/10 hover:bg-red-900/20 px-4 py-3 rounded-lg border border-red-500/30 active:scale-95 w-full"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout Session
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}
//                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all active:scale-95 w-full"
//               >
//                 <Wallet className="w-5 h-5" />
//                 Connect Wallet
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }




















"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, Upload, FileSearch, LayoutDashboard, Wallet, ShieldAlert, LogOut, Menu, X } from "lucide-react";
import { getContract } from "../utils/ethereum";

// --- NEW: Custom Eviblock SVG Logo Component ---
const EviblockLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" fill="#10B981" />
  </svg>
);

// // --- NEW: Updated Custom Eviblock SVG Logo Component (Document inside block) ---
// const EviblockLogo = ({ className }: { className?: string }) => (
//   <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
//     {/* Outer Cube */}
//     <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
//     {/* Inner Document */}
//     <path d="M9 8C9 7.44772 9.44772 7 10 7H13L16 10V17C16 17.5523 15.5523 18 15 18H10C9.44772 18 9 17.5523 9 17V8Z" fill="#10B981"/>
//     {/* We use hardcoded #0F172A here to match the navbar background for the fold cutout effect */}
//     <path d="M13 7V10H16" stroke="#0F172A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );


export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    checkConnection();
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

  const checkAdminStatus = async (address: string) => {
    try {
      const contract = await getContract();
      if (contract) {
        const superAdmin = await contract.superAdmin();
        const isMatch = address.toLowerCase() === superAdmin.toLowerCase();
        setIsAdmin(isMatch);
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

  const navItems = [
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Verify", href: "/verify", icon: ShieldCheck },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: ShieldAlert }] : []),
  ];

  return (
    <nav className="w-full border-b border-slate-800 bg-[#0F172A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* --- UPDATED LOGO SECTION --- */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-slate-900/50 p-1.5 sm:p-2 rounded-lg border border-slate-800 group-hover:border-blue-500/50 group-hover:bg-blue-900/20 transition-all duration-300 shadow-lg">
              {/* Using our custom SVG component here */}
              <EviblockLogo className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
              Evi<span className="text-blue-500">Block</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
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
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pl-4 border-l border-slate-700">
              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    {formatAddress(walletAddress)}
                  </div>
                  <button 
                    onClick={disconnectWallet}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-red-900/20 px-3 py-2 rounded-lg border border-transparent hover:border-red-500/30 active:scale-95"
                    title="Disconnect Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:scale-95"
                >
                  <Wallet className="w-4 h-4" />
                  Connect
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-4 animate-fade-in-up">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 text-sm font-medium transition-colors px-4 py-3 rounded-lg
                    ${isActive ? "text-blue-400 bg-blue-900/20 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            {walletAddress ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-lg text-sm font-mono text-slate-300 w-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {formatAddress(walletAddress)}
                </div>
                <button 
                  onClick={() => { disconnectWallet(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 text-sm font-medium text-red-400 transition-colors bg-red-900/10 hover:bg-red-900/20 px-4 py-3 rounded-lg border border-red-500/30 active:scale-95 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Session
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { connectWallet(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all active:scale-95 w-full"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}