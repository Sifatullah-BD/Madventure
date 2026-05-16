import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, MapPin, Phone, MessageCircle, X, ShieldAlert } from 'lucide-react';
import { EMERGENCY } from '../../data/madventure-data';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { supabaseService } from '../../services/supabaseService';

const SOSButton = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [activated, setActivated] = useState(false);

    const pressTimer = useRef(null);
    const progressInterval = useRef(null);

    const triggerSOS = async (pos) => {
        try {
            await supabaseService.sendSOS({
                user_id: user?.id,
                full_name: user?.full_name || 'Anonymous Traveler',
                phone: user?.phone || 'Unknown',
                location_lat: pos?.lat,
                location_lng: pos?.lng,
                status: 'pending'
            });
            console.log("SOS Signal Sent to Backend");
        } catch (e) {
            console.error("Failed to log SOS:", e);
        }
    };

    const startPress = () => {
        setIsPressing(true);
        setProgress(0);
        if (navigator.vibrate) navigator.vibrate([10]);

        progressInterval.current = setInterval(() => {
            setProgress(p => (p >= 100 ? 100 : p + 3.33));
        }, 100);

        pressTimer.current = setTimeout(() => {
            clearInterval(progressInterval.current);
            setActivated(true);
            setIsOpen(true);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            
            // Try to get location and trigger
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const l = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setLocation(l);
                    triggerSOS(l);
                });
            } else {
                triggerSOS(null);
            }
        }, 3000);
    };

    const stopPress = () => {
        setIsPressing(false);
        setProgress(0);
        clearTimeout(pressTimer.current);
        clearInterval(progressInterval.current);
    };

    const handleShareLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const l = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setLocation(l);
                    setIsLocating(false);
                    triggerSOS(l);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    setIsLocating(false);
                }
            );
        }
    };

    const districtData = EMERGENCY['cox-bazar'];

    return (
        <>
        <>
            <div className="relative flex flex-col items-center">
                {isPressing && !isOpen && (
                    <div className="absolute inset-0 pointer-events-none scale-[1.3] z-[-1] flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="28" cy="28" r="24" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="4" fill="none" />
                            <circle 
                                cx="28" cy="28" r="24" 
                                stroke="#ef4444" strokeWidth="4" fill="none" 
                                strokeDasharray="150" 
                                strokeDashoffset={150 - (progress / 100) * 150} 
                                className="transition-all duration-100 ease-linear"
                            />
                        </svg>
                    </div>
                )}

                <button
                    onMouseDown={startPress}
                    onMouseUp={stopPress}
                    onMouseLeave={stopPress}
                    onTouchStart={startPress}
                    onTouchEnd={stopPress}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative
                        ${isPressing ? 'bg-red-700 scale-95' : 'bg-red-600 animate-pulse hover:scale-110'}`}
                >
                    <AlertTriangle size={24} className={isPressing ? 'animate-bounce' : ''} />
                    
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-wider shadow-lg">
                        SOS
                    </span>
                </button>
                
                {progress > 0 && progress < 100 && (
                    <div className="absolute -bottom-6 text-[10px] font-bold text-red-600 bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm z-20">
                        {Math.round(progress)}%
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="relative bg-red-600 text-white p-6 text-center flex-shrink-0">
                            <button onClick={() => { setIsOpen(false); setActivated(false); setProgress(0); }} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full">
                                <X size={20} />
                            </button>
                            <div className="mx-auto w-20 h-20 bg-white text-red-600 rounded-full flex items-center justify-center mb-4 relative">
                                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                                <ShieldAlert size={40} className="relative z-10" />
                            </div>
                            <h2 className="text-3xl font-black mb-1">{activated ? t('sos.sent') : t('sos.trigger')}</h2>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col gap-3">
                                <h3 className="font-bold text-red-900 text-sm flex items-center gap-2">
                                    <MapPin size={16}/> {t('common.search')} (Location)
                                </h3>
                                {location ? (
                                    <p className="text-sm font-medium text-red-700 bg-red-100 p-3 rounded-xl border border-red-200">
                                        Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                                    </p>
                                ) : (
                                    <button onClick={handleShareLocation} disabled={isLocating} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">
                                        {isLocating ? t('common.loading') : 'Share Location'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <a href="tel:999" className="bg-gray-900 text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2">
                                    <Phone size={24} className="text-red-500" />
                                    <span>Call 999</span>
                                </a>
                                <button className="bg-[#25D366] text-white p-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2"
                                    onClick={() => {
                                        const locStr = location ? `Lat: ${location.lat}, Lng: ${location.lng}` : "Unknown";
                                        window.open(`https://wa.me/8801700000000?text=SOS! I am in danger. Location: ${locStr}`, '_blank');
                                    }}
                                >
                                    <MessageCircle size={24} />
                                    <span>WhatsApp Help</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;
