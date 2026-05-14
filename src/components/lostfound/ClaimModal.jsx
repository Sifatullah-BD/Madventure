import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';

const ClaimModal = ({ isOpen, onClose, item, onClaim }) => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !item) return null;

    const handleSubmit = () => {
        if (!answer.trim()) {
            setError('Please provide an answer.');
            return;
        }

        // Mock verification logic
        // In a real app, this would check against the backend
        // Here we just simulate a success for demonstration if the answer is long enough
        if (answer.length < 3) {
            setError('Please provide a more detailed answer.');
            return;
        }

        onClaim(item.id, answer);
        setAnswer('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <ShieldCheck className="text-green-600" size={20} />
                        Claim Item
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-1">{item.item}</h4>
                        <p className="text-sm text-blue-600 mb-3">Found at {item.location}</p>

                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Verification Question</p>
                            <p className="font-medium text-gray-800">
                                {item.verificationQuestion || "What is a unique feature of this item that isn't visible in the photo?"}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Answer</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                            placeholder="Describe the hidden detail..."
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertTriangle size={14} /> {error}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Submit Claim
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClaimModal;
