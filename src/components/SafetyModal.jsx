import React from 'react';
import { X, AlertTriangle, CloudRain, ShieldCheck, Phone } from 'lucide-react';

const SafetyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-action p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={24} />
                        <div>
                            <h2 className="text-lg font-heading font-bold">Safety Center</h2>
                            <p className="text-orange-100 text-xs">Live Updates</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Live Alert Status */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-800">You are Safe</h3>
                            <p className="text-green-700 text-sm mt-1">
                                Current Location: <span className="font-semibold">Sylhet, Bangladesh</span>
                            </p>
                            <p className="text-green-600 text-xs mt-1">No security threats reported in this area.</p>
                        </div>
                    </div>

                    {/* Weather Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <CloudRain size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-800">Weather Update</h3>
                            <p className="text-blue-700 text-sm mt-1">
                                Light rain expected around 4:00 PM.
                            </p>
                            <p className="text-blue-600 text-xs mt-1">Temperature: 28°C • Humidity: 75%</p>
                        </div>
                    </div>

                    {/* Emergency Actions */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-action" /> Emergency Contacts
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg font-bold transition-colors">
                                <Phone size={18} /> Police (999)
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg font-bold transition-colors">
                                <Phone size={18} /> Ambulance
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                    Location tracking is active for your safety.
                </div>
            </div>
        </div>
    );
};

export default SafetyModal;
