import { Payment } from '../models/payment.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Application } from '../models/application.model.js';
import { Notification } from '../models/notification.model.js';
import { WageRecord } from '../models/wage.model.js';
import crypto from 'crypto';

// Create Mock Online Payment Order (Works without Razorpay)
export const createOnlinePaymentOrder = async (req, res) => {
  try {
    const { workerId, jobId, applicationId, amount, paymentType } = req.body;
    const employerId = req.id;

    console.log("Create Payment Order - Request Body:", req.body);
    console.log("Create Payment Order - Employer ID:", employerId);

    if (!workerId || !jobId || !amount) {
      return res.status(400).json({
        message: "Worker ID, Job ID, and amount are required",
        success: false
      });
    }

    // Verify worker and job exist
    const worker = await User.findById(workerId);
    const job = await Job.findById(jobId);

    if (!worker || !job) {
      return res.status(404).json({
        message: "Worker or Job not found",
        success: false
      });
    }

    // Generate mock order ID
    const orderId = `ORDER${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    console.log("Creating payment with data:", {
      worker: workerId,
      employer: employerId,
      job: jobId,
      application: applicationId,
      amount,
      paymentType,
      orderId,
      transactionId
    });

    // Create payment record
    const payment = await Payment.create({
      worker: workerId,
      employer: employerId,
      job: jobId,
      application: applicationId,
      razorpayOrderId: orderId,
      amount: amount,
      paymentType: paymentType || 'full',
      paymentMethod: 'online_payment',
      status: 'pending',
      description: `Payment for job: ${job.title}`,
      transactionId: transactionId
    });

    console.log("Payment created successfully:", payment._id);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: orderId,
      amount: amount,
      currency: "INR",
      payment: payment,
      mockPayment: true // Flag to indicate this is a mock payment
    });

  } catch (error) {
    console.log("Error in createOnlinePaymentOrder:", error);
    return res.status(500).json({
      message: error.message || "Error creating payment order",
      error: error.toString(),
      success: false
    });
  }
};

// Complete Mock Online Payment (Simulates payment completion)
export const completeOnlinePayment = async (req, res) => {
  try {
    const { orderId, paymentId, paymentMethod } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
        success: false
      });
    }

    // Find payment by order ID or payment ID
    let payment;
    if (orderId) {
      payment = await Payment.findOne({ razorpayOrderId: orderId });
    }
    if (!payment && paymentId) {
      payment = await Payment.findById(paymentId);
    }
    
    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
        success: false
      });
    }

    // Generate mock payment ID and signature
    const mockPaymentId = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const mockSignature = crypto.randomBytes(32).toString('hex');

    // Update payment record
    payment.razorpayPaymentId = mockPaymentId;
    payment.razorpaySignature = mockSignature;
    payment.status = 'success';
    payment.paymentMethod = paymentMethod || 'upi'; // upi, card, netbanking
    await payment.save();

    // Update application status
    if (payment.application) {
      await Application.findByIdAndUpdate(payment.application, {
        status: 'accepted'
      });
    }

    // Update wage record if exists
    const wageRecord = await WageRecord.findOne({
      worker: payment.worker,
      job: payment.job,
      status: { $in: ['pending', 'partially_paid'] }
    }).sort({ createdAt: -1 });

    if (wageRecord) {
      wageRecord.totalPaid += payment.amount;
      wageRecord.payments.push(payment._id);
      await wageRecord.save();
    }

    // Create notification for worker
    await Notification.create({
      recipient: payment.worker,
      sender: payment.employer,
      type: 'payment_received',
      title: 'Payment Received',
      message: `You have received ₹${payment.amount} for the job`,
      priority: 'high',
      link: `/payments`
    });

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      payment
    });

  } catch (error) {
    console.log("Error in completeOnlinePayment:", error);
    return res.status(500).json({
      message: error.message || "Error completing payment",
      error: error.toString(),
      success: false
    });
  }
};

// Create Local Cash Payment
export const createLocalCashPayment = async (req, res) => {
  try {
    const { workerId, jobId, applicationId, amount, paymentType, cashCollectedBy, notes } = req.body;
    const employerId = req.id;

    console.log("Create Cash Payment - Request Body:", req.body);
    console.log("Create Cash Payment - Employer ID:", employerId);

    if (!workerId || !jobId || !amount || !cashCollectedBy) {
      return res.status(400).json({
        message: "Worker ID, Job ID, amount, and cash collector name are required",
        success: false
      });
    }

    // Verify worker and job exist
    const worker = await User.findById(workerId);
    const job = await Job.findById(jobId);

    if (!worker || !job) {
      return res.status(404).json({
        message: "Worker or Job not found",
        success: false
      });
    }

    const transactionId = `CASH${Date.now()}${Math.floor(Math.random() * 1000)}`;

    console.log("Creating cash payment with data:", {
      worker: workerId,
      employer: employerId,
      job: jobId,
      application: applicationId,
      amount,
      paymentType,
      cashCollectedBy,
      transactionId
    });

    // Create payment record
    const payment = await Payment.create({
      worker: workerId,
      employer: employerId,
      job: jobId,
      application: applicationId,
      amount: amount,
      paymentType: paymentType || 'full',
      paymentMethod: 'local_cash',
      status: 'success', // Cash payments are immediately successful
      description: `Cash payment for job: ${job.title}`,
      cashCollectedBy,
      cashCollectionDate: new Date(),
      notes,
      transactionId: transactionId
    });

    console.log("Cash payment created successfully:", payment._id);

    // Update application status
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, {
        status: 'accepted'
      });
    }

    // Update wage record if exists
    const wageRecord = await WageRecord.findOne({
      worker: workerId,
      job: jobId,
      status: { $in: ['pending', 'partially_paid'] }
    }).sort({ createdAt: -1 });

    if (wageRecord) {
      wageRecord.totalPaid += amount;
      wageRecord.payments.push(payment._id);
      await wageRecord.save();
    }

    // Create notification for worker
    await Notification.create({
      recipient: workerId,
      sender: employerId,
      type: 'payment_received',
      title: 'Cash Payment Recorded',
      message: `Cash payment of ₹${amount} has been recorded for the job`,
      priority: 'high',
      link: `/payments`
    });

    return res.status(201).json({
      success: true,
      message: "Cash payment recorded successfully",
      payment
    });

  } catch (error) {
    console.log("Error in createLocalCashPayment:", error);
    return res.status(500).json({
      message: error.message || "Error recording cash payment",
      error: error.toString(),
      success: false
    });
  }
};

// Get all payments (for employer)
export const getEmployerPayments = async (req, res) => {
  try {
    const employerId = req.id;

    const payments = await Payment.find({ employer: employerId })
      .populate('worker', 'fullname email phoneNumber')
      .populate('job', 'title location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching payments",
      success: false
    });
  }
};

// Get all payments (for worker)
export const getWorkerPayments = async (req, res) => {
  try {
    const workerId = req.id;

    const payments = await Payment.find({ worker: workerId })
      .populate('employer', 'fullname email phoneNumber')
      .populate('job', 'title location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching payments",
      success: false
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId)
      .populate('worker', 'fullname email phoneNumber')
      .populate('employer', 'fullname email phoneNumber')
      .populate('job', 'title location salary');

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching payment",
      success: false
    });
  }
};
