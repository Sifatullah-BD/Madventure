import React from 'react';
import { Trophy, Users, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const ProfileOverview = ({ profileData, socialStats, onApplyVerification }) => {
    const { language } = useLanguage();
    
    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    const badges = [
        { icon: "🏔️", label: language === 'bn' ? "মাউন্টেন কিং" : "Mountain King" },
        { icon: "🏖️", label: language === 'bn' ? "বিচ লাভার" : "Beach Lover" },
        { icon: "📸", label: language === 'bn' ? "টপ ভিজুয়ালিস্ট" : "Top Visualist" },
        { icon: "🤝", label: language === 'bn' ? "হেল্পফুল হ্যান্ড" : "Helpful Hand" },
        { icon: "🔥", label: language === 'bn' ? "৭ দিনের স্ট্রিক" : "7 Day Streak" }
    ];

    return (
        <motion.div 
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0d1a11] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
                        {language === 'bn' ? 'মোট পয়েন্ট' : 'Total Points'}
                    </p>
                    <div className="flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={24} />
                        <h3 className="text-3xl font-black text-white">{profileData.xp} XP</h3>
                    </div>
                </div>
                <div className="bg-[#0d1a11] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
                        {language === 'bn' ? 'ফলোয়ার' : 'Followers'}
                    </p>
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-500" size={24} />
                        <h3 className="text-3xl font-black text-white">{socialStats.followers}</h3>
                    </div>
                </div>
                <div className="bg-[#0d1a11] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">
                        {language === 'bn' ? 'এক্সপ্লোরেশন লেভেল' : 'Exploration Level'}
                    </p>
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-forest-light" size={24} />
                        <h3 className="text-3xl font-black text-white">Lvl {profileData.level}</h3>
                    </div>
                </div>
            </div>

            {/* Verification Card */}
            <div className="bg-gradient-to-r from-forest-light to-green-700 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white">
                            {language === 'bn' ? 'ভেরিফাইড ট্রাভেলার হোন' : 'Become a Verified Traveler'}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {language === 'bn' ? 'ব্লু টিক মার্ক পান এবং ট্রাভেল কমিউনিটিতে ট্রাস্ট বাড়ান।' : 'Get the blue checkmark and increase trust in the community.'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onApplyVerification}
                    className="bg-white text-forest-light px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all shadow-xl whitespace-nowrap"
                >
                    {language === 'bn' ? 'এপ্লাই করুন' : 'Apply Now'}
                </button>
            </div>

            {/* Achievements */}
            <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        <Award className="text-forest-light" />
                        {language === 'bn' ? 'আপনার ব্যাজসমূহ' : 'Your Badges'}
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-forest-light/30 transition-all cursor-pointer group">
                            <span className="text-4xl mb-4 group-hover:scale-125 transition-transform">{badge.icon}</span>
                            <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">{badge.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileOverview;
