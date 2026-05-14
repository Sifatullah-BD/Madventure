import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const BookingSlip = ({ bookingId, paymentMode = 'SSLCommerz Digital Gateway', status = 'PAID' }) => {
    return (
        <div className="p-8 pb-4">
            <div className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-100 pb-6 mb-6 border-dashed">
                <div className="flex-1 w-full text-center md:text-left">
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Booking Reference</span>
                    <span className="font-mono text-xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded inline-block">
                        {bookingId || 'MDV-XXXXXX'}
                    </span>
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
