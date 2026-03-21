import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academicServices } from '../data/academicServices';
import { Check, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';

interface RouteParams {
  id: string;
}

const AcademicServiceDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  
  const service = academicServices.find(s => s.id === id);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!service) {
    return (
      <div className="bg-brand-light min-h-screen pt-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-2xl font-bold text-brand-dark mb-4">Service Not Found</h1>
          <button 
            onClick={() => navigate('/services')}
            className="text-brand-primary hover:underline"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulated payment flow - replace with actual Stripe/PayPal integration
    if (paymentMethod === 'stripe') {
      alert('Stripe integration coming soon! Use PayPal for now.');
    } else {
      alert('PayPal integration coming soon!');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="bg-brand-light min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/services/academic')}
          className="flex items-center text-brand-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Academic Services
        </button>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="bg-brand-dark px-8 py-12">
            <h1 className="font-serif text-4xl font-bold text-white mb-4">{service.title}</h1>
            {service.duration && (
              <p className="text-slate-300 text-lg">{service.duration}</p>
            )}
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="mb-8">
              <span className="bg-green-100 text-green-800 text-2xl font-bold px-4 py-2 rounded-lg whitespace-nowrap">
                ${service.price} {service.priceLabel}
              </span>
            </div>

            <p className="text-slate-600 text-lg mb-8">{service.description}</p>

            <h2 className="font-serif text-xl font-bold text-brand-dark mb-4">What's Included</h2>
            <ul className="space-y-3 mb-8">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Payment Section */}
            <div className="border-t border-slate-200 pt-8 mt-8">
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-6">Complete Your Booking</h2>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-700">Total</span>
                  <span className="text-2xl font-bold text-brand-dark">${service.price}</span>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-slate-600" />
                    <span className="text-slate-700">Pay with Stripe</span>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="mr-3"
                    />
                    <span className="font-bold text-blue-700 mr-2">PayPal</span>
                    <span className="text-slate-600">(or card)</span>
                  </label>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-brand-dark hover:bg-slate-800 text-white py-4 px-6 rounded-lg font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>
                
                <p className="text-center text-slate-500 text-sm mt-4">
                  Secure payment • Non-refundable • 24hr reschedule notice
                </p>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> All services are advisory and developmental in nature. 
                Dr. Triplett does not provide ghostwriting or authorship services. 
                Clients remain solely responsible for the originality and submission of their academic work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicServiceDetail;
