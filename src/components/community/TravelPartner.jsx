import React, { useState, useEffect } from 'react';
import { DISTRICTS } from '../../data/madventure-data';
import { Search, MapPin, Calendar, Wallet, Users, MessageCircle, AlertTriangle, UserPlus, Filter, Loader2, X, CheckCircle2 } from 'lucide-react';
import { getTravelPartners, createPartnerRequest } from '../../api/community';
import { useAuth } from '../../hooks/useAuth';

const BUDGETS = ['বাজেট (৳3000-৳5000)', 'মধ্যম (৳5000-৳8000)', 'প্রিমিয়াম (৳8000+)'];

const TravelPartner = () => {
    const { user } = useAuth();
    const [districtId, setDistrictId] = useState('');
    const [genderPref, setGenderPref] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [newRequest, setNewRequest] = useState({
        destination_id: '',
        travel_date: '',
        budget_range: BUDGETS[0],
        description: '',
        interests: []
    });

    const fetchPartners = async () => {
        setLoading(true);
        const { data, error } = await getTravelPartners({ districtId, gender: genderPref });
        if (data) {
            setPartners(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPartners();
    }, [districtId, genderPref]);

    const handleWhatsApp = (phone) => {
        if (!phone) {
            alert("মোবাইল নম্বর পাওয়া যায়নি।");
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("লগইন করুন!");
            return;
        }
        
        setSubmitting(true);
        const { error } = await createPartnerRequest({
            user_id: user.id,
            ...newRequest,
            interests: ['Nature', 'Adventure'] // Default for now
        });

        if (error) {
            alert(error.message);
        } else {
            alert("রিকোয়েস্ট পোস্ট হয়েছে!");
            setShowAddForm(false);
            fetchPartners();
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 relative min-h-screen">
            {/* Header & Warning */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Users className="text-primary"/> ট্রাভেল পার্টনার খুঁজুন
                </h1>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex gap-3 text-orange-800 shadow-sm">
                    <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                    <p className="font-medium text-sm md:text-base leading-relaxed">
                        <span className="font-bold block mb-1">⚠️ সতর্কতা:</span> 
                        অজানা ব্যক্তির সাথে দেখা করার আগে পরিচিতদের জানান। প্রথম দেখায় প্রকাশ্য স্থান বেছে নিন এবং আর্থিক লেনদেনে শতভাগ নিশ্চিত না হয়ে আগাবেন না।
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-72">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                            <Filter size={18}/> ফিল্টার করুন
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">গন্তব্য</label>
                                <select 
                                    value={districtId}
                                    onChange={e => setDistrictId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-all"
                                >
                                    <option value="">সব গন্তব্য</option>
                                    {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">জেন্ডার (Gender)</label>
                                <select 
                                    value={genderPref}
                                    onChange={e => setGenderPref(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-all"
                                >
                                    <option value="">সবাই (All)</option>
                                    <option value="male">পুরুষ (Male)</option>
                                    <option value="female">মহিলা (Female)</option>
                                </select>
                            </div>

                            <button onClick={fetchPartners} className="w-full bg-[#1B5E20] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all shadow-md active:scale-95">
                                ফিল্টার প্রয়োগ করুন
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main List Area */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {partners.map(p => {
                                const d = DISTRICTS.find(dist => dist.id === p.destination_id);
                                const profile = p.profiles || {};
                                return (
                                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-green-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                                                    {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover"/> : (profile.full_name?.charAt(0) || 'U')}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                        {profile.full_name || 'User'} 
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${profile.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                            {profile.gender === 'male' ? 'M' : 'F'}
                                                        </span>
                                                    </h3>
                                                    <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={12}/> Dhaka, Bangladesh</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-2 text-sm text-gray-700 border border-gray-100">
                                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                                    <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={14}/> গন্তব্য:</span>
                                                    <span className="font-bold">{d ? d.name : p.destination_id}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-100 py-2">
                                                    <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={14}/> তারিখ:</span>
                                                    <span className="font-bold">{new Date(p.travel_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between pt-2">
                                                    <span className="text-gray-500 flex items-center gap-1.5"><Wallet size={14}/> বাজেট:</span>
                                                    <span className="font-bold text-[#1B5E20]">{p.budget_range}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm italic mb-4 line-clamp-3 bg-gray-50/50 p-3 rounded-lg">"{p.description}"</p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {p.interests?.map(i => (
                                                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-500 px-2.5 py-1 rounded-full shadow-sm">
                                                        #{i}
                                                    </span>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => handleWhatsApp(profile.phone)}
                                                className="w-full bg-[#1B5E20] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-md active:scale-95"
                                            >
                                                <MessageCircle size={18}/> যোগাযোগ করুন
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {partners.length === 0 && (
                                <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                    <Users size={48} className="mx-auto text-gray-200 mb-4"/>
                                    <p className="text-gray-500 font-bold text-lg">আপনার সার্চ অনুযায়ী কাউকে পাওয়া যায়নি।</p>
                                    <p className="text-gray-400 text-sm mt-2">আপনি নিজেই একটি রিকোয়েস্ট পোস্ট করতে পারেন!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => setShowAddForm(true)}
                className="fixed bottom-8 right-8 bg-[#22c55e] text-white p-4 rounded-full shadow-xl shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all z-40 group flex gap-2 items-center px-6"
            >
                <UserPlus size={20} />
                <span className="font-bold">আমিও সঙ্গী খুঁজছি</span>
            </button>

            {/* Add Request Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><UserPlus className="text-primary"/> নতুন ট্রাভেল মেট রিকোয়েস্ট</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm">
                                <X size={20}/>
                            </button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={handleCreateRequest}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">গন্তব্য <span className="text-red-500">*</span></label>
                                    <select 
                                        required 
                                        value={newRequest.destination_id}
                                        onChange={e => setNewRequest({...newRequest, destination_id: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                                    >
                                        <option value="">নির্বাচন করুন</option>
                                        {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">যাওয়ার তারিখ <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={newRequest.travel_date}
                                        onChange={e => setNewRequest({...newRequest, travel_date: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">বাজেট ধরন</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {BUDGETS.map(b => (
                                        <button
                                            key={b}
                                            type="button"
                                            onClick={() => setNewRequest({...newRequest, budget_range: b})}
                                            className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${newRequest.budget_range === b ? 'border-primary bg-green-50 text-primary shadow-sm' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">বিস্তারিত বিবরণ <span className="text-red-500">*</span></label>
                                <textarea 
                                    required 
                                    rows="4" 
                                    value={newRequest.description}
                                    onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none bg-gray-50" 
                                    placeholder="আপনি কেমন মানুষ এবং কেমন ভ্রমণসঙ্গী খুঁজছেন..."
                                ></textarea>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">বাতিল</button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-8 py-3 bg-[#f97316] text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelPartner;
