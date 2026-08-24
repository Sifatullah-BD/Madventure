import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Smartphone, ChevronRight, Github, Facebook, Chrome as Google, Compass, Mountain, Map, Camera, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { analytics, trackEvent } from '../services/analyticsService';
import { useToast } from './ui/Toast';

const Wallet = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>;

const STYLES = [
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'trekking', label: 'Trekking', icon: Compass },
    { id: 'luxury', label: 'Luxury', icon: Map },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'camping', label: 'Camping', icon: Camera }
];

const ACCOUNT_TYPES = [
    { id: 'traveler', label: 'Traveler', description: 'Plan trips and discover Bangladesh' },
    { id: 'guide', label: 'Local Guide', description: 'Offer local knowledge and guided trips' },
    { id: 'agency', label: 'Tour Agency', description: 'Publish tours and manage bookings' },
    { id: 'hotel_owner', label: 'Hotel / Resort', description: 'List stays for travelers' },
    { id: 'partner', label: 'Business Partner', description: 'Offer travel services and products' },
];

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const { login, register, signInWithGoogle } = useAuth();
    const toast = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1: Auth, 2: Personalization
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [accountType, setAccountType] = useState('traveler');
    const [loading, setLoading] = useState(false);

    // Password strength derived during render (no effect needed)
    const passwordStrength = (() => {
        let strength = 0;
        if (password.length > 6) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    })();

    // Close on Escape + lock body scroll while open
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const toggleStyle = (id) => {
        setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleNext = () => {
        if (isLogin) {
            handleSubmit();
        } else {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const { user, error } = await login(email, password);
                if (error) throw error;
                if (user) {
                    analytics.loginSuccess('email');
                    onLogin(user);
                }
            } else {
                const { user, error } = await register(email, password, { name, phone, gender, styles: selectedStyles, accountType });
                if (error) throw error;
                if (user) {
                    trackEvent('user_register', { method: 'email' });
                    onLogin(user);
                }
            }
        } catch (error) {
            toast.error(error.message || 'Authentication Error');
        } finally {
            setLoading(false);
            onClose();
            setStep(1); // Reset for next time
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 sm:p-6 overflow-hidden" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a140d] rounded-[2.5rem] shadow-[0_0_100px_rgba(34,197,94,0.1)] w-full max-w-4xl min-h-[600px] max-h-[90vh] flex overflow-hidden border border-white/5 relative"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Brand & Visuals */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0d1a11]">
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-light/20 to-transparent"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=800&q=80" 
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        alt="Adventure"
                    />
                    
                    <div className="relative z-10 p-10 flex flex-col justify-between h-full">
                        <div>
                            <img src="/madventure-logo-v2.png" alt="Logo" className="h-8 w-auto mb-8 opacity-90" />
                            <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-4">
                                EXPLORE <br />
                                <span className="text-forest-light">THE UNKNOWN</span>
                            </h2>
                            <p className="text-gray-400 text-lg font-medium max-w-xs leading-relaxed">
                                Join our community of 50,000+ travelers exploring the hidden gems of Bangladesh.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                <div className="w-12 h-12 rounded-xl bg-forest-light/20 flex items-center justify-center text-forest-light">
                                    <Heart size={24} className="fill-current" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm uppercase tracking-widest">Trust & Safety</p>
                                    <p className="text-gray-500 text-xs">Verified partners for every trip.</p>
                                </div>
                            </div>
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0d1a11] overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#0d1a11] bg-forest-light flex items-center justify-center text-xs font-black text-[#0d1a11]">
                                    +5k
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated Glow */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -bottom-20 -left-20 w-80 h-80 bg-forest-light blur-[100px] -z-10 rounded-full"
                    />
                </div>

                {/* Right Side: Glassmorphic Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center relative bg-[#0a140d] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full"
                            >
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-white tracking-tighter mb-2">
                                        {isLogin ? 'WELCOME BACK' : 'START JOURNEY'}
                                    </h3>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        {isLogin ? 'Please enter your details to sign in' : 'Create an account to explore with us'}
                                    </p>
                                </div>

                                {/* Social Logins */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {[
                                        { icon: Google, label: 'Google', color: 'bg-white/5 border-white/5 hover:bg-white/10', action: signInWithGoogle },
                                        { icon: Facebook, label: 'FB', color: 'bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20' },
                                        { icon: Github, label: 'Apple', color: 'bg-white/5 border-white/5 hover:bg-white/10' }
                                    ].map((social, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={social.action}
                                            className={`${social.color} border py-3 rounded-2xl flex items-center justify-center transition-all group`}
                                        >
                                            <social.icon size={20} className="text-white/60 group-hover:text-white transition-colors" />
                                        </button>
                                    ))}
                                </div>

                                <div className="relative flex items-center mb-8">
                                    <div className="flex-grow border-t border-white/5"></div>
                                    <span className="flex-shrink mx-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">OR EMAIL</span>
                                    <div className="flex-grow border-t border-white/5"></div>
                                </div>

                                <form className="space-y-5">
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-forest-light transition-colors" size={20} />
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-forest-light/30 focus:bg-white/[0.07] text-white font-medium transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-forest-light transition-colors" size={20} />
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Password"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-14 outline-none focus:border-forest-light/30 focus:bg-white/[0.07] text-white font-medium transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        
                                        {!isLogin && (
                                            <div className="flex gap-1.5 px-1">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${passwordStrength >= (i * 25) ? 'bg-forest-light' : 'bg-white/5'}`}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {isLogin && (
                                        <div className="text-right">
                                            <button type="button" className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Forgot Password?</button>
                                        </div>
                                    )}

                                    {!isLogin && (
                                        <div className="flex items-start gap-3 mt-4">
                                            <input type="checkbox" className="mt-1 accent-forest-light" id="terms" required />
                                            <label htmlFor="terms" className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                                                I agree to the <span className="text-forest-light">Terms of Service</span> and <span className="text-forest-light">Privacy Policy</span>
                                            </label>
                                        </div>
                                    )}

                                    <button 
                                        type="button"
                                        onClick={handleNext}
                                        disabled={loading}
                                        className="w-full bg-forest-light hover:bg-green-600 text-[#0a140d] font-black py-5 rounded-2xl shadow-xl shadow-forest-light/10 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-8"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-[#0a140d] border-t-transparent rounded-full animate-spin"></div> : (
                                            <> {isLogin ? 'LOG IN' : 'CONTINUE'} <ChevronRight size={18} /> </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-10 text-center">
                                    <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                                        {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}{' '}
                                        <button 
                                            onClick={() => { setIsLogin(!isLogin); setStep(1); }}
                                            className="text-forest-light hover:underline ml-1"
                                        >
                                            {isLogin ? 'SIGN UP' : 'LOG IN'}
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="w-full"
                            >
                                <div className="mb-8">
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"
                                    >
                                        ← BACK TO LOGIN
                                    </button>
                                    <h3 className="text-3xl font-black text-white tracking-tighter mb-2">PERSONALIZE</h3>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Tell us about your travel style</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input 
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Full Name"
                                                required
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-forest-light/30 text-white text-sm transition-all"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                            <input 
                                                type="text"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                placeholder="Phone Number"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-forest-light/30 text-white text-sm transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Account Type</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {ACCOUNT_TYPES.map(type => (
                                                <button key={type.id} type="button" onClick={() => setAccountType(type.id)}
                                                    className={`text-left p-3 rounded-xl border transition-all ${accountType === type.id ? 'bg-forest-light/15 border-forest-light/60' : 'bg-white/5 border-white/5'}`}>
                                                    <span className={`block text-xs font-black ${accountType === type.id ? 'text-white' : 'text-gray-400'}`}>{type.label}</span>
                                                    <span className="block text-[10px] text-gray-500 mt-1">{type.description}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Gender</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Male', 'Female', 'Other'].map(g => (
                                                <button 
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setGender(g)}
                                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${gender === g ? 'bg-forest-light text-[#0a140d] border-forest-light' : 'bg-white/5 border-white/5 text-gray-500'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Travel Styles</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {STYLES.map(style => (
                                                <button 
                                                    key={style.id}
                                                    type="button"
                                                    onClick={() => toggleStyle(style.id)}
                                                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${selectedStyles.includes(style.id) ? 'bg-white/10 border-forest-light/50' : 'bg-white/5 border-white/5'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedStyles.includes(style.id) ? 'bg-forest-light text-[#0a140d]' : 'bg-white/10 text-gray-500'}`}>
                                                        <style.icon size={16} />
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedStyles.includes(style.id) ? 'text-white' : 'text-gray-500'}`}>{style.label}</span>
                                                    {selectedStyles.includes(style.id) && <CheckCircle2 size={12} className="ml-auto text-forest-light" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-forest-light hover:bg-green-600 text-[#0a140d] font-black py-5 rounded-2xl shadow-xl shadow-forest-light/10 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-4"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-[#0a140d] border-t-transparent rounded-full animate-spin"></div> : 'COMPLETE SIGNUP'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;
