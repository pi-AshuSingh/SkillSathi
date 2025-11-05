// hooks/usePayment.js
import { useState } from 'react';

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initiate payment creation
  const createPayment = async ({ amount, currency, paymentMethod }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Payment creation failed');
      }
      return data; // e.g., contains paymentUrl, transactionId
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Additional function to check payment status (optional)
  const checkPaymentStatus = async (transactionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/payment/status/${transactionId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get payment status');
      }
      return data; // e.g., status, details
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPayment,
    checkPaymentStatus,
  };
};

export default usePayment;
