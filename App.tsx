import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Books from './components/Books';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import { ToastProvider } from './components/Toast';

// Dynamic SEO and Head Manager
const SEO: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const baseTitle = 'Dr. William Triplett';
    const baseSuffix = 'Author . Scholar . Faculty Advisor . Technology & Learning Executive';
    
    let title = `${baseTitle} | ${baseSuffix}`;
    let description = "Professional platform of Dr. William Triplett. Author, Scholar, Faculty Advisor, and Technology & Learning Executive.";

    if (pathname === '/about') {
      title = `About | ${baseTitle}`;
      description = "Learn about Dr. William Triplett's background in leadership, cybersecurity, and human-centered innovation.";
    } else if (pathname === '/services') {
      title = `Services & Advisory | ${baseTitle}`;
      description = "Strategic advisory, speaking engagements, and consulting services by Dr. William Triplett.";
    } else if (pathname === '/books') {
      title = `Publications | ${baseTitle}`;
      description = "Explore books and resources by Dr. William Triplett exploring faith, leadership, and technology.";
    } else if (pathname.startsWith('/books/')) {
      // Title for specific books is handled within the Books component for more detail
    } else if (pathname === '/contact') {
      title = `Contact | ${baseTitle}`;
      description = "Get in touch with Dr. William Triplett for professional inquiries and advisory requests.";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [pathname]);

  return null;
};

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Global Scroll Animation Observer
const ScrollObserver: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
    });

    // Small delay to ensure DOM is ready after route transition
    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run on route change

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SEO />
        <ScrollToTop />
        <ScrollObserver />
        <div className="flex flex-col min-h-screen font-sans text-slate-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:bookId" element={<Books />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;