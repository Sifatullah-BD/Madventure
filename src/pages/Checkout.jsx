import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Lock, Tag, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import MFSPaymentModal from '../components/payment/MFSPaymentModal';
import { unicornService } from '../api/unicorn';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { notificationService } from '../services/notificationService';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [mfsModal, setMfsModal] = useState({ open: false, type: 'bkash' });
    
    // Coupon States
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [activeCoupon, setActiveCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const bookingDetails = location.state?.booking || {
        id: `mock_${Date.now()}`,
        amount: 2500,
        title: 'Sundarbans Adventure Pack',
        customerName: 'Demo User',
        customerPhone: '01711000000'
    };

    const [finalAmount, setFinalAmount] = useState(bookingDetails.amount);
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {
        let total = bookingDetails.amount || 0;
        
        // 1. Apply Coupon Discount
        if (activeCoupon) {
            let discount = 0;
            if (activeCoupon.discount_type === 'percentage') {
                discount = (total * activeCoupon.discount_value) / 100;
                if (activeCoupon.max_discount) discount = Math.min(discount, activeCoupon.max_discount);
            } else {
                discount = activeCoupon.discount_value;
            }
            total -= discount;
        }

        // 2. Apply Student/Group Discount
        if (isStudent || (bookingDetails.seats && bookingDetails.seats >= 5)) {
            total -= (total * 0.10); // 10% discount
        }

        setFinalAmount(Math.max(0, total));
    }, [activeCoupon, bookingDetails, isStudent]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const coupon = await unicornService.validateCoupon(couponCode, user?.id, bookingDetails.amount);
            setActiveCoupon(coupon);
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon');
            setActiveCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleMFSConfirm = async (data) => {
        setMfsModal({ ...mfsModal, open: false });
        setLoading(true);
        try {
            if (isSupabaseConfigured && bookingDetails.id) {
                // Mark booking as confirmed in DB for MFS
                await supabase
                    .from('bookings')
                    .update({ 
                        booking_status: 'confirmed', 
                        payment_status: 'completed',
                        payment_method: data.method,
                        transaction_id: data.trxId
                    })
                    .eq('id', bookingDetails.id);
            }
            
            // Send WhatsApp/SMS Notification (Simulated)
            await notificationService.sendWhatsAppNotification(bookingDetails.customerPhone, bookingDetails.id, finalAmount);
            
            setTimeout(() => {
                navigate('/payment-success', { state: { booking_id: bookingDetails.id, amount: finalAmount, method: data.method, isStudent } });
            }, 1000);
        } catch (error) {
            console.error("MFS Confirmation error", error);
            navigate('/payment-fail');
        }
    };

    const handleSSLPayment = async () => {
        setLoading(true);
        try {
            if (bookingDetails.scheduleId) {
                await unicornService.createBookingLock(user?.id, bookingDetails.scheduleId, bookingDetails.seats || 1);
            }

            if (!isSupabaseConfigured) {
                setTimeout(() => {
                    navigate('/payment-success', { state: { booking_id: bookingDetails.id, amount: finalAmount } });
                }, 1500);
                return;
            }

            const { data, error } = await supabase.functions.invoke('initiate-payment', {
                body: { 
                    bookingId: bookingDetails.id, 
                    amount: finalAmount,
                    couponId: activeCoupon?.id,
                    cus_name: bookingDetails.customerName,
                    cus_email: bookingDetails.customerEmail || user?.email || 'customer@example.com',
                    cus_phone: bookingDetails.customerPhone
                }
            });

            if (error) throw error;
            if (data?.GatewayPageURL) {
                window.location.href = data.GatewayPageURL;
            } else {
                throw new Error("Invalid SSL response");
            }
        } catch (error) {
            console.error('Payment Error:', error);
            navigate('/payment-fail');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center items-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-8 text-white text-center">
                    <ShieldCheck size={56} className="mx-auto mb-3 opacity-90" />
                    <h2 className="text-2xl font-black font-heading tracking-tight">Secure Checkout</h2>
                    <p className="text-green-100 mt-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                        <Lock size={14} /> Unicorn-Grade Encryption
                    </p>
                </div>

                <div className="p-8">
                    {/* Order Summary */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wide">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{bookingDetails.title}</span>
                                <span className="text-gray-900 font-bold">৳{bookingDetails.amount}</span>
                            </div>
                            
                            {activeCoupon && (
                                <div className="flex justify-between text-sm text-green-600 font-bold animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-1">
                                        <Tag size={14} />
                                        <span>Discount ({activeCoupon.code})</span>
                                    </div>
                                    <span>-৳{bookingDetails.amount - finalAmount}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xl font-black border-t border-gray-200 pt-4 mt-2">
                                <span className="text-gray-900">Total</span>
                                <span className="text-primary">৳{finalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Student / Group Discount */}
                    <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <input 
                            type="checkbox" 
                            id="studentCheck" 
                            checked={isStudent} 
                            onChange={(e) => setIsStudent(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                            <label htmlFor="studentCheck" className="text-sm font-bold text-blue-900 cursor-pointer">
                                Apply Student Discount (10%)
                            </label>
                            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                                You must present a valid student ID during the tour. <br/>
                                <span className="font-semibold">(Groups of 5+ get automatic 10% discount)</span>
                            </p>
                        </div>
                    </div>

                    {/* Student / Group Discount */}
                    <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <input 
                            type="checkbox" 
                            id="studentCheck" 
                            checked={isStudent} 
                            onChange={(e) => setIsStudent(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                            <label htmlFor="studentCheck" className="text-sm font-bold text-blue-900 cursor-pointer">
                                Apply Student Discount (10%)
                            </label>
                            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                                You must present a valid student ID during the tour. <br/>
                                <span className="font-semibold">(Groups of 5+ get automatic 10% discount)</span>
                            </p>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button 
                            onClick={() => setMfsModal({ open: true, type: 'bkash' })}
                            className="bg-[#E2136E] text-white p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform shadow-md"
                        >
                            <img src="/bkash-icon.png" className="w-8 h-8 hidden" alt=""/>
                            <span className="text-2xl font-black">b</span>
                            <span className="text-xs">bKash</span>
                        </button>
                        <button 
                            onClick={() => setMfsModal({ open: true, type: 'nagad' })}
                            className="bg-[#F7941E] text-white p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform shadow-md"
                        >
                            <span className="text-2xl font-black">n</span>
                            <span className="text-xs">Nagad</span>
                        </button>
                    </div>

                    {/* SSLCommerz Fallback */}
                    <button
                        onClick={handleSSLPayment}
                        disabled={loading}
                        className={`w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 mb-8 ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                            <>
                                <CreditCard size={20} />
                                Pay via SSLCommerz
                            </>
                        )}
                    </button>

                    {/* Coupon Section */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Promo Code</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Code"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                                />
                            </div>
                            <button 
                                onClick={handleApplyCoupon}
                                disabled={couponLoading || !couponCode}
                                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                {couponLoading ? '...' : 'Apply'}
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center mb-6 font-medium leading-relaxed">
                        By proceeding, you agree to our terms. Inventory will be <span className="text-primary font-bold">locked for 10 minutes</span>.
                    </p>
                    
                    <button onClick={() => navigate(-1)} className="w-full text-gray-400 font-bold hover:text-red-500 transition-colors text-xs uppercase tracking-widest">
                        Cancel Transaction
                    </button>
                </div>
            </div>

            <MFSPaymentModal 
                isOpen={mfsModal.open}
                type={mfsModal.type}
                amount={finalAmount}
                onClose={() => setMfsModal({ ...mfsModal, open: false })}
                onConfirm={handleMFSConfirm}
            />
        </div>
    );
};

export default Checkout;
