import { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2, Upload, IndianRupee, Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        companyName: "",
        advancePayment: "",
        logo: null
    });
    const [logoPreview, setLogoPreview] = useState(null);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, logo: file });
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const registerNewCompany = async () => {
        if (!input.companyName) {
            toast.error("Company name is required");
            return;
        }

        const formData = new FormData();
        formData.append("companyName", input.companyName);
        formData.append("advancePayment", input.advancePayment || 0);
        if (input.logo) {
            formData.append("file", input.logo);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to register company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <Navbar />
            <div className='max-w-4xl mx-auto py-10 px-4'>
                {/* Header Section */}
                <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-indigo-100 p-3 rounded-full'>
                            <Building2 className='w-8 h-8 text-indigo-600' />
                        </div>
                        <div>
                            <h1 className='font-bold text-3xl text-gray-800'>Register Your Company</h1>
                            <p className='text-gray-500 mt-1'>Create a company profile to start posting jobs</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className='bg-white rounded-lg shadow-md p-8'>
                    <div className='space-y-6'>
                        {/* Company Name */}
                        <div>
                            <Label htmlFor="companyName" className="text-base font-semibold text-gray-700">
                                Company Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                type="text"
                                name="companyName"
                                className="mt-2"
                                placeholder="e.g., ABC Construction Company"
                                value={input.companyName}
                                onChange={changeEventHandler}
                                autoComplete="organization"
                            />
                            <p className='text-sm text-gray-500 mt-1'>This will be displayed to job seekers</p>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <Label htmlFor="logo" className="text-base font-semibold text-gray-700">
                                Company Logo
                            </Label>
                            <div className='mt-2'>
                                <div className='flex items-center gap-4'>
                                    {/* Preview */}
                                    <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden'>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" className='w-full h-full object-cover' />
                                        ) : (
                                            <Upload className='w-8 h-8 text-gray-400' />
                                        )}
                                    </div>
                                    {/* Upload Button */}
                                    <div className='flex-1'>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={changeFileHandler}
                                            className="cursor-pointer"
                                        />
                                        <p className='text-sm text-gray-500 mt-1'>
                                            Upload a square image (PNG, JPG, max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advance Payment */}
                        <div>
                            <Label htmlFor="advancePayment" className="text-base font-semibold text-gray-700">
                                Advance Payment for Laborers
                            </Label>
                            <div className='relative mt-2'>
                                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <IndianRupee className='w-5 h-5 text-gray-400' />
                                </div>
                                <Input
                                    id="advancePayment"
                                    type="number"
                                    name="advancePayment"
                                    className="pl-10"
                                    placeholder="0"
                                    min="0"
                                    value={input.advancePayment}
                                    onChange={changeEventHandler}
                                />
                            </div>
                            <p className='text-sm text-gray-500 mt-1'>
                                Optional: Specify the advance payment amount you offer to workers
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                            <div className='flex gap-3'>
                                <div className='flex-shrink-0'>
                                    <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-blue-800'>Quick Tip</h3>
                                    <p className='text-sm text-blue-700 mt-1'>
                                        You can update company details, add description, website, and location after registration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-3 mt-8'>
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={registerNewCompany}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Creating...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate