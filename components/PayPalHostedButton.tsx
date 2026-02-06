import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from './Toast';

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ hostedButtonId }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { showToast } = useToast();

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    showToast('Opening secure checkout...', 'info');
    
    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `https://www.paypal.com/ncp/payment/${hostedButtonId}`,
      'PayPalCheckout',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=no`
    );

    if (popup) {
      setIsCheckoutOpen(true);
      
      // Polling to detect when popup is closed
      const pollTimer = window.setInterval(() => {
        if (popup.closed !== false) {
          window.clearInterval(pollTimer);
          setIsCheckoutOpen(false);
          showToast('Checkout window closed.', 'info');
        }
      }, 500);
    } else {
      showToast('Pop-up blocked! Please allow pop-ups for this site.', 'error');
    }
  };

  return (
    <div className="flex justify-center w-full py-4">
      {/* Checkout Overlay */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-[fadeInUp_0.4s_ease-out]">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-2">Checkout in Progress</h3>
              <p className="text-slate-500 text-sm max-w-[240px]">
                Please complete your transaction in the secure PayPal window.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pp-${hostedButtonId} {
          text-align: center;
          border: none;
          border-radius: 0.25rem;
          min-width: 11.625rem;
          padding: 0 2rem;
          height: 2.625rem;
          font-weight: bold;
          background-color: #FFD140;
          color: #000000;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pp-${hostedButtonId}:hover {
          background-color: #f4c42e;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      <form 
        onSubmit={handlePayClick}
        style={{ display: 'inline-grid', justifyItems: 'center', alignContent: 'start', gap: '0.5rem' }}
      >
        <input className={`pp-${hostedButtonId}`} type="submit" value="Buy Now" />
        <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
        <section style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" style={{ height: '0.875rem', verticalAlign: 'middle' }} />
        </section>
      </form>
    </div>
  );
};

export default PayPalHostedButton;
