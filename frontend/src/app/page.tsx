import Link from "next/link";
import { ShieldCheck, Database, Lock, FileSearch, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      
      {/* --- HERO SECTION --- */}
      <div className="space-y-6 max-w-4xl animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          BLOCKCHAIN INTEGRITY SYSTEM
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-mono">
          Immutable <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Digital Evidence
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Eviblock secures digital forensic data using SHA-256 hashing and decentralized IPFS storage. 
          Guarantee chain-of-custody with zero-trust verification.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/upload" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Secure Evidence
          </Link>
          <Link href="/verify" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all">
            <FileSearch className="w-5 h-5 mr-2" />
            Verify Integrity
          </Link>
        </div>
      </div>

      {/* --- FEATURE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pt-12">
        
        {/* Feature 1 */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
          <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900/30">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">Tamper-Proof</h3>
          <p className="text-slate-400 text-sm">
            Records are stored on the Ethereum blockchain. Once added, evidence cannot be altered or deleted by anyone.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-purple-500/50 transition-colors group">
          <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-900/30">
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">Decentralized</h3>
          <p className="text-slate-400 text-sm">
            Files are secured on IPFS (InterPlanetary File System), eliminating central points of failure.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-emerald-500/50 transition-colors group">
          <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-900/30">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-mono">Instant Audit</h3>
          <p className="text-slate-400 text-sm">
            Verify any file against the blockchain ledger in seconds. Detect even 1-bit modifications immediately.
          </p>
        </div>

      </div>

      {/* --- STATS / TRUST SECTION --- */}
      <div className="pt-8 border-t border-slate-800 w-full max-w-4xl">
        <div className="flex justify-between items-center text-slate-500 text-xs md:text-sm font-mono uppercase tracking-widest">
          <span>Encryption: SHA-256</span>
          <span>Network: Hardhat / Eth</span>
          <span>Status: Protected</span>
        </div>
      </div>

    </div>
  );
}