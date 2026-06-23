// models/payment.model.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String, // e.g., 'card', 'netbanking', 'upi'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
