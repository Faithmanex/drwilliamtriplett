import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { Menu, X, ArrowRight } from 'lucide-react';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Books', path: '/books' },
  { label: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled && !isOpen
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm py-2' 
          : isOpen
            ? 'bg-transparent py-2'
            : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Elevated z-index to stay above overlay */}
          <div className="flex-shrink-0 flex items-center relative z-[101]">
            <NavLink to="/" className="group" onClick={() => setIsOpen(false)}>
              <h1 className={`font-serif text-2xl font-bold tracking-tight transition-colors duration-300 ${scrolled || location.pathname !== '/' || isOpen ? 'text-brand-dark' : 'text-white'}`}>
                Dr. William Triplett
              </h1>
              <span className={`block text-[10px] font-sans font-bold tracking-[0.2em] uppercase mt-1 transition-colors duration-300 ${scrolled || location.pathname !== '/' || isOpen ? 'text-brand-accent' : 'text-slate-300 group-hover:text-brand-accent'}`}>
                Leadership & Ethics
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-brand-accent bg-brand-accent/5'
                      : scrolled || location.pathname !== '/' 
                        ? 'text-slate-600 hover:text-brand-primary hover:bg-slate-50' 
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pl-4 ml-2 border-l border-slate-200/20">
              <NavLink
                to="/books"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-glow transform hover:-translate-y-0.5 ${
                    scrolled || location.pathname !== '/'
                    ? 'bg-brand-primary text-white hover:bg-brand-dark'
                    : 'bg-white text-brand-dark hover:bg-slate-100'
                }`}
              >
                Shop Resources
              </NavLink>
            </div>
          </div>

          {/* Mobile menu button - Elevated z-index to stay above overlay */}
          <div className="md:hidden flex items-center relative z-[101]">
            <button
              onClick={toggleMenu}
              className={`focus:outline-none transition-colors ${scrolled || location.pathname !== '/' || isOpen ? 'text-slate-800' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[100] bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0', paddingTop: '0px' }} 
      >
        <div className="flex flex-col h-full relative">
           
           <div className="px-8 pt-24 pb-8 space-y-6 overflow-y-auto h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block text-3xl font-serif font-bold ${
                    isActive
                      ? 'text-brand-accent'
                      : 'text-slate-800 hover:text-brand-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-8 border-t border-slate-100 mt-8">
               <NavLink
                to="/books"
                className="w-full flex items-center justify-between bg-brand-primary text-white p-5 rounded-2xl font-bold text-lg shadow-lg"
              >
                Shop Resources
                <ArrowRight size={20} />
              </NavLink>
            </div>

            <div className="mt-auto pt-12 text-sm text-slate-400">
               <p>&copy; {new Date().getFullYear()} Dr. William Triplett</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;