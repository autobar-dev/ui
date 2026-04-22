'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentCallout() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="container px-4">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden bg-gradient-to-br from-[rgba(227,176,75,0.18)] to-[rgba(227,176,75,0.05)] border border-[rgba(227,176,75,0.25)] rounded-[32px] p-8 md:p-16 flex flex-col-reverse lg:flex-row items-center gap-12 group/callout"
      >
        {/* Large "Heavy" Halo Effect - Instant Tracking */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/callout:opacity-100"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(227, 176, 75, 0.2), transparent 50%)`,
          }}
        />

        {/* Static Background Blur */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E3B04B] opacity-10 blur-[100px] pointer-events-none" />

        <div className="flex-1 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
            This is a student project — <br className="hidden md:block" />
            and that's the point.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-[600px] mb-10">
            We're not here to sell you something. We're designing a concept and want to hear from the people who actually run festivals. What would make this work? What wouldn't? Your perspective shapes what we build.
          </p>
          <Link href="#contact" className="btn-primary py-4 px-10 shadow-lg shadow-[rgba(227,176,75,0.2)]">
            Share your thoughts
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex-1 w-full max-w-[480px] relative">
          <Image
            src="/module-three-mockup-transparent-2.png"
            alt="Autobar Concept"
            width={600}
            height={600}
            className="w-full h-auto drop-shadow-2xl rounded-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
