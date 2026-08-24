import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Loader2, Clock } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useLanguage } from '../../context/LanguageContext';

const ProfileWallet = ({ user }) => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchWalletData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const [walletData, txData] = await Promise.all([
                    paymentService.getWallet(),
                    paymentService.getMyTransactions()
                ]);
                
                if (walletData) {
                    setWallet(walletData);
                } else {
                    setWallet({ current_balance: 0 }); // Fallback if no wallet exists yet
                }
                
                if (txData) {
                    setTransactions(txData);
                }
            } catch (error) {
                console.error("Error fetching wallet data:", error);
                setWallet({ current_balance: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchWalletData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32 bg-[#0d1a11] rounded-[2.5rem] border border-white/5 shadow-xl">
                <Loader2 className="animate-spin text-forest-light" size={40} />
            </div>
        );
    }

    const currentBalance = Number(wallet?.current_balance) || 0;

    return (
        <div className="bg-[#0d1a11] p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-xl min-h-[60vh]">
            <div className="mb-10">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                    <Wallet className="text-forest-light" /> 
                    {language === 'bn' ? 'আমার ওয়ালেট' : 'My Wallet'}
                </h3>
                <p className="text-gray-400 text-sm">
                    {language === 'bn' ? 'আপনার ব্যালেন্স এবং লেনদেনের ইতিহাস' : 'Your balance and transaction history'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Balance Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-forest-light to-forest-dark p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute right-10 -bottom-10 w-32 h-32 bg-black/20 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10">
                        <p className="text-forest-50 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Wallet size={16} />
                            {language === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}
                        </p>
                        <h2 className="text-5xl font-black text-white mb-6">
                            ৳{currentBalance.toLocaleString()}
                        </h2>
                        
                        <div className="flex gap-4">
                            <button className="bg-white text-forest-dark px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-lg">
                                <CreditCard size={18} />
                                {language === 'bn' ? 'টাকা যোগ করুন' : 'Add Funds'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-6">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</p>
                        <p className="text-2xl font-black text-white">৳0</p>
                    </div>
                    <div className="h-px w-full bg-white/5"></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{language === 'bn' ? 'রিওয়ার্ড পয়েন্ট' : 'Reward Points'}</p>
                        <p className="text-2xl font-black text-forest-light flex items-center gap-2">
                            0 <span className="text-sm font-normal text-gray-500">XP</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div>
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <Clock className="text-gray-400" size={20} />
                    {language === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}
                </h4>
                
                {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                        <CreditCard size={40} className="mx-auto text-gray-700 mb-3" />
                        <p className="text-gray-400 font-bold">{language === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No recent transactions'}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map(tx => (
                            <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {tx.amount > 0 ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{tx.description || (tx.amount > 0 ? 'Deposit' : 'Payment')}</p>
                                        <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-gray-500">{tx.payment_status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileWallet;
