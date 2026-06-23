// controllers/payment.controller.js
const axios = require('axios');

// Dummy config - replace with real payment gateway details
const PAYMENT_GATEWAY_API = 'https://api.examplepayment.com';
const PAYMENT_GATEWAY_KEY = process.env.PAYMENT_GATEWAY_KEY;

// Create a payment request (e.g., initialize transaction)
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    // Send payment request to payment provider API
    const paymentResponse = await axios.post(
      `${PAYMENT_GATEWAY_API}/create-payment`,
      {
        amount,
        currency,
        userId,
        callbackUrl: `${process.env.SERVER_URL}/api/payment/callback`,
      },
      {
        headers: { Authorization: `Bearer ${PAYMENT_GATEWAY_KEY}` },
      }
    );

    // Respond with payment URL or transaction info for frontend
    return res.status(200).json({
      success: true,
      paymentUrl: paymentResponse.data.paymentUrl,
      transactionId: paymentResponse.data.transactionId,
    });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
};

// Handle payment confirmation callback from payment gateway
exports.paymentCallback = async (req, res) => {
  try {
    const { transactionId, status, paymentDetails } = req.body;

    // Verify payment status and update database accordingly (pseudo example)
    if (status === 'success') {
      // TODO: update transaction/payment status in DB, grant services, etc.
      console.log(`Payment successful for transaction ${transactionId}`);
    } else {
      console.log(`Payment failed or canceled for transaction ${transactionId}`);
    }

    // Respond to gateway acknowledge receipt of callback
    return res.status(200).send('Callback received');
  } catch (error) {
    console.error('Payment callback handling error:', error.message);
    return res.status(500).send('Error handling callback');
  }
};
