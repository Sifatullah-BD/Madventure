import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
    const { language } = useLanguage();

    const isBn = language === 'bn';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={16} /> {isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
                </Link>

                <div className="bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <Shield size={32} />
                        <span className="text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            {isBn ? 'গোপনীয়তা নীতি' : 'Legal & Privacy'}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        {isBn ? 'ম্যাডভেঞ্চার প্রাইভেসী পলিসি' : 'Privacy Policy'}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mb-8">
                        {isBn ? 'সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৬' : 'Last updated: January 1, 2026'}
                    </p>

                    <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Lock size={20} className="text-primary" />
                                {isBn ? '১. সংগৃহীত তথ্যাবলী' : '1. Information We Collect'}
                            </h2>
                            <p className="mb-3">
                                {isBn 
                                    ? 'ম্যাডভেঞ্চার প্ল্যাটফর্ম ব্যবহারের সময় আমরা আপনার থেকে প্রয়োজনীয় কিছু তথ্য সংগ্রহ করি:'
                                    : 'When using the Madventure platform, we collect certain essential information:'}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>{isBn ? 'ব্যক্তিগত তথ্য: নাম, ইমেইল অ্যাড্রেস, ফোন নম্বর এবং প্রোফাইল ছবি।' : 'Personal Information: Name, email address, phone number, and profile image.'}</li>
                                <li>{isBn ? 'লোকেশন ডেটা: অন-স্পট গাইড এবং ইমার্জেন্সি এসওএস (SOS) পরিষেবার জন্য আপনার সম্মতিসাপেক্ষে জিপিএস অবস্থান।' : 'Location Data: GPS coordinates (with consent) for On-spot Guide and Emergency SOS features.'}</li>
                                <li>{isBn ? 'পেমেন্ট ও বুকিং ডেটা: ট্রিপ বুকিং ইতিহাস এবং পেমেন্ট ট্রানজেকশন আইডি (আমরা কার্ড নম্বর সংরক্ষণ করি না)।' : 'Payment & Booking Data: Trip booking history and transaction IDs (we do not store raw credit card details).'}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Eye size={20} className="text-primary" />
                                {isBn ? '২. তথ্যের ব্যবহার' : '2. How We Use Your Information'}
                            </h2>
                            <p className="mb-3">
                                {isBn 
                                    ? 'সংগৃহীত তথ্যসমূহ নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:'
                                    : 'The information gathered is used for the following purposes:'}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>{isBn ? 'ট্যুর ইভেন্ট বুকিং ও টিকিট কনফার্মেশন প্রসেস করা।' : 'Processing tour bookings and ticket confirmations.'}</li>
                                <li>{isBn ? 'স্মার্ট এআই প্ল্যানার দ্বারা কাস্টমাইজড ট্রিপ প্যাকেজ তৈরি করা।' : 'Generating customized itineraries via Smart AI Planner.'}</li>
                                <li>{isBn ? 'জরুরি পরিস্থিতিতে লোকাল সাপোর্ট ও রেসকিউ টিমকে তথ্য প্রদান।' : 'Providing location context to local rescue teams in emergencies.'}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <FileText size={20} className="text-primary" />
                                {isBn ? '৩. ডাটা সুরক্ষা ও নিরাপত্তা' : '3. Data Security & Storage'}
                            </h2>
                            <p>
                                {isBn 
                                    ? 'আমরা আপনার তথ্য সুরক্ষায় SSL এনক্রিপশন এবং সুনির্দিষ্ট Supabase RLS (Row Level Security) পলিসি ব্যবহার করি। আপনার সম্মতি ছাড়া আমরা কখনো কোনো তৃতীয় পক্ষের নিকট আপনার ব্যক্তিগত তথ্য বিক্রয় করি না।'
                                    : 'We protect your data using SSL encryption and Supabase Row Level Security (RLS). We never sell your personal information to third parties.'}
                            </p>
                        </section>

                        <section className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {isBn ? 'যোগাযোগ' : 'Contact Us'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {isBn ? 'প্রাইভেসি পলিসি সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের ইমেইল করুন: ' : 'For privacy questions, please email us at: '}
                                <a href="mailto:madventurepim19@gmail.com" className="text-primary font-bold hover:underline">madventurepim19@gmail.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
