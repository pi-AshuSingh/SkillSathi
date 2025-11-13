import { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        
        console.log("Signup attempt started with data:", { 
            fullname: input.fullname,
            email: input.email,
            phoneNumber: input.phoneNumber,
            hasPassword: !!input.password,
            role: input.role,
            hasFile: !!input.file
        });
        
        // Validate required fields
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role) {
            const missing = [];
            if (!input.fullname) missing.push("full name");
            if (!input.email) missing.push("email");
            if (!input.phoneNumber) missing.push("phone number");
            if (!input.password) missing.push("password");
            if (!input.role) missing.push("role");
            console.error("Missing fields:", missing);
            toast.error(`Please fill all required fields: ${missing.join(", ")}`);
            return;
        }
        
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            console.log("Sending registration request to:", `${USER_API_END_POINT}/register`);
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            console.log("Registration response:", res.data);
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error response:", error?.response?.data);
            const errorMsg = error?.response?.data?.message || error.message || "Registration failed. Please try again.";
            toast.error(errorMsg);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50'>
            <Navbar />
            <div className='flex items-center justify-center px-4 py-8'>
                <div className='w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center'>
                    {/* Left Side - Branding */}
                    <div className='hidden md:block space-y-8'>
                        <div className='space-y-4'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg'>
                                <Sparkles className='w-4 h-4' />
                                <span>Join SkillSathi</span>
                            </div>
                            <h1 className='text-5xl font-extrabold leading-tight'>
                                <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'>
                                    Start Your
                                    <br />
                                    Success Story
                                </span>
                            </h1>
                            <p className='text-lg text-gray-600 leading-relaxed'>
                                Create your account and unlock opportunities for fair employment and economic empowerment.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className='space-y-3'>
                            <div className='flex items-center gap-3'>
                                <CheckCircle2 className='w-6 h-6 text-green-600' />
                                <span className='text-gray-700'>Free account creation in under 2 minutes</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <CheckCircle2 className='w-6 h-6 text-green-600' />
                                <span className='text-gray-700'>Access to thousands of job opportunities</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <CheckCircle2 className='w-6 h-6 text-green-600' />
                                <span className='text-gray-700'>Secure and transparent payment system</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <CheckCircle2 className='w-6 h-6 text-green-600' />
                                <span className='text-gray-700'>Track wages and earnings in real-time</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className='grid grid-cols-3 gap-4'>
                            <div className='text-center p-4 bg-white rounded-2xl shadow-md'>
                                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>10K+</div>
                                <div className='text-xs text-gray-600'>Users</div>
                            </div>
                            <div className='text-center p-4 bg-white rounded-2xl shadow-md'>
                                <div className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>500+</div>
                                <div className='text-xs text-gray-600'>Companies</div>
                            </div>
                            <div className='text-center p-4 bg-white rounded-2xl shadow-md'>
                                <div className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent'>98%</div>
                                <div className='text-xs text-gray-600'>Success</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur opacity-20'></div>
                        <form onSubmit={submitHandler} className='relative bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-2xl space-y-5'>
                            <div className='text-center space-y-2'>
                                <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                                    Create Account
                                </h2>
                                <p className='text-gray-600'>Join thousands of empowered workers</p>
                            </div>

                            {/* Full Name */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <User className='w-4 h-4 text-purple-600' />
                                    Full Name
                                </Label>
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all text-base'
                                />
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Mail className='w-4 h-4 text-purple-600' />
                                    Email Address
                                </Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all text-base'
                                />
                            </div>

                            {/* Phone */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Phone className='w-4 h-4 text-purple-600' />
                                    Phone Number
                                </Label>
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="+91 XXXXXXXXXX"
                                    autoComplete="tel"
                                    className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all text-base'
                                />
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Lock className='w-4 h-4 text-purple-600' />
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all text-base'
                                />
                            </div>

                            {/* Role Selection */}
                            <div className='space-y-3'>
                                <Label className='text-gray-700 font-medium'>I am a</Label>
                                <RadioGroup className="grid grid-cols-2 gap-3">
                                    <div 
                                        onClick={() => setInput({...input, role: 'student'})}
                                        className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            input.role === 'student' 
                                                ? 'border-purple-600 bg-purple-50 shadow-md' 
                                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                                        }`}
                                    >
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="w-4 h-4"
                                        />
                                        <Label className='cursor-pointer font-medium'>Job Seeker</Label>
                                    </div>
                                    <div 
                                        onClick={() => setInput({...input, role: 'recruiter'})}
                                        className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            input.role === 'recruiter' 
                                                ? 'border-pink-600 bg-pink-50 shadow-md' 
                                                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                                        }`}
                                    >
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="w-4 h-4"
                                        />
                                        <Label className='cursor-pointer font-medium'>Local Head</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* File Upload */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Upload className='w-4 h-4 text-purple-600' />
                                    Profile Photo (Optional)
                                </Label>
                                <div className='relative'>
                                    <Input
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-xl p-4 transition-all"
                                    />
                                    {input.file && (
                                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-green-600'>
                                            <CheckCircle2 className='w-5 h-5' />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            {
                                loading ? (
                                    <Button disabled className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg">
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                        Creating your account...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        Create Account
                                        <ArrowRight className='w-5 h-5' />
                                    </Button>
                                )
                            }

                            {/* Login Link */}
                            <div className='text-center pt-4 border-t border-gray-200'>
                                <span className='text-gray-600'>Already have an account? </span>
                                <Link to="/login" className='text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors'>
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup