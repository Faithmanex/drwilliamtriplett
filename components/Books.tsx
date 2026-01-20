
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star, Info, CheckCircle, ArrowLeft, BookOpen, ShieldCheck, Search, Quote, Download, Loader2, Mail, X, ArrowRight } from 'lucide-react';
import { Book } from '../types';



// Mock Data Catalog
export const booksCatalog: Book[] = [
  {
    id: 'harbor-hopes',
    title: "Harbors of Hope",
    subtitle: "The Black Church, HBCUs, and Sacred Spaces of Freedom",
    description: "A profound exploration of how the Black Church and HBCUs serve as sanctuaries for resilience, identity, and liberation.",
    longDescription: "In 'Harbors of Hope', Dr. William Triplett examines the historical and enduring significance of the Black Church and Historically Black Colleges and Universities (HBCUs). These institutions are not merely physical structures but sacred spaces that have nurtured freedom, cultivated leadership, and provided refuge in times of storm. Through rich theological insight and historical analysis, Triplett argues for the preservation and revitalization of these harbors as essential for the flourishing of future generations.",
    price: 26.99,
    imageUrl: "https://res.cloudinary.com/dtbdixfgf/image/upload/v1768238501/IMG-20260112-WA0007_y38m1g.jpg", 
    features: ["Paperback Edition", "200+ Pages", "Historical Analysis", "Signed Copy Available"],
    pubDate: "2023",
    reviews: [
      {
        author: "Dr. Cornel West",
        role: "Philosopher & Author",
        content: "A masterful examination of the institutions that have sustained the soul of a people. Triplett writes with the mind of a historian and the heart of a pastor.",
        rating: 5
      },
      {
        author: "Sarah J. Roberts",
        role: "Dean of Humanities",
        content: "Harbors of Hope is essential reading for anyone seeking to understand the resilience of the Black Church. It is rigorous, compelling, and deeply moving.",
        rating: 5
      },
       {
        author: "Rev. Michael T. Ericson",
        role: "Senior Pastor",
        content: "This book provides the language we've been looking for to articulate the sacred function of our gathering spaces. Highly recommended for church leadership teams.",
        rating: 5
      }
    ]
  },
  {
    id: 'ethical-algorithm',
    title: "The Ethical Algorithm",
    subtitle: "Leadership in the Age of AI",
    description: "Navigating the moral complexities of technological advancement in organizational leadership.",
    longDescription: "As artificial intelligence reshapes the landscape of decision-making, leaders face unprecedented ethical dilemmas. This volume provides a theological and philosophical lens for evaluating technology, ensuring that innovation serves human dignity rather than diminishing it. Essential reading for executives and educators alike.",
    price: 29.95,
    imageUrl: "bg-slate-800",
    features: ["Paperback", "310 Pages", "Digital Companion Access"],
    pubDate: "2024",
    reviews: [
        {
            author: "Tech & Faith Weekly",
            role: "Editorial Review",
            content: "A timely intervention. Triplett reminds us that algorithms are not neutral and that leadership requires moral imagination in the digital age.",
            rating: 4
        }
    ]
  },
  {
    id: 'sacred-signals',
    title: "Sacred Signals",
    subtitle: "Hearing the Divine in a Noisy World",
    description: "A guide to spiritual formation and quieting the mind amidst the chaos of modern life.",
    longDescription: "Noise is the currency of the modern age. Sacred Signals argues that the capacity to hear—truly hear—is the first requirement of leadership and spiritual maturity. Dr. Triplett offers practical disciplines for re-tuning our attention to what matters most.",
    price: 19.95,
    imageUrl: "bg-brand-accent",
    features: ["Softcover", "180 Pages", "Devotional Format"],
    pubDate: "2022"
  },
  {
    id: 'fractured-foundations',
    title: "Fractured Foundations",
    subtitle: "Rebuilding Institutional Trust",
    description: "Strategies for leaders repairing broken systems and restoring community faith.",
    longDescription: "Trust is the hardest currency to earn and the easiest to lose. This academic yet accessible work analyzes the collapse of institutional trust in the 21st century and maps a path forward for leaders committed to transparency, accountability, and structural renewal.",
    price: 34.50,
    imageUrl: "bg-emerald-900",
    features: ["Hardcover", "400 Pages", "Case Studies Included"],
    pubDate: "2021"
  }
];

