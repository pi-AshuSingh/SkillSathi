import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ArrowLeft, Download, IndianRupee, Calendar, User, Briefcase, CreditCard, FileText, Phone, Mail } from 'lucide-react'
import axios from 'axios'
import { PAYMENT_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'

const PaymentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useSelector(store => store.auth)
    const isWorker = user?.role === 'student'

    useEffect(() => {
        fetchPaymentDetails()
    }, [id])

    const fetchPaymentDetails = async () => {
        try {
            const response = await axios.get(`${PAYMENT_API_END_POINT}/${id}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setPayment(response.data.payment)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to fetch payment details')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            success: { className: 'bg-green-500 text-white', text: 'Success' },
            pending: { className: 'bg-yellow-500 text-white', text: 'Pending' },
            failed: { className: 'bg-red-500 text-white', text: 'Failed' },
            cancelled: { className: 'bg-gray-500 text-white', text: 'Cancelled' },
            refunded: { className: 'bg-blue-500 text-white', text: 'Refunded' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return <Badge className={config.className}>{config.text}</Badge>
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto my-10 px-4">
                    <h1 className="text-2xl font-bold">Loading payment details...</h1>
                </div>
            </div>
        )
    }

    if (!payment) {
        return (
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto my-10 px-4">
                    <h1 className="text-2xl font-bold">Payment not found</h1>
                    <Button onClick={() => navigate('/payments')} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Payment History
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Payment Receipt</h1>
                                <p className="text-indigo-100">Transaction ID: {payment.transactionId}</p>
                            </div>
                            <div>{getStatusBadge(payment.status)}</div>
                        </div>
                    </div>

                    {/* Payment Amount */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b">
                        <div className="text-center">
                            <p className="text-gray-600 mb-2">Amount Paid</p>
                            <div className="flex items-center justify-center gap-2">
                                <IndianRupee className="w-8 h-8 text-green-700" />
                                <span className="text-5xl font-bold text-green-700">{payment.amount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Parties Involved */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* From/To */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-indigo-600" />
                                    {isWorker ? 'Received From' : 'Paid To'}
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-medium text-lg">
                                        {isWorker ? payment.employer?.fullname : payment.worker?.fullname}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        {isWorker ? payment.employer?.email : payment.worker?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        {isWorker ? payment.employer?.phoneNumber : payment.worker?.phoneNumber}
                                    </div>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    Job Details
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-medium text-lg">{payment.job?.title}</p>
                                    <p className="text-sm text-gray-600">{payment.job?.location}</p>
                                    {payment.job?.salary && (
                                        <p className="text-sm text-gray-600">Salary: ₹{payment.job.salary}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Payment Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Type</p>
                                    <p className="font-medium capitalize">{payment.paymentType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-medium capitalize">
                                        {payment.paymentMethod.replace('_', ' ')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Transaction Date</p>
                                    <div className="flex items-center gap-1 font-medium">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(payment.createdAt)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Receipt Number</p>
                                    <p className="font-mono text-sm">{payment.receiptNumber || payment.transactionId}</p>
                                </div>
                            </div>

                            {/* Payment IDs */}
                            {payment.razorpayPaymentId && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Payment ID</p>
                                            <p className="font-mono text-sm">{payment.razorpayPaymentId}</p>
                                        </div>
                                        {payment.razorpayOrderId && (
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-mono text-sm">{payment.razorpayOrderId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Cash Payment Details */}
                            {payment.paymentMethod === 'local_cash' && payment.cashCollectedBy && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Cash Collected By</p>
                                            <p className="font-medium">{payment.cashCollectedBy}</p>
                                        </div>
                                        {payment.cashCollectionDate && (
                                            <div>
                                                <p className="text-sm text-gray-600">Collection Date</p>
                                                <p className="font-medium">{formatDate(payment.cashCollectionDate)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {payment.notes && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="mt-1">{payment.notes}</p>
                                </div>
                            )}

                            {/* Description */}
                            {payment.description && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">Description</p>
                                    <p className="mt-1">{payment.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer with Download Button */}
                    <div className="bg-gray-50 p-6 border-t flex justify-center">
                                                                <div className='flex gap-3'>
                                                                        <Button
                                                                                onClick={() => {
                                                                                        // open a printable HTML receipt in a new window
                                                                                        const html = renderReceiptHtml(payment, { isWorker })
                                                                                        const w = window.open('', '_blank', 'width=800,height=900')
                                                                                        if (!w) {
                                                                                                toast.error('Unable to open print window. Please allow popups.')
                                                                                                return
                                                                                        }
                                                                                        w.document.write(html)
                                                                                        w.document.close()
                                                                                        // give it a bit to render then trigger print
                                                                                        setTimeout(() => { w.print() }, 300)
                                                                                }}
                                                                                className="bg-indigo-50 text-indigo-700 border border-indigo-200"
                                                                        >
                                                                                Print Receipt
                                                                        </Button>

                                                                        <Button
                                                                            onClick={() => {
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
                                                                            }}
                                                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                                                        >
                                                                            <Download className="w-4 h-4 mr-2" />
                                                                            Download Receipt
                                                                        </Button>

                                                                        <Button
                                                                            onClick={() => {
                                                                                // open a window that auto-generates a PDF via html2pdf
                                                                                const html = renderReceiptHtml(payment, { isWorker, autoPdf: true })
                                                                                const w = window.open('', '_blank', 'width=900,height=1100')
                                                                                if (!w) { toast.error('Unable to open window for PDF. Allow popups.'); return }
                                                                                w.document.write(html)
                                                                                w.document.close()
                                                                            }}
                                                                            className="bg-slate-50 text-slate-700 border border-slate-200"
                                                                        >
                                                                            Download PDF
                                                                        </Button>
                                                                </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

                // Helper: render a simple printable HTML receipt (inline styles for portability)
                function renderReceiptHtml(payment, { isWorker, autoPdf = false } = {}) {
                        const created = new Date(payment.createdAt).toLocaleString('en-IN')
                        const receiptNo = payment.receiptNumber || payment.transactionId
                        const amount = `₹${payment.amount}`
                        const jobTitle = payment.job?.title || '-'
                        const jobLocation = payment.job?.location || '-'

                            // full-page / A4 friendly layout and optional auto-PDF generation
                            return `
                    <!doctype html>
                    <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width,initial-scale=1" />
                        <title>Payment Receipt - ${receiptNo}</title>
                        <style>
                            @page { size: A4; margin: 12mm }
                            html,body{height:100%;margin:0}
                            body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827;background:#f3f4f6}
                            .container{box-sizing:border-box;width:100%;min-height:100vh;padding:28mm 18mm 18mm 18mm;background:white}
                            .header{background:linear-gradient(90deg,#6366f1,#a78bfa);color:white;padding:18px;border-radius:6px}
                            .title{font-size:20px;margin:0}
                            .muted{color:#6b7280}
                            .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
                            .card{background:#fafafa;padding:12px;border-radius:6px;border:1px solid #eef2ff}
                            .amount{font-size:36px;font-weight:700;color:#059669}
                            .small{font-size:13px;color:#374151}
                            .mono{font-family: ui-monospace,SFMono-Regular,Menlo,monospace;background:#f3f4f6;padding:6px;border-radius:4px}
                            .noprint{display:block}
                            @media print{ .noprint{display:none} .container{padding:12mm} }
                        </style>
                            ${autoPdf ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>' : ''}
                    </head>
                    <body>
                        <div id="receipt" class="container">
                            <div class="header">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                                    <div>
                                        <h1 class="title">Payment Receipt</h1>
                                        <div class="small">Transaction ID: ${payment.transactionId}</div>
                                    </div>
                                    <div style="text-align:right">
                                        <div class="small">${payment.status?.toUpperCase() || ''}</div>
                                        <div class="mono" style="margin-top:8px">Receipt No: ${receiptNo}</div>
                                    </div>
                                </div>
                            </div>

                            <div style="display:flex;justify-content:center;margin-top:18px">
                                <div>
                                    <div class="small">Amount Paid</div>
                                    <div class="amount">${amount}</div>
                                </div>
                            </div>

                            <div class="grid">
                                <div>
                                    <h4 class="small">${isWorker ? 'Received From' : 'Paid To'}</h4>
                                    <div class="card">
                                        <div style="font-weight:600">${isWorker ? escapeHtml(payment.employer?.fullname) : escapeHtml(payment.worker?.fullname) || '-'}</div>
                                        <div class="small">${escapeHtml(isWorker ? payment.employer?.email : payment.worker?.email) || '-'}</div>
                                        <div class="small">${escapeHtml(isWorker ? payment.employer?.phoneNumber : payment.worker?.phoneNumber) || '-'}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="small">Job Details</h4>
                                    <div class="card">
                                        <div style="font-weight:600">${escapeHtml(jobTitle)}</div>
                                        <div class="small">${escapeHtml(jobLocation)}</div>
                                        ${payment.job?.salary ? `<div class="small">Salary: ₹${payment.job.salary}</div>` : ''}
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top:16px" class="card">
                                <div class="small">Payment Method</div>
                                <div style="font-weight:600">${escapeHtml((payment.paymentMethod || '').replace('_',' '))}</div>
                                <div style="margin-top:8px" class="small">Payment Type: ${escapeHtml(payment.paymentType || '-')}</div>
                                <div style="margin-top:8px" class="small">Transaction Date: ${created}</div>
                                ${payment.razorpayPaymentId ? `<div class="small" style="margin-top:8px">Payment ID: <span class="mono">${payment.razorpayPaymentId}</span></div>` : ''}
                                ${payment.cashCollectedBy ? `<div class="small" style="margin-top:8px">Cash Collected By: ${escapeHtml(payment.cashCollectedBy)}</div>` : ''}
                                ${payment.notes ? `<div style="margin-top:8px" class="small">Notes: ${escapeHtml(payment.notes)}</div>` : ''}
                            </div>

                            <div style="margin-top:14px;text-align:center" class="small muted">Generated on ${new Date().toLocaleString('en-IN')}</div>
                            <div style="margin-top:12px;text-align:center" class="noprint">
                                <button onclick="window.print()" style="padding:8px 12px;border-radius:6px;background:#6366f1;color:white;border:none;cursor:pointer">Print</button>
                            </div>
                        </div>
                            ${autoPdf ? `
                                <script>
                                    (function(){
                                        function generate(){
                                            const element = document.getElementById('receipt');
                                            const opt = { margin: 12, filename: 'receipt-${receiptNo}.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
                                            html2pdf().set(opt).from(element).save().then(()=>{ setTimeout(()=>{ window.close(); }, 700); });
                                        }
                                        if (window.html2pdf) generate();
                                        else { document.addEventListener('DOMContentLoaded', generate); }
                                    })();
                                </script>
                            ` : ''}
                    </body>
                    </html>
                            `
                }

                function escapeHtml(str){
                        if (!str) return ''
                        return String(str).replace(/[&<>"']/g, function (s) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s] })
                }

                export default PaymentDetails
