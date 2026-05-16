import React from 'react';
import { X, AlertTriangle, CloudRain, ShieldCheck, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SafetyModal = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-slate-800 transition-colors duration-300">
                <div className="bg-action p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={24} />
                        <div>
                            <h2 className="text-lg font-heading font-bold">{language === 'bn' ? 'সেফটি সেন্টার' : 'Safety Center'}</h2>
                            <p className="text-orange-100 text-xs">{language === 'bn' ? 'লাইভ আপডেট' : 'Live Updates'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Live Alert Status */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-800 dark:text-green-300">{language === 'bn' ? 'আপনি নিরাপদ' : 'You are Safe'}</h3>
                            <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                                {language === 'bn' ? 'বর্তমান অবস্থান:' : 'Current Location:'} <span className="font-semibold">{language === 'bn' ? 'সিলেট, বাংলাদেশ' : 'Sylhet, Bangladesh'}</span>
                            </p>
                            <p className="text-green-600 dark:text-green-500 text-xs mt-1">{language === 'bn' ? 'এই এলাকায় কোনো নিরাপত্তা ঝুঁকি নেই।' : 'No security threats reported in this area.'}</p>
                        </div>
                    </div>

                    {/* Weather Alert */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                            <CloudRain size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-800 dark:text-blue-300">{language === 'bn' ? 'আবহাওয়া আপডেট' : 'Weather Update'}</h3>
                            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                                {language === 'bn' ? 'বিকেল ৪টার দিকে হালকা বৃষ্টির সম্ভাবনা।' : 'Light rain expected around 4:00 PM.'}
                            </p>
                            <p className="text-blue-600 dark:text-blue-500 text-xs mt-1">{language === 'bn' ? 'তাপমাত্রা: ২৮°সে • আর্দ্রতা: ৭৫%' : 'Temperature: 28°C • Humidity: 75%'}</p>
                        </div>
                    </div>

                    {/* Emergency Actions */}
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-action" /> {language === 'bn' ? 'জরুরি যোগাযোগ' : 'Emergency Contacts'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-950/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 py-3 rounded-lg font-bold transition-colors">
                                <Phone size={18} /> {language === 'bn' ? 'পুলিশ (৯৯৯)' : 'Police (999)'}
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-950/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 py-3 rounded-lg font-bold transition-colors">
                                <Phone size={18} /> {language === 'bn' ? 'অ্যাম্বুলেন্স' : 'Ambulance'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800">
                    {language === 'bn' ? 'আপনার নিরাপত্তার জন্য লোকেশন ট্র্যাকিং সচল আছে।' : 'Location tracking is active for your safety.'}
                </div>
            </div>
        </div>
    );
};

export default SafetyModal;
