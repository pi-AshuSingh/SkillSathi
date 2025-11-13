import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  transactionId: {
    type: String,
    required: true
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online_payment', 'razorpay', 'local_cash', 'bank_transfer', 'upi'],
    required: true
  },
  paymentType: {
    type: String,
    enum: ['advance', 'full', 'remaining'],
    default: 'full'
  },
  description: {
    type: String
  },
  receiptNumber: {
    type: String
  },
  cashCollectedBy: {
    type: String // Name of person who collected cash
  },
  cashCollectionDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique transaction ID
PaymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  if (!this.receiptNumber) {
    this.receiptNumber = `RCP${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export const Payment = mongoose.model('Payment', PaymentSchema);
