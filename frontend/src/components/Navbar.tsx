"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Upload, FileSearch, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Verify", href: "/verify", icon: ShieldCheck },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="w-full border-b border-slate-800 bg-[#0F172A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-colors">
              <ShieldCheck className="text-blue-400 w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Evi<span className="text-blue-500">Block</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md
                    ${isActive 
                      ? "text-blue-400 bg-blue-900/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}