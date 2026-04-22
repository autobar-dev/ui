'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden px-8 md:px-16 lg:px-24">
      {/* Decorative Elements */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(227,176,75,0.08)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[640px]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(227,176,75,0.12)] border border-[rgba(227,176,75,0.25)] text-[0.78rem] font-bold tracking-widest text-[#E3B04B] uppercase mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3B04B]" />
          Student Project · Seeking Feedback
        </div>

        <h1 className="text-[clamp(3rem,8vw,4.5rem)] leading-[1.05] font-black tracking-tight mb-8 animate-fade-up delay-100">
          The future of<br />
          festival <span className="text-[#E3B04B] italic">bars.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 font-light max-w-[480px] mb-10 leading-relaxed animate-fade-up delay-200">
          Self-service beer modules for music festivals — no bartenders, no queues, no tokens. Walk up, tap your card, pour your pint.
        </p>

        <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-300">
          <Link href="#contact" className="btn-primary">
            Share your thoughts
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="#how" className="btn-ghost px-6">
            See how it works
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M12 6v12" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 w-[40%] max-w-[500px] z-1 animate-fade-up delay-400 hidden lg:block">
        <div className="relative group">
          {/* Subtle glow effect behind image */}
          <div className="absolute inset-0 bg-[#E3B04B] opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity duration-300" />
          <Image
            src="/module-single-mockup-transparent-2.png"
            alt="Autobar Module"
            width={372}
            height={800}
            className="w-full h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
