import { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Download, IndianRupee, Calendar, User, Briefcase, CreditCard, Wallet, Building2, Smartphone } from 'lucide-react'
import axios from 'axios'
import { PAYMENT_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'

const PaymentHistory = () => {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useSelector(store => store.auth)
    const isWorker = user?.role === 'student'

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            const endpoint = isWorker ? '/worker' : '/employer'
            const response = await axios.get(`${PAYMENT_API_END_POINT}${endpoint}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setPayments(response.data.payments)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to fetch payment history')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            success: { variant: 'default', className: 'bg-green-500 hover:bg-green-600', text: 'Success' },
            pending: { variant: 'secondary', className: 'bg-yellow-500 hover:bg-yellow-600', text: 'Pending' },
            failed: { variant: 'destructive', className: 'bg-red-500 hover:bg-red-600', text: 'Failed' },
            cancelled: { variant: 'outline', className: 'bg-gray-500 hover:bg-gray-600 text-white', text: 'Cancelled' },
            refunded: { variant: 'outline', className: 'bg-blue-500 hover:bg-blue-600 text-white', text: 'Refunded' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return <Badge className={config.className}>{config.text}</Badge>
    }

    const getPaymentMethodIcon = (method) => {
        const icons = {
            online_payment: <Smartphone className="w-4 h-4 text-purple-600" />,
            razorpay: <CreditCard className="w-4 h-4 text-indigo-600" />,
            local_cash: <Wallet className="w-4 h-4 text-green-600" />,
            bank_transfer: <Building2 className="w-4 h-4 text-blue-600" />,
            upi: <Smartphone className="w-4 h-4 text-orange-600" />
        }
        return icons[method] || <CreditCard className="w-4 h-4" />
    }

    const getPaymentMethodText = (method) => {
        const methods = {
            online_payment: 'Online Payment',
            razorpay: 'Razorpay',
            local_cash: 'Local Cash',
            bank_transfer: 'Bank Transfer',
            upi: 'UPI'
        }
        return methods[method] || method
    }

    const getPaymentTypeText = (type) => {
        const types = {
            full: 'Full Payment',
            advance: 'Advance Payment',
            remaining: 'Remaining Payment'
        }
        return types[type] || type
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const downloadReceipt = (payment) => {
        // Create styled HTML receipt (HTML download)
        const html = renderReceiptHtml(payment, { isWorker, autoPdf: false })
        const blob = new Blob([html], { type: 'text/html' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt-${payment.transactionId}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Receipt downloaded (HTML)')
    }

    const downloadReceiptPdf = (payment) => {
        // open a window that auto-generates a PDF via html2pdf
        const html = renderReceiptHtml(payment, { isWorker, autoPdf: true })
        const w = window.open('', '_blank', 'width=900,height=1100')
        if (!w) { toast.error('Unable to open window for PDF. Allow popups.'); return }
        w.document.write(html)
        w.document.close()
    }

    // local helper to render receipt HTML (kept simple and portable)
    function renderReceiptHtml(payment, { isWorker } = {}) {
        const created = new Date(payment.createdAt).toLocaleString('en-IN')
        const receiptNo = payment.receiptNumber || payment.transactionId
        const amount = `₹${payment.amount}`
        const jobTitle = payment.job?.title || '-'
        const jobLocation = payment.job?.location || '-'

        const esc = (s) => (s ? String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) : '')

        return `
<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Receipt ${receiptNo}</title>
<style>body{font-family:Inter,system-ui,Arial;color:#111827} .c{max-width:720px;margin:24px auto;padding:18px;border:1px solid #e5e7eb;border-radius:8px} .h{background:linear-gradient(90deg,#6366f1,#a78bfa);color:#fff;padding:14px;border-radius:6px} .amt{font-size:28px;color:#059669;font-weight:700}</style>
</head><body><div class="c"><div class="h"><div style="display:flex;justify-content:space-between"><div><h2 style="margin:0">Payment Receipt</h2><div style="opacity:0.9">Transaction: ${esc(payment.transactionId)}</div></div><div style="text-align:right">Receipt: <strong>${esc(receiptNo)}</strong></div></div></div>
<div style="text-align:center;margin-top:12px"><div style="font-size:12px;color:#6b7280">Amount Paid</div><div class="amt">${amount}</div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
<div><div style="font-weight:600">${isWorker?esc(payment.employer?.fullname):esc(payment.worker?.fullname)||'-'}</div><div style="font-size:13px;color:#374151">${esc(isWorker?payment.employer?.email:payment.worker?.email)||'-'}</div></div>
<div><div style="font-weight:600">${esc(jobTitle)}</div><div style="font-size:13px;color:#374151">${esc(jobLocation)}</div></div>
</div>
<div style="margin-top:12px;font-size:13px;color:#374151">Payment Method: ${esc((payment.paymentMethod||'').replace('_',' '))} &nbsp; | &nbsp; ${esc(payment.paymentType||'')}</div>
<div style="margin-top:10px;font-size:12px;color:#6b7280">Generated on ${new Date().toLocaleString('en-IN')}</div>
</div></body></html>
        `
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto my-10 px-4">
                    <h1 className="text-2xl font-bold mb-5">Loading payment history...</h1>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
                        <p className="text-gray-600 mt-1">
                            {isWorker ? 'Payments you have received' : 'Payments you have made'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-lg border border-indigo-200">
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="text-2xl font-bold text-indigo-600">{payments.length}</p>
                    </div>
                </div>

                {payments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Yet</h3>
                        <p className="text-gray-500">
                            {isWorker 
                                ? 'You haven\'t received any payments yet' 
                                : 'You haven\'t made any payments yet'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <Table>
                            <TableCaption>
                                A list of all your {isWorker ? 'received' : 'made'} payments
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Transaction ID</TableHead>
                                    <TableHead className="font-semibold">{isWorker ? 'From' : 'To'}</TableHead>
                                    <TableHead className="font-semibold">Job</TableHead>
                                    <TableHead className="font-semibold">Amount</TableHead>
                                    <TableHead className="font-semibold">Payment Type</TableHead>
                                    <TableHead className="font-semibold">Method</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="text-right font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment._id} className="hover:bg-gray-50">
                                        <TableCell className="font-mono text-xs">
                                            {payment.transactionId}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                                    {isWorker 
                                                        ? payment.employer?.fullname?.charAt(0).toUpperCase()
                                                        : payment.worker?.fullname?.charAt(0).toUpperCase()
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {isWorker ? payment.employer?.fullname : payment.worker?.fullname}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {isWorker ? payment.employer?.email : payment.worker?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{payment.job?.title}</p>
                                                <p className="text-xs text-gray-500">{payment.job?.location}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-green-700">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{payment.amount}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {getPaymentTypeText(payment.paymentType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                                <span className="text-sm">
                                                    {getPaymentMethodText(payment.paymentMethod)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(payment.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => downloadReceipt(payment)}
                                                className="hover:bg-indigo-50"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Receipt
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Summary Cards */}
                {payments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
                                    </p>
                                </div>
                                <IndianRupee className="w-12 h-12 text-green-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {payments.filter(p => p.status === 'success').length}
                                    </p>
                                </div>
                                <CreditCard className="w-12 h-12 text-blue-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                                    <p className="text-2xl font-bold text-purple-700">
                                        {payments.filter(p => p.status === 'pending').length}
                                    </p>
                                </div>
                                <Wallet className="w-12 h-12 text-purple-600 opacity-20" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentHistory
