import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Ban, Check, CheckCircle2, Flag, Loader2, MapPin, UserPlus, UserRound, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { blockUser, followUser, getConnectionStatus, getFollowStats, getPublicProfile, reportContent, requestConnection, respondToConnectionRequest, unfollowUser } from '../services/communityService';

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

    const handleConnectionResponse = async (accept) => {
        if (!user || status !== 'request_received') return;
        setWorking(true);
        try {
            const { data: request } = await (await import('../lib/supabase')).supabase.from('connection_requests').select('id').eq('sender_id', id).eq('receiver_id', user.id).eq('status', 'pending').single();
            await respondToConnectionRequest(request.id, user.id, accept);
            setStatus(accept ? 'connected' : 'none');
            toast.success(accept ? 'Connection accepted.' : 'Request declined.');
        } catch (error) { toast.error(error.message || 'Unable to respond to request.'); }
        finally { setWorking(false); }
    };

    const handleBlock = async () => {
        if (!user || !window.confirm('Block this traveler?')) return;
        setWorking(true);
        try { await blockUser(user.id, id); setStatus('blocked'); toast.success('Traveler blocked.'); }
        catch (error) { toast.error(error.message || 'Unable to block traveler.'); }
        finally { setWorking(false); }
    };

    const handleReport = async () => {
        if (!user) { toast.warning('Please log in to report a profile.'); return; }
        try { await reportContent(user.id, 'profile', id); toast.success('Profile reported.'); }
        catch (error) { toast.error(error.message || 'Unable to report profile.'); }
    };

    if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    if (!profile) return <div className="mx-auto max-w-xl px-4 py-20 text-center"><UserRound className="mx-auto mb-4 text-gray-400" size={48} /><h1 className="text-2xl font-black">Profile not found</h1><Link className="mt-4 inline-block font-bold text-primary" to="/community">Back to community</Link></div>;

    const name = profile.full_name || profile.username || 'Traveler';
    const isSelf = user?.id === id;
    return <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950"><div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="h-40 bg-gradient-to-r from-green-900 via-green-700 to-emerald-500" /><div className="px-6 pb-8"><div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-4"><div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-green-100 text-3xl font-black text-green-800 shadow-lg dark:border-slate-900">{profile.avatar_url ? <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" /> : name[0]}</div><div className="pb-2"><h1 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">{name}<CheckCircle2 className="text-blue-500" size={18} /></h1><p className="text-sm text-gray-500">@{profile.username || 'traveler'}</p></div></div>{!isSelf && <div className="flex flex-wrap gap-2"><button disabled={working || status === 'blocked'} onClick={handleFollow} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{status === 'following' ? 'Following' : 'Follow'}</button>{status === 'request_received' ? <><button disabled={working} onClick={() => handleConnectionResponse(true)} className="flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white"><Check size={15} />Accept</button><button disabled={working} onClick={() => handleConnectionResponse(false)} className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 dark:border-slate-700 dark:text-gray-200"><X size={15} />Decline</button></> : <button disabled={working || status !== 'none'} onClick={handleConnect} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 disabled:opacity-50 dark:border-slate-700 dark:text-gray-200"><UserPlus size={16} />{status === 'request_sent' ? 'Request Sent' : status === 'connected' ? 'Connected' : 'Connect'}</button>}<button disabled={working} onClick={handleBlock} title="Block traveler" className="rounded-xl border border-red-200 p-2.5 text-red-600 dark:border-red-900"><Ban size={16} /></button><button onClick={handleReport} title="Report profile" className="rounded-xl border border-gray-200 p-2.5 text-gray-500 dark:border-slate-700"><Flag size={16} /></button></div>}</div><p className="mt-6 max-w-xl text-gray-600 dark:text-gray-300">{profile.bio || 'Travel enthusiast and explorer.'}</p>{(profile.district || profile.division) && <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} />{[profile.district, profile.division].filter(Boolean).join(', ')}</p>}<div className="mt-6 flex gap-8 border-t border-gray-100 pt-5 text-sm dark:border-slate-800"><span><strong className="text-lg text-gray-900 dark:text-white">{stats.followers}</strong> followers</span><span><strong className="text-lg text-gray-900 dark:text-white">{stats.following}</strong> following</span></div></div></div></div>;
}
