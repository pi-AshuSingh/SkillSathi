import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  createOnlinePaymentOrder,
  completeOnlinePayment,
  createLocalCashPayment,
  getEmployerPayments,
  getWorkerPayments,
  getPaymentById
} from '../controllers/payment.controller.js';

const router = express.Router();

// Mock online payment routes (Works without Razorpay)
router.route('/online/create-order').post(isAuthenticated, createOnlinePaymentOrder);
router.route('/online/complete').post(isAuthenticated, completeOnlinePayment);

// Local cash payment route
router.route('/cash/create').post(isAuthenticated, createLocalCashPayment);

// Get payments
router.route('/employer').get(isAuthenticated, getEmployerPayments);
router.route('/worker').get(isAuthenticated, getWorkerPayments);
router.route('/:id').get(isAuthenticated, getPaymentById);

export default router;
