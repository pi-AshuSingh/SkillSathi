// routes/payment.route.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Route to initiate a payment request
router.post('/create', paymentController.createPayment);

// Route to handle payment gateway callback
router.post('/callback', paymentController.paymentCallback);

module.exports = router;
   



const paymentRoutes = require('./routes/payment.route');
app.use('/api/payment', paymentRoutes);
