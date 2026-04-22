'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[rgba(255,255,255,0.05)] bg-[#0a0a0a]">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-text.svg"
            alt="Autobar Logo"
            width={120}
            height={28}
            className="h-7 w-auto"
          />
        </Link>

        <p className="text-gray-500 text-sm font-medium text-center max-w-[480px]">
          A student project exploring self-service bar technology for music festivals.
        </p>

        <div className="flex flex-col items-center md:items-end gap-1">
          {/* <Link href="mailto:hello@autobar.se" className="text-white font-bold hover:text-[#E3B04B] transition-colors">
            hello@autobar.se
          </Link> */}
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Autobar
          </p>
        </div>
      </div>
    </footer>
  );
}
