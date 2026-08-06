import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { services } from '@/lib/initServices';

const BookingSlip = ({ bookingId, paymentMode = 'SSLCommerz Digital Gateway', status = 'PAID' }) => {
    useEffect(() => {
        // Request FCM token and store in Supabase
        const getTokenAndSave = async () => {
            const token = await services.firebaseMessaging.requestForToken();
            if (token && services.isSupabaseConfigured) {
                const { error } = await services.supabase
                    .from('device_tokens')
                    .insert([{ token, created_at: new Date().toISOString() }]);
                if (error) console.warn('Failed to store FCM token:', error);
            }
        };
        getTokenAndSave();
    }, []);
    const serial = bookingId?.split('-')[1] || 'XXXXXX';
    return (
                <div className="p-8 pb-4 bg-gradient-to-br from-green-900 via-green-800 to-green-700 rounded-2xl backdrop-blur-lg border border-green-800/30 shadow-xl animate-fade-in duration-500 ease-out">
            <div className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-100 pb-6 mb-6 border-dashed">
                <div className="flex-1 w-full text-center md:text-left">
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Booking Reference</span>
                    <span className="font-mono text-xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded inline-block">
                        {bookingId || 'MDV-XXXXXX'}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Serial: {serial}</p>
                    <p className="text-xs text-gray-400 mt-2">Issued on: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="bg-white p-2 border border-gray-100 rounded-xl shadow-sm shrink-0">
                    <QRCodeSVG
                        value={`https://madventure.com/verify/${bookingId || 'test'}`}
                        size={100}
                        bgColor={"#ffffff"}
                        fgColor={"#1f2937"}
                        level={"L"}
                    />
                </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600 mb-8">
                <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${status === 'PAID' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>
                        {status}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="font-medium text-gray-800">{paymentMode}</span>
                </div>
            </div>
        </div>
    );
};

export default BookingSlip;
