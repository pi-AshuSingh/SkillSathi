import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  createWageRecord,
  getWorkerWageRecords,
  getEmployerWageRecords,
  updateWageRecordWithPayment,
  getWageRecordById,
  getWorkerWageSummary,
  updateBankDetails,
  updateUpiDetails
} from '../controllers/wage.controller.js';

const router = express.Router();

// Wage Record Routes
router.post('/create', isAuthenticated, createWageRecord);
router.get('/worker', isAuthenticated, getWorkerWageRecords);
router.get('/employer', isAuthenticated, getEmployerWageRecords);
router.put('/update-payment', isAuthenticated, updateWageRecordWithPayment);
router.get('/summary/:workerId?', isAuthenticated, getWorkerWageSummary);
router.get('/:id', isAuthenticated, getWageRecordById);

// Bank and UPI Routes
router.put('/bank-details', isAuthenticated, updateBankDetails);
router.put('/upi-details', isAuthenticated, updateUpiDetails);

export default router;
