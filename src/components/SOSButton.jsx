import React, { useState } from 'react';
import { AlertTriangle, Phone, X, MapPin, MessageSquare } from 'lucide-react';

const SOSButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [isActive, setIsActive] = useState(false);

    const handleTrigger = () => {
        setIsOpen(true);
        setIsActive(true);
        let timer = 5;
        setCountdown(5);

        const interval = setInterval(() => {
            timer -= 1;
            setCountdown(timer);
            if (timer === 0) {
                clearInterval(interval);
                // Mock sending alert
            }
        }, 1000);
    };

    const handleCancel = () => {
        setIsActive(false);
        setIsOpen(false);
        setCountdown(5);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleTrigger}
                className="fixed bottom-32 right-0 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-l-xl shadow-lg transition-all transform hover:-translate-x-1 group"
                title="Emergency SOS"
            >
                <AlertTriangle size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Emergency SOS
                </span>
            </button>

            {/* SOS Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-bounce-in">
                        <div className="bg-red-600 p-4 text-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-700 opacity-50 animate-ping"></div>
                            <AlertTriangle size={48} className="mx-auto mb-2 relative z-10" />
                            <h2 className="text-2xl font-bold relative z-10">SOS TRIGGERED</h2>
                            <p className="text-red-100 text-sm relative z-10">Alerting contacts & authorities in</p>
                            <div className="text-5xl font-black mt-1 relative z-10">{countdown}</div>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <MapPin className="text-red-500" size={20} />
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Current Location</p>
                                    <p className="font-medium text-sm text-gray-800">Lat: 23.8103, Long: 90.4125</p>
                                    <p className="text-[10px] text-gray-400">Dhaka, Bangladesh</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
                                    <Phone size={18} /> Call Tourist Police (999)
                                </button>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
                                    <MessageSquare size={18} /> Message Emergency Contacts
                                </button>
                            </div>

                            <button
                                onClick={handleCancel}
                                className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-xl font-bold transition-colors text-sm"
                            >
                                I'm Safe - Cancel Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;
