import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (config: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ hostedButtonId }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the script is already loaded
    const scriptId = 'paypal-js-sdk';
    const containerId = `paypal-container-${hostedButtonId}`;

    const renderButton = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        // Clear container first to prevent duplicates
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
        
        window.paypal.HostedButtons({
          hostedButtonId: hostedButtonId
        })
        .render(`#${containerId}`)
        .then(() => {
           setIsLoading(false);
        })
        .catch((err) => {
           console.error("PayPal button render failed", err);
           setIsLoading(false); // Stop loading on error too
        });
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
       // Updated client-id from user request
      script.src = "https://www.paypal.com/sdk/js?client-id=BAAeVmaNSSf9Bvv56cqvYIYZgw-lW_5H3uKPuO8xYQvgat5zmyWCee9wPnq0yo-AbelvtxfQX2y2EctLvc&components=hosted-buttons&enable-funding=venmo&currency=USD";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => {
          // Script loaded, now render
          renderButton();
      };
      document.body.appendChild(script);
    } else {
      // If script is already loaded, just render
      renderButton();
    }
  }, [hostedButtonId]);

  return (
    <div className="relative w-full" style={{ minHeight: '300px' }}>
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-lg border border-slate-100/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
                <p className="text-sm text-slate-500 font-medium">Loading secure payment...</p>
            </div>
        )}
        <div id={`paypal-container-${hostedButtonId}`} className="w-full relative z-0" />
    </div>
  );
};

export default PayPalHostedButton;
