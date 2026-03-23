import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import AcademicServices from './components/AcademicServices';
import AcademicServiceDetail from './components/AcademicServiceDetail';
import Books from './components/Books';
import Contact from './components/Contact';
import Legal from './components/Legal';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import UserDashboard from './components/auth/UserDashboard';
import ChatWidget from './components/ChatWidget';
import { ToastProvider } from './components/Toast';

// Dynamic SEO and Head Manager
const SEO: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const baseTitle = 'Dr. William Triplett';
    const baseSuffix = 'Author . Coach . Advisor . Executive';
    
    let title = `${baseTitle} | ${baseSuffix}`;
    let description = "Professional platform of Dr. William Triplett. Author, Coach, Advisor, and Executive.";

    if (pathname === '/about') {
      title = `About | ${baseTitle}`;
      description = "Learn about Dr. William Triplett's background in leadership, cybersecurity, and human-centered innovation.";
    } else if (pathname === '/services') {
      title = `Services & Advisory | ${baseTitle}`;
      description = "Strategic advisory, speaking engagements, and consulting services by Dr. William Triplett.";
    } else if (pathname === '/services/academic') {
      title = `Academic Advisory Services | ${baseTitle}`;
      description = "Strategic guidance for faculty, researchers, and doctoral candidates. Faculty strategy, dissertation support, and academic career advancement programs.";
    } else if (pathname.startsWith('/services/academic/')) {
      title = `Book Now | ${baseTitle}`;
      description = "Complete your booking for academic advisory services with Dr. William Triplett.";
    } else if (pathname === '/books') {
      title = `Publications | ${baseTitle}`;
      description = "Explore books and resources by Dr. William Triplett exploring faith, leadership, and technology.";
    } else if (pathname.startsWith('/books/')) {
      // Title for specific books is handled within the Books component for more detail
    } else if (pathname === '/contact') {
      title = `Contact | ${baseTitle}`;
      description = "Get in touch with Dr. William Triplett for professional inquiries and advisory requests.";
    } else if (pathname === '/legal') {
      title = `Legal Statements & Disclosures | ${baseTitle}`;
      description = "Legal statements and professional disclosures for Dr. William Triplett's advisory services.";
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
  const [session, setSession] = useState<any>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <SEO />
        <ScrollToTop />
        <ScrollObserver />
        <div className="flex flex-col min-h-screen font-sans text-slate-900">
          {!session && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/academic" element={<AcademicServices />} />
              <Route path="/services/academic/:id" element={<AcademicServiceDetail />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:bookId" element={<Books />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal" element={<Legal />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={
                session ? <UserDashboard user={session.user} onLogout={handleLogout} /> : 
                <LoginForm onSuccess={() => {}} />
              } />
              <Route path="/signup" element={
                session ? <UserDashboard user={session.user} onLogout={handleLogout} /> : 
                <SignupForm onSuccess={() => {}} onLoginClick={() => setAuthView('login')} />
              } />
              <Route path="/dashboard" element={
                session ? <UserDashboard user={session.user} onLogout={handleLogout} /> : 
                <LoginForm onSuccess={() => {}} />
              } />
            </Routes>
          </main>
          {!session && <Footer />}
          <ChatWidget />
        </div>
        <Analytics />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;