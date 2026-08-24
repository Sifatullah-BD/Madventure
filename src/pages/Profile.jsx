import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Settings, Shield, LogOut, Camera, 
    Trash2, Save, Award, Users, TrendingUp,
    MapPin, Calendar, Heart, MessageSquare, Trophy, Star,
    Bell, Globe, Moon, CreditCard, HelpCircle, FileText, CheckCircle2,
    Lock, Smartphone, Mail, Map, Briefcase, Video, Inbox, Users2, Activity, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadImages } from '../services/storageService';
import { useToast } from '../components/ui/Toast';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

import ProfileOverview from '../components/profile/ProfileOverview';
import EditProfile from '../components/profile/EditProfile';
import MyTrips from '../components/profile/MyTrips';
import ProfileBookings from '../components/profile/ProfileBookings';
import ProfileWallet from '../components/profile/ProfileWallet';
import ProfileWishlist from '../components/profile/ProfileWishlist';
import TravelPlans from '../components/profile/TravelPlans';
import MyPosts from '../components/profile/MyPosts';

const Profile = ({ user, onLogout, onUpdateRole, onUpdateUser }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const fileInputRef = useRef(null);
    const { language } = useLanguage();

    const [activeTab, setActiveTab] = useState('overview');
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || 'User Name',
        username: user?.username || 'traveler_01',
        email: user?.email || '',
        phone: user?.phone || '+880 1XXX XXXXXX',
        bio: user?.bio || 'Travel enthusiast | Explorer | Photographer',
        location: user?.location || 'Dhaka, Bangladesh',
        avatar: user?.avatar || null,
        travelStyles: [],
        budgetPreference: ''
    });

    // Preferences State
    const [prefs, setPrefs] = useState({
        pushNotifications: true,
        emailAlerts: true,
        darkMode: true,
        language: 'bn'
    });

    // Social & Gamification State
    const [socialStats, setSocialStats] = useState({ followers: 0, following: 0 });
    const [profileData, setProfileData] = useState({ xp: 0, level: 1, totalTrips: 0 });

    useEffect(() => {
        if (!user?.id) return;
        
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await authService.getProfile(user.id);
                
                if (data) {
                    setProfileForm(prev => ({
                        ...prev,
                        name: data.full_name || user.name || 'User Name',
                        username: data.username || user.username || 'traveler_01',
                        phone: data.phone || user.phone || '',
                        bio: data.bio || '',
                        location: data.district ? `${data.district}, ${data.division}` : prev.location,
                        avatar: data.avatar_url || user.avatar || null
                    }));
                    
                    setProfileData({
                        xp: data.travel_score || 0,
                        level: Math.floor((data.travel_score || 0) / 100) + 1,
                        totalTrips: data.total_trips || 0
                    });

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
        if (e && e.preventDefault) e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            await authService.updateProfile(user.id, {
                full_name: profileForm.name,
                phone: profileForm.phone,
                bio: profileForm.bio,
            });

            onUpdateUser({ ...user, ...profileForm });
            toast.success(language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(language === 'bn' ? 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।' : 'Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && user?.id) {
            setIsUploading(true);
            try {
                const { data, error } = await uploadImages('avatars', [file]);
                if (error) throw error;
                
                if (data && data[0]) {
                    const avatarUrl = data[0];
                    await authService.updateProfile(user.id, { avatar_url: avatarUrl });
                    setProfileForm(prev => ({ ...prev, avatar: avatarUrl }));
                    onUpdateUser({ ...user, avatar: avatarUrl });
                    toast.success(language === 'bn' ? 'ছবি আপডেট করা হয়েছে!' : 'Profile picture updated!');
                }
            } catch (err) {
                console.error(err);
                toast.error(language === 'bn' ? "ইমেজ আপলোড করতে সমস্যা হয়েছে।" : "Error uploading image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    // --- Navigation Groups ---
    const navigationGroups = [
        {
            title: language === 'bn' ? '👤 প্রোফাইল' : '👤 Profile',
            items: [
                { id: 'overview', label: 'Overview', icon: <User size={18} /> },
                { id: 'edit', label: 'Edit Profile', icon: <Settings size={18} /> },
                { id: 'trips', label: 'My Trips', icon: <Briefcase size={18} /> },
                { id: 'plans', label: 'Travel Plans', icon: <Map size={18} /> },
                { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
                { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
                { id: 'wallet', label: 'Wallet & Payments', icon: <CreditCard size={18} /> },
            ]
        },
        {
            title: language === 'bn' ? '🌍 কমিউনিটি' : '🌍 Community',
            items: [
                { id: 'posts', label: 'My Posts', icon: <MessageSquare size={18} /> },
                { id: 'videos', label: 'My Videos', icon: <Video size={18} /> },
                { id: 'followers', label: 'Followers', icon: <Users size={18} /> },
                { id: 'following', label: 'Following', icon: <Users2 size={18} /> },
            ]
        },
        {
            title: language === 'bn' ? '💬 মেসেজেস' : '💬 Messages',
            items: [
                { id: 'inbox', label: 'Inbox', icon: <Inbox size={18} /> },
                { id: 'groups', label: 'Group Chats', icon: <Users size={18} /> },
            ]
        },
        {
            title: language === 'bn' ? '🏆 ট্রাভেল গ্যামিফিকেশন' : '🏆 Gamification',
            items: [
                { id: 'achievements', label: 'Achievements', icon: <Award size={18} /> },
                { id: 'contributions', label: 'Reviews & Contributions', icon: <Star size={18} /> },
            ]
        },
        {
            title: language === 'bn' ? '👥 ট্রাভেল ইনফো' : '👥 Travel Info',
            items: [
                { id: 'companions', label: 'Travel Companions', icon: <Users2 size={18} /> },
                { id: 'emergency', label: 'Emergency Contact', icon: <Phone size={18} /> },
            ]
        },
        {
            title: language === 'bn' ? '⚙️ সেটিংস' : '⚙️ Settings',
            items: [
                { id: 'security', label: 'Security & Privacy', icon: <Shield size={18} /> },
                { id: 'preferences', label: 'Notifications & App', icon: <Bell size={18} /> },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    // Placeholder content renderer for currently unimplemented tabs
    const renderPlaceholder = (title, icon, text) => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="flex flex-col items-center justify-center p-16 bg-[#0d1a11] rounded-[2.5rem] border border-white/5 shadow-xl text-center">
            <div className="w-24 h-24 bg-forest-light/10 rounded-full flex items-center justify-center text-forest-light mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-white mb-4">{title}</h3>
            <p className="text-gray-400 max-w-md mx-auto">{text}</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#050f08] text-gray-100 pt-24 pb-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Profile Cover Photo - Full Width */}
                <div className="w-full h-64 md:h-80 rounded-[3rem] overflow-hidden relative mb-12 shadow-2xl border-4 border-[#0d1a11]">
                    <img 
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050f08] via-transparent to-transparent"></div>
                    <button className="absolute top-6 right-6 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10 transition-all">
                        <Camera size={16} /> {language === 'bn' ? 'কভার পরিবর্তন' : 'Change Cover'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-[#0d1a11] rounded-[2.5rem] border border-white/5 p-6 shadow-2xl sticky top-28">
                            
                            {/* Avatar & Basic Info */}
                            <div className="flex flex-col items-center mb-8 -mt-20 relative z-10">
                                <div className="relative group mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-[#0d1a11] shadow-2xl bg-forest-light/10 flex items-center justify-center text-forest-light">
                                        {profileForm.avatar ? (
                                            <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={50} />
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute bottom-2 right-2 bg-forest-light text-white p-2.5 rounded-full shadow-xl hover:bg-green-600 transition-all border-4 border-[#0d1a11]"
                                    >
                                        {isUploading ? <Activity size={16} className="animate-spin" /> : <Camera size={16} />}
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                <h2 className="text-xl font-black text-white flex items-center gap-2">
                                    {profileForm.name} <CheckCircle2 className="text-blue-500" size={18} />
                                </h2>
                                <p className="text-gray-500 text-sm font-medium">@{profileForm.username}</p>
                                <p className="text-gray-400 text-xs text-center mt-3 max-w-[250px]">{profileForm.bio}</p>
                                <div className="w-full mt-6 bg-white/5 p-4 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Profile</p>
                                        <p className="text-white font-bold text-sm">85% Complete</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-4 border-forest-light flex items-center justify-center text-forest-light font-black text-xs">
                                        85
                                    </div>
                                </div>
                            </div>

                            {/* Complex Navigation List */}
                            <nav className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {navigationGroups.map((group, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4 mb-3">
                                            {group.title}
                                        </h3>
                                        {group.items.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                                    activeTab === tab.id 
                                                    ? 'bg-forest-light text-white shadow-lg shadow-forest-light/20' 
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {tab.icon}
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                                
                                <div className="pt-6 mt-6 border-t border-white/5 pb-4">
                                    <button 
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
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
                            {/* --- Profile Group --- */}
                            {activeTab === 'overview' && (
                                <ProfileOverview 
                                    profileData={profileData} 
                                    socialStats={socialStats} 
                                    onApplyVerification={() => toast.info('Verification request system coming soon.')} 
                                />
                            )}
                            
                            {activeTab === 'edit' && (
                                <EditProfile 
                                    profileForm={profileForm} 
                                    setProfileForm={setProfileForm} 
                                    handleUpdateProfile={handleUpdateProfile} 
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'trips' && (
                                <MyTrips user={user} />
                            )}
                            {activeTab === 'plans' && (
                                <TravelPlans user={user} />
                            )}
                            {activeTab === 'bookings' && (
                                <ProfileBookings user={user} />
                            )}
                            {activeTab === 'wishlist' && (
                                <ProfileWishlist user={user} />
                            )}
                            {activeTab === 'wallet' && (
                                <ProfileWallet user={user} />
                            )}

                            {/* --- Community Group --- */}
                            {activeTab === 'posts' && (
                                <MyPosts user={user} />
                            )}
                            {activeTab === 'videos' && renderPlaceholder(
                                'My Videos', <Video size={40} />, 
                                'Your uploaded travel vlogs and reels.'
                            )}
                            {activeTab === 'followers' && renderPlaceholder(
                                'Followers', <Users size={40} />, 
                                'Travelers who are following your journeys.'
                            )}
                            {activeTab === 'following' && renderPlaceholder(
                                'Following', <Users2 size={40} />, 
                                'Travelers you are following.'
                            )}

                            {/* --- Messages Group --- */}
                            {activeTab === 'inbox' && renderPlaceholder(
                                'Inbox', <Inbox size={40} />, 
                                'Direct messages with guides, agencies, and other travelers.'
                            )}
                            {activeTab === 'groups' && renderPlaceholder(
                                'Group Chats', <Users size={40} />, 
                                'Chat with your travel companions and public community groups.'
                            )}

                            {/* --- Gamification Group --- */}
                            {activeTab === 'achievements' && renderPlaceholder(
                                'Achievements', <Award size={40} />, 
                                'Unlock badges by completing trips and participating in the community.'
                            )}
                            {activeTab === 'contributions' && renderPlaceholder(
                                'Reviews & Contributions', <Star size={40} />, 
                                'Your ratings and reviews for hotels and tours.'
                            )}

                            {/* --- Travel Info Group --- */}
                            {activeTab === 'companions' && renderPlaceholder(
                                'Travel Companions', <Users2 size={40} />, 
                                'Save profiles of your friends and family for quick booking.'
                            )}
                            {activeTab === 'emergency' && renderPlaceholder(
                                'Emergency Contact', <Phone size={40} />, 
                                'Keep emergency contact info safe for your upcoming trips.'
                            )}

                            {/* --- Settings Group --- */}
                            {activeTab === 'security' && (
                                <motion.div key="security" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                        <Lock className="text-forest-light" /> Security & Privacy
                                    </h3>
                                    <p className="text-gray-400 mb-6">Manage your two-factor authentication, connected accounts, and password.</p>
                                    <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all">
                                        Change Password
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'preferences' && (
                                <motion.div key="preferences" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="bg-[#0d1a11] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                                    <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                        <Bell className="text-forest-light" /> App Preferences
                                    </h3>
                                    <p className="text-gray-400">Settings for push notifications, email alerts, and language will be managed here.</p>
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
