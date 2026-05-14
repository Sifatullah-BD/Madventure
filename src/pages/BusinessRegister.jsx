import React, { useState } from 'react';
import { Store, MapPin, Phone, Camera, DollarSign, Check, ArrowRight, ArrowLeft, CheckCircle, Building2, Globe, MessageCircle } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../data/businessData';
import { districtsData } from '../data/districts';
import { businessService } from '../services/businessService';
import { useToast } from '../components/ui/Toast';

const STEPS = [
    { id: 1, label: 'মৌলিক তথ্য', icon: Store },
    { id: 2, label: 'যোগাযোগ ও লোকেশন', icon: Phone },
    { id: 3, label: 'সাবমিট', icon: Check },
];

const BusinessRegister = () => {
    const toast = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        division: '',
        district: '',
        address: '',
        phone: '',
        whatsapp: '',
        facebook: '',
        website: '',
        images: [],
        priceRange: '',
        amenities: [],
    });

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const filteredDistricts = form.division
        ? districtsData.find(d => d.division === form.division)?.districts || []
        : [];

    const canProceed = () => {
        switch (currentStep) {
            case 1: return form.name && form.category && form.description;
            case 2: return form.division && form.district && form.phone;
            default: return true;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await businessService.registerBusiness({
                ...form,
                location: `${form.district}, ${form.division}`,
            });
            setIsSubmitted(true);
            toast.success('আপনার আবেদন সফলভাবে জমা হয়েছে!');
        } catch (err) {
            toast.error('কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">আবেদন জমা হয়েছে! 🎉</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        আমাদের টিম আপনার আবেদন পর্যালোচনা করবে এবং ২৪ ঘণ্টার মধ্যে আপনাকে জানাবে।
                    </p>
                    <a href="/explore" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all inline-block">
                        এক্সপ্লোর পেজে যান
                    </a>
                </div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-800 dark:text-white placeholder-gray-400";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ব্যবসা নিবন্ধন করুন</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Madventure-এ আপনার ব্যবসা যোগ করুন এবং হাজারো ভ্রমণকারীর কাছে পৌঁছান</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 px-2">
                    {STEPS.map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    currentStep > step.id ? 'bg-primary text-white' :
                                    currentStep === step.id ? 'bg-primary text-white scale-110 shadow-lg shadow-green-200' :
                                    'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}>
                                    {currentStep > step.id ? <Check size={16} /> : <step.icon size={16} />}
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1 hidden md:block">{step.label}</span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-fade-in">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">মৌলিক তথ্য</h2>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">ব্যবসার নাম *</label>
                                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} placeholder="যেমন: সী পার্ল বিচ রিসোর্ট" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">ক্যাটেগরি *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {BUSINESS_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => update('category', cat.id)}
                                            className={`p-3 rounded-xl border text-sm font-bold transition-all text-left ${
                                                form.category === cat.id
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary/30'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">বিবরণ *</label>
                                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="আপনার ব্যবসা সম্পর্কে বিস্তারিত লিখুন..." />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact & Location */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-fade-in">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">যোগাযোগ ও লোকেশন</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">বিভাগ *</label>
                                    <select value={form.division} onChange={e => { update('division', e.target.value); update('district', ''); }} className={inputClass}>
                                        <option value="">বিভাগ নির্বাচন করুন</option>
                                        {districtsData.map((d, i) => (
                                            <option key={i} value={d.division}>{d.division}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">জেলা *</label>
                                    <select value={form.district} onChange={e => update('district', e.target.value)} className={inputClass} disabled={!form.division}>
                                        <option value="">জেলা নির্বাচন করুন</option>
                                        {filteredDistricts.map((d, i) => (
                                            <option key={i} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">ফোন নম্বর *</label>
                                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} placeholder="+880 1XXX-XXXXXX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                                        <MessageCircle size={12} className="inline mr-1" /> WhatsApp নম্বর
                                    </label>
                                    <input type="tel" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} className={inputClass} placeholder="8801XXXXXXXXX" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <div className="space-y-5 animate-fade-in">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">তথ্য পর্যালোচনা</h2>
                            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl space-y-3">
                                <div className="flex justify-between"><span className="text-gray-500 text-sm">নাম</span><span className="font-bold text-gray-800 dark:text-white text-sm">{form.name}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 text-sm">ক্যাটেগরি</span><span className="font-bold text-gray-800 dark:text-white text-sm">{BUSINESS_CATEGORIES.find(c => c.id === form.category)?.label}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 text-sm">লোকেশন</span><span className="font-bold text-gray-800 dark:text-white text-sm">{form.district}, {form.division?.replace(' Division', '')}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 text-sm">ফোন</span><span className="font-bold text-gray-800 dark:text-white text-sm">{form.phone}</span></div>
                            </div>
                            <p className="text-xs text-gray-400 text-center">
                                ছবি আপলোড এবং অন্যান্য বিস্তারিত তথ্য আপনি অ্যাডমিন ড্যাশবোর্ড থেকে দিতে পারবেন।
                                সাবমিট করার পর আমাদের টিম আপনার তথ্য পর্যালোচনা করবে।
                            </p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        {currentStep > 1 ? (
                            <button onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold hover:text-gray-800 dark:hover:text-white transition-colors">
                                <ArrowLeft size={18} /> আগের ধাপ
                            </button>
                        ) : <div />}

                        {currentStep < 3 ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={!canProceed()}
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                পরবর্তী <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                            >
                                {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'সাবমিট করুন'} <CheckCircle size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessRegister;
