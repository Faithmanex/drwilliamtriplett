
import React, { useState } from 'react';
import { ArrowRight, BookOpen, Star, CheckCircle, Briefcase, Book, UserCheck, Mic } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { booksCatalog } from './Books'; 

const Home: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Find "Harbors of Hope" specifically
  const featuredBook = booksCatalog.find(book => book.id === 'harbor-hopes') || booksCatalog[0];

  // Helper to safely truncate text for the "Read More" feature
  const getTruncatedText = (text: string) => {
    // Split by sentences to avoid cutting mid-word
    const sentences = text.split('. ');
    if (sentences.length <= 2) return text;
    // Return first two sentences
    return sentences.slice(0, 2).join('. ') + '.';
  };

  const serviceHighlights = [
    {
      title: "Advisory & Strategy",
      icon: <Briefcase className="w-6 h-6" />,
      description: "Faith, ethics, technology, and cybersecurity advisory alongside philanthropic strategy."
    },
    {
      title: "Academic & Research",
      icon: <Book className="w-6 h-6" />,
      description: "Faculty support, curriculum innovation, and research design for academic development."
    },
    {
      title: "Coaching & Development",
      icon: <UserCheck className="w-6 h-6" />,
      description: "Leadership coaching and executive formation rooted in ethics, purpose, and adaptive leadership."
    },
    {
      title: "Public Engagement",
      icon: <Mic className="w-6 h-6" />,
      description: "Speaking, teaching, facilitation, and scholarly collaboration for various contexts."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Modern Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-dark">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2690&auto=format&fit=crop" 
            alt="Dr. William Triplett Library - Leadership and Excellence" 
            className="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/50 to-brand-dark"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm animate-[fadeIn_1s_ease-out]">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-accent">
              Professional Home
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl reveal-on-scroll">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-200 italic">
              Leadership · Responsibility · Change
            </span>
          </h1>
          
          <p className="font-sans text-lg md:text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed reveal-on-scroll delay-100">
            Advising leaders, faculty, and institutions through complexity, responsibility, and change.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto reveal-on-scroll delay-200">
            <NavLink 
              to="/services" 
              className="group flex items-center justify-center gap-3 bg-white text-brand-dark px-8 py-3.5 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-white/20 hover:scale-105"
            >
              Explore Services
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <NavLink 
              to="/books" 
              className="group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full text-lg font-medium transition-all shadow-lg hover:scale-105"
            >
              <BookOpen size={20} />
              <span>Shop Resources</span>
            </NavLink>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-0.5 h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </section>

      {/* Featured Book Spotlight: Harbors of Hope */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
         <div className="absolute -left-40 top-40 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl mix-blend-lighten"></div>
         <div className="absolute -right-40 bottom-40 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl mix-blend-lighten"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16 reveal-on-scroll">
            <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Latest Publication</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Featured Resource</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
              Explore Dr. Triplett's latest work on the intersection of faith, history, and freedom.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/20 border border-slate-800/50 flex flex-col lg:flex-row items-center gap-12 reveal-on-scroll">
            
            {/* Book Cover / Visual */}
            <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
              <div className="relative group cursor-pointer perspective-1000">
                {/* Glow */}
                <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* 3D Book Container */}
                <div className="relative w-64 md:w-80 aspect-[2/3] shadow-2xl shadow-black/50 rounded-r-md transform transition-all duration-500 group-hover:rotate-y-[-5deg] group-hover:scale-105 origin-center">
                   <img 
                      src={featuredBook.imageUrl} 
                      alt={`Book Cover: ${featuredBook.title} by Dr. William Triplett`}
                      className="absolute inset-0 w-full h-full object-cover rounded-r-md z-10" 
                   />
                   {/* Shine */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none z-20 rounded-r-md"></div>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="w-full lg:w-7/12 text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
                <Star size={14} fill="currentColor" /> Editor's Choice
              </div>
              
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {featuredBook.title}
              </h3>
              <p className="font-sans text-xl text-slate-400 font-light italic mb-6">
                {featuredBook.subtitle}
              </p>

              <div className="text-lg text-slate-300 leading-relaxed mb-8">
                <p>
                  {isExpanded ? featuredBook.longDescription : getTruncatedText(featuredBook.longDescription)}
                  {!isExpanded && (
                     <span className="text-slate-500">... </span>
                  )}
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 text-brand-accent font-bold text-sm uppercase tracking-wide hover:text-white transition-colors focus:outline-none ml-1"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {featuredBook.features.slice(0,4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-brand-accent/80 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <NavLink 
                   to="/books" 
                   className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-accent hover:text-brand-dark transition-all shadow-lg hover:shadow-white/10 hover:-translate-y-1"
                 >
                   Get Your Copy <ArrowRight size={18} />
                 </NavLink>
                 <NavLink 
                   to="/books" 
                   className="inline-flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 text-slate-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 hover:text-white transition-all"
                 >
                   Read Excerpt
                 </NavLink>
              </div>
            </div>

          </div>
         </div>
      </section>

      {/* Services Showcase */}
      <section className="py-16 bg-[#0a0f1d] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal-on-scroll">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Engagements</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Multidisciplinary support for leaders and institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {serviceHighlights.map((service, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-glow transition-all duration-300 border border-slate-800/50 group flex flex-col h-full reveal-on-scroll"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <NavLink to="/services" className="text-xs font-bold text-brand-accent uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                  Learn More <ArrowRight size={12} />
                </NavLink>
              </div>
            ))}
          </div>
          
          <div className="text-center reveal-on-scroll">
            <NavLink to="/services" className="inline-block border border-slate-700 text-slate-300 px-8 py-3 rounded-full font-bold hover:bg-slate-800 hover:border-brand-accent hover:text-brand-accent transition-colors">
              View Full Service Offerings
            </NavLink>
          </div>
        </div>
      </section>

      {/* Modern Intro / Mission Statement */}
      <section className="py-16 bg-brand-dark relative overflow-hidden border-t border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal-on-scroll">
          <div className="w-16 h-1 bg-brand-accent mx-auto mb-10"></div>
          
          <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-slate-300 font-medium mb-10 italic">
            "This website serves as the professional home for my work as an author, scholar, educator,
            and advisor engaging leaders and institutions across academic, professional, and public
            contexts."
          </blockquote>

          <div className="flex flex-col items-center">
            {/* Signature SVG - Attribution label removed per request */}
            <div className="opacity-90 hover:opacity-100 transition-opacity mt-2">
              <svg width="350" height="100" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Sacramento&display=swap');
                  `}</style>
                </defs>
                
                <text x="50%" y="55%" 
                      dominantBaseline="middle" 
                      textAnchor="middle" 
                      fontFamily="'Sacramento', cursive" 
                      fontSize="65" 
                      fill="white">
                  Dr. William Triplett
                </text>
              </svg>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
