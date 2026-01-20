import React from 'react';
import { ServiceCategory } from '../types';
import { Briefcase, Book, UserCheck, Mic, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const servicesData: ServiceCategory[] = [
  {
    title: "Advisory & Strategy",
    items: [
      { title: "Entrepreneurship, Innovation & Strategic Advisory" },
      { title: "Faith, Ethics, Technology & Cyber Advisory" },
      { title: "Investment & Philanthropic Strategy" }
    ]
  },
  {
    title: "Academic & Research",
    items: [
      { title: "Faculty Support & Academic Development" },
      { title: "Research Design, IRB, Proposal & Dissertation Support" },
      { title: "Research Collaboration & Scholarly Engagement" }
    ]
  },
  {
    title: "Coaching & Development",
    items: [
      { title: "Leadership Coaching & Executive Formation" },
      { title: "Organizational Development & Learning Systems" },
      { title: "Human Performance, Fitness & Leadership Formation" }
    ]
  },
  {
    title: "Public Engagement",
    items: [
      { title: "Speaking, Teaching & Facilitation" }
    ]
  }
];

const iconMap: { [key: string]: React.ReactNode } = {
  "Advisory & Strategy": <Briefcase className="w-5 h-5" />,
  "Academic & Research": <Book className="w-5 h-5" />,
  "Coaching & Development": <UserCheck className="w-5 h-5" />,
  "Public Engagement": <Mic className="w-5 h-5" />
};

const Services: React.FC = () => {
  return (
    <div className="bg-brand-light min-h-screen pt-20">
      <div className="bg-brand-dark py-24 px-6 text-center reveal-on-scroll">
        <h1 className="font-serif text-5xl font-bold mb-6 text-white">Services & Engagements</h1>
        <p className="font-sans text-xl text-slate-300 max-w-2xl mx-auto font-light">
          Comprehensive support for institutions, leaders, and communities seeking to flourish.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {servicesData.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-card border border-slate-100 hover:border-brand-primary/20 transition-all duration-300 flex flex-col h-full reveal-on-scroll"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary shadow-sm">
                  {iconMap[category.title]}
                </div>
                <h2 className="font-serif text-2xl font-bold text-brand-dark">{category.title}</h2>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5 mr-4 group-hover:bg-brand-accent transition-colors"></span>
                    <span className="text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{item.title}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-slate-50">
                <NavLink 
                  to="/contact"
                  className="inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors uppercase tracking-wide group"
                >
                  Inquire Now 
                  <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-24 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center reveal-on-scroll">
          <h3 className="font-serif text-3xl font-bold text-brand-dark mb-6">Ready to Collaborate?</h3>
          <p className="text-slate-600 mb-10 text-lg font-light">
            Whether you need strategic advisory, research support, or leadership formation, Dr. Triplett offers tailored engagement models designed for your specific context.
          </p>
          <NavLink 
            to="/contact" 
            className="inline-block bg-brand-dark hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Start a Conversation
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Services;