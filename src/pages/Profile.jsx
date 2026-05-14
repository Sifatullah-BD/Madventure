import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Settings, Shield, LogOut, RefreshCw, Camera, 
    Trash2, Save, X, Loader2, Award, Users, TrendingUp,
    MapPin, Calendar, Heart, MessageSquare, Trophy, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadImages } from '../api/storage';
import { useToast } from '../components/ui/Toast';
import { getFollowStats, getUserAchievements, getLeaderboard } from '../api/social';
import { supabase } from '../lib/supabase';

const Profile = ({ user, onLogout, onUpdateRole, onUpdateUser }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || 'User Name');
    const [bio, setBio] = useState(user?.bio || 'Travel enthusiast | Explorer | Photographer');
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [coverPhoto, setCoverPhoto] = useState(user?.coverPhoto || null);
    const [isUploading, setIsUploading] = useState(false);

    // Social & Gamification State
    const [socialStats, setSocialStats] = useState({ followers: 0, following: 0 });
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [profileData, setProfileData] = useState({ xp: 0, level: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchSocialData() {
            try {
                const [stats, achs, leaders, prof] = await Promise.all([
                    getFollowStats(user.id),
                    getUserAchievements(user.id),
                    getLeaderboard(5),
                    supabase.from('profiles').select('xp, level').eq('id', user.id).single()
                ]);

                setSocialStats(stats);
                setAchievements(achs.data || []);
                setLeaderboard(leaders.data || []);
                if (prof.data) setProfileData(prof.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchSocialData();
    }, [user]);

    // Sync with user prop if it changes
    useEffect(() => {
        if (user) {
            setName(user.name || 'User Name');
            if (user.avatar) setAvatar(user.avatar);
            if (user.coverPhoto) setCoverPhoto(user.coverPhoto);
        }
    }, [user]);

    const handleRoleSwitch = (newRole) => {
        onUpdateRole(newRole);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                const { data, error } = await uploadImages('avatars', [file]);
                if (error) throw error;
                if (data && data[0]) {
                    setAvatar(data[0]);
                    onUpdateUser({ ...user, avatar: data[0] });
                }
            } catch (err) {
                console.error("Avatar upload failed:", err);
                toast.error("ইমেজ আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
        const updatedUser = { ...user, name, bio, avatar, coverPhoto };
        onUpdateUser(updatedUser);
        toast.success('Profile updated successfully!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            localStorage.removeItem('madventure_user');
            onLogout();
            navigate('/');
            toast.info('Your account has been deleted.');
        }
    };

    // Calculate XP progress
    const nextLevelXP = profileData.level * profileData.level * 100;
    const currentLevelXP = (profileData.level - 1) * (profileData.level - 1) * 100;
    const progress = ((profileData.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Profile Card & Gamification */}
                    <div className="col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            {/* Profile Header */}
                            <div className="relative group w-24 h-24 mx-auto mb-4">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden ring-4 ring-primary/10">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <button
                                            onClick={() => !isUploading && fileInputRef.current.click()}
                                            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                        </button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </>
                                )}
                            </div>

                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                                        LVL {profileData.level}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{bio}"</p>
                            </div>

                            {/* Social Stats */}
                            <div className="flex justify-center gap-8 py-4 border-t border-b border-gray-50 dark:border-gray-800 mb-6">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{socialStats.followers}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{socialStats.following}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Following</p>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                                    <span>Explorer Progress</span>
                                    <span>{profileData.xp} / {nextLevelXP} XP</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-6">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                                        <button onClick={handleSaveProfile} className="flex-1 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-green-900/20 hover:bg-green-700 transition-colors">Save Changes</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="w-full py-2.5 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">Edit Profile</button>
                                )}
                            </div>
                        </div>

                        {/* Leaderboard Preview */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                <Trophy size={18} className="text-orange-500" />
                                Top Explorers
                            </h3>
                            <div className="space-y-4">
                                {leaderboard.map((player, idx) => (
                                    <div key={player.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold w-4 ${idx === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>{idx + 1}</span>
                                            <img src={player.avatar || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full bg-gray-100" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{player.full_name}</p>
                                                <p className="text-[10px] text-gray-500">Level {player.level}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{player.xp} XP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Achievements & Settings */}
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        {/* Achievements Grid */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Award size={22} className="text-primary" />
                                Achievement Badges
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {achievements.length === 0 ? (
                                    <div className="col-span-full py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-500">Complete bookings to earn badges!</p>
                                    </div>
                                ) : (
                                    achievements.map(ach => (
                                        <div key={ach.achievements.id} className="group flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all hover:scale-105">
                                            <span className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">{ach.achievements.icon}</span>
                                            <p className="text-[10px] font-bold text-gray-900 dark:text-white text-center uppercase tracking-tighter">{ach.achievements.title}</p>
                                            <p className="text-[8px] text-gray-500 text-center mt-1">Earned {new Date(ach.earned_at).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Actions & Settings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Role Switcher */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <RefreshCw size={20} />
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">Role Simulation</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRoleSwitch('Member')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${user?.role !== 'Admin' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500'}`}>Member</button>
                                    <button onClick={() => handleRoleSwitch('Admin')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${user?.role === 'Admin' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500'}`}>Admin</button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                        <Trash2 size={20} />
                                    </div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">Account</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={onLogout} className="flex-1 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50">Log Out</button>
                                    <button onClick={handleDeleteAccount} className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
