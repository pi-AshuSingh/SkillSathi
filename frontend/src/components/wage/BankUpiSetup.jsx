import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Building2, CreditCard, Smartphone, Save, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { WAGE_API_END_POINT, USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'

const BankUpiSetup = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [bankDetails, setBankDetails] = useState({
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: ''
    })

    const [upiDetails, setUpiDetails] = useState({
        upiId: '',
        upiName: ''
    })

    const [loadingBank, setLoadingBank] = useState(false)
    const [loadingUpi, setLoadingUpi] = useState(false)

    useEffect(() => {
        if (user?.profile?.bankDetails) {
            setBankDetails({
                accountHolderName: user.profile.bankDetails.accountHolderName || '',
                accountNumber: user.profile.bankDetails.accountNumber || '',
                ifscCode: user.profile.bankDetails.ifscCode || '',
                bankName: user.profile.bankDetails.bankName || '',
                branchName: user.profile.bankDetails.branchName || ''
            })
        }

        if (user?.profile?.upiDetails) {
            setUpiDetails({
                upiId: user.profile.upiDetails.upiId || '',
                upiName: user.profile.upiDetails.upiName || ''
            })
        }
    }, [user])

    const handleBankChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value })
    }

    const handleUpiChange = (e) => {
        setUpiDetails({ ...upiDetails, [e.target.name]: e.target.value })
    }

    const handleBankSubmit = async (e) => {
        e.preventDefault()
        setLoadingBank(true)

        try {
            const response = await axios.put(
                `${WAGE_API_END_POINT}/bank-details`,
                bankDetails,
                { withCredentials: true }
            )

            if (response.data.success) {
                toast.success('Bank details updated successfully')
                
                // Update user in Redux store
                const userResponse = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                })
                if (userResponse.data.success) {
                    dispatch(setUser(userResponse.data.user))
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to update bank details')
        } finally {
            setLoadingBank(false)
        }
    }

    const handleUpiSubmit = async (e) => {
        e.preventDefault()
        setLoadingUpi(true)

        try {
            const response = await axios.put(
                `${WAGE_API_END_POINT}/upi-details`,
                upiDetails,
                { withCredentials: true }
            )

            if (response.data.success) {
                toast.success('UPI details updated successfully')
                
                // Update user in Redux store
                const userResponse = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                })
                if (userResponse.data.success) {
                    dispatch(setUser(userResponse.data.user))
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to update UPI details')
        } finally {
            setLoadingUpi(false)
        }
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-lg border p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Details Setup</h1>
                    <p className="text-gray-600 mb-8">Add your bank and UPI details to receive payments</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bank Details Form */}
                        <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <div className="flex items-center gap-2 mb-6">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
                            </div>

                            <form onSubmit={handleBankSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                                    <Input
                                        id="accountHolderName"
                                        name="accountHolderName"
                                        type="text"
                                        value={bankDetails.accountHolderName}
                                        onChange={handleBankChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <Input
                                        id="accountNumber"
                                        name="accountNumber"
                                        type="text"
                                        value={bankDetails.accountNumber}
                                        onChange={handleBankChange}
                                        placeholder="1234567890"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ifscCode">IFSC Code</Label>
                                    <Input
                                        id="ifscCode"
                                        name="ifscCode"
                                        type="text"
                                        value={bankDetails.ifscCode}
                                        onChange={handleBankChange}
                                        placeholder="SBIN0001234"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input
                                        id="bankName"
                                        name="bankName"
                                        type="text"
                                        value={bankDetails.bankName}
                                        onChange={handleBankChange}
                                        placeholder="State Bank of India"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="branchName">Branch Name</Label>
                                    <Input
                                        id="branchName"
                                        name="branchName"
                                        type="text"
                                        value={bankDetails.branchName}
                                        onChange={handleBankChange}
                                        placeholder="Main Branch"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loadingBank}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loadingBank ? 'Saving...' : 'Save Bank Details'}
                                </Button>
                            </form>
                        </div>

                        {/* UPI Details Form */}
                        <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                            <div className="flex items-center gap-2 mb-6">
                                <Smartphone className="w-6 h-6 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-800">UPI Details</h2>
                            </div>

                            <form onSubmit={handleUpiSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="upiId">UPI ID</Label>
                                    <Input
                                        id="upiId"
                                        name="upiId"
                                        type="text"
                                        value={upiDetails.upiId}
                                        onChange={handleUpiChange}
                                        placeholder="yourname@paytm"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter your UPI ID (e.g., 9876543210@paytm)
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="upiName">UPI Registered Name</Label>
                                    <Input
                                        id="upiName"
                                        name="upiName"
                                        type="text"
                                        value={upiDetails.upiName}
                                        onChange={handleUpiChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loadingUpi}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loadingUpi ? 'Saving...' : 'Save UPI Details'}
                                </Button>

                                {/* Popular UPI Apps */}
                                <div className="mt-6 pt-6 border-t">
                                    <p className="text-xs text-gray-600 mb-3">Popular UPI Apps:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                            <span>PhonePe</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                            <CreditCard className="w-4 h-4 text-green-600" />
                                            <span>Google Pay</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                            <CreditCard className="w-4 h-4 text-purple-600" />
                                            <span>Paytm</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                            <CreditCard className="w-4 h-4 text-orange-600" />
                                            <span>BHIM</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <h3 className="font-semibold text-gray-800 mb-2">📌 Important Information</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Ensure all details are accurate to avoid payment failures</li>
                            <li>• Your bank and UPI details are securely stored and encrypted</li>
                            <li>• You can update these details anytime from your profile</li>
                            <li>• These details will be used for receiving wage payments</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankUpiSetup
