import React from 'react';
import { User, Mail, Smartphone, MessageSquare, MapPin, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const EditProfile = ({ profileForm, setProfileForm, handleUpdateProfile, loading }) => {
    const { language } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    const travelStyles = [
        "Adventure", "Nature", "Beach", "Cultural", "Photography", "Luxury", "Backpacking"
    ];

    const toggleStyle = (style) => {
        const styles = profileForm.travelStyles || [];
        if (styles.includes(style)) {
            setProfileForm({ ...profileForm, travelStyles: styles.filter(s => s !== style) });
        } else {
            setProfileForm({ ...profileForm, travelStyles: [...styles, style] });
        }
    };

    return (
        <motion.div 
            key="account"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-8"
        >
            <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-10">{language === 'bn' ? 'বেসিক তথ্য' : 'Basic Information'}</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'সম্পূর্ণ নাম' : 'Full Name'}</label>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                                <User size={18} className="text-forest-light" />
                                <input 
                                    type="text" 
                                    value={profileForm.name} 
                                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                    className="bg-transparent border-none outline-none w-full text-white font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'ইউজারনেম' : 'Username'}</label>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                                <span className="text-forest-light font-black">@</span>
                                <input 
                                    type="text" 
                                    value={profileForm.username} 
                                    onChange={e => setProfileForm({...profileForm, username: e.target.value})}
                                    className="bg-transparent border-none outline-none w-full text-white font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 opacity-50">
                                <Mail size={18} className="text-forest-light" />
                                <input type="email" value={profileForm.email} readOnly className="bg-transparent border-none outline-none w-full text-white font-bold cursor-not-allowed" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'ফোন নাম্বার' : 'Phone Number'}</label>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                                <Smartphone size={18} className="text-forest-light" />
                                <input 
                                    type="text" 
                                    value={profileForm.phone} 
                                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                                    className="bg-transparent border-none outline-none w-full text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'বায়ো / বিবরণ' : 'Bio / Description'}</label>
                        <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                            <MessageSquare size={18} className="text-forest-light mt-1" />
                            <textarea 
                                value={profileForm.bio} 
                                onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                className="bg-transparent border-none outline-none w-full text-white font-bold h-24 resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'লোকেশন' : 'Location'}</label>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                            <MapPin size={18} className="text-forest-light" />
                            <input 
                                type="text" 
                                value={profileForm.location || ''} 
                                onChange={e => setProfileForm({...profileForm, location: e.target.value})}
                                placeholder="E.g., Dhaka, Bangladesh"
                                className="bg-transparent border-none outline-none w-full text-white font-bold"
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Travel Information */}
            <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-6">{language === 'bn' ? 'ট্রাভেল ইনফরমেশন' : 'Travel Information'}</h3>
                <p className="text-gray-400 text-sm mb-8">
                    {language === 'bn' ? 'আপনার ট্রাভেল প্রিফারেন্স আপডেট করুন, যাতে আমরা আপনাকে সেরা ট্যুর প্যাকেজ সাজেস্ট করতে পারি।' : 'Update your travel preferences so we can suggest the best tour packages for you.'}
                </p>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'ট্রাভেল স্টাইল' : 'Travel Style'}</label>
                        <div className="flex flex-wrap gap-3">
                            {travelStyles.map(style => {
                                const isSelected = profileForm.travelStyles?.includes(style);
                                return (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => toggleStyle(style)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                            isSelected 
                                            ? 'bg-forest-light/20 border-forest-light text-forest-light' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {isSelected && "✓ "} {style}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'বাজেট প্রিফারেন্স' : 'Budget Preference'}</label>
                        <select 
                            value={profileForm.budgetPreference || ''} 
                            onChange={e => setProfileForm({...profileForm, budgetPreference: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-forest-light/50 transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-800">Select Budget...</option>
                            <option value="budget" className="bg-slate-800">Budget / Backpacker</option>
                            <option value="mid" className="bg-slate-800">Mid-range / Comfort</option>
                            <option value="luxury" className="bg-slate-800">Luxury / Premium</option>
                        </select>
                    </div>
                </div>

                <div className="pt-10 flex justify-end">
                    <button 
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="bg-forest-light hover:bg-green-600 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-forest-light/20 transition-all flex items-center gap-3"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : (language === 'bn' ? 'সেভ করুন' : 'Save Information')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default EditProfile;
