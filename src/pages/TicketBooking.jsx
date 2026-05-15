import DashboardHeader from '../components/dashboard/DashboardHeader';
import LoginModal from '../components/LoginModal';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketSearch from '../components/tickets/TicketSearch';
import SearchResults from '../components/tickets/SearchResults';
import SeatSelection from '../components/tickets/SeatSelection';
import TicketWallet from '../components/tickets/TicketWallet';
import { transportService } from '../services/transportService';

const TicketBooking = () => {
    const [step, setStep] = useState('search'); 
    const [searchParams, setSearchParams] = useState(null);
    const [results, setResults] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [bookedTicket, setBookedTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('madventure_user'));

    const handleSearch = async (params) => {
        setSearchParams(params);
        setLoading(true);
        setStep('results');
        try {
            const data = await transportService.searchTransports(params);
            setResults(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrip = (trip) => {
        setSelectedTrip(trip);
        setStep('seats');
    };

    const handleConfirmBooking = (seats) => {
        const bookingData = {
            trip: selectedTrip,
            seats: seats,
            totalPrice: seats.length * selectedTrip.price
        };

        if (!isLoggedIn) {
            setPendingBooking(bookingData);
            setShowLogin(true);
        } else {
            processBooking(bookingData);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowLogin(false);
        if (pendingBooking) {
            processBooking(pendingBooking);
            setPendingBooking(null);
        }
    };

    const processBooking = (data) => {
        // Simulate API call
        setTimeout(() => {
            const ticket = {
                id: 'TICKET-' + Math.floor(Math.random() * 10000),
                pnr: 'PNR' + Math.floor(Math.random() * 10000),
                from: data.trip.from,
                to: data.trip.to,
                date: 'Today', // Should come from searchParams
                time: data.trip.departureTime,
                seats: data.seats,
                operator: data.trip.operatorId // Should fetch name
            };
            setBookedTicket(ticket);
            setStep('wallet');
        }, 1500);
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Tickets & Transport"
                subtitle="Book Bus, Train, Air & Launch tickets easily."
            />
            <div className="px-6 pb-12">

                {/* Content */}
                <AnimatePresence mode="wait">
                    {step === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TicketSearch onSearch={handleSearch} />
                        </motion.div>
                    )}

                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={() => setStep('search')}
                                    className="text-gray-500 hover:text-[#1B5E20] font-medium flex items-center gap-1"
                                >
                                    ← Back to Search
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Available Trips from {searchParams?.from} to {searchParams?.to}
                                </h2>
                            </div>
                            <SearchResults results={results} onSelectTrip={handleSelectTrip} loading={loading} />
                        </motion.div>
                    )}

                    {step === 'seats' && (
                        <motion.div
                            key="seats"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={() => setStep('results')}
                                    className="text-gray-500 hover:text-[#1B5E20] font-medium flex items-center gap-1"
                                >
                                    ← Back to Results
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">Select Seats</h2>
                            </div>
                            <SeatSelection trip={selectedTrip} onConfirmBooking={handleConfirmBooking} />
                        </motion.div>
                    )}

                    {step === 'wallet' && (
                        <motion.div
                            key="wallet"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🎉</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                                <p className="text-gray-600">Your ticket has been sent to your email.</p>
                            </div>
                            <TicketWallet ticket={bookedTicket} />
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setStep('search')}
                                    className="text-[#1B5E20] font-bold hover:underline"
                                >
                                    Book Another Ticket
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Modal for Guest Checkout */}
                <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLoginSuccess}
                />
            </div>
        </div>
    );
};

export default TicketBooking;
