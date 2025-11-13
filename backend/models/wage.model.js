import mongoose from 'mongoose';

const WageRecordSchema = new mongoose.Schema({
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
  // Work Details
  workDate: {
    type: Date,
    required: true
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  daysWorked: {
    type: Number,
    default: 1
  },
  // Wage Calculation
  wageType: {
    type: String,
    enum: ['daily', 'monthly', 'hourly', 'project'],
    default: 'daily'
  },
  ratePerDay: {
    type: Number,
    default: 0
  },
  ratePerHour: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    required: true
  },
  // Payment Tracking
  totalPaid: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number,
    default: 0
  },
  // Period
  periodType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily'
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'fully_paid', 'overdue'],
    default: 'pending'
  },
  // Additional Info
  description: {
    type: String
  },
  notes: {
    type: String
  },
  // Payment Records Reference
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
}, {
  timestamps: true
});

// Calculate remaining balance before saving
WageRecordSchema.pre('save', function(next) {
  this.remainingBalance = this.totalEarned - this.totalPaid;
  
  // Update status based on payment
  if (this.totalPaid === 0) {
    this.status = 'pending';
  } else if (this.totalPaid < this.totalEarned) {
    this.status = 'partially_paid';
  } else if (this.totalPaid >= this.totalEarned) {
    this.status = 'fully_paid';
  }
  
  next();
});

export const WageRecord = mongoose.model('WageRecord', WageRecordSchema);
