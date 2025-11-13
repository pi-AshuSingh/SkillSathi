import { WageRecord } from '../models/wage.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';
import { Payment } from '../models/payment.model.js';

// Create Wage Record
export const createWageRecord = async (req, res) => {
  try {
    const {
      workerId,
      jobId,
      workDate,
      hoursWorked,
      daysWorked,
      wageType,
      ratePerDay,
      ratePerHour,
      periodType,
      periodStart,
      periodEnd,
      description,
      notes
    } = req.body;
    
    const employerId = req.id;

    if (!workerId || !jobId) {
      return res.status(400).json({
        message: "Worker ID and Job ID are required",
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

    // Calculate total earned
    let totalEarned = 0;
    if (wageType === 'daily') {
      totalEarned = ratePerDay * daysWorked;
    } else if (wageType === 'hourly') {
      totalEarned = ratePerHour * hoursWorked;
    } else if (wageType === 'monthly') {
      totalEarned = ratePerDay; // For monthly, ratePerDay contains the monthly amount
    }

    // Create wage record
    const wageRecord = await WageRecord.create({
      worker: workerId,
      employer: employerId,
      job: jobId,
      workDate: workDate || new Date(),
      hoursWorked: hoursWorked || 0,
      daysWorked: daysWorked || 1,
      wageType: wageType || 'daily',
      ratePerDay: ratePerDay || 0,
      ratePerHour: ratePerHour || 0,
      totalEarned,
      periodType: periodType || 'daily',
      periodStart: periodStart || new Date(),
      periodEnd: periodEnd || new Date(),
      description,
      notes
    });

    return res.status(201).json({
      success: true,
      message: "Wage record created successfully",
      wageRecord
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error creating wage record",
      success: false
    });
  }
};

// Get Wage Records for Worker
export const getWorkerWageRecords = async (req, res) => {
  try {
    const workerId = req.id;

    const wageRecords = await WageRecord.find({ worker: workerId })
      .populate('employer', 'fullname email phoneNumber')
      .populate('job', 'title location')
      .populate('payments')
      .sort({ createdAt: -1 });

    // Calculate totals
    const totals = wageRecords.reduce((acc, record) => {
      acc.totalEarned += record.totalEarned;
      acc.totalPaid += record.totalPaid;
      acc.totalRemaining += record.remainingBalance;
      return acc;
    }, { totalEarned: 0, totalPaid: 0, totalRemaining: 0 });

    return res.status(200).json({
      success: true,
      wageRecords,
      summary: totals
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching wage records",
      success: false
    });
  }
};

// Get Wage Records for Employer
export const getEmployerWageRecords = async (req, res) => {
  try {
    const employerId = req.id;

    const wageRecords = await WageRecord.find({ employer: employerId })
      .populate('worker', 'fullname email phoneNumber profile.bankDetails profile.upiDetails')
      .populate('job', 'title location')
      .populate('payments')
      .sort({ createdAt: -1 });

    // Calculate totals
    const totals = wageRecords.reduce((acc, record) => {
      acc.totalEarned += record.totalEarned;
      acc.totalPaid += record.totalPaid;
      acc.totalRemaining += record.remainingBalance;
      return acc;
    }, { totalEarned: 0, totalPaid: 0, totalRemaining: 0 });

    return res.status(200).json({
      success: true,
      wageRecords,
      summary: totals
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching wage records",
      success: false
    });
  }
};

// Update Wage Record with Payment
export const updateWageRecordWithPayment = async (req, res) => {
  try {
    const { wageRecordId, paymentId, amountPaid } = req.body;

    if (!wageRecordId || !paymentId || !amountPaid) {
      return res.status(400).json({
        message: "Wage Record ID, Payment ID, and Amount are required",
        success: false
      });
    }

    const wageRecord = await WageRecord.findById(wageRecordId);

    if (!wageRecord) {
      return res.status(404).json({
        message: "Wage record not found",
        success: false
      });
    }

    // Update payment tracking
    wageRecord.totalPaid += amountPaid;
    wageRecord.payments.push(paymentId);
    await wageRecord.save();

    return res.status(200).json({
      success: true,
      message: "Wage record updated successfully",
      wageRecord
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error updating wage record",
      success: false
    });
  }
};

// Get Wage Record by ID
export const getWageRecordById = async (req, res) => {
  try {
    const wageRecordId = req.params.id;

    const wageRecord = await WageRecord.findById(wageRecordId)
      .populate('worker', 'fullname email phoneNumber profile.bankDetails profile.upiDetails')
      .populate('employer', 'fullname email phoneNumber')
      .populate('job', 'title location salary')
      .populate('payments');

    if (!wageRecord) {
      return res.status(404).json({
        message: "Wage record not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      wageRecord
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching wage record",
      success: false
    });
  }
};

// Get Worker Summary (Total earnings, paid, remaining)
export const getWorkerWageSummary = async (req, res) => {
  try {
    const workerId = req.params.workerId || req.id;

    const wageRecords = await WageRecord.find({ worker: workerId });

    const summary = {
      totalEarned: 0,
      totalPaid: 0,
      totalRemaining: 0,
      pendingRecords: 0,
      partiallyPaidRecords: 0,
      fullyPaidRecords: 0
    };

    wageRecords.forEach(record => {
      summary.totalEarned += record.totalEarned;
      summary.totalPaid += record.totalPaid;
      summary.totalRemaining += record.remainingBalance;

      if (record.status === 'pending') summary.pendingRecords++;
      if (record.status === 'partially_paid') summary.partiallyPaidRecords++;
      if (record.status === 'fully_paid') summary.fullyPaidRecords++;
    });

    return res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error fetching wage summary",
      success: false
    });
  }
};

// Update Bank Details
export const updateBankDetails = async (req, res) => {
  try {
    const userId = req.id;
    const { accountHolderName, accountNumber, ifscCode, bankName, branchName } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    user.profile.bankDetails = {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error updating bank details",
      success: false
    });
  }
};

// Update UPI Details
export const updateUpiDetails = async (req, res) => {
  try {
    const userId = req.id;
    const { upiId, upiName } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    user.profile.upiDetails = {
      upiId,
      upiName
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "UPI details updated successfully",
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error updating UPI details",
      success: false
    });
  }
};
