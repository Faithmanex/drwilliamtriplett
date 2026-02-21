
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star, Info, CheckCircle, ArrowLeft, BookOpen, ShieldCheck, Search, Quote, Download, Loader2, Mail, X, ArrowRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import PayPalHostedButton from './PayPalHostedButton';
import { booksCatalog } from '../data/books';
import { useToast } from './Toast';

const Books: React.FC = () => {
  const { bookId } = useParams<{ bookId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseState, setPurchaseState] = useState<'idle' | 'input_email' | 'payment' | 'processing' | 'success' | 'error'>('idle');
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const purchaseRef = useRef<HTMLDivElement>(null);

  // Sync selected book and SEO metadata with URL param
  useEffect(() => {
    if (bookId) {
      const book = booksCatalog.find(b => b.id === bookId);
      if (book) {
        setSelectedBook(book);
        
        // Update Metadata for the specific book
        document.title = `${book.title} | Dr. William Triplett`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', book.description);
        }
      } else {
        // If ID is invalid, clear it
        navigate('/books', { replace: true });
        setSelectedBook(null);
      }
    } else {
      setSelectedBook(null);
    }
  }, [bookId, navigate]);

  // Handle book selection
  const handleBookClick = (book: Book) => {
    navigate(`/books/${book.id}`);
  };

  // Handle going back to catalog
  const handleBackToCatalog = () => {
    navigate('/books');
  };

  // Scroll to top when selection changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPurchaseState('idle'); 
    setUserEmail('');
    setEmailError('');
  }, [selectedBook]);

  // Check for PayPal return
  useEffect(() => {
    // Check if we have pending purchase state
    const pendingEmail = localStorage.getItem('pendingPurchaseEmail');
    const pendingBookId = localStorage.getItem('pendingPurchaseBookId');

    if (pendingEmail && pendingBookId) {
        // Find the book
        const book = booksCatalog.find(b => b.id === pendingBookId);
        
        // If we have a success param in URL (PayPal standard return) or if we just rely on presence of state 
        // Logic: if user comes back to this page and has pending state, we might assume success if redirected from PayPal
        // But better is to look for URL params usually. 
        // PayPal Hosted Buttons Auto Return adds ?tx=...&st=Completed&amt=...&cc=...&cm=...&item_number=...
        // We will look for "token" or "tx" or "success=true" which we might set manually in the return URL
        
        const urlParams = new URLSearchParams(window.location.search);
        // We will assume if we have pending state and we are back here, we check for PayPal transaction params
        // Or specific 'success' flag if user set that in Auto Return URL configuration (e.g. ?success=true)
        // Since we don't control the exact return URL params entirely, we look for typical ones.
        
        if (urlParams.has('tx') || urlParams.has('token') || urlParams.has('PayerID')) {
            if (book) {
                setSelectedBook(book);
                setUserEmail(pendingEmail);
                setPurchaseState('processing');
                
                // Clear pending state immediately to prevent loop
                localStorage.removeItem('pendingPurchaseEmail');
                localStorage.removeItem('pendingPurchaseBookId');
                
                // We need to trigger this slightly delayed to ensure state is set
                // We can call a modified version of handlePaymentComplete that takes params
                
                 (async () => {
                    try {
                      const response = await fetch('/api/book-purchase', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          email: pendingEmail,
                          bookId: book.id,
                          bookTitle: book.title,
                          bookSubtitle: book.subtitle,
                          price: book.price,
                        }),
                      });
                
                      const data = await response.json();
                
                      if (response.ok && data.success) {
                        setPurchaseState('success');
                      } else {
                        throw new Error('Email delivery failed');
                      }
                    } catch (error: any) {
                      console.error('Email sending failed:', error);
                      showToast(error.message || 'Payment confirmation failed.', 'error');
                      setPurchaseState('error');
                    }
                  })();
            }
        }
    }
  }, []);

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

  // Step 1: Validate email and proceed to payment
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userEmail.includes('@') || !userEmail.includes('.')) {
        setEmailError('Please enter a valid email address.');
        return;
    }

    setPurchaseState('payment');
    
    // Save state for auto-return
    if (selectedBook?.paypalButtonId) {
        localStorage.setItem('pendingPurchaseEmail', userEmail);
        localStorage.setItem('pendingPurchaseBookId', selectedBook.id);
    }
  };

  // Step 2: Handle PayPal payment completion (simulated for now)
  // TODO: Replace with real PayPal integration
  const handlePaymentComplete = async () => {
    if (!selectedBook) return;

    setPurchaseState('processing');
    
    try {
      const response = await fetch('/api/book-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          bookId: selectedBook.id,
          bookTitle: selectedBook.title,
          bookSubtitle: selectedBook.subtitle,
          price: selectedBook.price,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPurchaseState('success');
      } else {
        throw new Error('Email delivery failed');
      }
    } catch (error: any) {
      console.error('Email sending failed:', error);
      showToast(error.message || 'Failed to process purchase.', 'error');
      setPurchaseState('error');
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
                    alt={`Book Cover: ${book.title} - Publication by Dr. William Triplett`} 
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
            onClick={handleBackToCatalog}
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-col">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Total Amount</p>
                      <p className="text-4xl font-serif font-black text-brand-dark">${selectedBook.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={handleInitiatePurchase}
                      className="h-16 w-full sm:w-auto px-10 bg-[#FFC439] hover:bg-[#F4BB2E] text-slate-900 rounded-full transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_8px_20px_-4px_rgba(255,196,57,0.4)] hover:shadow-[0_12px_25px_-5px_rgba(255,196,57,0.5)] transform hover:-translate-y-0.5 active:scale-[0.98] group"
                    >
                      <div className="flex items-center select-none">
                        <span className="italic font-serif font-black text-xl tracking-tighter">Pay</span>
                        <span className="italic font-serif font-black text-xl tracking-tighter text-[#003087]">Pal</span>
                      </div>
                      <div className="h-6 w-px bg-slate-900/10"></div>
                      <span className="font-sans font-bold text-lg tracking-tight">Buy Now</span>
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
                      <button onClick={handleCancelPurchase} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100" aria-label="Cancel purchase">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleEmailSubmit}>
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
                              Continue to Payment <ArrowRight size={18} />
                          </button>
                      </div>
                  </form>
              </div>
              )}

              {purchaseState === 'payment' && (
                <div className="bg-white border-2 border-brand-primary/10 rounded-2xl p-6 sm:p-8 animate-[fadeInUp_0.4s_ease-out]">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="text-lg font-bold text-brand-dark font-serif">Complete Your Purchase</h3>
                          <p className="text-sm text-slate-500">Secure payment powered by PayPal</p>
                      </div>
                      <button onClick={handleCancelPurchase} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100" aria-label="Cancel purchase">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">{selectedBook?.title}</span>
                      <span className="font-bold text-brand-dark">${selectedBook?.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-500">
                      <span>Delivery to:</span>
                      <span className="font-medium text-slate-700">{userEmail}</span>
                    </div>
                  </div>

                  {/* PayPal Button */}
                  {selectedBook?.paypalButtonId ? (
                      <div className="mb-4">
                        <PayPalHostedButton hostedButtonId={selectedBook.paypalButtonId} />
                      </div>
                  ) : (
                    // Fallback for books without hosted button (simulated)
                    <button 
                        onClick={handlePaymentComplete}
                        className="h-16 w-full px-10 bg-[#FFC439] hover:bg-[#F4BB2E] text-slate-900 rounded-full transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_8px_20px_-4px_rgba(255,196,57,0.4)] hover:shadow-[0_12px_25px_-5px_rgba(255,196,57,0.5)] transform hover:-translate-y-0.5 active:scale-[0.98] mb-4"
                    >
                        <div className="flex items-center select-none">
                          <span className="italic font-serif font-black text-xl tracking-tighter">Pay</span>
                          <span className="italic font-serif font-black text-xl tracking-tighter text-[#003087]">Pal</span>
                        </div>
                        <div className="h-6 w-px bg-slate-900/10"></div>
                        <span className="font-sans font-bold text-lg tracking-tight">Pay ${selectedBook?.price.toFixed(2)}</span>
                    </button>
                  )}

                  <button 
                    onClick={() => setPurchaseState('input_email')}
                    className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Change Email
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    <span>Secure SSL Encrypted Transaction</span>
                  </div>
              </div>
              )}

              {purchaseState === 'processing' && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl animate-[fadeInUp_0.4s_ease-out]">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
                  <p className="text-lg font-bold text-brand-dark">Processing your order...</p>
                  <p className="text-sm text-slate-500 mt-2">Sending download link to {userEmail}</p>
                </div>
              )}

              {purchaseState === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-[fadeInUp_0.5s_ease-out]">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">Purchase Successful!</h3>
                  <p className="text-slate-600 mb-6">
                    Thank you for your purchase! A download link for <strong>{selectedBook.title}</strong> has been sent to <span className="font-bold text-slate-900">{userEmail}</span>.
                  </p>
                  <a 
                    href="https://drwilliamtriplett.com/secure-cloud/pdf/harbor-hopes-digital.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors mb-4 shadow-lg"
                  >
                    <Download size={18} /> Download Now
                  </a>
                </div>
              )}

              {purchaseState === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-[fadeInUp_0.5s_ease-out]">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">Something Went Wrong</h3>
                  <p className="text-slate-600 mb-6">
                    We couldn't process your request. Please try again or contact support if the issue persists.
                  </p>
                  <button 
                    onClick={() => setPurchaseState('idle')}
                    className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors shadow-lg"
                  >
                    <ArrowLeft size={18} /> Try Again
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
            Curated works exploring faith, leadership, cybersecurity, artificial intelligence, learning innovation, and sports ministry—designed to equip leaders for the challenges of a complex, modern world.
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
                className="group cursor-pointer flex flex-col h-full animate-fade-in-up"
                onClick={() => handleBookClick(book)}
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
