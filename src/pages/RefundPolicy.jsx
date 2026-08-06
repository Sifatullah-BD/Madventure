import React from 'react';
import { RefreshCcw, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const RefundPolicy = () => {
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
                        <RefreshCcw size={32} />
                        <span className="text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            {isBn ? 'রিফান্ড নীতি' : 'Refund Guidelines'}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        {isBn ? 'রিফান্ড ও ক্যানসেলেশন নীতি' : 'Refund & Cancellation Policy'}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mb-8">
                        {isBn ? 'সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৬' : 'Last updated: January 1, 2026'}
                    </p>

                    <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Clock size={20} className="text-primary" />
                                {isBn ? '১. ট্যুর ক্যানসেলেশন ও রিফান্ড পার্সেন্টেজ' : '1. Cancellation Timeframe & Refund Tier'}
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse my-3">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase font-bold text-gray-500">
                                            <th className="py-3 px-4">{isBn ? 'ক্যানসেলেশনের সময়' : 'Cancellation Timeframe'}</th>
                                            <th className="py-3 px-4">{isBn ? 'ফেরতযোগ্য পরিমাণ' : 'Refund Amount'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                        <tr>
                                            <td className="py-3 px-4 font-medium">{isBn ? 'ট্যুর শুরুর ৭ দিন বা তার বেশি পূর্বে' : '7+ days before trip start'}</td>
                                            <td className="py-3 px-4 font-bold text-green-600">১০০% রিফান্ড (100%)</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">{isBn ? 'ট্যুর শুরুর ৩ থেকে ৬ দিন পূর্বে' : '3-6 days before trip start'}</td>
                                            <td className="py-3 px-4 font-bold text-orange-500">৫০% রিফান্ড (50%)</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">{isBn ? 'ট্যুর শুরুর ৭২ ঘণ্টার কম সময়ে' : 'Less than 72 hours'}</td>
                                            <td className="py-3 px-4 font-bold text-red-500">অফেরতযোগ্য (0%)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-primary" />
                                {isBn ? '২. রিফান্ড প্রসেসিং সময়' : '2. Refund Processing Time'}
                            </h2>
                            <p>
                                {isBn 
                                    ? 'রিফান্ড রিকোয়েস্ট অনুমোদিত হওয়ার পর ৫ থেকে ৭ কর্মদিবসের মধ্যে মূল পেমেন্ট মেথডে (bKash/Nagad/Cards) অর্থ ফেরত পাঠানো হয়।'
                                    : 'Approved refunds are credited back to the original payment method within 5-7 business days.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-primary" />
                                {isBn ? '৩. এজেন্সির কারণে ক্যানসেলেশন' : '3. Cancellation by Tour Agency'}
                            </h2>
                            <p>
                                {isBn 
                                    ? 'যদি কোনো ট্যুর সংস্থা বা এজেন্সির কারণে ইভেন্ট ক্যানসেল করা হয়, তবে গ্রাহক ১০০% রিফান্ড পাবেন অথবা সমমূল্যের অন্য যেকোনো ইভেন্টে শিফট হতে পারবেন।'
                                    : 'If a tour is cancelled by the agency, travelers receive a 100% full refund or alternative trip voucher.'}
                            </p>
                        </section>

                        <section className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {isBn ? 'রিফান্ড রিকোয়েস্টের জন্য যোগাযোগ করুন: ' : 'For refund assistance, write to: '}
                                <a href="mailto:refunds@madventure.com" className="text-primary font-bold hover:underline">refunds@madventure.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
