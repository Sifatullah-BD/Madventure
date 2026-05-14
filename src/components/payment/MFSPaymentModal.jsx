import React, { useState, useEffect } from 'react';
import { X, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MFSPaymentModal = ({ isOpen, onClose, onConfirm, amount, type = 'bkash' }) => {
    const [step, setStep] = useState(1); // 1: Number, 2: OTP, 3: PIN
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    const config = {
        bkash: { color: '#E2136E', logo: '/bkash-logo.png', name: 'bKash' },
        nagad: { color: '#F7941E', logo: '/nagad-logo.png', name: 'Nagad' }
    }[type] || { color: '#E2136E', logo: '', name: 'MFS' };

    const handleNext = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (step < 3) setStep(step + 1);
            else {
                onConfirm({ method: type, transactionId: 'MFS' + Math.floor(Math.random() * 1000000) });
            }
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div style={{ backgroundColor: config.color }} className="p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black" style={{ color: config.color }}>{config.name[0]}</span>
                    </div>
                    <h2 className="text-xl font-bold">{config.name} Payment</h2>
                    <p className="text-white/80 text-sm">Amount: ৳{amount}</p>
                </div>

                <div className="p-6 space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Enter {config.name} Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="tel" 
                                            placeholder="01XXXXXXXXX"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#E2136E]/20"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center italic">By clicking next, you agree to the terms and conditions.</p>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center">
                                <p className="text-sm text-gray-600">A verification code has been sent to <span className="font-bold">{phoneNumber}</span></p>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                />
                                <button className="text-xs font-bold" style={{ color: config.color }}>Resend Code</button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase text-center mb-2">Enter your Secret PIN</label>
                                <input 
                                    type="password" 
                                    maxLength="5"
                                    placeholder="XXXXX"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="w-full text-center text-2xl font-black tracking-[0.5em] py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                />
                                <div className="flex items-center justify-center gap-2 text-[10px] text-green-600 font-bold">
                                    <ShieldCheck size={14} /> Secured by 128-bit encryption
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={handleNext}
                        disabled={loading || (step === 1 && phoneNumber.length < 11) || (step === 2 && otp.length < 6) || (step === 3 && pin.length < 4)}
                        style={{ backgroundColor: config.color }}
                        className="w-full py-4 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:brightness-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (step === 3 ? 'Confirm Payment' : 'Next')}
                    </button>
                </div>

                <div className="p-4 bg-gray-50 text-center border-t border-gray-100 flex items-center justify-center gap-4 grayscale opacity-50">
                    <span className="text-[10px] font-bold">PCI-DSS Compliant</span>
                    <span className="text-[10px] font-bold">Verified by VISA</span>
                </div>
            </motion.div>
        </div>
    );
};

export default MFSPaymentModal;
