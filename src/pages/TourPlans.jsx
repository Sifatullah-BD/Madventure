import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Map, Calendar, Plus, Trash2, Save, Share2, Download, DollarSign, MapPin, Clock, FileText, MoreVertical, CheckCircle, GripVertical, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { supabaseService } from '../services/supabaseService';

const TourPlans = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [showToast, setShowToast] = useState(null);
    const [activePlan, setActivePlan] = useState(null);
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [isAddingActivity, setIsAddingActivity] = useState(null); // { dayNum }

    // Activity state for the new activity dialog
    const [newActivity, setNewActivity] = useState({
        time: '',
        title: '',
        type: 'Sightseeing',
        cost: 0
    });

    // Plans list state with localStorage persistency
    const [myPlans, setMyPlans] = useState(() => {
        const saved = localStorage.getItem('madventure_tours_plans');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved plans, using fallbacks:", e);
            }
        }
        return []; // Start empty if no local data
    });

    // Fetch from Supabase on mount if logged in
    useEffect(() => {
        if (user?.id) {
            supabaseService.getUserPlans(user.id).then(plans => {
                if (plans && plans.length > 0) {
                    setMyPlans(plans);
                    localStorage.setItem('madventure_tours_plans', JSON.stringify(plans));
                }
            });
        }
    }, [user?.id]);

    const handleAction = (action) => {
        setShowToast(action);
        setTimeout(() => setShowToast(null), 3000);
    };

    // Calculate budget statistics dynamically
    const calculateDayCost = (day) => {
        return day.activities?.reduce((sum, act) => sum + (Number(act.cost) || 0), 0) || 0;
    };

    const calculateTotalSpent = () => {
        if (!activePlan || !activePlan.itinerary) return 0;
        return activePlan.itinerary.reduce((sum, day) => sum + calculateDayCost(day), 0);
    };

    const calculateCategoryCost = (category) => {
        if (!activePlan || !activePlan.itinerary) return 0;
        return activePlan.itinerary.reduce((sum, day) => 
            sum + (day.activities?.filter(act => act.type?.toLowerCase() === category.toLowerCase())
                .reduce((dSum, act) => dSum + (Number(act.cost) || 0), 0) || 0)
        , 0);
    };

    // Function to add a new day
    const handleAddDay = () => {
        const nextDayNum = (activePlan.itinerary?.length || 0) + 1;
        const newDay = {
            day: nextDayNum,
            title: language === 'bn' ? `দিন ${nextDayNum} ভ্রমণ পরিকল্পনা` : `Day ${nextDayNum} Adventures`,
            activities: []
        };
        setActivePlan(prev => ({
            ...prev,
            itinerary: [...(prev.itinerary || []), newDay]
        }));
        handleAction(language === 'bn' ? 'নতুন দিন যোগ করা হয়েছে' : 'Added New Day');
    };

    // Function to show Add Activity dialog
    const handleOpenAddActivity = (dayNum) => {
        setIsAddingActivity({ dayNum });
        setNewActivity({
            time: '09:00 AM',
            title: '',
            type: 'Sightseeing',
            cost: 0
        });
    };

    // Submit new activity
    const submitActivity = () => {
        if (!newActivity.title.trim()) return;

        const updatedItinerary = activePlan.itinerary.map(day => {
            if (day.day === isAddingActivity.dayNum) {
                const nextId = day.activities.length > 0 ? Math.max(...day.activities.map(a => a.id)) + 1 : 1;
                return {
                    ...day,
                    activities: [
                        ...day.activities,
                        {
                            id: nextId,
                            time: newActivity.time || '10:00 AM',
                            title: newActivity.title,
                            type: newActivity.type,
                            cost: Number(newActivity.cost) || 0
                        }
                    ]
                };
            }
            return day;
        });

        setActivePlan(prev => ({
            ...prev,
            itinerary: updatedItinerary
        }));

        setIsAddingActivity(null);
        handleAction(language === 'bn' ? 'কার্যক্রম যুক্ত করা হয়েছে' : 'Added Activity');
    };

    // Delete activity
    const handleDeleteActivity = (dayNum, actId) => {
        const updatedItinerary = activePlan.itinerary.map(day => {
            if (day.day === dayNum) {
                return {
                    ...day,
                    activities: day.activities.filter(act => act.id !== actId)
                };
            }
            return day;
        });

        setActivePlan(prev => ({
            ...prev,
            itinerary: updatedItinerary
        }));

        handleAction(language === 'bn' ? 'কার্যক্রম মুছে ফেলা হয়েছে' : 'Removed Activity');
    };

    // Save plan to localStorage and Supabase
    const handleSavePlan = async () => {
        const totalSpent = calculateTotalSpent();
        const finalPlan = {
            ...activePlan,
            duration: `${activePlan.itinerary?.length || 1} Days`,
            budget: Math.max(activePlan.budget || 0, totalSpent)
        };

        let updatedPlans;
        if (activePlan.id === 'new') {
            const nextId = myPlans.length > 0 ? Math.max(...myPlans.map(p => p.id)) + 1 : 1;
            const newPlanObj = {
                ...finalPlan,
                id: nextId,
                status: 'Planned',
                user_id: user?.id
            };
            updatedPlans = [...myPlans, newPlanObj];
            setActivePlan(newPlanObj);
            if (user?.id) await supabaseService.saveUserPlan(newPlanObj);
        } else {
            updatedPlans = myPlans.map(p => p.id === activePlan.id ? finalPlan : p);
            if (user?.id) await supabaseService.saveUserPlan(finalPlan);
        }

        setMyPlans(updatedPlans);
        localStorage.setItem('madventure_tours_plans', JSON.stringify(updatedPlans));
        handleAction(language === 'bn' ? 'ট্যুর প্ল্যান সেভ হয়েছে' : 'Saved Plan Successfully');
    };

    // Export PDF
    const handleExportPDF = () => {
        window.print();
        handleAction(language === 'bn' ? 'পিডিএফ হিসেবে প্রিন্ট করা হচ্ছে' : 'Printing to PDF');
    };

    // Share Plan
    const handleSharePlan = () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: activePlan.title,
                text: language === 'bn' ? `আমার ${activePlan.title} ভ্রমণের পরিকল্পনা দেখে নিন!` : `Check out my travel plan for ${activePlan.title}!`,
                url: shareUrl
            }).then(() => handleAction(language === 'bn' ? 'শেয়ার করা হয়েছে' : 'Shared Successfully'))
              .catch(() => {
                  navigator.clipboard.writeText(shareUrl);
                  handleAction(language === 'bn' ? 'লিংক ক্লিপবোর্ডে কপি করা হয়েছে' : 'Link Copied to Clipboard');
              });
        } else {
            navigator.clipboard.writeText(shareUrl);
            handleAction(language === 'bn' ? 'লিংক ক্লিপবোর্ডে কপি করা হয়েছে' : 'Link Copied to Clipboard');
        }
    };

    const spentTotal = calculateTotalSpent();
    const budgetTotal = activePlan?.budget || 1;
    const progressPercent = Math.min(100, Math.round((spentTotal / budgetTotal) * 100));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050f08] text-gray-900 dark:text-gray-100 pb-12 relative transition-colors duration-300">
            <DashboardHeader 
                title={language === 'bn' ? 'ভ্রমণ পরিকল্পনা' : 'Tour Plans'} 
                subtitle={language === 'bn' ? 'তৈরি এবং পরিচালনা করুন আপনার নিখুঁত ভ্রমণসূচী' : 'Create & manage your perfect itinerary'} 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {!activePlan ? (
                    // Plan List View
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {language === 'bn' ? 'আমার ভ্রমণ পরিকল্পনা সমূহ' : 'My Itineraries'}
                            </h2>
                            <button
                                onClick={() => setActivePlan({ 
                                    id: 'new', 
                                    title: language === 'bn' ? 'নতুন ভ্রমণ' : 'New Trip', 
                                    date: new Date().toISOString().split('T')[0], 
                                    duration: '1 Day', 
                                    budget: 5000, 
                                    status: 'Draft',
                                    notes: '',
                                    itinerary: [{ day: 1, title: language === 'bn' ? 'ভ্রমণ শুরু ও আগমন' : 'Arrival & Exploration', activities: [] }]
                                })}
                                className="bg-[#1B5E20] text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus size={20} /> {language === 'bn' ? 'নতুন পরিকল্পনা তৈরি করুন' : 'Create New Plan'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myPlans.map(plan => (
                                <div key={plan.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => setActivePlan(plan)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center text-[#1B5E20] dark:text-green-400 group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                                            <Map size={24} />
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{plan.title}</h3>
                                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} /> {plan.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} /> {plan.duration}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} /> {language === 'bn' ? `বাজেট: ৳${plan.budget}` : `Est. Budget: ৳${plan.budget}`}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.status === 'Draft' ? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300' : 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400'}`}>
                                            {plan.status}
                                        </span>
                                        <span className="text-[#1B5E20] dark:text-green-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                            {language === 'bn' ? 'সম্পাদনা করুন →' : 'Edit Plan →'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* AI Generator Card */}
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer" onClick={() => setActivePlan({ 
                                    id: 'new', 
                                    title: language === 'bn' ? 'আমার এআই ভ্রমণ পরিকল্পনা' : 'AI Generated Itinerary', 
                                    date: new Date().toISOString().split('T')[0], 
                                    duration: '2 Days', 
                                    budget: 6000, 
                                    status: 'Draft',
                                    notes: 'This itinerary was beautifully auto-generated by Madventure AI Co-Pilot.',
                                    itinerary: [
                                        { 
                                            day: 1, 
                                            title: language === 'bn' ? 'এআই গাইড ভ্রমণ শুরু' : 'AI Co-Pilot Kickoff', 
                                            activities: [
                                                { id: 1, time: '08:00 AM', title: 'Arrival & Welcome Drinks', type: 'Accommodation', cost: 500 },
                                                { id: 2, time: '11:00 AM', title: 'Sightseeing & Main Attractions Tour', type: 'Sightseeing', cost: 100 },
                                                { id: 3, time: '01:30 PM', title: 'Traditional Premium Lunch', type: 'Food', cost: 350 }
                                            ] 
                                        },
                                        {
                                            day: 2,
                                            title: language === 'bn' ? 'অ্যাডভেঞ্চার ও ফিরে আসা' : 'Adventure Trails & Return Journey',
                                            activities: [
                                                { id: 1, time: '06:00 AM', title: 'Trekking & Photo Walks', type: 'Adventure', cost: 150 },
                                                { id: 2, time: '05:00 PM', title: 'Bus ride back to station', type: 'Transport', cost: 800 }
                                            ]
                                        }
                                    ]
                                })}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-150 transition-transform duration-700">
                                    <Map size={150} />
                                </div>
                                <div>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block border border-white/30">AI Powered</span>
                                    <h3 className="text-2xl font-bold mb-2">{language === 'bn' ? 'অটো-জেনারেট ট্রিপ' : 'Auto-Generate Trip'}</h3>
                                    <p className="text-purple-100 text-sm">
                                        {language === 'bn' ? 'এআই সহকারীর মাধ্যমে আপনার বাজেট ও পছন্দ অনুযায়ী নিখুঁত প্ল্যান তৈরি করুন।' : 'Let AI create the perfect itinerary based on your budget & interests.'}
                                    </p>
                                </div>
                                <button className="mt-6 bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                                    {language === 'bn' ? 'এআই প্ল্যানার ট্রাই করুন' : 'Try AI Planner'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Itinerary Builder View
                    <div className="animate-fade-in print:p-0">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                            <div>
                                <button onClick={() => { setActivePlan(null); setIsEditingHeader(false); }} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-bold mb-2 flex items-center gap-1">
                                    &larr; {language === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to Plans'}
                                </button>
                                
                                {isEditingHeader ? (
                                    <div className="flex flex-col gap-2 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-md">
                                        <input 
                                            type="text" 
                                            className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-2.5 rounded-xl text-lg font-bold w-full text-gray-800 dark:text-white" 
                                            value={activePlan.title} 
                                            onChange={e => setActivePlan({...activePlan, title: e.target.value})} 
                                        />
                                        <div className="flex gap-2">
                                            <input 
                                                type="date" 
                                                className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-2.5 rounded-xl text-sm w-full text-gray-800 dark:text-white" 
                                                value={activePlan.date} 
                                                onChange={e => setActivePlan({...activePlan, date: e.target.value})} 
                                            />
                                            <input 
                                                type="number" 
                                                className="bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-2.5 rounded-xl text-sm w-full text-gray-800 dark:text-white" 
                                                placeholder={language === 'bn' ? 'বাজেট' : 'Budget'}
                                                value={activePlan.budget} 
                                                onChange={e => setActivePlan({...activePlan, budget: Number(e.target.value)})} 
                                            />
                                        </div>
                                        <button onClick={() => setIsEditingHeader(false)} className="bg-[#1B5E20] hover:bg-green-700 text-white py-2 px-5 rounded-xl font-bold text-sm self-end">Done</button>
                                    </div>
                                ) : (
                                    <div onClick={() => setIsEditingHeader(true)} className="cursor-pointer group" title="Click to Edit Trip Details">
                                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 group-hover:text-[#1B5E20] dark:group-hover:text-green-400 transition-colors">
                                            {activePlan.title} <span className="text-xs text-gray-400 font-normal opacity-80">(Click to edit)</span>
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                            <Calendar size={16} /> {activePlan.date || 'Set Date'} • {activePlan.itinerary?.length || 0} {language === 'bn' ? 'দিন' : 'Days'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={handleSavePlan} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex-1 md:flex-none justify-center">
                                    <Save size={18} className="text-green-600" /> {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
                                </button>
                                <button onClick={handleExportPDF} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex-1 md:flex-none justify-center">
                                    <Download size={18} className="text-blue-600" /> {language === 'bn' ? 'পিডিএফ' : 'PDF'}
                                </button>
                                <button onClick={handleSharePlan} className="bg-[#1B5E20] hover:bg-green-750 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all flex-1 md:flex-none justify-center">
                                    <Share2 size={18} /> {language === 'bn' ? 'শেয়ার' : 'Share'}
                                </button>
                            </div>
                        </div>

                        {/* Print Header */}
                        <div className="hidden print:block text-center border-b pb-6 mb-8 text-black">
                            <h1 className="text-4xl font-bold">{activePlan.title}</h1>
                            <p className="text-gray-600 mt-2">{activePlan.date} • {activePlan.itinerary?.length || 0} Days • Budget: ৳{activePlan.budget}</p>
                            <p className="text-xs text-gray-400 mt-1">Generated by Madventure Travel OS</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Itinerary Timeline */}
                            <div className="lg:col-span-2 space-y-6">
                                {activePlan.itinerary?.map((day) => (
                                    <div key={day.day} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                <span className="bg-green-50 dark:bg-green-950/40 text-[#1B5E20] dark:text-green-400 px-3 py-1 rounded-xl text-sm font-bold">
                                                    {language === 'bn' ? `দিন ${day.day}` : `Day ${day.day}`}
                                                </span>
                                                {day.title}
                                            </h3>
                                            <button 
                                                onClick={() => handleOpenAddActivity(day.day)} 
                                                className="text-[#1B5E20] dark:text-green-400 text-sm font-bold hover:underline print:hidden"
                                            >
                                                + {language === 'bn' ? 'কার্যক্রম যোগ করুন' : 'Add Activity'}
                                            </button>
                                        </div>

                                        <div className="space-y-4 relative pl-4 border-l-2 border-gray-100 dark:border-slate-800">
                                            {day.activities?.length === 0 ? (
                                                <p className="text-gray-400 dark:text-gray-500 text-sm italic pl-2">
                                                    {language === 'bn' ? 'কোনো কার্যক্রম নেই। নতুন কার্যক্রম যোগ করতে উপরে ক্লিক করুন।' : 'No activities scheduled. Click Add Activity to plan your day.'}
                                                </p>
                                            ) : (
                                                day.activities?.map((activity) => (
                                                    <div key={activity.id} className="relative pl-6 group">
                                                        {/* Timeline Dot */}
                                                        <div className="absolute -left-[21px] top-3.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-[#1B5E20] dark:border-green-400"></div>

                                                        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-700 flex justify-between items-center group">
                                                            <div className="flex items-center gap-3">
                                                                <GripVertical className="text-gray-300 dark:text-gray-600 print:hidden" size={18} />
                                                                <div>
                                                                    <p className="text-xs font-bold text-[#1B5E20] dark:text-green-400 mb-1">{activity.time}</p>
                                                                    <h4 className="font-bold text-gray-800 dark:text-white leading-tight">{activity.title}</h4>
                                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-slate-700 mt-1.5 inline-block">
                                                                        {activity.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex items-center gap-4">
                                                                <div>
                                                                    <p className="font-bold text-gray-800 dark:text-white">৳{activity.cost}</p>
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleDeleteActivity(day.day, activity.id)}
                                                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg print:hidden"
                                                                    title="Delete Activity"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    onClick={handleAddDay}
                                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-2xl text-gray-400 dark:text-gray-500 font-bold hover:border-[#1B5E20] hover:text-[#1B5E20] dark:hover:border-green-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/10 transition-all flex items-center justify-center gap-2 print:hidden"
                                >
                                    <Plus size={20} /> {language === 'bn' ? 'আরেকটি দিন যোগ করুন' : 'Add Another Day'}
                                </button>
                            </div>

                            {/* Sidebar: Budget & Notes */}
                            <div className="space-y-6">
                                {/* Budget Tracker */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <DollarSign className="text-[#1B5E20] dark:text-green-400" size={20} /> {language === 'bn' ? 'বাজেট ট্র্যাকার' : 'Budget Tracker'}
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{language === 'bn' ? 'পরিবহন খরচ' : 'Transport'}</span>
                                            <span className="font-bold">৳{calculateCategoryCost('Transport')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{language === 'bn' ? 'খাবার খরচ' : 'Food'}</span>
                                            <span className="font-bold">৳{calculateCategoryCost('Food')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{language === 'bn' ? 'ঘোরাঘুরি ও অ্যাডভেঞ্চার' : 'Sightseeing & Adventure'}</span>
                                            <span className="font-bold">৳{calculateCategoryCost('Sightseeing') + calculateCategoryCost('Adventure')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{language === 'bn' ? 'হোটেল ও থাকার খরচ' : 'Accommodation'}</span>
                                            <span className="font-bold">৳{calculateCategoryCost('Accommodation')}</span>
                                        </div>
                                        <div className="border-t dark:border-slate-800 pt-3 flex justify-between font-bold text-lg">
                                            <span>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</span>
                                            <span className="text-[#1B5E20] dark:text-green-400">৳{spentTotal}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${progressPercent > 90 ? 'bg-red-500' : progressPercent > 70 ? 'bg-yellow-500' : 'bg-[#1B5E20]'}`} 
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        {progressPercent}% of ৳{budgetTotal} {language === 'bn' ? 'বাজেট ব্যবহৃত হয়েছে' : 'budget used'}
                                    </p>
                                </div>

                                {/* Notes */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 print:bg-yellow-50/20">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <FileText className="text-yellow-500" size={20} /> {language === 'bn' ? 'ভ্রমণ নোটস' : 'Trip Notes'}
                                    </h3>
                                    <textarea
                                        className="w-full h-36 p-3.5 bg-yellow-50/40 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 rounded-2xl text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none print:bg-transparent print:border-none print:p-0"
                                        placeholder={language === 'bn' ? 'আপনার প্রয়োজনীয় তথ্যগুলো এখানে লিখে রাখুন...' : "Don't forget to pack sunscreen and power bank..."}
                                        value={activePlan.notes || ''}
                                        onChange={e => setActivePlan({...activePlan, notes: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Add Activity Modal */}
            {isAddingActivity && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-800 animate-scale-up">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {language === 'bn' ? `দিন ${isAddingActivity.dayNum} এ নতুন কার্যক্রম` : `Add Activity to Day ${isAddingActivity.dayNum}`}
                            </h3>
                            <button 
                                onClick={() => setIsAddingActivity(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 bg-gray-50 dark:bg-slate-800 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{language === 'bn' ? 'সময়' : 'Time'}</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 09:00 AM" 
                                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-3.5 rounded-2xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#1B5E20] transition-all" 
                                    value={newActivity.time} 
                                    onChange={e => setNewActivity({...newActivity, time: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{language === 'bn' ? 'কার্যক্রমের নাম' : 'Activity Title'}</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Konglak Para trekking" 
                                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-3.5 rounded-2xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#1B5E20] transition-all" 
                                    value={newActivity.title} 
                                    onChange={e => setNewActivity({...newActivity, title: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{language === 'bn' ? 'ধরন' : 'Type'}</label>
                                    <select 
                                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-3.5 rounded-2xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#1B5E20] transition-all" 
                                        value={newActivity.type} 
                                        onChange={e => setNewActivity({...newActivity, type: e.target.value})}
                                    >
                                        <option value="Sightseeing">{language === 'bn' ? 'ঘোরাঘুরি' : 'Sightseeing'}</option>
                                        <option value="Transport">{language === 'bn' ? 'যাতায়াত' : 'Transport'}</option>
                                        <option value="Food">{language === 'bn' ? 'খাবার' : 'Food'}</option>
                                        <option value="Adventure">{language === 'bn' ? 'অ্যাডভেঞ্চার' : 'Adventure'}</option>
                                        <option value="Accommodation">{language === 'bn' ? 'হোটেল/থাকা' : 'Accommodation'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">{language === 'bn' ? 'খরচ (৳)' : 'Cost (৳)'}</label>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 p-3.5 rounded-2xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#1B5E20] transition-all" 
                                        value={newActivity.cost} 
                                        onChange={e => setNewActivity({...newActivity, cost: Number(e.target.value)})} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setIsAddingActivity(null)} 
                                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-200 py-3.5 rounded-2xl font-bold text-sm transition-all"
                            >
                                {language === 'bn' ? 'বাতিল' : 'Cancel'}
                            </button>
                            <button 
                                onClick={submitActivity} 
                                className="flex-1 bg-[#1B5E20] hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md"
                            >
                                {language === 'bn' ? 'যুক্ত করুন' : 'Add Activity'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50 border border-gray-800 dark:border-slate-700">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold text-sm">{language === 'bn' ? 'সফল হয়েছে' : 'Success'}</h4>
                        <p className="text-xs text-gray-400">{showToast}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourPlans;
