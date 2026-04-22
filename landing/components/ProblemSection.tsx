'use client';

import Image from 'next/image';

const problems = [
  {
    icon: '/coin-icon.svg',
    title: 'Staffing is expensive',
    description: 'Every bar requires multiple workers per shift — one of the biggest operational costs at any event.',
  },
  {
    icon: '/hourglass-icon.svg',
    title: 'Long queues lose sales',
    description: 'Slow service means guests miss acts. Fewer moments at the bar means less revenue for organizers.',
  },
  {
    icon: '/box-icon.svg',
    title: 'Hard to set up & scale',
    description: "Existing solutions aren't modular. Adding more bar capacity means hiring more people.",
  },
  {
    icon: '/chart-icon.svg',
    title: 'No real-time visibility',
    description: 'Organizers lack live data on sales and stock — decisions are made blind, mid-event.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="section-padding bg-[rgba(255,255,255,0.02)] border-y border-[rgba(255,255,255,0.05)]">
      <div className="container">
        <p className="section-label">The Problem</p>
        <h2 className="section-title mb-6">Festival bars haven't changed in decades.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group p-8 bg-[#141414] border border-[#222] rounded-2xl relative overflow-hidden hover:border-[rgba(227,176,75,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gold accent line on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E3B04B] opacity-80" />

              <div className="mb-6 w-12 h-12 rounded-xl bg-[rgba(227,176,75,0.08)] group-hover:bg-[rgba(227,176,75,0.15)] transition-colors duration-300 flex flex-col justify-center">
                <Image
                  src={problem.icon}
                  alt={problem.title}
                  width={28}
                  height={28}
                  style={{ width: '100%', height: '28px' }}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {problem.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
