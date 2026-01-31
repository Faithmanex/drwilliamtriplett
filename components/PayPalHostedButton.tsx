import React, { useEffect } from 'react';

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (config: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}

const PayPalHostedButton: React.FC<PayPalHostedButtonProps> = ({ hostedButtonId }) => {
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
        }).render(`#${containerId}`);
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
       // Updated client-id from user request
      script.src = "https://www.paypal.com/sdk/js?client-id=BAAeVmaNSSf9Bvv56cqvYIYZgw-lW_5H3uKPuO8xYQvgat5zmyWCee9wPnq0yo-AbelvtxfQX2y2EctLvc&components=hosted-buttons&enable-funding=venmo&currency=USD";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, just render
      renderButton();
    }
  }, [hostedButtonId]);

  return <div id={`paypal-container-${hostedButtonId}`} className="w-full relative z-0" style={{ minHeight: '300px' }} />;
};

export default PayPalHostedButton;
