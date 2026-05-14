import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Navigation, MessageCircle, Info, ShieldAlert, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import DashboardHeader from '../dashboard/DashboardHeader';
import { supabase } from '../../lib/supabase';

const TABS = [
    { id: 'mechanic', label: '🔧 মেকানিক' },
    { id: 'pharmacy', label: '💊 ফার্মেসি' },
    { id: 'hospital', label: '🏥 হাসপাতাল' },
    { id: 'police', label: '🚔 পুলিশ' }
];

const EmergencyFinder = () => {
    const [activeTab, setActiveTab] = useState('mechanic');
    const [districtId, setDistrictId] = useState('');
    const [districts, setDistricts] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadDistricts() {
            const { data } = await supabase.from('districts').select('id, name');
            if (data) {
                setDistricts(data);
                if (data.length > 0) setDistrictId(data[0].id);
            }
        }
        loadDistricts();
    }, []);

    useEffect(() => {
        async function fetchServices() {
            if (!districtId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('emergency_services')
                    .select('*')
                    .eq('type', activeTab);
                
                if (data) setServices(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, [activeTab, districtId]);

    const renderServices = () => {
        if (loading) return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );

        if (services.length === 0) return <EmptyState />;

        return services.map(item => (
            <div key={item.id} className={`rounded-2xl p-6 shadow-sm border transition-colors ${
                activeTab === 'hospital' ? 'bg-red-50/50 border-red-100 hover:border-red-200' :
                activeTab === 'police' ? 'bg-blue-50/50 border-blue-100 hover:border-blue-200' :
                'bg-white border-gray-100 hover:border-blue-200'
            }`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {activeTab === 'hospital' && <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">🏥</div>}
                        {activeTab === 'police' && <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"><ShieldAlert size={20}/></div>}
                        <div>
                            <h3 className={`font-bold text-xl mb-1 flex items-center gap-2 ${
                                activeTab === 'hospital' ? 'text-red-900' :
                                activeTab === 'police' ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                                {item.name} 
                                {item.is_open_24h && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock size={12}/> 24/7</span>}
                            </h3>
                            <p className={`${activeTab === 'hospital' ? 'text-red-700/80' : activeTab === 'police' ? 'text-blue-700/80' : 'text-gray-500'} text-sm flex items-center gap-1.5`}>
                                <MapPin size={14}/> {item.address}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs font-bold">
                    {(item.specialities || []).map(s => (
                        <span key={s} className={`${activeTab === 'hospital' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'} px-2 py-1 rounded-md`}>{s}</span>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                    <a href={`tel:${item.phone}`} className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                        activeTab === 'hospital' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        activeTab === 'police' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                        'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}>
                        <Phone size={16}/> কল করুন
                    </a>
                    {item.whatsapp && (
                        <a href={`https://wa.me/${item.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-sm">
                            <MessageCircle size={16}/> WhatsApp
                        </a>
                    )}
                    <a href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer" className="flex-1 border border-gray-200 bg-white text-gray-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                        <Navigation size={16}/> রাস্তা দেখুন
                    </a>
                </div>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader
                title="ইমার্জেন্সি ও সহায়তা"
                subtitle="আপনার আসেপাশের মেকানিক, ফার্মেসি কিংবা জরুরি সেবার তথ্য।"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full py-6">
                
                {/* Emergency Banner */}
                <div className="bg-red-600 rounded-2xl p-4 sm:p-6 mb-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-red-500/20">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle size={24}/>
                        </div>
                        <div>
                            <h2 className="font-black text-xl mb-1">জরুরি? সরাসরি কল করুন!</h2>
                            <p className="text-red-100 text-sm font-medium">লাইফ থ্রেটেনিং ইমার্জেন্সিতে ৯৯৯ ডায়াল করুন।</p>
                        </div>
                    </div>
                    <a href="tel:999" className="bg-white text-red-600 px-8 py-3 rounded-xl font-black text-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-2 w-full sm:w-auto justify-center">
                        <Phone size={22} className="fill-current"/> 999
                    </a>
                </div>

                {/* Filters */}
                <div className="bg-white p-2 rounded-xl flex flex-col sm:flex-row gap-2 mb-6 shadow-sm border border-gray-100">
                    <select 
                        value={districtId}
                        onChange={e => setDistrictId(e.target.value)}
                        className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg font-bold text-gray-700 outline-none w-full sm:w-auto min-w-[200px]"
                    >
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>

                    <div className="flex bg-gray-50 p-1 rounded-lg flex-1 overflow-x-auto no-scrollbar">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[100px] py-2 px-3 rounded-md font-bold text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                    {renderServices()}
                </div>

                {services.length > 5 && (
                    <button className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                        কাছের আরো দেখুন ↓
                    </button>
                )}
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
        <Info className="mx-auto mb-3 opacity-50" size={32}/>
        <p className="font-medium">এই স্থানে আপাতত কোনো তথ্য পাওয়া যায়নি।</p>
    </div>
);

export default EmergencyFinder;
