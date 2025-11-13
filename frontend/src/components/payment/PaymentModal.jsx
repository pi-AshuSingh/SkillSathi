import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { CreditCard, Wallet, IndianRupee, User, Smartphone, Building2 } from 'lucide-react'
import axios from 'axios'
import { PAYMENT_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const PaymentModal = ({ open, setOpen, worker, job, application }) => {
    const [paymentMethod, setPaymentMethod] = useState('online_payment')
    const [onlineMethod, setOnlineMethod] = useState('upi')
    const [amount, setAmount] = useState('')
    const [paymentType, setPaymentType] = useState('full')
    const [cashCollectedBy, setCashCollectedBy] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
    const [orderData, setOrderData] = useState(null)

    // Handle Online Payment (Mock Gateway)
    const handleOnlinePayment = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        setLoading(true)

        try {
            // Create order
            const orderResponse = await axios.post(
                `${PAYMENT_API_END_POINT}/online/create-order`,
                {
                    workerId: worker._id,
                    jobId: job._id,
                    applicationId: application?._id,
                    amount: parseFloat(amount),
                    paymentType
                },
                { withCredentials: true }
            )

            if (orderResponse.data.success) {
                setOrderData(orderResponse.data)
                setShowPaymentConfirmation(true)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to create payment order')
            setLoading(false)
        }
    }

    // Complete Online Payment
    const completePayment = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${PAYMENT_API_END_POINT}/online/complete`,
                {
                    orderId: orderData.orderId,
                    paymentId: orderData.payment._id,
                    paymentMethod: onlineMethod
                },
                { withCredentials: true }
            )

            if (response.data.success) {
                toast.success('Payment successful!')
                setShowPaymentConfirmation(false)
                setOpen(false)
                setTimeout(() => window.location.reload(), 1000)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(false)
        }
    }

    // Handle Local Cash Payment
    const handleLocalCashPayment = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (!cashCollectedBy.trim()) {
            toast.error('Please enter who collected the cash')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                `${PAYMENT_API_END_POINT}/cash/create`,
                {
                    workerId: worker._id,
                    jobId: job._id,
                    applicationId: application?._id,
                    amount: parseFloat(amount),
                    paymentType,
                    cashCollectedBy,
                    notes
                },
                { withCredentials: true }
            )

            if (response.data.success) {
                toast.success('Cash payment recorded successfully!')
                setOpen(false)
                setTimeout(() => window.location.reload(), 1000)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to record cash payment')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (paymentMethod === 'online_payment') {
            handleOnlinePayment()
        } else {
            handleLocalCashPayment()
        }
    }

    // Payment Confirmation Modal
    if (showPaymentConfirmation) {
        return (
            <Dialog open={showPaymentConfirmation} onOpenChange={setShowPaymentConfirmation}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Complete Payment</DialogTitle>
                        <DialogDescription className="text-center">
                            Confirm your payment of ₹{amount}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Payment Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-2xl font-bold text-green-700">₹{amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Payment to:</span>
                                <span className="font-medium">{worker?.fullname}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">For:</span>
                                <span className="font-medium">{job?.title}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-mono text-xs">{orderData?.orderId}</span>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Select Payment Method</Label>
                            <RadioGroup value={onlineMethod} onValueChange={setOnlineMethod}>
                                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <RadioGroupItem value="upi" id="upi" />
                                    <Label htmlFor="upi" className="cursor-pointer flex-1 flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-purple-600" />
                                        <span>UPI (PhonePe, GPay, Paytm)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="cursor-pointer flex-1 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        <span>Debit/Credit Card</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                    <RadioGroupItem value="netbanking" id="netbanking" />
                                    <Label htmlFor="netbanking" className="cursor-pointer flex-1 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-orange-600" />
                                        <span>Net Banking</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Mock Payment Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                            <p className="font-semibold mb-1">📝 Demo Payment</p>
                            <p>This is a simulated payment for testing. Click "Pay Now" to complete the transaction.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPaymentConfirmation(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={completePayment}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                {loading ? 'Processing...' : 'Pay Now'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Make Payment
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Pay {worker?.fullname} for {job?.title}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Worker Info */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {worker?.fullname?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{worker?.fullname}</p>
                                <p className="text-sm text-gray-600">{job?.title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Payment Type</Label>
                        <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="full" id="full" />
                                <Label htmlFor="full" className="cursor-pointer flex-1">Full Payment</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="advance" id="advance" />
                                <Label htmlFor="advance" className="cursor-pointer flex-1">Advance Payment</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="remaining" id="remaining" />
                                <Label htmlFor="remaining" className="cursor-pointer flex-1">Remaining Payment</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-semibold">Amount (₹)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        {job?.salary && (
                            <p className="text-xs text-gray-500">Job salary: ₹{job.salary}</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="online_payment" id="online_payment" />
                                <Label htmlFor="online_payment" className="cursor-pointer flex-1 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-indigo-600" />
                                    <span>Online Payment (UPI/Card/Net Banking)</span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="local_cash" id="local_cash" />
                                <Label htmlFor="local_cash" className="cursor-pointer flex-1 flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-green-600" />
                                    <span>Local Cash Payment</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Local Cash Payment Fields */}
                    {paymentMethod === 'local_cash' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="cashCollectedBy" className="text-sm font-semibold">
                                    Cash Collected By
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="cashCollectedBy"
                                        type="text"
                                        placeholder="Name of person who collected cash"
                                        value={cashCollectedBy}
                                        onChange={(e) => setCashCollectedBy(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold">Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    type="text"
                                    placeholder="Any additional notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {loading ? 'Processing...' : paymentMethod === 'online_payment' ? 'Proceed' : 'Record Payment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentModal
