import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Mail, Sparkles } from 'lucide-react'
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
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Logout failed');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    const getGradientColor = (name) => {
        if (!name) return 'from-gray-500 to-gray-600';
        const colors = ['from-blue-500 to-indigo-600','from-purple-500 to-pink-600','from-green-500 to-teal-600','from-orange-500 to-red-600','from-cyan-500 to-blue-600'];
        return colors[name.charCodeAt(0) % colors.length];
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
            <div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between'>
                <Link to='/' className='flex items-center gap-3'>
                    <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-md shadow'>
                        <Sparkles className='w-6 h-6' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold'>Skill<span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Sathi</span></h1>
                        <p className='text-xs text-gray-500'>Connecting workers with opportunities</p>
                    </div>
                </Link>

                <nav className='hidden md:flex items-center gap-6'>
                    <Link to='/' className={`text-sm ${isActive('/') ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>Home</Link>
                    <Link to='/jobs' className={`text-sm ${isActive('/jobs') ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>Jobs</Link>
                    <Link to='/browse' className={`text-sm ${isActive('/browse') ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}>Browse</Link>
                </nav>

                <div className='flex items-center gap-3'>
                    {!user ? (
                        <div className='hidden md:flex items-center gap-2'>
                            <Link to='/login'><Button variant='outline' className='border-indigo-600 text-indigo-600'>Login</Button></Link>
                            <Link to='/signup'><Button className='bg-gradient-to-r from-indigo-600 to-purple-600'>Signup</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className='cursor-pointer'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback className={`bg-gradient-to-r ${getGradientColor(user?.fullname)} text-white font-bold`}>{getInitials(user?.fullname)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className='w-72 p-0'>
                                <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white rounded-t-lg'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='h-12 w-12'><AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} /><AvatarFallback className={`bg-gradient-to-r ${getGradientColor(user?.fullname)} text-white font-bold`}>{getInitials(user?.fullname)}</AvatarFallback></Avatar>
                                        <div>
                                            <div className='font-semibold'>{user?.fullname}</div>
                                            <div className='text-xs text-indigo-100 flex items-center gap-1'><Mail className='w-3 h-3' />{user?.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4 bg-white rounded-b-lg'>
                                    {user?.profile?.bio && <div className='mb-3 text-sm text-gray-700'>{user.profile.bio}</div>}
                                    <div className='flex flex-col gap-2'>
                                        <Link to='/wage-dashboard'><Button variant='ghost' className='justify-start text-gray-700'>Wage Dashboard</Button></Link>
                                        <Link to='/payments'><Button variant='ghost' className='justify-start text-gray-700'>Payment History</Button></Link>
                                        <Button variant='ghost' className='justify-start text-red-600' onClick={logoutHandler}>Logout</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <button className='md:hidden p-2 rounded-md' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
                        <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <div className='md:hidden absolute left-4 right-4 top-16 bg-white rounded-lg shadow-lg p-4 z-50'>
                        <ul className='flex flex-col gap-3'>
                            <li><Link to='/' onClick={() => setMobileOpen(false)}>Home</Link></li>
                            <li><Link to='/jobs' onClick={() => setMobileOpen(false)}>Jobs</Link></li>
                            <li><Link to='/browse' onClick={() => setMobileOpen(false)}>Browse</Link></li>
                            {!user ? (
                                <>
                                    <li><Link to='/login' onClick={() => setMobileOpen(false)}>Login</Link></li>
                                    <li><Link to='/signup' onClick={() => setMobileOpen(false)}>Signup</Link></li>
                                </>
                            ) : (
                                <li><button onClick={() => { logoutHandler(); setMobileOpen(false); }} className='text-left w-full'>Logout</button></li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar
