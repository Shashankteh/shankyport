"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/journey", label: "Journey" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 top-0 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-20">
        <Link href="/" className="font-serif text-xl tracking-widest uppercase">
          Shashank
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm uppercase tracking-wider transition-colors ${pathname === link.href ? "text-primary border-b border-primary pb-1" : "text-muted hover:text-primary"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-background border-b border-border transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isOpen ? "max-h-[80vh] py-8 opacity-100" : "max-h-0 py-0 opacity-0"}`}
      >
        <div className="px-8 flex flex-col gap-6">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl uppercase tracking-widest transition-colors py-2 ${pathname === link.href ? "text-primary" : "text-muted hover:text-primary"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
