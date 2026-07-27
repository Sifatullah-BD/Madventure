import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useToast } from '../ui/Toast';

const Step2Travelers = ({ formData, setFormData, onNext, onPrev }) => {
    const toast = useToast();
    // Initialize travelers array based on seats selected
    const [travelers, setTravelers] = useState(
        formData.travelers && formData.travelers.length === formData.seats 
            ? formData.travelers 
            : Array.from({ length: formData.seats }).map((_, i) => ({ id: i, name: '', age: '', nid: '' }))
    );

    const updateTraveler = (index, field, value) => {
        const newTravelers = [...travelers];
        newTravelers[index][field] = value;
        setTravelers(newTravelers);
    };

    const handleNext = () => {
        // Simple validation
        const isValid = travelers.every(t => t.name.trim() !== '' && t.age !== '');
        if (!isValid) {
            toast.warning('Please fill in Name and Age for all travelers.');
            return;
        }

        setFormData({ ...formData, travelers });
        onNext();
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-primary" /> Traveler Details
            </h3>

            <div className="space-y-6">
                {travelers.map((traveler, index) => (
                    <div key={index} className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                            Traveler {index + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    value={traveler.name}
                                    onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                                <input 
                                    type="number" 
                                    value={traveler.age}
                                    onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="25"
                                    min="1" max="100"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NID / Passport / Birth Cert.</label>
                                <input 
                                    type="text" 
                                    value={traveler.nid}
                                    onChange={(e) => updateTraveler(index, 'nid', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button 
                    onClick={onPrev}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={handleNext}
                    className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors"
                >
                    Review Summary
                </button>
            </div>
        </div>
    );
};

export default Step2Travelers;
