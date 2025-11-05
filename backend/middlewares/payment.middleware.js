// middlewares/payment.middleware.js

// Example middleware to verify payment gateway callback signature (pseudo example)
exports.verifyPaymentSignature = (req, res, next) => {
  const signature = req.headers['x-payment-signature'];
  const payload = JSON.stringify(req.body);

  // TODO: Implement your payment gateway's signature verification logic here
  // For example, using HMAC with a shared secret key

  const expectedSignature = computeExpectedSignature(payload); // placeholder function

  if (signature !== expectedSignature) {
    return res.status(401).json({ success: false, message: 'Invalid payment signature' });
  }

  next();
};

// Example middleware to check if payment-related fields exist in the request body
exports.validatePaymentRequest = (req, res, next) => {
  const { amount, currency, userId } = req.body;
  if (!amount || !currency || !userId) {
    return res.status(400).json({ success: false, message: 'Missing payment information' });
  }
  next();
};

// Placeholder function for expected signature calculation
function computeExpectedSignature(payload) {
  // Use your payment gateway's secret and logic here
  return 'some-calculated-signature';
}




// const paymentMiddleware = require('../middlewares/payment.middleware');

// router.post('/create', paymentMiddleware.validatePaymentRequest, paymentController.createPayment);
// router.post('/callback', paymentMiddleware.verifyPaymentSignature, paymentController.paymentCallback);
