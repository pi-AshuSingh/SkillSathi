// components/payment/PaymentForm.jsx
import React, { useState } from 'react';

const PaymentForm = ({ onPaymentSuccess, onPaymentFailure }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, paymentMethod }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect user to paymentUrl or handle further UI flow
        window.location.href = data.paymentUrl;
      } else {
        setError('Failed to initiate payment.');
        onPaymentFailure && onPaymentFailure(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      onPaymentFailure && onPaymentFailure(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Make a Payment</h2>
      <label>
        Amount:
        <input
          type="number"
          min="1"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <br />
      <label>
        Currency:
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </label>
      <br />
      <label>
        Payment Method:
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="card">Card</option>
          <option value="netbanking">Net Banking</option>
          <option value="upi">UPI</option>
        </select>
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default PaymentForm;
