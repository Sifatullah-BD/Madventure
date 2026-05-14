import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, HeadphonesIcon } from 'lucide-react';

const PaymentFail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center items-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={40} />
                </div>
                
                <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-500 mb-6">
                    We couldn't process your payment. No charges were made to your account. Please try again.
                </p>

                {bookingId && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-sm">
                        <span className="text-gray-500 block mb-1">Attempted Booking ID</span>
                        <span className="font-mono text-gray-800">{bookingId}</span>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-[#1B5E20] hover:bg-green-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = 'mailto:support@madventure.com'}
                        className="w-full bg-orange-50 hover:bg-orange-100 text-secondary font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <HeadphonesIcon size={18} /> Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
