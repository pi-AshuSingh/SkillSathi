// components/payment/PaymentStatus.jsx
import React from 'react';

const PaymentStatus = ({ status, message }) => {
  let displayMessage = '';
  let color = 'black';

  switch (status) {
    case 'success':
      displayMessage = 'Payment Successful! Thank you for your purchase.';
      color = 'green';
      break;
    case 'failed':
      displayMessage = `Payment Failed: ${message || 'Please try again or contact support.'}`;
      color = 'red';
      break;
    case 'pending':
      displayMessage = 'Payment is pending. Please wait for confirmation.';
      color = 'orange';
      break;
    default:
      displayMessage = 'No payment information available.';
  }

  return (
    <div style={{ padding: '1rem', border: `2px solid ${color}`, borderRadius: '8px' }}>
      <h3 style={{ color }}>{displayMessage}</h3>
      {status === 'failed' && message && <p>{message}</p>}
    </div>
  );
};

export default PaymentStatus;
