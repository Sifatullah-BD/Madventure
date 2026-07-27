import React, { useState } from 'react';
import { X, DollarSign, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import useWalletStore from '../../store/useWalletStore';

const AddMoneyModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { fetchWallet } = useWalletStore();

    if (!isOpen) return null;

    const handleAddMoney = async (e) => {
        e.preventDefault();
        const numAmount = Number(amount);
        if (!numAmount || numAmount < 100) {
            toast.warning('Minimum amount is 100 BDT');
            return;
        }

        setLoading(true);
        try {
            // Here we'd call SSLCommerz. For now, simulate adding directly.
            // Using a mock RPC or directly inserting if we had one. 
            // In a real app we'd redirect to gateway.
            
            // To simulate, we'll just mock it.
            setTimeout(() => {
                toast.success(`Successfully added ${numAmount} BDT via bKash!`);
                if (user) {
                    fetchWallet(user.id);
                }
                onSuccess();
                onClose();
                setLoading(false);
            }, 1500);
            
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-gray-600" />
                </button>
                
                <div className="p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Add Money</h2>
                    <p className="text-gray-500 mb-6">Top up your wallet using bKash, Nagad or Card</p>
                    
                    <form onSubmit={handleAddMoney} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Amount (BDT)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                <input 
                                    type="number" 
                                    min="100"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-lg"
                                    placeholder="e.g. 500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[500, 1000, 5000].map(preset => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset.toString())}
                                    className="py-2 border border-gray-200 rounded-lg font-bold text-gray-600 hover:border-primary hover:text-primary hover:bg-green-50 transition-colors"
                                >
                                    +{preset}
                                </button>
                            ))}
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || !amount}
                            className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>Proceed to Pay <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMoneyModal;
