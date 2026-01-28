import React, { useState } from "react";
import { Compass, Users, Cpu } from "lucide-react";

const About: React.FC = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="bg-white pt-20">
      {/* Header */}
      <div className="bg-brand-dark text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center reveal-on-scroll">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            About Dr. William Triplett
          </h1>
          <div className="flex justify-center gap-3 text-sm md:text-base font-medium tracking-widest text-brand-accent uppercase">
            <span>Author</span>
            <span className="text-slate-600">•</span>
            <span>Scholar</span>
            <span className="text-slate-600">•</span>
            <span>Researcher</span>
            <span className="text-slate-600">•</span>
            <span>Advisor</span>
          </div>
        </div>
      </div>

      {/* Main Bio Section - Asymmetrical */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Image Column */}
          <div className="w-full lg:w-5/12 relative group reveal-on-scroll">
            <div className="absolute top-6 left-6 w-full h-full border-2 border-slate-100 rounded-2xl z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 bg-slate-200">
              <img
                src="https://res.cloudinary.com/dtbdixfgf/image/upload/f_auto,q_auto,w_800/v1768235662/WT-30_ei1uny.jpg"
                alt="Dr. William Triplett - Strategic Advisor and Scholar"
                loading="eager"
                fetchPriority="high"
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-auto object-cover transition-all duration-1000 scale-x-[-1] ${
                  isImageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
                }`}
              />
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-7/12 pt-8 reveal-on-scroll delay-200">            <h2 className="font-serif text-4xl font-bold text-brand-dark mb-8 relative inline-block">
              Executive / Consulting-Oriented
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-brand-accent"></span>
            </h2>

            <div className="space-y-6 text-lg text-slate-600 leading-loose font-medium">
              <p>
                <span className="font-bold text-brand-dark">Dr. William Triplett</span> is an author, scholar, educator, and strategic advisor specializing in cybersecurity, artificial intelligence, leadership, and human performance. His work centers on advancing human-centered excellence in organizations operating at the forefront of technological change, informed by faith and purpose.
              </p>
              <p>
                Drawing from interdisciplinary research and applied experience, he supports leaders in addressing complex challenges across security, innovation, and organizational transformation. His approach integrates technical insight with a deep understanding of how systems, culture, and belief shape human outcomes.
              </p>
              <p>
                Dr. Triplett partners with leaders and institutions committed to building secure, intelligent, and resilient systems—where innovation is guided by purpose and accountability to people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars - Modern Cards */}
      <section className="bg-brand-light py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="font-serif text-4xl font-bold text-brand-dark mb-4">
              Core Pillars of Work
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Foundational areas of focus driving research and advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Faith & Ethics",
                icon: <Compass className="w-8 h-8" />,
                desc: "Exploring the moral foundations that guide decision-making and spiritual dimensions in a secular age.",
                color: "text-brand-primary",
              },
              {
                title: "Leadership & Performance",
                icon: <Users className="w-8 h-8" />,
                desc: "Cultivating resilient leaders capable of sustaining high performance while fostering team well-being.",
                color: "text-brand-accent",
              },
              {
                title: "Technology and Human-Centered Progress",
                icon: <Cpu className="w-8 h-8" />,
                desc: <span>Examining how technological advancements impact human dignity and stewardship of <span className="font-bold">innovation</span>.</span>,
                color: "text-slate-700",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className={`group bg-white p-10 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300 transform hover:-translate-y-1 border border-slate-100/50 reveal-on-scroll delay-${idx * 150}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-white group-hover:shadow-md transition-all ${pillar.color}`}
                >
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
