import React from 'react';
import { ArrowRight, Users, Calendar, Map, BrainCircuit, Wallet, AlertTriangle, ShieldCheck, Heart, Briefcase, Truck, ShoppingBag, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/dashboard/DashboardCard';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
                    <p className="text-gray-600">Please login to view your dashboard.</p>
                </div>
            </div>
        );
    }

    const handleStartJourney = () => {
        navigate('/planner');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Dashboard Hero / Profile */}
                <div className="relative rounded-2xl shadow-xl overflow-hidden mb-12 group">
                    {/* Background Cover with Blur */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
                            alt="Cover"
                            className="w-full h-full object-cover blur-[2px] scale-105 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                        {/* User Avatar */}
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden flex-shrink-0">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-5xl font-bold">
                                    {user?.name?.[0] || 'U'}
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left flex-grow text-white">
                            <h1 className="text-4xl font-heading font-bold mb-2 text-white drop-shadow-md">Welcome, {user?.name || 'Traveler'}!</h1>
                            <p className="text-gray-100 text-lg mb-6 drop-shadow">Ready to plan your next adventure?</p>
                            <button
                                onClick={handleStartJourney}
                                className="bg-action hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0 border-2 border-transparent hover:border-white/20"
                            >
                                Start Your Journey <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* My Personal Hub */}
                <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-[2rem] shadow-sm inline-flex items-center gap-3 mb-8 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center -ml-2">
                        <Users className="text-primary" size={18} />
                    </div>
                    <h2 className="text-xl font-heading font-bold text-gray-800 dark:text-gray-100">My Personal Hub</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">

                    {/* 1. Upcoming Events */}
                    <DashboardCard
                        title="Upcoming Events"
                        subtitle="Next on your calendar"
                        icon={Calendar}
                        color="purple"
                        stats={
                            <p className="text-purple-800 font-medium text-center text-sm">No upcoming events scheduled.</p>
                        }
                        action="View Calendar"
                        onAction={() => navigate('/events')}
                    />

                    {/* 2. Tour Plans */}
                    <DashboardCard
                        title="Tour Plans"
                        subtitle="Manage your itineraries"
                        icon={Map}
                        color="blue"
                        stats={
                            <p className="text-blue-800 font-medium text-center text-sm">No active trips. Let's create one!</p>
                        }
                        action="View Plans"
                        onAction={() => navigate('/tour-plans')}
                    />

                    {/* ... (Destinations, AI Planner, Community remain same) ... */}

                    {/* 5. Wallet & Bookings */}
                    <DashboardCard
                        title="Wallet & Bookings"
                        subtitle="Payments & History"
                        icon={Wallet}
                        color="teal"
                        stats={
                            <div className="text-center w-full">
                                <p className="text-teal-900 font-bold text-lg">1,500 BDT</p>
                                <p className="text-teal-600 text-xs">Wallet Balance</p>
                            </div>
                        }
                        action="View History"
                        onAction={() => navigate('/bookings')}
                    />

                    {/* ... (Lost & Found, Safety Map remain same) ... */}

                    {/* 8. Wishlist */}
                    <DashboardCard
                        title="Wishlist"
                        subtitle="Saved Places"
                        icon={Heart}
                        color="pink"
                        stats={
                            <p className="text-pink-800 font-medium text-center text-sm">2 items in your wishlist.</p>
                        }
                        action="View Wishlist"
                        onAction={() => navigate('/wishlist')}
                    />

                    {/* ... (Partner, Local Fare, Gear Shop remain same) ... */}

                    {/* 12. Travel Stats */}
                    <DashboardCard
                        title="Travel Stats"
                        subtitle="Your Achievements"
                        icon={BarChart2}
                        color="purple"
                        stats={
                            <div className="flex justify-around w-full text-center">
                                <div>
                                    <p className="font-bold text-purple-900">12</p>
                                    <p className="text-xs text-purple-600 uppercase">Trips</p>
                                </div>
                                <div>
                                    <p className="font-bold text-purple-900">4</p>
                                    <p className="text-xs text-purple-600 uppercase">Countries</p>
                                </div>
                                <div>
                                    <p className="font-bold text-purple-900">3k</p>
                                    <p className="text-xs text-purple-600 uppercase">Km</p>
                                </div>
                            </div>
                        }
                        action="View Full Stats"
                        onAction={() => navigate('/stats')}
                    />

                </div>

            </div>
        </div>
    );
};

export default Dashboard;
