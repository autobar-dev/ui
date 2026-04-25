'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section id="contact" className="section-padding text-center">
      <div className="container max-w-[800px]">
        <p className="section-label justify-center">Get In Touch</p>
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black tracking-tight mb-6 text-white leading-tight">
          Let's chat.
        </h2>
        <p className="text-xl text-gray-400 font-light max-w-[540px] mx-auto mb-12 leading-relaxed">
          We'd love 30 minutes to hear your perspective — what would make this work for you, and what wouldn't?
        </p>

        <Link
          href="mailto:hello@autobar.dev"
          className="btn-primary px-12 py-5 text-xl rounded-2xl shadow-xl shadow-[rgba(227,176,75,0.2)]"
        >
          Book a free call
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <p className="mt-10 text-gray-500 text-sm font-medium italic">
          This is a student research project. No sales pitch, just honest questions.
        </p>
      </div>
    </section>
  );
}
