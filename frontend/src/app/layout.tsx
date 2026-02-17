import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Import professional fonts
import "./globals.css";
import Navbar from "../components/Navbar";

// Configure the fonts
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eviblock | Immutable Evidence Chain",
  description: "Decentralized digital evidence integrity system.",
  applicationName: "Eviblock",
  themeColor: "#0F172A", // Matches your Navy Blue background
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-[#0B1121] text-slate-300">
        
        {/* --- THE CYBER GRID BACKGROUND --- */}
        {/* This div creates the technical graph-paper effect across the whole app */}
        <div className="fixed inset-0 z-[-1] bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), 
                                 linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
             }}>
        </div>

        <Navbar />
        
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>
        
        {/* Professional Footer */}
        <footer className="border-t border-slate-800 py-8 bg-[#0F172A]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-mono">
            <p>© 2026 EVIBLOCK SECURITY SYSTEMS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span>SYSTEM STATUS: <span className="text-emerald-500">OPERATIONAL</span></span>
              <span>VERSION: 1.0.0-BETA</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}