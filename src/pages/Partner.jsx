import React, { useRef } from 'react';
import { Briefcase, CheckCircle, TrendingUp, Users, Globe, ArrowRight, Upload, User, FileText } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { uploadImages } from '../api/storage';
import { createPartnerRequest } from '../api/community';
import { useToast } from '../components/ui/Toast';

import { useLanguage } from '../context/LanguageContext';

const Partner = () => {
    const { language } = useLanguage();
    const [submitted, setSubmitted] = React.useState(false);
    const [businessName, setBusinessName] = React.useState('');
    const [businessType, setBusinessType] = React.useState('Hotel / Resort');
    const [location, setLocation] = React.useState('');
    const [ownerName, setOwnerName] = React.useState('');
    const [nid, setNid] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const fileRef = useRef(null);
    const toast = useToast();

    const validatePhone = (value) => {
        const digits = value.replace(/\D/g, '');
        return (digits.length === 11 && digits.startsWith('01')) || (digits.length === 13 && digits.startsWith('8801'));
    };

    const validateNid = (value) => {
        const digits = value.replace(/\D/g, '');
        return [10, 13, 17].includes(digits.length);
    };

    const handleFileClick = () => fileRef.current && fileRef.current.click();

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
            toast.error(language === 'bn' ? 'ফাইলটি অনেক বড়। সর্বোচ্চ ৫এমবি অনুমতিযোগ্য।' : 'File too large. Max 5MB allowed.');
            return;
        }
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowed.includes(f.type)) {
            toast.error(language === 'bn' ? 'অকার্যকর ফাইল টাইপ। PDF, JPG বা PNG ব্যবহার করুন।' : 'Invalid file type. Use PDF, JPG or PNG.');
            return;
        }
        setFile(f);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhone(phone)) return toast.error(language === 'bn' ? 'অকার্যকর ফোন নম্বর।' : 'Invalid phone number.');
        if (!validateNid(nid)) return toast.error(language === 'bn' ? 'অকার্যকর এনআইডি।' : 'Invalid NID.');

        setUploading(true);
        try {
            let docUrls = [];
            if (file) {
                const { data, error } = await uploadImages('partner-docs', [file]);
                if (error) throw error;
                docUrls = data || [];
            }

            const payload = {
                business_name: businessName,
                business_type: businessType,
                location,
                owner_name: ownerName,
                nid,
                phone,
                email,
                documents: docUrls,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const { data, error } = await createPartnerRequest(payload);
            if (error) throw error;

            toast.success(language === 'bn' ? 'আবেদন সফলভাবে জমা দেওয়া হয়েছে' : 'Application submitted successfully');
            setSubmitted(true);
            setBusinessName(''); setBusinessType('Hotel / Resort'); setLocation(''); setOwnerName(''); setNid(''); setPhone(''); setEmail(''); setFile(null);
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to submit application');
        } finally {
            setUploading(false);
        }
    };

    const benefits = [
        {
            icon: Globe,
            title: language === 'bn' ? 'ফ্রি মার্কেটিং' : 'Free Marketing',
            desc: language === 'bn' ? 'বিজ্ঞাপনে খরচ না করেই আপনার ব্যবসা বিশ্বজুড়ে প্রদর্শন করুন।' : 'Showcase your business to a global audience without spending a dime on ads.',
            color: 'blue'
        },
        {
            icon: TrendingUp,
            title: language === 'bn' ? 'রাজস্ব বৃদ্ধি' : 'Increase Revenue',
            desc: language === 'bn' ? 'সরাসরি আমাদের প্ল্যাটফর্মের মাধ্যমে আরও বেশি বুকিং এবং কাস্টমার পান।' : 'Get more bookings and customers directly through our platform.',
            color: 'green'
        },
        {
            icon: Users,
            title: language === 'bn' ? 'বিজনেস ড্যাশবোর্ড' : 'Business Dashboard',
            desc: language === 'bn' ? 'বুকিং ম্যানেজ করুন এবং সহজেই অ্যানালিটিক্স ট্র্যাক করুন।' : 'Manage bookings, track analytics, and respond to reviews easily.',
            color: 'purple'
        }
    ];

    return (
        <div className="h-full bg-gray-50 dark:bg-[#020d06] transition-colors duration-300">
            <DashboardHeader
                title={language === 'bn' ? 'ম্যাডভেঞ্চারের সাথে আপনার ব্যবসা বাড়ান' : 'Grow Your Business with Madventure'}
                subtitle={language === 'bn' ? 'হাজার হাজার হোটেল, ট্যুর গাইড এবং রেন্টাল সার্ভিসের সাথে যোগ দিন।' : 'Join thousands of hotels, tour guides, and rental services growing their revenue with us.'}
            />
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Benefits */}
                    <div className="space-y-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-${b.color}-100 dark:bg-${b.color}-900/30 text-${b.color}-600 dark:text-${b.color}-400`}>
                                    <b.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{b.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Registration Form */}
                    <div id="register-form" className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        {!submitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Briefcase className="text-primary" /> {language === 'bn' ? 'আপনার ব্যবসা নিবন্ধন করুন' : 'Register Your Business'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'ব্যবসার নাম' : 'Business Name'}</label>
                                        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} type="text" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="e.g. Sea View Hotel" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'ব্যবসার ধরন' : 'Business Type'}</label>
                                            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white">
                                                <option>{language === 'bn' ? 'হোটেল / রিসোর্ট' : 'Hotel / Resort'}</option>
                                                <option>{language === 'bn' ? 'ট্যুর গাইড' : 'Tour Guide'}</option>
                                                <option>{language === 'bn' ? 'রেন্ট-এ-কার' : 'Rent-a-Car'}</option>
                                                <option>{language === 'bn' ? 'রেস্টুরেন্ট' : 'Restaurant'}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'অবস্থান' : 'Location'}</label>
                                            <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="City / Area" />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <User size={16} /> {language === 'bn' ? 'মালিকের তথ্য' : 'Owner Information'}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'মালিকের নাম' : 'Owner Name'}</label>
                                                <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} type="text" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="Full Name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'এনআইডি নম্বর' : 'NID Number'}</label>
                                                <input value={nid} onChange={(e) => setNid(e.target.value)} type="text" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="National ID" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'যোগাযোগ নম্বর' : 'Contact Number'}</label>
                                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="+880..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'ইমেল ঠিকানা' : 'Email Address'}</label>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white" placeholder="business@example.com" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{language === 'bn' ? 'ট্রেড লাইসেন্স / ব্যবসার প্রমাণ' : 'Trade License / Business Proof'}</label>
                                        <input ref={fileRef} onChange={handleFileChange} type="file" accept=".pdf,image/*" className="hidden" />
                                        <div onClick={handleFileClick} className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 dark:bg-slate-700/50">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                            {file ? (
                                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Selected: {file.name}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{language === 'bn' ? 'ফাইল আপলোড করতে ক্লিক করুন' : 'Click to upload document'}</p>
                                                    <p className="text-xs text-gray-400">PDF, JPG or PNG (Max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button disabled={uploading} type="submit" className="w-full bg-primary disabled:opacity-60 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                        {uploading ? (language === 'bn' ? 'জমা দেওয়া হচ্ছে...' : 'Submitting…') : (language === 'bn' ? 'আবেদন জমা দিন' : 'Submit Application')} <ArrowRight size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{language === 'bn' ? 'আবেদন গ্রহণ করা হয়েছে!' : 'Application Received!'}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">{language === 'bn' ? 'আপনার আগ্রহের জন্য ধন্যবাদ। আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।' : 'Thank you for your interest. Our team will review your application and contact you within 24 hours.'}</p>
                                <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                                    {language === 'bn' ? 'অন্য একটি আবেদন জমা দিন' : 'Submit another application'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partner;
