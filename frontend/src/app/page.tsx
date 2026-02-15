// import Link from "next/link";
// import { ShieldCheck, Database, Lock, FileSearch, ArrowRight, CheckCircle } from "lucide-react";

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      
//       {/* --- HERO SECTION --- */}
//       <div className="space-y-6 max-w-4xl animate-fade-in-up">
//         {/* Badge */}
//         <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono tracking-wider mb-4">
//           <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
//           BLOCKCHAIN INTEGRITY SYSTEM
//         </div>

//         {/* Main Headline */}
//         <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-mono">
//           Immutable <br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
//             Digital Evidence
//           </span>
//         </h1>

//         <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
//           Eviblock secures digital forensic data using SHA-256 hashing and decentralized IPFS storage. 
//           Guarantee chain-of-custody with zero-trust verification.
//         </p>

//         {/* Call to Actions */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
//           <Link href="/upload" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
//             <ShieldCheck className="w-5 h-5 mr-2" />
//             Secure Evidence
//           </Link>
//           <Link href="/verify" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all">
//             <FileSearch className="w-5 h-5 mr-2" />
//             Verify Integrity
//           </Link>
//         </div>
//       </div>

//       {/* --- FEATURE GRID --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl pt-12">
        
//         {/* Feature 1 */}
//         <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
//           <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900/30">
//             <Lock className="w-6 h-6 text-blue-400" />
//           </div>
//           <h3 className="text-xl font-bold text-white mb-2 font-mono">Tamper-Proof</h3>
//           <p className="text-slate-400 text-sm">
//             Records are stored on the Ethereum blockchain. Once added, evidence cannot be altered or deleted by anyone.
//           </p>
//         </div>

//         {/* Feature 2 */}
//         <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-purple-500/50 transition-colors group">
//           <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-900/30">
//             <Database className="w-6 h-6 text-purple-400" />
//           </div>
//           <h3 className="text-xl font-bold text-white mb-2 font-mono">Decentralized</h3>
//           <p className="text-slate-400 text-sm">
//             Files are secured on IPFS (InterPlanetary File System), eliminating central points of failure.
//           </p>
//         </div>

//         {/* Feature 3 */}
//         <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-emerald-500/50 transition-colors group">
//           <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-900/30">
//             <CheckCircle className="w-6 h-6 text-emerald-400" />
//           </div>
//           <h3 className="text-xl font-bold text-white mb-2 font-mono">Instant Audit</h3>
//           <p className="text-slate-400 text-sm">
//             Verify any file against the blockchain ledger in seconds. Detect even 1-bit modifications immediately.
//           </p>
//         </div>

//       </div>

//       {/* --- STATS / TRUST SECTION --- */}
//       <div className="pt-8 border-t border-slate-800 w-full max-w-4xl">
//         <div className="flex justify-between items-center text-slate-500 text-xs md:text-sm font-mono uppercase tracking-widest">
//           <span>Encryption: SHA-256</span>
//           <span>Network: Hardhat / Eth</span>
//           <span>Status: Protected</span>
//         </div>
//       </div>

//     </div>
//   );
// }









import Link from "next/link";
import { ShieldCheck, Database, Lock, FileSearch, CheckCircle, Fingerprint, Network, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-20 overflow-hidden bg-[#0F172A]">
      
      {/* --- BACKGROUND SUBTLE GRID --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-6 lg:px-8 space-y-24 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center space-y-8 max-w-4xl animate-fade-in-up mt-10">
          
          {/* Security Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 text-blue-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
            System Operational • v1.0.0-Beta
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-mono leading-tight">
            Immutable <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Digital Evidence
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eviblock secures digital forensic data using zero-trust SHA-256 hashing and decentralized IPFS storage. Guarantee the chain of custody without relying on centralized authorities.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/upload" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] border border-blue-500/50 uppercase tracking-wider font-mono w-full sm:w-auto">
              <ShieldCheck className="w-5 h-5 mr-2.5" />
              Secure Evidence
            </Link>
            <Link href="/verify" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all uppercase tracking-wider font-mono w-full sm:w-auto">
              <FileSearch className="w-5 h-5 mr-2.5" />
              Verify Integrity
            </Link>
          </div>
        </section>

        {/* --- CORE FEATURES GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Feature 1 */}
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">Cryptographic Anchors</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Records are cryptographically hashed and stored on the Ethereum blockchain. Once anchored, evidence cannot be altered, forged, or deleted.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
              <Database className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">Decentralized Storage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Files are distributed across the InterPlanetary File System (IPFS), eliminating single points of failure and preventing database corruption.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
              <FileSearch className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-mono">Zero-Trust Auditing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Verify any file against the blockchain ledger instantly. If even a single pixel or text character is altered, the system will flag it as compromised.
            </p>
          </div>
        </section>

        {/* --- ARCHITECTURE FLOW (NEW SECTION) --- */}
        <section className="w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-2xl font-bold text-white font-mono mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
            <Cpu className="text-blue-500 w-6 h-6" /> System Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">1</div>
              <h4 className="text-white font-mono font-bold text-sm mb-2">Local Hashing</h4>
              <p className="text-slate-500 text-xs">Files are hashed (SHA-256) entirely in the browser. Raw data never touches our servers.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">2</div>
              <h4 className="text-white font-mono font-bold text-sm mb-2">IPFS Pinning</h4>
              <p className="text-slate-500 text-xs">The encrypted file is pinned to the decentralized IPFS network, generating a unique CID.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">3</div>
              <h4 className="text-white font-mono font-bold text-sm mb-2">Smart Contract</h4>
              <p className="text-slate-500 text-xs">The file's hash and IPFS CID are permanently anchored to the Ethereum blockchain ledger.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-mono font-bold mb-4 border border-blue-500/30">4</div>
              <h4 className="text-blue-100 font-mono font-bold text-sm mb-2">Public Verification</h4>
              <p className="text-slate-500 text-xs">Auditors can cross-reference physical files against the immutable blockchain record.</p>
            </div>
          </div>
        </section>

        {/* --- TERMINAL FOOTER --- */}
        <section className="w-full border-t border-slate-800 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-mono uppercase tracking-widest bg-slate-950 py-3 px-6 rounded border border-slate-800/50">
            <span className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-slate-600" /> Encryption: SHA-256</span>
            <span className="flex items-center gap-2"><Network className="w-4 h-4 text-slate-600" /> Network: Localhost / ETH</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Status: Protected</span>
          </div>
        </section>

      </div>
    </div>
  );
}