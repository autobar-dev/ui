'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { href: '#problem', label: 'The Problem' },
    { href: '#how', label: 'How It Works' },
    { href: '#concept', label: 'The Concept' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 md:px-16 glass">
      <Link href="/" className="flex items-center gap-3 relative z-[110]">
        <Image
          src="/logo-text.svg"
          alt="Autobar Logo"
          width={140}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="#contact" className="btn-primary px-5 py-2.5 text-sm">
            Let's Talk
          </Link>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <div className="md:hidden relative z-[110]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0a0a0a] z-[105] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ul className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className={`transition-all duration-500 delay-[${i * 100}ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black text-white hover:text-[#E3B04B] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className={`mt-4 transition-all duration-500 delay-[300ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="btn-primary px-10 py-4 text-xl"
            >
              Let's Talk
            </Link>
          </li>
        </ul>

        {/* Decorative elements in mobile menu */}
        <div className="absolute bottom-10 text-gray-500 text-sm font-medium tracking-widest uppercase">
          Autobar © {new Date().getFullYear()}
        </div>
      </div>
    </nav>
  );
}
