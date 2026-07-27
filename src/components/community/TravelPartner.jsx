import PartnerCard from './PartnerCard';
import { useToast } from '../ui/Toast';

const TravelPartner = () => {
    const toast = useToast();
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
            toast.warning("ব্যবহারকারী নাম্বার যুক্ত করেননি");
            return;
        }
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.warning("লগিন করুন!");
            return;
        }
        
        setSubmitting(true);
        const { error } = await createPartnerRequest({
            user_id: user.id,
            ...newRequest,
            interests: ['Nature', 'Adventure'] // Default for now
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("নতুন ট্রাভেলার রিকোয়েস্ট যুক্ত হয়েছে!");
            setShowAddForm(false);
            fetchPartners();
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 relative min-h-screen">
            {/* Premium Curved Hero for Partner Discovery */}
            <CurvedHero 
                title="FIND A PARTNER"
                subtitle="TO EXPLORE WITH"
                image="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80"
                onAction={() => setShowAddForm(true)}
                items={[
                    { label: "NEXT TRIP", value: "Upcoming" },
                    { label: "LOCATION", value: "64 Districts" },
                    { label: "BUDGET", value: "Fixed/Shared" },
                    { label: "SAFETY", value: "Verified Only" }
                ]}
            />
            
            {/* Floating Warning - Subtle */}
            <div className="mb-12 bg-[#f97316]/10 border border-[#f97316]/20 p-6 rounded-[2rem] flex gap-4 text-[#f97316] backdrop-blur-sm">
                <AlertTriangle className="shrink-0" size={24} />
                <p className="font-bold text-sm leading-relaxed">
                    সতর্কতা: অজানা ব্যক্তির সাথে দেখা করার আগে পরিচিতদের জানান। প্রথম দেখায় প্রকাশ্য স্থান বেছে নিন এবং আর্থিক লেনদেনে শতভাগ নিশ্চিত না হয়ে আগাবেন না।
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-72">
                    <div className="bg-[#0d1a11] p-8 rounded-[2rem] border border-white/5 shadow-2xl sticky top-24">
                        <h3 className="font-black text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-widest text-xs">
                            <Filter size={16}/> ফিল্টার করুন
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">গন্তব্য</label>
                                <select 
                                    value={districtId}
                                    onChange={e => setDistrictId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-forest-light text-white font-bold transition-all"
                                >
                                    <option value="" className="bg-[#0d1a11]">সব গন্তব্য</option>
                                    {DISTRICTS.map(d => <option key={d.id} value={d.id} className="bg-[#0d1a11]">{d.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">জেন্ডার (Gender)</label>
                                <select 
                                    value={genderPref}
                                    onChange={e => setGenderPref(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-forest-light text-white font-bold transition-all"
                                >
                                    <option value="" className="bg-[#0d1a11]">সবাই (All)</option>
                                    <option value="male" className="bg-[#0d1a11]">পুরুষ (Male)</option>
                                    <option value="female" className="bg-[#0d1a11]">মহিলা (Female)</option>
                                </select>
                            </div>

                            <button onClick={fetchPartners} className="w-full bg-forest-light text-white font-black py-4 rounded-xl hover:bg-green-600 transition-all shadow-xl shadow-forest-light/10 active:scale-95 uppercase tracking-widest text-xs">
                                ফিল্টার প্রয়োগ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main List Area */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-forest-light" size={40}/></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {partners.map(p => (
                                <PartnerCard 
                                    key={p.id} 
                                    partner={p} 
                                    onWhatsApp={handleWhatsApp} 
                                    onJoin={() => toast.success('Join request sent!')} 
                                />
                            ))}
                            
                            {partners.length === 0 && (
                                <div className="col-span-full text-center py-24 bg-[#0d1a11] rounded-[3rem] border border-dashed border-white/10">
                                    <Users size={64} className="mx-auto text-gray-800 mb-6"/>
                                    <p className="text-gray-400 font-black text-xl">আপনার সার্চ অনুযায়ী কাউকে পাওয়া যায়নি।</p>
                                    <p className="text-gray-500 text-sm mt-2 font-medium">আপনি নিজেই একটি রিকোয়েস্ট পোস্ট করতে পারেন!</p>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">বয়সসীমা (Age Group)</label>
                                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50">
                                        <option>২০-৩০ বছর</option>
                                        <option>৩০-৪০ বছর</option>
                                        <option>৪০+ বছর</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">পছন্দ (Preference)</label>
                                    <div className="flex gap-3">
                                        <button type="button" className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Non-Smoking</button>
                                        <button type="button" className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Photography</button>
                                    </div>
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
