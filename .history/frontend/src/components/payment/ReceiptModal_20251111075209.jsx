/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

const ReceiptModal = ({ open, setOpen, payment, isWorker }) => {
  const contentRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // lazy-load html2pdf when needed
    let script
    if (generating) {
      if (!window.html2pdf) {
        script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js'
        script.async = true
        script.onload = () => {
          setTimeout(doGenerate, 200)
        }
        document.body.appendChild(script)
      } else {
        setTimeout(doGenerate, 50)
      }
    }

    function doGenerate() {
      if (!contentRef.current) { setGenerating(false); return }
      const element = contentRef.current
      const opt = { margin: 12, filename: `receipt-${payment.transactionId}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }
      try {
        // html2pdf returns a promise
        window.html2pdf().set(opt).from(element).save().then(() => {
          setGenerating(false)
          toast.success('PDF downloaded')
        }).catch((e) => { console.error(e); setGenerating(false); toast.error('Failed to generate PDF') })
      } catch (e) {
        console.error(e)
        setGenerating(false)
        toast.error('PDF generation failed')
      }
    }

    return () => { if (script) document.body.removeChild(script) }
  }, [generating])

  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>View or download receipt for this transaction.</DialogDescription>
        </DialogHeader>

        <div ref={contentRef} className="p-4 bg-white rounded shadow space-y-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white rounded">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold">Payment Receipt</h3>
                <div className="text-sm">Transaction ID: {payment.transactionId}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{payment.status?.toUpperCase()}</div>
                <div className="font-mono">Receipt: {payment.receiptNumber || payment.transactionId}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">Amount Paid</div>
            <div className="text-3xl font-bold text-green-700">₹{payment.amount}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">{isWorker ? 'Received From' : 'Paid To'}</div>
              <div className="font-semibold">{isWorker ? payment.employer?.fullname : payment.worker?.fullname}</div>
              <div className="text-sm text-gray-600">{isWorker ? payment.employer?.email : payment.worker?.email}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">Job</div>
              <div className="font-semibold">{payment.job?.title}</div>
              <div className="text-sm text-gray-600">{payment.job?.location}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end mt-4">
          <Button onClick={() => setOpen(false)} variant="outline">Close</Button>
          <Button onClick={() => { setGenerating(true) }} disabled={generating}>{generating ? 'Generating...' : 'Download PDF'}</Button>
          <Button onClick={() => window.print()} variant="ghost">Print</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReceiptModal
