import React, { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Wallet as WalletIcon, CreditCard, History, Ticket, Download, PlusCircle, Gift, AlertCircle, FileText, CheckCircle, RefreshCcw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { paymentService } from '../services/paymentService';
import { bookingService } from '../services/bookingService';
import useWalletStore from '../store/useWalletStore';
import AddMoneyModal from '../components/wallet/AddMoneyModal';

const DEMO_TRANSACTIONS = [
    { id: 1, desc: 'Added Money (Bkash)', date: '2025-12-01', amount: '+5000 BDT', type: 'credit' },
    { id: 2, desc: 'Paid for Sajek Tour', date: '2025-11-28', amount: '-3500 BDT', type: 'debit' },
    { id: 3, desc: 'Cashback Received', date: '2025-11-28', amount: '+150 BDT', type: 'credit' },
];

const DEMO_BOOKINGS = [
    { id: 1, title: 'Sajek Valley Tour', date: '15 Dec 2025', status: 'Confirmed', price: '3500 BDT', paid: 'Full', ticketAvailable: true },
    { id: 2, title: 'Dhaka to Sylhet Bus', date: '20 Dec 2025', status: 'Pending', price: '800 BDT', paid: 'Partial (500 Due)', ticketAvailable: false },
    { id: 3, title: 'Cox\'s Bazar Hotel', date: '10 Nov 2025', status: 'Cancelled', price: '5000 BDT', paid: 'Refunded', refundStatus: 'Completed' },
];

const Wallet = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('wallet');
    const [showDownloadToast, setShowDownloadToast] = useState(false);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [dbBookings, setDbBookings] = useState([]);
    const [paymentTxns, setPaymentTxns] = useState([]);
    const [showAddMoney, setShowAddMoney] = useState(false);

    // Use Zustand wallet store for optimistic updates
    const { balance, ledgerRows, fetchWallet } = useWalletStore();

    const staticTransactions = DEMO_TRANSACTIONS;
    const staticBookings = DEMO_BOOKINGS;

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!isSupabaseConfigured || !user?.id) {
                setLoadingRemote(false);
                return;
            }
            setLoadingRemote(true);
            try {
                // Fetch wallet via Zustand store (handles balance + ledger)
                await fetchWallet(user.id);

                const bk = await bookingService.getMyBookings();
                if (!cancelled) setDbBookings(bk || []);

                // Fetch payment transactions
                const pay = await paymentService.getMyTransactions();
                if (!cancelled) setPaymentTxns(pay || []);

            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoadingRemote(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    const transactions = useMemo(() => {
        if (!isSupabaseConfigured) return staticTransactions;
        if (!ledgerRows.length) return [];
        return ledgerRows.map((row) => ({
            id: row.id,
            desc: row.remarks || row.transaction_type || 'Wallet entry',
            date: row.created_at ? new Date(row.created_at).toLocaleDateString() : '',
            amount: Number(row.credit) > 0 ? `+${Number(row.credit)} BDT` : `-${Number(row.debit)} BDT`,
            type: Number(row.credit) > 0 ? 'credit' : 'debit',
        }));
    }, [ledgerRows, staticTransactions]);

    const bookings = useMemo(() => {
        if (!isSupabaseConfigured) return staticBookings;
        return (dbBookings || []).map((b) => {
            const extras = b.extras || {};
            const title = extras.tourTitle || extras.hotelName || `${b.entity_type || 'Trip'} · ${b.entity_id || ''}`;
            const st = (b.status || '').toLowerCase();
            const pay = (b.payment_status || '').toLowerCase();
            return {
                id: b.id,
                title,
                date: b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB') : '—',
                status: st === 'confirmed' ? 'Confirmed' : st === 'failed' ? 'Cancelled' : 'Pending',
                price: `${Number(b.total_price || 0)} BDT`,
                paid: pay === 'paid' ? 'Full' : 'Pending payment',
                ticketAvailable: st === 'confirmed',
                refundStatus: st === 'failed' ? '—' : undefined,
            };
        });
    }, [dbBookings, staticBookings]);

    const vouchers = [
        { id: 1, code: 'WELCOME500', amount: '500 BDT', desc: 'New User Bonus', expiry: '31 Dec 2025' },
        { id: 2, code: 'WINTER20', amount: '20% OFF', desc: 'Winter Sale', expiry: '15 Jan 2026' },
    ];

    const handleDownload = () => {
        setShowDownloadToast(true);
        setTimeout(() => setShowDownloadToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            <DashboardHeader title="Wallet & Bookings" subtitle="Manage your payments and trips" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
                    {['wallet', 'bookings', 'vouchers', 'payments'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-4 font-bold text-sm capitalize transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Wallet Content */}
                {activeTab === 'wallet' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Balance Card */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <WalletIcon size={120} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Available Balance</p>
                            <h2 className="text-4xl font-bold mb-8">
                                {isSupabaseConfigured
                                    ? (loadingRemote ? '…' : balance.toLocaleString())
                                    : '1,650'}{' '}
                                <span className="text-lg text-gray-400 font-normal">BDT</span>
                            </h2>

                            <button 
                                onClick={() => setShowAddMoney(true)}
                                className="w-full bg-primary hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                            >
                                <PlusCircle size={20} /> Add Money
                            </button>
                        </div>

                        {/* Transaction History */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <History size={20} className="text-gray-400" /> Recent Transactions
                            </h3>
                            <div className="space-y-4">
                                {transactions.length === 0 && isSupabaseConfigured && !loadingRemote && (
                                    <p className="text-sm text-gray-500">No ledger entries yet. Top-ups and refunds will appear here.</p>
                                )}
                                {transactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {tx.type === 'credit' ? <PlusCircle size={20} /> : <CreditCard size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{tx.desc}</p>
                                                <p className="text-xs text-gray-500">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold block ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.amount}
                                            </span>
                                            <button
                                                onClick={handleDownload}
                                                className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 justify-end mt-1"
                                            >
                                                <FileText size={12} /> Invoice
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Content */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Your Bookings</h3>
                        <div className="space-y-4">
                            {bookings.map(booking => (
                                <div key={booking.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${booking.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            <Ticket size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{booking.title}</h4>
                                            <p className="text-sm text-gray-500">{booking.date} • {booking.price}</p>

                                            {/* Partial Payment / Refund Status */}
                                            <div className="flex items-center gap-2 mt-1">
                                                {booking.paid.includes('Partial') && (
                                                    <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                                                        <AlertCircle size={12} /> {booking.paid}
                                                    </span>
                                                )}
                                                {booking.status === 'Cancelled' && (
                                                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                        <RefreshCcw size={12} /> Refund: {booking.refundStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>

                                        {booking.ticketAvailable && (
                                            <button
                                                onClick={handleDownload}
                                                className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-full"
                                                title="Download Ticket"
                                            >
                                                <Download size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vouchers Content */}
                {activeTab === 'vouchers' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {vouchers.map(voucher => (
                            <div key={voucher.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
                                <div className="absolute -right-6 -bottom-6 text-gray-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                    <Gift size={100} />
                                </div>

                                <div className="relative z-10">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Voucher</p>
                                    <h3 className="text-2xl font-black text-gray-800 mb-1">{voucher.amount}</h3>
                                    <p className="text-sm text-gray-600">{voucher.desc}</p>
                                    <p className="text-xs text-gray-400 mt-2">Expires: {voucher.expiry}</p>
                                </div>

                                <div className="relative z-10 text-right">
                                    <div className="bg-gray-100 px-3 py-1 rounded-lg border border-dashed border-gray-300 font-mono font-bold text-gray-700 mb-2">
                                        {voucher.code}
                                    </div>
                                    <button className="text-primary text-xs font-bold hover:underline">Copy Code</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary" /> External Payment History
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-4 font-bold text-gray-600">Date</th>
                                        <th className="pb-4 font-bold text-gray-600">Gateway</th>
                                        <th className="pb-4 font-bold text-gray-600">Transaction ID</th>
                                        <th className="pb-4 font-bold text-gray-600">Amount</th>
                                        <th className="pb-4 font-bold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentTxns.map(tx => (
                                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-800">{new Date(tx.created_at).toLocaleDateString()}</td>
                                            <td className="py-4 capitalize text-gray-800">{tx.gateway}</td>
                                            <td className="py-4 font-mono text-gray-500">{tx.tran_id || tx.val_id || '—'}</td>
                                            <td className="py-4 font-bold text-gray-800">৳{tx.amount.toLocaleString()}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    tx.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {tx.payment_status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {paymentTxns.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-10 text-center text-gray-400">No payment records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* Toast Notification */}
            {showDownloadToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold">Download Started</h4>
                        <p className="text-xs text-gray-400">Your file is being downloaded...</p>
                    </div>
                </div>
            )}

            {showAddMoney && (
                <AddMoneyModal 
                    isOpen={showAddMoney} 
                    onClose={() => setShowAddMoney(false)} 
                    onSuccess={() => fetchWallet(user?.id)}
                />
            )}
        </div>
    );
};

export default Wallet;
