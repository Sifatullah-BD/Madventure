import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Settings, Shield, LogOut, RefreshCw, Camera, 
    Trash2, Save, X, Loader2, Award, Users, TrendingUp,
    MapPin, Calendar, Heart, MessageSquare, Trophy, Star,
    Bell, Globe, Moon, CreditCard, HelpCircle, FileText, CheckCircle2,
    Lock, Smartphone, Mail, Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadImages } from '../services/storageService';
import { useToast } from '../components/ui/Toast';
import { getFollowStats, getUserAchievements, getLeaderboard } from '../services/communityService';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = ({ user, onLogout, onUpdateRole, onUpdateUser }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('overview');
    const [isUploading, setIsUploading] = useState(false);

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || 'User Name',
        username: user?.username || 'traveler_01',
        email: user?.email || '',
        phone: user?.phone || '+880 1XXX XXXXXX',
        bio: user?.bio || 'Travel enthusiast | Explorer | Photographer',
        location: user?.location || 'Dhaka, Bangladesh',
        avatar: user?.avatar || null
    });

    // Preferences State
    const [prefs, setPrefs] = useState({
        pushNotifications: true,
        emailAlerts: true,
        darkMode: true,
        language: 'Bengali'
    });

    // Social & Gamification State
    const [socialStats, setSocialStats] = useState({ followers: 0, following: 0 });
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [profileData, setProfileData] = useState({ xp: 0, level: 1, totalTrips: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await authService.getProfile(user.id);
                
                if (data) {
                    setProfileForm({
                        name: data.full_name || user.name || 'User Name',
                        username: data.username || user.username || 'traveler_01',
                        email: user.email || '',
                        phone: data.phone || user.phone || '',
                        bio: data.bio || '',
                        location: data.district ? `${data.district}, ${data.division}` : '',
                        avatar: data.avatar_url || user.avatar || null
                    });
                    
                    setProfileData({
                        xp: data.travel_score || 0,
                        level: Math.floor((data.travel_score || 0) / 100) + 1,
                        totalTrips: data.total_trips || 0
                    });

                    // In a full implementation, followers would come from a social graph query.
                    // For now, we initialize from DB if present, otherwise 0.
                    setSocialStats({
                        followers: data.followers_count || 0,
                        following: data.following_count || 0
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            await authService.updateProfile(user.id, {
                full_name: profileForm.name,
                phone: profileForm.phone,
                bio: profileForm.bio,
            });

            onUpdateUser({ ...user, ...profileForm });
            toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && user?.id) {
            setIsUploading(true);
            try {
                // Upload to Supabase Storage
                const { data, error } = await uploadImages('avatars', [file]);
                if (error) throw error;
                
                if (data && data[0]) {
                    const avatarUrl = data[0];
                    
                    // Update profiles table
                    await authService.updateProfile(user.id, { avatar_url: avatarUrl });

                    setProfileForm(prev => ({ ...prev, avatar: avatarUrl }));
                    onUpdateUser({ ...user, avatar: avatarUrl });
                    toast.success('ছবি আপডেট করা হয়েছে!');
                }
            } catch (err) {
                console.error(err);
                toast.error("ইমেজ আপলোড করতে সমস্যা হয়েছে।");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্টটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব হবে না।')) {
            toast.info('আপনার অ্যাকাউন্টটি ডিলিট করার রিকোয়েস্ট পাঠানো হয়েছে।');
            onLogout();
            navigate('/');
        }
    };

    // Tabs configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: <User size={18} /> },
        { id: 'account', label: 'Account Info', icon: <Settings size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
        { id: 'support', label: 'Support & Legal', icon: <HelpCircle size={18} /> },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-[#050f08] text-gray-100 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-[#0d1a11] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl sticky top-28">
                            <div className="flex flex-col items-center mb-10">
                                <div className="relative group mb-4">
                                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-forest-light/20 ring-4 ring-forest-light/5">
                                        {profileForm.avatar ? (
                                            <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-forest-light/10 flex items-center justify-center text-forest-light">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute -bottom-2 -right-2 bg-forest-light text-white p-2.5 rounded-2xl shadow-xl hover:bg-green-600 transition-all border-4 border-[#0d1a11]"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                <h2 className="text-xl font-black text-white">{profileForm.name}</h2>
                                <p className="text-gray-500 text-sm font-medium">@{profileForm.username}</p>
                                <div className="mt-4 flex gap-1">
                                    <span className="bg-forest-light/10 text-forest-light text-[10px] font-black px-3 py-1 rounded-full border border-forest-light/20 uppercase tracking-widest">PRO EXPLORER</span>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-forest-light text-white shadow-lg shadow-forest-light/20' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <button 
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
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
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Points</p>
                                            <div className="flex items-center gap-3">
                                                <Trophy className="text-yellow-500" size={24} />
                                                <h3 className="text-3xl font-black text-white">{profileData.xp} XP</h3>
                                            </div>
                                        </div>
                                        <div className="bg-[#0d1a11] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Followers</p>
                                            <div className="flex items-center gap-3">
                                                <Users className="text-blue-500" size={24} />
                                                <h3 className="text-3xl font-black text-white">{socialStats.followers}</h3>
                                            </div>
                                        </div>
                                        <div className="bg-[#0d1a11] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                                            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Exploration Level</p>
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
                                                <h3 className="text-xl font-black text-white">Become a Verified Guide</h3>
                                                <p className="text-white/80 text-sm">Get the blue checkmark and start earning from your expertise.</p>
                                            </div>
                                        </div>
                                        <button className="bg-white text-forest-light px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all shadow-xl">
                                            Apply Now
                                        </button>
                                    </div>

                                    {/* Achievements */}
                                    <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                                <Award className="text-forest-light" />
                                                Your Badges
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {[
                                                { icon: "🏔️", label: "Mountain King" },
                                                { icon: "🏖️", label: "Beach Lover" },
                                                { icon: "📸", label: "Top Visualist" },
                                                { icon: "🤝", label: "Helpful Hand" },
                                                { icon: "🔥", label: "7 Day Streak" }
                                            ].map((badge, i) => (
                                                <div key={i} className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-forest-light/30 transition-all cursor-pointer group">
                                                    <span className="text-4xl mb-4 group-hover:scale-125 transition-transform">{badge.icon}</span>
                                                    <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">{badge.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'account' && (
                                <motion.div 
                                    key="account"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl"
                                >
                                    <h3 className="text-2xl font-black text-white mb-10">প্রোফাইল সেটিংস (Account Info)</h3>
                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</label>
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
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Username</label>
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
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 opacity-50">
                                                    <Mail size={18} className="text-forest-light" />
                                                    <input type="email" value={profileForm.email} readOnly className="bg-transparent border-none outline-none w-full text-white font-bold cursor-not-allowed" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Phone Number</label>
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
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Bio / Description</label>
                                            <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-forest-light/50 transition-all">
                                                <MessageSquare size={18} className="text-forest-light mt-1" />
                                                <textarea 
                                                    value={profileForm.bio} 
                                                    onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                                                    className="bg-transparent border-none outline-none w-full text-white font-bold h-24 resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 flex justify-end">
                                            <button 
                                                type="submit"
                                                className="bg-forest-light hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-forest-light/20 transition-all flex items-center gap-3"
                                            >
                                                <Save size={18} />
                                                Save Information
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div 
                                    key="security"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="space-y-8"
                                >
                                    <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                            <Lock className="text-forest-light" />
                                            নিরাপত্তা ও গোপনীয়তা (Security)
                                        </h3>
                                        
                                        <div className="space-y-6">
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-forest-light/10 rounded-2xl flex items-center justify-center text-forest-light group-hover:bg-forest-light group-hover:text-white transition-all">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">Two-Factor Authentication</h4>
                                                        <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                                                    </div>
                                                </div>
                                                <div className="w-14 h-8 bg-white/10 rounded-full relative cursor-pointer border border-white/5">
                                                    <div className="absolute top-1 left-1 w-6 h-6 bg-forest-light rounded-full shadow-lg"></div>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                                                        <LinkIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">Connected Accounts</h4>
                                                        <p className="text-xs text-gray-500 mt-1">Manage linked social profiles.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 cursor-pointer transition-all">G</div>
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 cursor-pointer transition-all">f</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-white/5">
                                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Password Management</h4>
                                            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'preferences' && (
                                <motion.div 
                                    key="preferences"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl"
                                >
                                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                        <Bell className="text-forest-light" />
                                        অ্যাপ সেটিংস (App Preferences)
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">Push Notifications</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Receive trip updates on your mobile.</p>
                                                </div>
                                            </div>
                                            <div className="w-14 h-8 bg-forest-light rounded-full relative cursor-pointer border border-white/5">
                                                <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg"></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                                                    <Globe size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">Display Language</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Currently set to {prefs.language}.</p>
                                                </div>
                                            </div>
                                            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-white outline-none">
                                                <option value="bn">Bengali</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-forest-light/10 rounded-2xl flex items-center justify-center text-forest-light">
                                                    <Moon size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">Theme Selection</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Switch between dark and light modes.</p>
                                                </div>
                                            </div>
                                            <button className="bg-forest-light text-white px-5 py-2 rounded-xl text-xs font-black uppercase">Dark Mode</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'support' && (
                                <motion.div 
                                    key="support"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="space-y-8"
                                >
                                    <div className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                        <h3 className="text-2xl font-black text-white mb-10">সাহায্য ও নিয়মাবলী (Support & Legal)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-forest-light/30 transition-all cursor-pointer group">
                                                <HelpCircle className="text-forest-light mb-4 group-hover:scale-110 transition-transform" size={32} />
                                                <h4 className="text-lg font-black text-white mb-2">Help Center & FAQ</h4>
                                                <p className="text-sm text-gray-500">Find answers to common questions about bookings and accounts.</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-forest-light/30 transition-all cursor-pointer group">
                                                <FileText className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                                                <h4 className="text-lg font-black text-white mb-2">Terms of Service</h4>
                                                <p className="text-sm text-gray-500">Read our legal agreement for using the Madventure platform.</p>
                                            </div>
                                        </div>

                                        <div className="mt-12 p-8 bg-red-500/5 rounded-[2rem] border border-red-500/10">
                                            <h4 className="text-lg font-black text-red-500 mb-2 flex items-center gap-2">
                                                <Trash2 size={20} />
                                                Danger Zone
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-6">Once you delete your account, all your trip history and points will be permanently removed.</p>
                                            <button 
                                                onClick={handleDeleteAccount}
                                                className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
                                            >
                                                Delete My Account
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
