import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Calendar, Camera, AlertCircle, CheckCircle, Shield, MessageCircle, Printer, Gift, Loader2 } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ClaimModal from '../components/lostfound/ClaimModal';
import ChatModal from '../components/lostfound/ChatModal';
import PosterGenerator from '../components/lostfound/PosterGenerator';
import { getLostFoundItems, reportLostFoundItem } from '../api/community';
import { useAuth } from '../hooks/useAuth';

const LostFound = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('lost');
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Modals State
    const [claimModal, setClaimModal] = useState({ isOpen: false, item: null });
    const [chatModal, setChatModal] = useState({ isOpen: false, item: null });
    const [posterModal, setPosterModal] = useState({ isOpen: false, item: null });

    // Form State
    const [newItem, setNewItem] = useState({
        item: '',
        location: '',
        date: '',
        description: '',
        image: null,
        reward: '',
        verificationQuestion: ''
    });

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await getLostFoundItems();
        if (data) {
            setItems(data.map(i => ({
                ...i,
                item: i.title,
                status: i.item_type,
                date: i.created_at,
                image: i.image_url,
                isChatEnabled: true,
                contact: i.contact_number
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleImageUpload = () => {
        // Simulating image upload for now
        const mockImage = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        setNewItem({ ...newItem, image: mockImage });
        alert('Image uploaded successfully! (Mock)');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to report an item.');
            return;
        }
        if (!newItem.item || !newItem.location || !newItem.description) {
            alert('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        const itemData = {
            user_id: user.id,
            title: newItem.item,
            location: newItem.location,
            description: newItem.description,
            item_type: activeTab,
            image_url: newItem.image,
            contact_number: user.phone || 'Contact via Chat'
        };

        const { error } = await reportLostFoundItem(itemData);
        if (error) {
            alert(error.message);
        } else {
            setNewItem({ item: '', location: '', date: '', description: '', image: null, reward: '', verificationQuestion: '' });
            setShowForm(false);
            fetchItems();
            alert(`${activeTab === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
        }
        setSubmitting(false);
    };

    const handleClaim = (itemId, answer) => {
        console.log(`Claiming item ${itemId} with answer: ${answer}`);
        alert('Claim submitted! The reporter will review your answer.');
    };

    const filteredItems = items.filter(item => item.status === activeTab);

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Lost & Found"
                subtitle="Report lost items or help others find theirs. A community effort to keep travel stress-free."
                action={
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-4 py-2 rounded-lg font-bold text-white shadow-md transition-transform hover:scale-105 text-sm ${activeTab === 'lost' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        {showForm ? 'Cancel Report' : `+ Report ${activeTab === 'lost' ? 'Lost Item' : 'Found Item'}`}
                    </button>
                }
            />
            <div className="max-w-5xl mx-auto px-4 pb-12">

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-full shadow-sm flex">
                        <button
                            onClick={() => setActiveTab('lost')}
                            className={`px-8 py-2 rounded-full font-bold transition-all ${activeTab === 'lost' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Lost Something?
                        </button>
                        <button
                            onClick={() => setActiveTab('found')}
                            className={`px-8 py-2 rounded-full font-bold transition-all ${activeTab === 'found' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Found Something?
                        </button>
                    </div>
                </div>

                {/* Report Form (Collapsible) */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 animate-fade-in-up border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Report a {activeTab} Item</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                                <input
                                    type="text"
                                    name="item"
                                    value={newItem.item}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g. Black Wallet"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={newItem.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Where was it?"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date (Approx)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="date"
                                        value={newItem.date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24"
                                    placeholder="Describe the item in detail..."
                                    required
                                ></textarea>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                                <div
                                    onClick={handleImageUpload}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    {newItem.image ? (
                                        <div className="relative h-40 w-full">
                                            <img src={newItem.image} alt="Preview" className="h-full w-full object-contain" />
                                            <p className="text-xs text-green-600 mt-2">Image Selected</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                                            <p className="text-sm text-gray-500">Click to upload photo</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <button type="submit" disabled={submitting} className={`w-full py-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 ${activeTab === 'lost' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                    {submitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Items List */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
                ) : (
                    <div className="space-y-4">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-6 animate-fade-in-up hover:shadow-lg transition-shadow border border-gray-100 relative overflow-hidden">
                                <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative group">
                                    {item.image ? (
                                        <img src={item.image} alt={item.item} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Camera size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">{item.item}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-primary" /> {item.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-primary" /> {new Date(item.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-primary" /> {item.contact || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
                                        <button
                                            onClick={() => setChatModal({ isOpen: true, item })}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                                        >
                                            <MessageCircle size={16} /> Chat
                                        </button>

                                        {item.status === 'found' ? (
                                            <button
                                                onClick={() => setClaimModal({ isOpen: true, item })}
                                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-md"
                                            >
                                                <Shield size={16} /> Claim Item
                                            </button>
                                        ) : (
                                            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-md">
                                                <Phone size={16} /> Contact
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">No items reported in this category.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ClaimModal
                isOpen={claimModal.isOpen}
                onClose={() => setClaimModal({ isOpen: false, item: null })}
                item={claimModal.item}
                onClaim={handleClaim}
            />

            <ChatModal
                isOpen={chatModal.isOpen}
                onClose={() => setChatModal({ isOpen: false, item: null })}
                item={chatModal.item}
                user={user || { name: 'Guest' }}
            />

            <PosterGenerator
                isOpen={posterModal.isOpen}
                onClose={() => setPosterModal({ isOpen: false, item: null })}
                item={posterModal.item}
            />
        </div>
    );
};

export default LostFound;
