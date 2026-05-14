import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { logEvent } from '../api/analytics';
import { awardXP, grantAchievement } from '../api/rewards';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const { user } = useAuth();

    useEffect(() => {
        if (bookingId && user?.id) {
            logEvent('payment_success', { booking_id: bookingId }, user.id);
            
            // Award 100 XP for successful booking
            awardXP(user.id, 100);
            
            // If it's their first booking, grant 'first_trip'
            grantAchievement(user.id, 'first_trip');
        }
    }, [bookingId, user?.id]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center items-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-6">
                    Your booking has been confirmed successfully. A confirmation email has been sent to your registered address.
                </p>

                {bookingId && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm">
                        <span className="text-gray-500 block mb-1">Booking Reference</span>
                        <span className="font-mono font-bold text-gray-900">{bookingId}</span>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-[#1B5E20] hover:bg-green-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FileText size={18} /> View My Bookings
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
