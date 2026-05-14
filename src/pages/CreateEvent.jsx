import React, { useState } from 'react';
import {
    Calendar, MapPin, DollarSign, Clock, Bus, Hotel, Users,
    Shield, FileText, Image, Info, CheckCircle, AlertTriangle,
    Plus, Trash2, Save
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useTranslation } from 'react-i18next';

const CreateEvent = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState(1);
    const [formData, setFormData] = useState({
        // 1. Basic Info
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        duration: '',
        description: '',

        // 2. Pricing
        price: '',
        childPolicy: '',
        advanceAmount: '',
        inclusions: [''],
        exclusions: [''],

        // 3. Itinerary
        itinerary: [{ day: 1, title: '', activities: '', food: '' }],

        // 4. Transport
        departureLocation: '',
        departureTime: '',
        transportType: 'Non-AC Bus',
        returnInfo: '',

        // 5. Accommodation
        hotelName: '',
        roomType: 'Shared',
        facilities: '',
        sharingDetails: '',

        // 6. Booking
        totalSeats: '',
        maxGroupSize: '',
        bookingDeadline: '',

        // 7. Agency Info
        agencyName: '',
        guideName: '',
        phone: '',
        email: '',
        emergencyContact: '',

        // 8. Media
        coverPhoto: '',
        gallery: ['', '', ''],
        videoLink: '',

        // 9. Policies
        refundPolicy: '',
        termsConditions: '',
        safetyRequirements: '',

        // 10. Safety
        medicalPlan: '',
        nearestHospital: '',
        specialSafetyNotes: '',

        // 11. Additional
        weather: '',
        packingList: '',
        whoShouldJoin: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleItineraryChange = (index, key, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index][key] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', activities: '', food: '' }]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        alert('Event Created Successfully! (Mock)');
    };

    const sections = [
        { id: 1, title: 'Basic Info', icon: Info },
        { id: 2, title: 'Pricing', icon: DollarSign },
        { id: 3, title: 'Itinerary', icon: Calendar },
        { id: 4, title: 'Transport', icon: Bus },
        { id: 5, title: 'Accommodation', icon: Hotel },
        { id: 6, title: 'Booking', icon: Users },
        { id: 7, title: 'Agency Info', icon: Shield },
        { id: 8, title: 'Media', icon: Image },
        { id: 9, title: 'Policies', icon: FileText },
        { id: 10, title: 'Safety', icon: AlertTriangle },
        { id: 11, title: 'Additional', icon: CheckCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <DashboardHeader title="Create New Event" subtitle="Publish your tour package" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <section.icon size={18} />
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-grow">
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">

                            {/* 1. Basic Info */}
                            {activeSection === 1 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Basic Trip Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title *</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., Sajek 2-Day Group Tour" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                                            <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="Place, District" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., 2 Days 1 Night" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                            <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="Summary (150-300 chars)" required></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Pricing */}
                            {activeSection === 2 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Pricing & Package</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Package Price (Per Person) *</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="BDT" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Advance Payment Required</label>
                                            <input type="text" name="advanceAmount" value={formData.advanceAmount} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="Amount or %" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Child Policy</label>
                                            <input type="text" name="childPolicy" value={formData.childPolicy} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., 0-5 free, 5-10 half" />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                                            {formData.inclusions.map((item, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => handleArrayChange(index, 'inclusions', e.target.value)}
                                                        className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                        placeholder="e.g., Breakfast"
                                                    />
                                                    <button type="button" onClick={() => removeArrayItem(index, 'inclusions')} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addArrayItem('inclusions')} className="text-primary text-sm font-bold flex items-center gap-1 mt-2"><Plus size={16} /> Add Inclusion</button>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">What's Excluded</label>
                                            {formData.exclusions.map((item, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => handleArrayChange(index, 'exclusions', e.target.value)}
                                                        className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                        placeholder="e.g., Personal Medicine"
                                                    />
                                                    <button type="button" onClick={() => removeArrayItem(index, 'exclusions')} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addArrayItem('exclusions')} className="text-primary text-sm font-bold flex items-center gap-1 mt-2"><Plus size={16} /> Add Exclusion</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Itinerary */}
                            {activeSection === 3 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Itinerary</h3>
                                    {formData.itinerary.map((day, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-bold text-gray-700 mb-3">Day {day.day}</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input
                                                    type="text"
                                                    value={day.title}
                                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                    placeholder="Day Title (e.g., Dhaka to Sajek)"
                                                />
                                                <textarea
                                                    value={day.activities}
                                                    onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                    placeholder="Detailed Activities..."
                                                    rows="3"
                                                />
                                                <input
                                                    type="text"
                                                    value={day.food}
                                                    onChange={(e) => handleItineraryChange(index, 'food', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                    placeholder="Food Plan (e.g., Breakfast, Lunch, Dinner)"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addItineraryDay} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:bg-gray-50 hover:border-primary hover:text-primary transition-colors">
                                        + Add Day
                                    </button>
                                </div>
                            )}

                            {/* 4. Transport */}
                            {activeSection === 4 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Travel & Transport</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Location *</label>
                                            <input type="text" name="departureLocation" value={formData.departureLocation} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., Fakirapool" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time *</label>
                                            <input type="time" name="departureTime" value={formData.departureTime} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Transport Type *</label>
                                            <select name="transportType" value={formData.transportType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary">
                                                <option>Non-AC Bus</option>
                                                <option>AC Bus</option>
                                                <option>Train</option>
                                                <option>Microbus</option>
                                                <option>Launch</option>
                                                <option>Air</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Return Info</label>
                                            <input type="text" name="returnInfo" value={formData.returnInfo} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., Drop at same location" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. Accommodation */}
                            {activeSection === 5 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Accommodation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Resort/Hotel Name *</label>
                                            <input type="text" name="hotelName" value={formData.hotelName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                            <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary">
                                                <option>Shared</option>
                                                <option>Couple</option>
                                                <option>Single</option>
                                                <option>Tent</option>
                                                <option>Dormitory</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sharing Details</label>
                                            <input type="text" name="sharingDetails" value={formData.sharingDetails} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., 4 person per room" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                                            <input type="text" name="facilities" value={formData.facilities} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., WiFi, Geyser, Balcony" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 6. Booking */}
                            {activeSection === 6 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Booking Capacity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats *</label>
                                            <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size</label>
                                            <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Deadline</label>
                                            <input type="date" name="bookingDeadline" value={formData.bookingDeadline} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 7. Agency Info */}
                            {activeSection === 7 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Agency Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name *</label>
                                            <input type="text" name="agencyName" value={formData.agencyName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer/Guide Name</label>
                                            <input type="text" name="guideName" value={formData.guideName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                            <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 8. Media */}
                            {activeSection === 8 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Media & Gallery</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo URL *</label>
                                        <input type="url" name="coverPhoto" value={formData.coverPhoto} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="https://..." required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Min 3)</label>
                                        {formData.gallery.map((url, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => handleArrayChange(index, 'gallery', e.target.value)}
                                                    className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                                    placeholder={`Image URL ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Video Link (Optional)</label>
                                        <input type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="YouTube/Facebook Link" />
                                    </div>
                                </div>
                            )}

                            {/* 9. Policies */}
                            {activeSection === 9 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Policies</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund & Cancellation Policy *</label>
                                        <textarea name="refundPolicy" value={formData.refundPolicy} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions *</label>
                                        <textarea name="termsConditions" value={formData.termsConditions} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Safety Requirements</label>
                                        <textarea name="safetyRequirements" value={formData.safetyRequirements} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., ID card required, Age limit"></textarea>
                                    </div>
                                </div>
                            )}

                            {/* 10. Safety */}
                            {activeSection === 10 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Safety & Legal Info</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Emergency Plan *</label>
                                        <textarea name="medicalPlan" value={formData.medicalPlan} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" required></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Hospital</label>
                                        <input type="text" name="nearestHospital" value={formData.nearestHospital} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Safety Notes</label>
                                        <textarea name="specialSafetyNotes" value={formData.specialSafetyNotes} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="Mountain/Sea safety instructions"></textarea>
                                    </div>
                                </div>
                            )}

                            {/* 11. Additional */}
                            {activeSection === 11 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Additional Information</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Weather Expectation</label>
                                        <input type="text" name="weather" value={formData.weather} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" placeholder="e.g., Sunny days, cold nights" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Packing List</label>
                                        <textarea name="packingList" value={formData.packingList} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Who Should Join</label>
                                        <textarea name="whoShouldJoin" value={formData.whoShouldJoin} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 pt-6 border-t flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection(prev => Math.max(prev - 1, 1))}
                                    disabled={activeSection === 1}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {activeSection < 11 ? (
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection(prev => Math.min(prev + 1, 11))}
                                        className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-8 py-2 bg-primary text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
                                    >
                                        <Save size={18} /> Publish Event
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
