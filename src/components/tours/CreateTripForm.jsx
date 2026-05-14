import React, { useState } from 'react';
import { Plus, Trash, Image as ImageIcon } from 'lucide-react';

const CreateTripForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        price: '',
        capacity: '',
        description: '',
        itinerary: [{ day: 1, title: '', description: '' }],
        includes: [''],
        excludes: ['']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index][field] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '' }]
        });
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Trip</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trip Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            placeholder="e.g., Sajek Valley Adventure"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            placeholder="e.g., Sajek"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person (৳)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            required
                        />
                    </div>
                </div>

                {/* Itinerary */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Itinerary</label>
                        <button
                            type="button"
                            onClick={addItineraryDay}
                            className="text-xs text-[#1B5E20] font-bold flex items-center gap-1 hover:underline"
                        >
                            <Plus size={14} /> Add Day
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.itinerary.map((day, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500">Day {day.day}</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Day Title (e.g., Journey Start)"
                                    value={day.title}
                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                    className="w-full mb-2 px-3 py-2 bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={day.description}
                                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                                    rows="2"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Includes/Excludes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Includes</label>
                            <button type="button" onClick={() => addArrayItem('includes')} className="text-[#1B5E20]"><Plus size={16} /></button>
                        </div>
                        {formData.includes.map((item, index) => (
                            <input
                                key={index}
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                                className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                            />
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Excludes</label>
                            <button type="button" onClick={() => addArrayItem('excludes')} className="text-red-500"><Plus size={16} /></button>
                        </div>
                        {formData.excludes.map((item, index) => (
                            <input
                                key={index}
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('excludes', index, e.target.value)}
                                className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#1B5E20] text-white font-bold rounded-lg hover:bg-green-800 transition-colors shadow-lg shadow-green-900/20"
                    >
                        Publish Trip
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTripForm;
