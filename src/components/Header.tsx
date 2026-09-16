"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "The Court", href: "/the-court" },
    { name: "The Case", href: "/the-case" },
    { name: "Rules", href: "/rules" },
    { name: "Schedule", href: "/schedule" },
    { name: "Know Your Case", href: "/know-your-case" },
    { name: "Results", href: "/results" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-court-dark/80 backdrop-blur-md border-b border-gold-muted/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logos */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image src="/stagnes.png" alt="St. Agnes College" fill className="object-contain" />
            </div>
            <div className="relative w-12 h-12">
              <Image src="/aikyam.png" alt="AIKYAM 2026" fill className="object-contain" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm tracking-widest text-parchment/70 hover:text-gold-accent transition-colors uppercase font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-parchment hover:text-gold-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden absolute top-20 left-0 w-full h-[calc(100vh-80px)] bg-court-dark/95 backdrop-blur-xl border-t border-gold-muted/20 py-8 px-6 flex flex-col gap-8 overflow-y-auto z-40">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg tracking-widest text-parchment/80 hover:text-gold-accent transition-colors uppercase font-medium text-center border-b border-gold-muted/10 pb-4"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
