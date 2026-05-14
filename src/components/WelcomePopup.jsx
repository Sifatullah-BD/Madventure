import React from 'react';
import { X, PartyPopper } from 'lucide-react';

const WelcomePopup = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-up border-4 border-green-50">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1B5E20] shadow-inner overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Welcome" className="w-full h-full object-cover" />
                        ) : (
                            <PartyPopper size={48} />
                        )}
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Welcome Back!</h2>
                    <p className="text-xl font-medium text-[#1B5E20] mb-4">{user?.name || 'Traveler'}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Ready to explore the unseen beauty of Bangladesh? Your adventure starts now.
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-[#1B5E20] hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 w-full shadow-lg hover:shadow-xl"
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;
