import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase, Mail, Phone, Wallet, TrendingUp, Home, Search, Building2, Sparkles } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Logout failed');
        }
    }

    // Generate initials from fullname
    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Generate gradient color based on name
    const getGradientColor = (name) => {
        if (!name) return 'from-gray-500 to-gray-600';
        
        const colors = [
            'from-blue-500 to-indigo-600',
            'from-purple-500 to-pink-600',
            'from-green-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-cyan-500 to-blue-600',
            'from-pink-500 to-rose-600',
            'from-indigo-500 to-purple-600',
            'from-teal-500 to-green-600',
            'from-yellow-500 to-orange-600',
            'from-red-500 to-pink-600'
        ];
        
        const charCode = name.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <Link to="/" className='flex items-center gap-2 hover:opacity-80 transition-all duration-300 group'>
                    <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
                        <Sparkles className='w-6 h-6' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold'>
                            Skill<span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Sathi</span>
                        </h1>
                        <p className='text-xs text-gray-500 -mt-1'>Connecting workers with opportunities</p>
                    </div>
                </Link>
                <div className='flex items-center gap-4'>
                    {/* Desktop nav */}
                    <ul className='hidden md:flex font-medium items-center gap-8'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link 
                                            to="/admin/companies" 
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                                isActive('/admin/companies') 
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                                                    : 'hover:bg-indigo-50 hover:text-indigo-600'
                                            </ul>

                                            {/* Mobile hamburger */}
                                            <button
                                                className='md:hidden p-2 rounded-md hover:bg-gray-100'
                                                aria-label='Toggle menu'
                                                onClick={() => setMobileOpen(v => !v)}
                                            >
                                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                                                </svg>
                                            </button>
                                        >
                                            /* Desktop / Mobile content area */
                                            }
                                            {!user ? (
                                                <div className='hidden md:flex items-center gap-2'>
                                                    <Link to="/login">
                                                        <Button variant="outline" className='border-indigo-600 text-indigo-600 hover:bg-indigo-50'>
                                                            Login
                                                        </Button>
                                                    </Link>
                                                    <Link to="/signup">
                                                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
                                                            Signup
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Avatar className="cursor-pointer h-10 w-10 ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all">
                                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                            <AvatarFallback className={`bg-gradient-to-r ${getGradientColor(user?.fullname)} text-white font-bold text-sm`}>
                                                                {getInitials(user?.fullname)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 p-0 shadow-xl border-gray-200">
                                                        <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white'>
                                                            <div className='flex gap-3 items-center'>
                                                                <Avatar className="h-14 w-14 ring-4 ring-white">
                                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                                    <AvatarFallback className={`bg-gradient-to-r ${getGradientColor(user?.fullname)} text-white font-bold text-lg`}>
                                                                        {getInitials(user?.fullname)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className='flex-1'>
                                                                    <h4 className='font-semibold text-lg'>{user?.fullname}</h4>
                                                                    <p className='text-indigo-100 text-sm flex items-center gap-1'>
                                                                        <Mail className='w-3 h-3' />
                                                                        {user?.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                
                                                        <div className='p-4'>
                                                            {user?.profile?.bio && (
                                                                <div className='mb-4 pb-4 border-b border-gray-200'>
                                                                    <p className='text-sm text-gray-600 flex items-start gap-2'>
                                                                        <Briefcase className='w-4 h-4 mt-0.5 text-gray-400' />
                                                                        <span>{user?.profile?.bio}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                    
                                                            {user?.phoneNumber && (
                                                                <div className='mb-4 pb-4 border-b border-gray-200'>
                                                                    <p className='text-sm text-gray-600 flex items-center gap-2'>
                                                                        <Phone className='w-4 h-4 text-gray-400' />
                                                                        <span>{user?.phoneNumber}</span>
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className='flex flex-col gap-1'>
                                                                {user && user.role === 'student' && (
                                                                    <Link to="/profile">
                                                                        <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'>
                                                                            <User2 className='w-4 h-4 mr-2' />
                                                                            View Profile
                                                                        </Button>
                                                                    </Link>
                                                                )}
                                        
                                                                <Link to="/wage-dashboard">
                                                                    <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700'>
                                                                        <TrendingUp className='w-4 h-4 mr-2' />
                                                                        Wage Dashboard
                                                                    </Button>
                                                                </Link>

                                                                <Link to="/payments">
                                                                    <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700'>
                                                                        <Wallet className='w-4 h-4 mr-2' />
                                                                        Payment History
                                                                    </Button>
                                                                </Link>

                                                                <Button 
                                                                    onClick={logoutHandler} 
                                                                    variant="ghost" 
                                                                    className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
                                                                >
                                                                    <LogOut className='w-4 h-4 mr-2' />
                                                                    Logout
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )}

                                            {/* Mobile menu (small screens) */}
                                            {mobileOpen && (
                                                <div className='absolute right-4 top-16 w-64 bg-white rounded-lg shadow-lg p-4 md:hidden z-50'>
                                                    <ul className='flex flex-col gap-2'>
                                                        <li><Link to='/' onClick={() => setMobileOpen(false)}>Home</Link></li>
                                                        <li><Link to='/jobs' onClick={() => setMobileOpen(false)}>Jobs</Link></li>
                                                        <li><Link to='/browse' onClick={() => setMobileOpen(false)}>Browse</Link></li>
                                                        {!user ? (
                                                            <>
                                                                <li><Link to='/login' onClick={() => setMobileOpen(false)}>Login</Link></li>
                                                                <li><Link to='/signup' onClick={() => setMobileOpen(false)}>Signup</Link></li>
                                                            </>
                                                        ) : (
                                                            <li>
                                                                <button onClick={() => { logoutHandler(); setMobileOpen(false); }} className='text-left w-full'>Logout</button>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                                <p className='text-indigo-100 text-sm flex items-center gap-1'>
                                                    <Mail className='w-3 h-3' />
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='p-4'>
                                        {user?.profile?.bio && (
                                            <div className='mb-4 pb-4 border-b border-gray-200'>
                                                <p className='text-sm text-gray-600 flex items-start gap-2'>
                                                    <Briefcase className='w-4 h-4 mt-0.5 text-gray-400' />
                                                    <span>{user?.profile?.bio}</span>
                                                </p>
                                            </div>
                                        )}
                                        
                                        {user?.phoneNumber && (
                                            <div className='mb-4 pb-4 border-b border-gray-200'>
                                                <p className='text-sm text-gray-600 flex items-center gap-2'>
                                                    <Phone className='w-4 h-4 text-gray-400' />
                                                    <span>{user?.phoneNumber}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className='flex flex-col gap-1'>
                                            {user && user.role === 'student' && (
                                                <Link to="/profile">
                                                    <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'>
                                                        <User2 className='w-4 h-4 mr-2' />
                                                        View Profile
                                                    </Button>
                                                </Link>
                                            )}

                                            <Link to="/wage-dashboard">
                                                <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700'>
                                                    <TrendingUp className='w-4 h-4 mr-2' />
                                                    Wage Dashboard
                                                </Button>
                                            </Link>

                                            <Link to="/payments">
                                                <Button variant="ghost" className='w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700'>
                                                    <Wallet className='w-4 h-4 mr-2' />
                                                    Payment History
                                                </Button>
                                            </Link>

                                            <Button 
                                                onClick={logoutHandler} 
                                                variant="ghost" 
                                                className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
                                            >
                                                <LogOut className='w-4 h-4 mr-2' />
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar