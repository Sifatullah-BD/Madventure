import React from 'react';
import { FileCheck, AlertCircle, UserCheck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
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
                        <FileCheck size={32} />
                        <span className="text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            {isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        {isBn ? 'ম্যাডভেঞ্চার টার্মস ও কন্ডিশনস' : 'Terms & Conditions'}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mb-8">
                        {isBn ? 'সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৬' : 'Last updated: January 1, 2026'}
                    </p>

                    <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <UserCheck size={20} className="text-primary" />
                                {isBn ? '১. একাউন্ট এবং নিবন্ধন' : '1. Account & Registration'}
                            </h2>
                            <p>
                                {isBn 
                                    ? 'ম্যাডভেঞ্চার সার্ভিস ব্যবহার করার জন্য ব্যবহারকারীকে সঠিক ও নির্ভুল তথ্য প্রদান করতে হবে। ব্যবহারকারীর অ্যাকাউন্ট পাসওয়ার্ড গোপন রাখার দায়িত্ব সম্পূর্ণ ব্যবহারকারীর।'
                                    : 'Users must provide accurate information when creating an account on Madventure. You are responsible for safeguarding your login credentials.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-primary" />
                                {isBn ? '২. বুকিং ও গাইড নীতি' : '2. Booking & Guide Guidelines'}
                            </h2>
                            <p className="mb-3">
                                {isBn 
                                    ? 'ট্যুর প্যাকেজ বুকিং বা স্থানীয় গাইড সার্ভিসের ক্ষেত্রে:'
                                    : 'When booking tour packages or hiring local guides:'}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>{isBn ? 'অনুমোদিত ট্রাভেল এজেন্সির প্রদানকৃত রুলস ও নির্দেশিকা মেনে চলতে হবে।' : 'Travelers must comply with safety rules set by verified agencies.'}</li>
                                <li>{isBn ? 'পরিবেশের ক্ষতি সাধন বা বন্যপ্রাণীর ক্ষতি করা সম্পূর্ণ নিষিদ্ধ।' : 'Damaging natural environments or wildlife is strictly prohibited.'}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <AlertCircle size={20} className="text-primary" />
                                {isBn ? '৩. দায়বদ্ধতার সীমাবদ্ধতা' : '3. Limitation of Liability'}
                            </h2>
                            <p>
                                {isBn 
                                    ? 'প্রাকৃতিক দুর্যোগ, আকস্মিক রাজনৈতিক অস্থিতিশীলতা বা অনাকাঙ্ক্ষিত দুর্ঘটনার ক্ষেত্রে ম্যাডভেঞ্চার প্রত্যক্ষভাবে দায়ী থাকবে না, তবে সম্ভাব্য সর্বাত্মক জরুরি সহায়তা প্রদান করবে।'
                                    : 'Madventure is not directly liable for unforeseen natural disasters or accidents during trips, though emergency support will be provided.'}
                            </p>
                        </section>

                        <section className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {isBn ? 'যেকোনো জিজ্ঞাসায় যোগাযোগের জন্য: ' : 'For questions regarding terms: '}
                                <a href="mailto:madventurepim19@gmail.com" className="text-primary font-bold hover:underline">madventurepim19@gmail.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
