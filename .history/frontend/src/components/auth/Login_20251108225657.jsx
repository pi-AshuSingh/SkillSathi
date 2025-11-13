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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Briefcase, Sparkles, ArrowRight } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        console.log("Login attempt started with data:", { 
            email: input.email, 
            hasPassword: !!input.password, 
            role: input.role 
        });
        
        // Validate required fields
        if (!input.email || !input.password || !input.role) {
            const missing = [];
            if (!input.email) missing.push("email");
            if (!input.password) missing.push("password");
            if (!input.role) missing.push("role");
            console.error("Missing fields:", missing);
            toast.error(`Please fill all required fields: ${missing.join(", ")}`);
            return;
        }
        
        try {
            dispatch(setLoading(true));
            console.log("Sending login request to:", `${USER_API_END_POINT}/login`);
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            console.log("Login response:", res.data);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            console.error("Error response:", error?.response?.data);
            const errorMsg = error?.response?.data?.message || error.message || "Login failed. Please try again.";
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
            <Navbar />
            <div className='flex items-center justify-center px-4 py-12'>
                <div className='w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center'>
                    {/* Left Side - Branding */}
                    <div className='hidden md:block space-y-8'>
                        <div className='space-y-4'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg'>
                                <Sparkles className='w-4 h-4' />
                                <span>Welcome Back</span>
                            </div>
                            <h1 className='text-5xl font-extrabold leading-tight'>
                                <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                                    Sign in to
                                    <br />
                                    SkillSathi
                                </span>
                            </h1>
                            <p className='text-lg text-gray-600 leading-relaxed'>
                                Continue your journey towards finding the perfect job or hiring the right talent for your organization.
                            </p>
                        </div>

                        {/* Features */}
                        <div className='space-y-4'>
                            <div className='flex items-start gap-3 group'>
                                <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md'>
                                    <User className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Personalized Dashboard</h3>
                                    <p className='text-sm text-gray-600'>Track applications, wages, and opportunities</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3 group'>
                                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md'>
                                    <Briefcase className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Job Matching</h3>
                                    <p className='text-sm text-gray-600'>AI-powered job recommendations</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3 group'>
                                <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md'>
                                    <Sparkles className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Secure Payments</h3>
                                    <p className='text-sm text-gray-600'>Transparent wage tracking and payments</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className='p-6 bg-white rounded-2xl shadow-lg border border-gray-200'>
                            <p className='text-gray-700 italic mb-3'>
                                "SkillSathi transformed how I find work. The transparency and fair payments make all the difference!"
                            </p>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                                    RK
                                </div>
                                <div>
                                    <p className='font-semibold text-gray-800'>Rajesh Kumar</p>
                                    <p className='text-sm text-gray-500'>Construction Worker</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20'></div>
                        <form onSubmit={submitHandler} className='relative bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-2xl space-y-6'>
                            <div className='text-center space-y-2'>
                                <h2 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                    Login
                                </h2>
                                <p className='text-gray-600'>Enter your credentials to access your account</p>
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Mail className='w-4 h-4 text-indigo-600' />
                                    Email Address
                                </Label>
                                <div className='relative group'>
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all text-base'
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label className='text-gray-700 font-medium flex items-center gap-2'>
                                    <Lock className='w-4 h-4 text-indigo-600' />
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className='pl-4 pr-4 py-6 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all text-base'
                                />
                            </div>

                            {/* Role Selection */}
                            <div className='space-y-3'>
                                <Label className='text-gray-700 font-medium'>Select Role</Label>
                                <RadioGroup className="grid grid-cols-2 gap-3">
                                    <div 
                                        onClick={() => setInput({...input, role: 'student'})}
                                        className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            input.role === 'student' 
                                                ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
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
                                                ? 'border-purple-600 bg-purple-50 shadow-md' 
                                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
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

                            {/* Submit Button */}
                            {
                                loading ? (
                                    <Button disabled className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg">
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                        Signing you in...
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        Sign In
                                        <ArrowRight className='w-5 h-5' />
                                    </Button>
                                )
                            }

                            {/* Sign Up Link */}
                            <div className='text-center pt-4 border-t border-gray-200'>
                                <span className='text-gray-600'>Don't have an account? </span>
                                <Link to="/signup" className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors'>
                                    Create Account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login