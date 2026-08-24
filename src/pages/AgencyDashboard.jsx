import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, List, Users } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CreateTripForm from '../components/tours/CreateTripForm';
import BookingManagement from '../components/tours/BookingManagement';
import { bookings as mockBookings } from '../data/tourData';
import { supabaseService } from '../services/supabaseService';
import { getAgencyBookings } from '../services/bookingService';
import { useToast } from '../components/ui/Toast';

const AgencyDashboard = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bookings State
    const [bookings, setBookings] = useState([]);
    const [bookingsCount, setBookingsCount] = useState(0);
    const [bookingsPage, setBookingsPage] = useState(1);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Mock Agency ID (In a real app, this would come from auth context)
    const AGENCY_ID = 'AG-001';

    const fetchTours = async () => {
        try {
            const data = await supabaseService.getTours();
            setTours(data || []);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async (page) => {
        setBookingsLoading(true);
        try {
            const { data, count, error } = await getAgencyBookings(AGENCY_ID, { page, limit: 10 });
            if (error) throw error;
            setBookings(data || []);
            setBookingsCount(count || 0);
            setBookingsPage(page);
        } catch (e) {
            console.error("Error fetching bookings:", e);
        } finally {
            setBookingsLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
        fetchBookings(1);
    }, []);

    // ... rest of the component

    // Stats
    const stats = [
        { label: 'Total Trips', value: tours.length.toString(), icon: List, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Bookings', value: bookingsCount.toString(), icon: Users, color: 'bg-green-50 text-green-600' },
        { label: 'Estimated Revenue', value: `৳${(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0) / 1000).toFixed(1)}K`, icon: LayoutDashboard, color: 'bg-purple-50 text-purple-600' },
    ];

    const handleCreateTrip = async (formData) => {
        try {
            const newTour = {
                id: `TR-${Date.now()}`, 
                agency_id: AGENCY_ID,
                title: formData.title,
                destination: formData.destination,
                start_date: formData.startDate,
                duration: `${Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} Days`,
                price: parseFloat(formData.price),
                max_group_size: parseInt(formData.capacity),
                description: formData.description,
                itinerary: formData.itinerary,
                includes: formData.includes,
                excludes: formData.excludes,
                category: 'Adventure',
                images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80'],
                type: 'Agency Tour'
            };

            await supabaseService.createTour(newTour);
            toast.success('Trip Created Successfully!');
            setShowCreateForm(false);
            fetchTours();
        } catch (error) {
            console.error("Error creating trip:", error);
            toast.error('Failed to create trip. Please try again.');
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Agency Dashboard"
                subtitle="Welcome back, Wanderlust Adventures"
                action={
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1B5E20] text-white rounded-lg font-bold shadow-md hover:bg-green-800 transition-all text-sm"
                    >
                        <Plus size={16} />
                        Create New Trip
                    </button>
                }
            />
            <div className="max-w-7xl mx-auto px-4 pb-12">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                {showCreateForm ? (
                    <CreateTripForm onSubmit={handleCreateTrip} onCancel={() => setShowCreateForm(false)} />
                ) : (
                    <div className="space-y-8">
                        {/* Active Trips Preview */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Trips</h2>
                            {loading ? (
                                <div className="text-center py-8">Loading trips...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tours.slice(0, 6).map((event) => (
                                        <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                            <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{event.start_date}</p>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-[#1B5E20] font-bold">৳{event.price}</span>
                                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                    {event.booked || 0}/{event.max_group_size} Max
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {tours.length === 0 && (
                                        <div className="col-span-full text-center py-8 text-gray-500">
                                            No active trips found. Create one to get started!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bookings Table */}
                        <BookingManagement 
                            bookings={bookings} 
                            totalCount={bookingsCount}
                            currentPage={bookingsPage}
                            onPageChange={fetchBookings}
                            loading={bookingsLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgencyDashboard;
