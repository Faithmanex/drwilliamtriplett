import React from 'react';
import { NavLink } from 'react-router-dom';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-slate-300 py-16 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="max-w-sm space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-white font-bold">Dr. William Triplett</h3>
              <p className="text-xs text-brand-accent uppercase tracking-widest mt-1">Leadership & Ethics</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-light">
              Supporting leaders, faculty, and institutions to flourish amid complexity, responsibility, and change.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800/50 rounded-full hover:bg-brand-primary hover:text-white transition-all" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800/50 rounded-full hover:bg-brand-primary hover:text-white transition-all" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <NavLink to="/contact" className="p-2 bg-slate-800/50 rounded-full hover:bg-brand-primary hover:text-white transition-all" aria-label="Email">
                <Mail size={18} />
              </NavLink>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div>
              <h4 className="font-sans font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><NavLink to="/" className="text-slate-400 hover:text-brand-accent transition-colors">Home</NavLink></li>
                <li><NavLink to="/about" className="text-slate-400 hover:text-brand-accent transition-colors">About</NavLink></li>
                <li><NavLink to="/services" className="text-slate-400 hover:text-brand-accent transition-colors">Services</NavLink></li>
                <li><NavLink to="/books" className="text-slate-400 hover:text-brand-accent transition-colors">Books</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-white mb-6 uppercase text-xs tracking-widest">Inquiries</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><NavLink to="/contact" className="text-slate-400 hover:text-brand-accent transition-colors">Contact Form</NavLink></li>
                <li><a href="mailto:will@drwilliamtriplett.com" className="text-slate-400 hover:text-brand-accent transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>&copy; {currentYear} Dr. William Triplett. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;