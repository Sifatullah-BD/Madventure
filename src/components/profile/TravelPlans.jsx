import React, { useState, useEffect } from 'react';
import { Map, Loader2, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { useLanguage } from '../../context/LanguageContext';

const TravelPlans = ({ user }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchPlans = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await supabaseService.getUserPlans(user.id);
                setPlans(data || []);
            } catch (error) {
                console.error("Error fetching travel plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32 bg-[#0d1a11] rounded-[2.5rem] border border-white/5 shadow-xl">
                <Loader2 className="animate-spin text-forest-light" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-[#0d1a11] p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-xl min-h-[60vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                        <Map className="text-sky-500" /> 
                        {language === 'bn' ? 'আমার ট্যুর প্ল্যান' : 'Travel Plans'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {language === 'bn' ? 'আপনার সেভ করা এআই প্ল্যান এবং ড্রাফট' : 'Your saved AI itineraries and drafts'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/planner')}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
                    >
                        <Plus size={16} />
                        {language === 'bn' ? 'নতুন প্ল্যান' : 'New Plan'}
                    </button>
                    <button 
                        onClick={() => navigate('/tour-plans')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white border border-white/10 transition-all flex items-center gap-2"
                    >
                        {language === 'bn' ? 'সব প্ল্যান দেখুন' : 'View All'}
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {plans.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <Map size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold">{language === 'bn' ? 'কোনো প্ল্যান পাওয়া যায়নি' : 'No travel plans created yet'}</p>
                    <button 
                        onClick={() => navigate('/planner')}
                        className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 rounded-xl text-white font-bold text-sm transition-all"
                    >
                        {language === 'bn' ? 'এআই দিয়ে প্ল্যান করুন' : 'Create with AI'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white/5 border border-white/10 hover:border-sky-500/50 p-5 rounded-2xl transition-all group">
                            <h4 className="text-white font-bold text-lg mb-2 group-hover:text-sky-500 transition-colors">
                                {plan.title || 'Untitled Plan'}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(plan.created_at || Date.now()).toLocaleDateString()}
                                </span>
                                {plan.destination && (
                                    <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md">
                                        {plan.destination}
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={() => navigate('/tour-plans')}
                                className="text-sky-500 hover:text-white text-sm font-bold flex items-center gap-1 transition-colors"
                            >
                                {language === 'bn' ? 'প্ল্যান খুলুন' : 'Open Plan'} <ChevronRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TravelPlans;
