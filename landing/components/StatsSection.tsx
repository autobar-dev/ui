'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

const stats = [
  {
    val: '0',
    label: 'Bartenders needed',
    note: 'Our core design goal',
  },
  {
    val: '1',
    label: 'Crew to run the whole bar',
    note: 'vs. one per tap traditionally',
  },
  {
    val: '+',
    label: 'Scalable setup',
    note: 'Add modules as your event grows',
  },
  {
    val: '€',
    label: 'Flexible pricing',
    note: 'Revenue share or module rental',
    // isIcon: true,
  },
];

export default function StatsSection() {
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
    <section
      id="concept"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="section-padding bg-[rgba(227,176,75,0.03)] border-y border-[rgba(227,176,75,0.08)] relative overflow-hidden group/stats"
    >
      {/* Dynamic Halo Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/stats:opacity-100 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(227, 176, 75, 0.1), transparent 50%)`,
        }}
      />

      <div className="container relative z-10">
        <p className="section-label">What We're Designing For</p>
        <h2 className="section-title mb-6">The benefits we're building toward.</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-10 bg-[#141414] border border-[#222] border-t-[3px] border-t-[#E3B04B] rounded-2xl hover:bg-[rgba(255,255,255,0.03)] transition-all duration-300"
            >
              <div className="text-5xl font-black text-[#E3B04B] mb-6 tracking-tighter flex items-center h-12">
                {stat.val}
              </div>

              <div className="text-white font-bold text-lg mb-1 leading-tight">
                {stat.label}
              </div>

              <div className="text-gray-500 text-sm font-medium">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
