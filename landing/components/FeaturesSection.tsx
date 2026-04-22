'use client';

import Image from 'next/image';

const features = [
  {
    icon: '/card-icon.svg',
    title: 'Contactless payment',
    description: 'Card tap unlocks the tap. No tokens, no cash, no friction.',
  },
  {
    icon: '/chart-icon.svg',
    title: 'Real-time dashboard',
    description: 'Live sales, stock levels, and revenue — all visible to organizers.',
  },
  {
    icon: '/color_palette-icon.svg',
    title: 'Fully branded per festival',
    description: 'Each module displays your branding and the beer on tap.',
  },
  {
    icon: '/wrench-icon.svg',
    title: 'Modular & scalable',
    description: 'Add or remove units depending on event size and crowd flow.',
  },
  {
    icon: '/world-icon.svg',
    title: 'Swedish & English UI',
    description: 'Designed for Swedish festivals with international guests in mind.',
  },
  {
    icon: '/rain-icon.svg',
    title: 'Weatherproof',
    description: 'Designed for outdoor events. Built to handle the Swedish summer.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="section-padding">
      <div className="container">
        <p className="section-label">Features</p>
        <h2 className="section-title">Built for real festivals.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 p-10 border border-[#222] bg-[#141414] rounded-[24px] hover:border-[rgba(227,176,75,0.25)] hover:bg-[rgba(227,176,75,0.02)] transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[rgba(227,176,75,0.06)] border border-[rgba(227,176,75,0.1)] flex items-center justify-center group-hover:bg-[#E3B04B] transition-all duration-300">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="group-hover:invert group-hover:brightness-0 transition-all"
                />
              </div>

              <div>
                <h4 className="text-white text-lg font-bold mb-3 tracking-tight group-hover:text-[#E3B04B] transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
