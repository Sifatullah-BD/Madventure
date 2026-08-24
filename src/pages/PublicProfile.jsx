import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MapPin, UserPlus, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { followUser, getConnectionStatus, getFollowStats, getPublicProfile, requestConnection, unfollowUser } from '../services/communityService';

export default function PublicProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const toast = useToast();
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState('none');
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState(false);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getPublicProfile(id), getFollowStats(id)])
            .then(([nextProfile, nextStats]) => {
                if (!cancelled) {
                    setProfile(nextProfile);
                    setStats(nextStats);
                }
            })
            .catch(error => toast.error(error.message || 'Unable to load profile.'))
            .finally(() => { if (!cancelled) setLoading(false); });
        if (user?.id && user.id !== id) {
            getConnectionStatus(user.id, id).then(nextStatus => { if (!cancelled) setStatus(nextStatus); }).catch(() => {});
        }
        return () => { cancelled = true; };
    }, [id, user?.id, toast]);

    const handleFollow = async () => {
        if (!user) { toast.warning('Please log in to follow travelers.'); return; }
        setWorking(true);
        try {
            if (status === 'following') {
                await unfollowUser(user.id, id);
                setStatus('none');
                setStats(prev => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
            } else {
                await followUser(user.id, id);
                setStatus('following');
                setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
            }
        } catch (error) { toast.error(error.message || 'Follow action failed.'); }
        finally { setWorking(false); }
    };

    const handleConnect = async () => {
        if (!user) { toast.warning('Please log in to connect.'); return; }
        setWorking(true);
        try {
            await requestConnection(user.id, id);
            setStatus('request_sent');
            toast.success('Connection request sent.');
        } catch (error) { toast.error(error.message || 'Connection request failed.'); }
        finally { setWorking(false); }
    };

    if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    if (!profile) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><UserRound className="mx-auto mb-4 text-gray-400" size={48} /><h1 className="text-2xl font-black">Profile not found</h1><Link className="mt-4 inline-block font-bold text-primary" to="/community">Back to community</Link></div>;

    const name = profile.full_name || profile.username || 'Traveler';
    const isSelf = user?.id === id;
    return <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950"><div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="h-40 bg-gradient-to-r from-green-900 via-green-700 to-emerald-500" /><div className="px-6 pb-8"><div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-4"><div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-green-100 text-3xl font-black text-green-800 shadow-lg dark:border-slate-900">{profile.avatar_url ? <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" /> : name[0]}</div><div className="pb-2"><h1 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">{name}<CheckCircle2 className="text-blue-500" size={18} /></h1><p className="text-sm text-gray-500">@{profile.username || 'traveler'}</p></div></div>{!isSelf && <div className="flex gap-2"><button disabled={working} onClick={handleFollow} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{status === 'following' ? 'Following' : 'Follow'}</button><button disabled={working || status !== 'none'} onClick={handleConnect} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 disabled:opacity-50 dark:border-slate-700 dark:text-gray-200"><UserPlus size={16} />{status === 'request_sent' ? 'Request Sent' : status === 'connected' ? 'Connected' : 'Connect'}</button></div>}</div><p className="mt-6 max-w-xl text-gray-600 dark:text-gray-300">{profile.bio || 'Travel enthusiast and explorer.'}</p>{(profile.district || profile.division) && <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{[profile.district, profile.division].filter(Boolean).join(', ')}</p>}<div className="mt-6 flex gap-8 border-t border-gray-100 pt-5 text-sm dark:border-slate-800"><span><strong className="text-lg text-gray-900 dark:text-white">{stats.followers}</strong> followers</span><span><strong className="text-lg text-gray-900 dark:text-white">{stats.following}</strong> following</span></div></div></div></div>;
}
