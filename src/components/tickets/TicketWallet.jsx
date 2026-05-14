import React from 'react';
import { QrCode, Download, Share2, Calendar, Clock, MapPin } from 'lucide-react';

const TicketWallet = ({ ticket }) => {
    if (!ticket) return null;

    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
            {/* Top Section: Operator & Route */}
            <div className="bg-[#1B5E20] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">Green Line</h3>
                    <p className="text-green-100 text-sm">AC Business Class</p>

                    <div className="flex items-center justify-between mt-6">
                        <div>
                            <p className="text-xs text-green-200 mb-1">From</p>
                            <p className="font-bold text-lg">{ticket.from}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 border-t border-dashed border-green-300/50"></div>
                            <Clock size={14} className="text-green-200 my-1" />
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-green-200 mb-1">To</p>
                            <p className="font-bold text-lg">{ticket.to}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Details */}
            <div className="p-6 space-y-6 relative">
                {/* Cutout effect */}
                <div className="absolute top-0 left-0 w-4 h-8 bg-gray-100 rounded-r-full -mt-4"></div>
                <div className="absolute top-0 right-0 w-4 h-8 bg-gray-100 rounded-l-full -mt-4"></div>
                <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-gray-200 -mt-[1px]"></div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Date</p>
                        <div className="flex items-center gap-2 text-gray-900 font-bold">
                            <Calendar size={16} className="text-[#1B5E20]" />
                            <span>{ticket.date}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <div className="flex items-center gap-2 text-gray-900 font-bold">
                            <Clock size={16} className="text-[#1B5E20]" />
                            <span>{ticket.time}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Seats</p>
                        <p className="text-gray-900 font-bold">{ticket.seats.join(', ')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">PNR</p>
                        <p className="text-gray-900 font-bold tracking-wider">{ticket.pnr}</p>
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                        <QrCode size={120} className="text-gray-900" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Scan at counter</p>
                </div>
            </div>

            {/* Bottom Section: Actions */}
            <div className="bg-gray-50 p-4 flex gap-4">
                <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                    <Download size={16} />
                    Download
                </button>
                <button className="flex-1 py-3 bg-[#1B5E20] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-colors shadow-lg shadow-green-900/10">
                    <Share2 size={16} />
                    Share
                </button>
            </div>
        </div>
    );
};

export default TicketWallet;
