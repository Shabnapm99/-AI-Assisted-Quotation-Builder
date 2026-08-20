import { useState } from 'react';
import { HiOutlineMail } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { toast } from 'react-toastify';
import { axiosInstance } from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthState } from '../features/userSlice';

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault();
        loginUser();
    }

    const loginUser = async () => {
        try {
            setLoading(true);
            let response = await axiosInstance.post('/auth/login', { email, password });
            if (response.status === 200) {
                dispatch(setAuthState({
                    isLoggedin: true,
                    authUser: response?.data?.user
                }))
                setEmail('');
                setPassword('');
                navigate('/dashboard/clients');
                toast.success("LoggedIn successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-0'>
            <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
                <div className='absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-surface-container-highest rounded-full blur-[120px] opacity-50'></div>
                <div className='absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-primary-fixed rounded-full blur-[100px] opacity-30'></div>
            </div>

            {/* Login container */}

            <main className='relative z-10 w-full max-w-120'>

                <div className="flex flex-col items-center mb-stack-lg animate-subtle-float">
                    {/* icon */}
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                        <img src='/images/apple-touch-icon.png' alt='Brandicon' className='w-full h-full object-fit' />
                    </div>
                    <h1 className="text-[24px] text-on-surface tracking-tight">QuoteAI</h1>
                    <p className="text-[14px] text-on-surface-variant uppercase tracking-widest mt-1">Enterprise Edition</p>
                </div>
                {/* Login Card*/}
                <div className='bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12'>
                    <div className='mb-8'>
                        <h2 className="font-[20px] text-[20px] text-on-surface">Welcome back</h2>
                        <p className="text-[16px] text-on-surface-variant mt-2">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form className='space-y-4' onSubmit={handleSubmit} noValidate>

                        {/* email section */}
                        <div>
                            <label className="block font-[14px] text-[14px] text-on-surface-variant mb-2" htmlFor="email">Email address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"><HiOutlineMail /></span>
                                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-[16px] text-[16px] text-on-surface focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:text-outline/50"
                                    id="email" name="email" placeholder="admin@example.com" required="" type="email"
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        {/* Password section */}

                        <div>
                            <label className="block font-[14px] text-[14px] text-on-surface-variant mb-2" htmlFor="password">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"><MdLockOutline /></span>
                                <input className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-[16px] text-[16px]
                                 text-on-surface focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:text-outline/50"
                                    id="password" name="password" placeholder="password123" required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <button 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer" 
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}>
                                    <span className="text-[20px]">
                                        {showPassword ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/* Actions */}

                        <div className="flex items-center justify-between py-2">
                            <label className="flex items-center cursor-pointer group">
                                <input className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/30"
                                    type="checkbox" />
                                <span
                                    className="ml-2 font-[14px] text-[14px] text-on-surface-variant group-hover:text-on-surface transition-colors">Remember
                                    me</span>
                            </label>
                            <a className="font-[14px] text-[14px] text-secondary hover:text-on-secondary-fixed-variant transition-colors"
                                href="#">Forgot password?</a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            className="w-full bg-primary py-4 rounded-lg font-[16px] text-[16px] text-on-primary flex items-center justify-center gap-2 hover:bg-on-primary-fixed transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                            type="submit" disabled={loading}>
                            <span>{loading ? "Signing In...." : "Sign In"}</span>
                            <span className="material-symbols-outlined text-[18px]"><FaArrowRight /></span>
                        </button>

                    </form>

                    <div className="mt-8 pt-4 border-t border-outline-variant/30 text-center">
                        <p className="font-[14px] text-[14px] text-on-surface-variant">
                            Don't have an account? <a
                                className="font-[14px] text-[14px] text-on-surface hover:underline decoration-secondary underline-offset-4 cursor-pointer"
                                href="#">Contact your administrator.</a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 flex justify-center gap-8">
                    <a className="font-[12px] text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                        href="#">Privacy Policy</a>
                    <a className="font-[12px] text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                        href="#">Terms of Service</a>
                    <a className="font-[12px] text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                        href="#">Support</a>
                </footer>
            </main>
        </div>
    )
}

export default Login





