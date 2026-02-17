// import Link from "next/link";
// import { ShieldCheck, Database, Lock, FileSearch, CheckCircle, Fingerprint, Network, Cpu, ArrowRight } from "lucide-react";

// export default function Home() {
//   return (
//     <div className="relative min-h-screen flex flex-col items-center pt-20 overflow-hidden bg-[#0F172A]">
      
//       {/* --- BACKGROUND SUBTLE GRID --- */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

//       <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-6 lg:px-8 space-y-24 pb-20">
        
//         {/* --- HERO SECTION --- */}
//         <section className="text-center space-y-8 max-w-4xl animate-fade-in-up mt-10">
          
//           {/* Security Badge */}
//           <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 text-blue-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.1)]">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
//             System Operational • v1.0.0-Beta
//           </div>

//           {/* Main Headline */}
//           <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-mono leading-tight">
//             Immutable <br className="hidden sm:block" />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
//               Digital Evidence
//             </span>
//           </h1>

//           <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
//             Eviblock secures digital forensic data using zero-trust SHA-256 hashing and decentralized IPFS storage. Guarantee the chain of custody without relying on centralized authorities.
//           </p>

//           {/* Call to Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
//             <Link href="/upload" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] border border-blue-500/50 uppercase tracking-wider font-mono w-full sm:w-auto">
//               <ShieldCheck className="w-5 h-5 mr-2.5" />
//               Secure Evidence
//             </Link>
//             <Link href="/verify" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all uppercase tracking-wider font-mono w-full sm:w-auto">
//               <FileSearch className="w-5 h-5 mr-2.5" />
//               Verify Integrity
//             </Link>
//           </div>
//         </section>

//         {/* --- CORE FEATURES GRID --- */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
//           {/* Feature 1 */}
//           <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
//             <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
//               <Lock className="w-7 h-7 text-blue-400" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3 font-mono">Cryptographic Anchors</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Records are cryptographically hashed and stored on the Ethereum blockchain. Once anchored, evidence cannot be altered, forged, or deleted.
//             </p>
//           </div>

//           {/* Feature 2 */}
//           <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
//             <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
//               <Database className="w-7 h-7 text-blue-400" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3 font-mono">Decentralized Storage</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Files are distributed across the InterPlanetary File System (IPFS), eliminating single points of failure and preventing database corruption.
//             </p>
//           </div>

//           {/* Feature 3 */}
//           <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 transition-all group shadow-lg">
//             <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
//               <FileSearch className="w-7 h-7 text-blue-400" />
//             </div>
//             <h3 className="text-xl font-bold text-white mb-3 font-mono">Zero-Trust Auditing</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Verify any file against the blockchain ledger instantly. If even a single pixel or text character is altered, the system will flag it as compromised.
//             </p>
//           </div>
//         </section>

//         {/* --- ARCHITECTURE FLOW (NEW SECTION) --- */}
//         <section className="w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
//           <h2 className="text-2xl font-bold text-white font-mono mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
//             <Cpu className="text-blue-500 w-6 h-6" /> System Architecture
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
//             {/* Connecting Line (Desktop only) */}
//             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>

//             {/* Step 1 */}
//             <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
//               <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">1</div>
//               <h4 className="text-white font-mono font-bold text-sm mb-2">Local Hashing</h4>
//               <p className="text-slate-500 text-xs">Files are hashed (SHA-256) entirely in the browser. Raw data never touches our servers.</p>
//             </div>

//             {/* Step 2 */}
//             <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
//               <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">2</div>
//               <h4 className="text-white font-mono font-bold text-sm mb-2">IPFS Pinning</h4>
//               <p className="text-slate-500 text-xs">The encrypted file is pinned to the decentralized IPFS network, generating a unique CID.</p>
//             </div>

//             {/* Step 3 */}
//             <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
//               <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono font-bold mb-4 border border-slate-700">3</div>
//               <h4 className="text-white font-mono font-bold text-sm mb-2">Smart Contract</h4>
//               <p className="text-slate-500 text-xs">The file's hash and IPFS CID are permanently anchored to the Ethereum blockchain ledger.</p>
//             </div>

//             {/* Step 4 */}
//             <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-6 rounded-xl border border-slate-800/80 relative z-0">
//               <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-mono font-bold mb-4 border border-blue-500/30">4</div>
//               <h4 className="text-blue-100 font-mono font-bold text-sm mb-2">Public Verification</h4>
//               <p className="text-slate-500 text-xs">Auditors can cross-reference physical files against the immutable blockchain record.</p>
//             </div>
//           </div>
//         </section>

//         {/* --- TERMINAL FOOTER --- */}
//         <section className="w-full border-t border-slate-800 pt-8 pb-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-mono uppercase tracking-widest bg-slate-950 py-3 px-6 rounded border border-slate-800/50">
//             <span className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-slate-600" /> Encryption: SHA-256</span>
//             <span className="flex items-center gap-2"><Network className="w-4 h-4 text-slate-600" /> Network: Localhost / ETH</span>
//             <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Status: Protected</span>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }



















import Link from "next/link";
import { ShieldCheck, Database, Lock, FileSearch, CheckCircle, Fingerprint, Network, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center pt-16 sm:pt-20 overflow-hidden bg-[#0F172A]">
      
      {/* --- BACKGROUND SUBTLE GRID --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center space-y-6 sm:space-y-8 max-w-4xl animate-fade-in-up mt-8 sm:mt-10">
          
          {/* Security Badge */}
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 rounded-full border border-blue-500/30 bg-blue-900/20 text-blue-400 text-[10px] sm:text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all hover:bg-blue-900/30 cursor-default">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 mr-2 sm:mr-3 animate-pulse"></span>
            System Operational • v1.0.0-Beta
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-mono leading-tight px-2">
            Immutable <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              Digital Evidence
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Eviblock secures digital forensic data using zero-trust SHA-256 hashing and decentralized IPFS storage. Guarantee the chain of custody without relying on centralized authorities.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
            <Link href="/upload" className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 text-sm font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.25)] border border-blue-500/50 uppercase tracking-wider font-mono w-full sm:w-auto">
              <ShieldCheck className="w-5 h-5 mr-2.5" />
              Secure Evidence
            </Link>
            <Link href="/verify" className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 text-sm font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all duration-200 active:scale-[0.98] uppercase tracking-wider font-mono w-full sm:w-auto">
              <FileSearch className="w-5 h-5 mr-2.5" />
              Verify Integrity
            </Link>
          </div>
        </section>

        {/* --- CORE FEATURES GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-2 sm:px-0">
          {/* Feature 1 */}
          <div className="p-6 sm:p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-5 sm:mb-6 group-hover:border-blue-500/50 group-hover:bg-blue-900/10 transition-colors">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-mono">Cryptographic Anchors</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Records are cryptographically hashed and stored on the Ethereum blockchain. Once anchored, evidence cannot be altered, forged, or deleted.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 sm:p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-5 sm:mb-6 group-hover:border-blue-500/50 group-hover:bg-blue-900/10 transition-colors">
              <Database className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-mono">Decentralized Storage</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Files are distributed across the InterPlanetary File System (IPFS), eliminating single points of failure and preventing database corruption.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 sm:p-8 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center mb-5 sm:mb-6 group-hover:border-blue-500/50 group-hover:bg-blue-900/10 transition-colors">
              <FileSearch className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-mono">Zero-Trust Auditing</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Verify any file against the blockchain ledger instantly. If even a single pixel or text character is altered, the system will flag it as compromised.
            </p>
          </div>
        </section>

        {/* --- ARCHITECTURE FLOW --- */}
        <section className="w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl mx-2 sm:mx-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-mono mb-6 sm:mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-3">
            <Cpu className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" /> System Architecture
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800/80 hover:border-slate-600 transition-colors relative z-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-slate-700">1</div>
              <h4 className="text-white font-mono font-bold text-xs sm:text-sm mb-1.5 sm:mb-2">Local Hashing</h4>
              <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">Files are hashed (SHA-256) entirely in the browser. Raw data never touches our servers.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800/80 hover:border-slate-600 transition-colors relative z-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-slate-700">2</div>
              <h4 className="text-white font-mono font-bold text-xs sm:text-sm mb-1.5 sm:mb-2">IPFS Pinning</h4>
              <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">The encrypted file is pinned to the decentralized IPFS network, generating a unique CID.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800/80 hover:border-slate-600 transition-colors relative z-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-slate-700">3</div>
              <h4 className="text-white font-mono font-bold text-xs sm:text-sm mb-1.5 sm:mb-2">Smart Contract</h4>
              <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">The file's hash and IPFS CID are permanently anchored to the Ethereum blockchain ledger.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.1)] relative z-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 font-mono text-xs sm:text-sm font-bold mb-3 sm:mb-4 border border-blue-500/50">4</div>
              <h4 className="text-blue-100 font-mono font-bold text-xs sm:text-sm mb-1.5 sm:mb-2">Public Verification</h4>
              <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">Auditors can cross-reference physical files against the immutable blockchain record.</p>
            </div>
          </div>
        </section>

        {/* --- TERMINAL FOOTER --- */}
        <section className="w-full border-t border-slate-800 pt-6 sm:pt-8 pb-4 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-slate-500 text-[10px] sm:text-xs font-mono uppercase tracking-widest bg-slate-950 py-3 sm:py-4 px-4 sm:px-6 rounded border border-slate-800/50">
            <span className="flex items-center gap-1.5 sm:gap-2"><Fingerprint className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /> Encryption: SHA-256</span>
            <span className="flex items-center gap-1.5 sm:gap-2"><Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /> Network: Localhost / ETH</span>
            <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" /> Status: Protected</span>
          </div>
        </section>

      </div>
    </div>
  );
}