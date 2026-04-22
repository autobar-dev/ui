'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-5 md:px-16 glass">
      <Link href="/" className="flex items-center gap-3">
        <Image 
          src="/logo-text.svg" 
          alt="Autobar Logo" 
          width={140} 
          height={32} 
          className="h-8 w-auto"
        />
      </Link>

      <ul className="hidden md:flex items-center gap-10">
        <li>
          <Link href="#problem" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            The Problem
          </Link>
        </li>
        <li>
          <Link href="#how" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            How It Works
          </Link>
        </li>
        <li>
          <Link href="#concept" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            The Concept
          </Link>
        </li>
        <li>
          <Link href="#contact" className="bg-[#E3B04B] text-[#0a0a0a] px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            Let's Talk
          </Link>
        </li>
      </ul>
      
      {/* Mobile Menu Placeholder - keeping it simple for now as per original */}
      <div className="md:hidden">
        <button className="text-white p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
}
