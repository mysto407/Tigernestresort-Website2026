"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/data";
import { CONTACT } from "@/lib/data";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-start justify-between p-6 lg:p-8">
          {/* Logo — hidden on home, shown on inner pages */}
          {!isHome && (
            <Link href="/" className="pointer-events-auto flex flex-col leading-none">
              <span className="font-serif text-xl text-cream tracking-wide">
                Tiger&apos;s Nest
              </span>
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold-400 mt-0.5">
                Resort · Paro, Bhutan
              </span>
            </Link>
          )}

          {/* Hamburger — always top right */}
          <button
            className="pointer-events-auto ml-auto flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={`block w-7 h-[1.5px] ${isHome ? "bg-white" : "bg-cream"}`} />
            <span className={`block w-7 h-[1.5px] ${isHome ? "bg-white" : "bg-cream"}`} />
            <span className={`block w-7 h-[1.5px] ${isHome ? "bg-white" : "bg-cream"}`} />
          </button>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-start justify-between p-6 lg:p-8">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex flex-col leading-none">
              <span className="font-gloock text-xl text-white uppercase tracking-wide">Tiger&apos;s Nest</span>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40 mt-1">
                Resort · Paro, Bhutan
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="ml-auto p-2 text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-10 lg:px-20 gap-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-sans font-black text-[12vw] md:text-[8vw] uppercase leading-none tracking-tight transition-colors duration-150 ${
                  pathname === link.href ? "text-white" : "text-white/25 hover:text-white"
                }`}
              >
                <span className="font-mono text-[10px] text-white/20 mr-4 align-middle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-10 lg:px-20 pb-12 border-t border-white/10 pt-6">
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors"
            >
              <span className="w-8 h-px bg-white/30" />
              Book via WhatsApp — 50% Off
            </a>
          </div>
        </div>
      )}
    </>
  );
}
