'use client';

const steps = [
  {
    num: '01',
    title: 'Walk Up',
    description: 'Each Autobar module serves one type of beer. Guests simply approach the module for the beer they want — no menus, no app, no wristbands.',
  },
  {
    num: '02',
    title: 'Tap Your Card',
    description: 'One tap on the contactless terminal. A small amount is held on the card. No tokens, no cash, no queues.',
  },
  {
    num: '03',
    title: 'Pour Your Pint',
    description: 'The tap unlocks immediately. The guest pours their own fresh beer in seconds and goes back to the music.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section-padding">
      <div className="container">
        <p className="section-label">How It Works</p>
        <h2 className="section-title">Walk up. Tap. Pour.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-[rgba(227,176,75,0.4)] to-transparent z-0" />
              )}

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#E3B04B] text-[#0a0a0a] flex items-center justify-center font-black text-sm mb-8 shadow-[0_8px_16px_-4px_rgba(227,176,75,0.4)] group-hover:scale-110 transition-transform">
                  {step.num}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-[#E3B04B] transition-colors">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