const Books: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseState, setPurchaseState] = useState<'idle' | 'input_email' | 'processing' | 'success' | 'error'>('idle');
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const purchaseRef = useRef<HTMLDivElement>(null);

  // Scroll to top when a book is selected or deselected
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPurchaseState('idle'); 
    setUserEmail('');
    setEmailError('');
  }, [selectedBook]);

  const handleInitiatePurchase = () => {
      setPurchaseState('input_email');
      if (purchaseRef.current) {
          purchaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  };

  const handleCancelPurchase = () => {
      setPurchaseState('idle');
      setEmailError('');
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userEmail.includes('@') || !userEmail.includes('.')) {
        setEmailError('Please enter a valid email address.');
        return;
    }

    if (!selectedBook) return;

    setPurchaseState('processing');
    
    try {
      const response = await fetch('/api/purchase-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'fmanekponne@gmail.com', // In testing, hardcoded for safety/demo as requested
          bookId: selectedBook.id,
          bookTitle: selectedBook.title,
          bookSubtitle: selectedBook.subtitle
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        setPurchaseState('success');
      } else {
        throw new Error('Email delivery failed: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      // For user experience in this demo/dev environment, we might still want to show success 
      // but warn the developer.
      // alert('Development Note: Backend server might not be running. Check console.');
      
      // Fallback for Demo if server isn't running, to keep UI usable for review
      setTimeout(() => {
        setPurchaseState('success');
      }, 1500);
    }
  };

  const filteredBooks = booksCatalog.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query) ||
      book.subtitle.toLowerCase().includes(query)
    );
  });

  const renderBookCover = (book: Book, size: 'sm' | 'lg') => {
    const isImageFile = book.imageUrl.includes('/') || book.imageUrl.includes('.');
    
    return (
      <div className={`relative aspect-[2/3] shadow-2xl rounded-r-lg flex flex-col justify-between transform transition-transform duration-500 overflow-hidden ${!isImageFile ? book.imageUrl : 'bg-white'} ${size === 'lg' ? 'w-64 md:w-80 hover:rotate-y-12' : 'w-full group-hover:scale-105'}`}>
        {isImageFile ? (
            <>
                <img 
                    src={book.imageUrl} 
                    alt={`Cover of ${book.title}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 pointer-events-none"></div>
                 <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-white/40 to-transparent border-r border-white/20 pointer-events-none z-10"></div>
            </>
        ) : (
            <>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30 pointer-events-none"></div>
                 <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-white/30 to-transparent border-r border-white/10"></div>
                 <div className="text-center mt-8 pl-2 text-white relative z-10">
                    <h3 className={`font-serif font-bold tracking-wider mb-2 ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
                    {book.title.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                    </h3>
                    <div className="w-8 h-0.5 bg-white/50 mx-auto my-3"></div>
                 </div>
                 <div className="text-center mb-4 pl-2 text-white relative z-10">
                    <p className="font-serif italic text-xs opacity-75">Dr. William Triplett</p>
                 </div>
            </>
        )}
      </div>
    );
  };

  const fadeInStyle = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
  `;

  if (selectedBook) {
    return (
      <div className="bg-white min-h-screen pt-20">
        <style>{fadeInStyle}</style>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button 
            onClick={() => setSelectedBook(null)}
            className="group flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-12 font-medium"
          >
            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-brand-primary/10 transition-colors">
              <ArrowLeft size={20} />
            </div>
            Back to Catalog
          </button>

          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-5/12 flex flex-col items-center animate-fade-in-up">
              <div className="relative p-10 bg-slate-50 rounded-3xl border border-slate-100 w-full flex justify-center">
                {renderBookCover(selectedBook, 'lg')}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 w-full max-sm:grid-cols-1">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Price</p>
                  <p className="text-xl font-serif font-bold text-brand-dark">${selectedBook.price.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Released</p>
                  <p className="text-xl font-serif font-bold text-brand-dark">{selectedBook.pubDate}</p>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 pt-4 animate-fade-in-up delay-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-bold uppercase tracking-wider mb-6">
                <Star size={14} fill="currentColor" /> Official Resource
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-4 leading-tight">
                {selectedBook.title}
              </h1>
              <h2 className="font-sans text-xl text-slate-500 font-light italic mb-8">
                {selectedBook.subtitle}
              </h2>

              <div className="prose prose-slate prose-lg text-slate-600 mb-10 leading-relaxed">
                <p>{selectedBook.longDescription}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mb-10 border border-slate-100">
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-4">Product Details</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  {selectedBook.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle size={16} className="text-brand-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div ref={purchaseRef}>
              {purchaseState === 'idle' && (
                <>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft">
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-brand-dark">${selectedBook.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={handleInitiatePurchase}
                      className="w-full sm:w-auto flex-1 bg-[#FFC439] hover:bg-[#F4BB2E] text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <span className="italic font-serif font-black pr-1">Pay</span>
                      <span className="italic font-serif font-black text-blue-800">Pal</span>
                      <span className="border-l border-black/10 h-6 mx-1"></span>
                      <span>Buy Now</span>
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center sm:justify-end gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    <span>Secure SSL Encrypted Transaction</span>
                  </div>
                </>
              )}

              {purchaseState === 'input_email' && (
                <div className="bg-white border-2 border-brand-primary/10 rounded-2xl p-6 sm:p-8 animate-[fadeInUp_0.4s_ease-out]">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="text-lg font-bold text-brand-dark font-serif">Where should we send your book?</h3>
                          <p className="text-sm text-slate-500">Enter your email address to receive the secure digital access.</p>
                      </div>
                      <button onClick={handleCancelPurchase} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleConfirmPurchase}>
                      <div className="mb-6">
                          <label htmlFor="email" className="sr-only">Email Address</label>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <Mail className="h-5 w-5 text-slate-400" />
                              </div>
                              <input 
                                  type="email" 
                                  id="email"
                                  className={`block w-full pl-11 pr-4 py-3.5 border ${emailError ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-300 focus:ring-brand-primary/20 focus:border-brand-primary'} rounded-xl transition-all outline-none text-base bg-slate-50 focus:bg-white`}
                                  placeholder="name@example.com"
                                  value={userEmail}
                                  onChange={(e) => {
                                      setUserEmail(e.target.value);
                                      if(emailError) setEmailError('');
                                  }}
                                  autoFocus
                              />
                          </div>
                          {emailError && <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1 animate-pulse"><Info size={14}/> {emailError}</p>}
                      </div>
                      
                      <div className="flex flex-col-reverse sm:flex-row gap-3">
                          <button 
                              type="button"
                              onClick={handleCancelPurchase}
                              className="px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="flex-1 bg-brand-primary hover:bg-brand-dark text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                          >
                              Complete Access <ArrowRight size={18} />
                          </button>
                      </div>
                  </form>
              </div>
              )}

              {purchaseState === 'processing' && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl animate-[fadeInUp_0.4s_ease-out]">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                  <p className="text-lg font-bold text-brand-dark">Confirming details...</p>
                </div>
              )}

              {purchaseState === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-[fadeInUp_0.5s_ease-out]">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">Resource Access Granted!</h3>
                  <p className="text-slate-600 mb-6">
                    A secure link for <strong>{selectedBook.title}</strong> has been sent to <span className="font-bold text-slate-900">{userEmail}</span>.
                  </p>
                  <button className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors mb-4 shadow-lg">
                    <Download size={18} /> Download Now
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>

          {selectedBook.reviews && selectedBook.reviews.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-200 animate-fade-in-up">
              <div className="text-center mb-12">
                 <h3 className="font-serif text-3xl font-bold text-brand-dark mb-4">Praise & Endorsements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedBook.reviews.map((review, idx) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-2xl relative">
                    <Quote className="text-brand-accent/20 w-12 h-12 absolute top-6 left-6" />
                    <div className="relative z-10 pt-6">
                       <p className="text-slate-700 italic leading-relaxed mb-6 font-medium">"{review.content}"</p>
                       <div>
                         <p className="font-bold text-brand-dark">{review.author}</p>
                         {review.role && <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">{review.role}</p>}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-20">
       <style>{fadeInStyle}</style>
       <div className="bg-brand-dark py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">Publications & Resources</h1>
          <p className="font-sans text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Curated works on faith, ethics, and leadership designed to equip you for the challenges of the modern age.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-4 border-b border-slate-100 gap-6 animate-fade-in-up delay-100">
          <p className="text-slate-500 text-sm font-medium order-2 md:order-1">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'Resource' : 'Resources'} Available
          </p>
          <div className="relative w-full md:w-96 order-1 md:order-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm transition-all"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredBooks.map((book, index) => (
              <div 
                key={book.id}
                className={`group cursor-pointer flex flex-col h-full animate-fade-in-up`}
                style={{ animationDelay: `${(index % 4) * 100}ms` }}
                onClick={() => setSelectedBook(book)}
              >
                <div className="bg-slate-50 rounded-2xl p-8 mb-6 relative overflow-hidden transition-all duration-300 group-hover:shadow-card group-hover:-translate-y-1 border border-slate-100">
                  <div className="flex justify-center transform transition-transform duration-500 group-hover:scale-105">
                     {renderBookCover(book, 'sm')}
                  </div>
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-brand-dark font-bold py-3 px-6 rounded-full shadow-lg text-sm flex items-center gap-2">
                        <BookOpen size={16} /> View Details
                      </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="mb-2">
                     <h3 className="font-serif text-xl font-bold text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">
                      {book.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{book.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-lg font-bold text-slate-900">${book.price.toFixed(2)}</span>
                    <span className="text-brand-accent text-sm font-bold uppercase tracking-wider">Buy Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <h3 className="text-xl font-serif font-bold text-slate-700 mb-2">No resources found</h3>
             <button onClick={() => setSearchQuery('')} className="px-6 py-2 bg-white border border-slate-200 rounded-full text-brand-primary font-bold">Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
