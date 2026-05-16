import DashboardHeader from '../components/dashboard/DashboardHeader';
import LoginModal from '../components/LoginModal';
import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import TicketSearch from '../components/tickets/TicketSearch';
import SearchResults from '../components/tickets/SearchResults';
import SeatSelection from '../components/tickets/SeatSelection';
import CheckoutStep from '../components/tickets/CheckoutStep';
import BoardingPass from '../components/tickets/BoardingPass';
import { transportService } from '../services/transportService';

const TicketBooking = () => {
    const [step, setStep] = useState('search'); 
    const [searchParams, setSearchParams] = useState(null);
    const [results, setResults] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
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

    const handleConfirmSeats = (seats) => {
        setSelectedSeats(seats);
        setStep('checkout');
    };

    const handlePaymentConfirm = () => {
        const bookingData = {
            trip: selectedTrip,
            seats: selectedSeats,
            totalPrice: selectedSeats.length * selectedTrip.price
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
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const ticket = {
                id: 'TICKET-' + Math.floor(Math.random() * 10000),
                pnr: 'PNR' + Math.floor(Math.random() * 10000),
                from: data.trip.from,
                to: data.trip.to,
                date: searchParams?.date || 'Tomorrow',
                time: data.trip.departureTime,
                seats: data.seats,
                operator: data.trip.operatorId
            };
            setBookedTicket(ticket);
            setStep('confirmation');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Tickets & Transport"
                subtitle="Book Bus, Train, Air & Launch tickets easily."
            />
            <div className="px-6 pb-20">

                <AnimatePresence mode="wait">
                    {step === 'search' && (
                        <Motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TicketSearch onSearch={handleSearch} />
                        </Motion.div>
                    )}

                    {step === 'results' && (
                        <Motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep('search')} className="text-gray-500 hover:text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <ArrowLeft size={16} /> Change Search
                                </button>
                            </div>
                            <SearchResults results={results} onSelectTrip={handleSelectTrip} loading={loading} />
                        </Motion.div>
                    )}

                    {step === 'seats' && (
                        <Motion.div
                            key="seats"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep('results')} className="text-gray-500 hover:text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <ArrowLeft size={16} /> Change Trip
                                </button>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Select Your Seats</h2>
                            </div>
                            <SeatSelection trip={selectedTrip} onConfirmBooking={handleConfirmSeats} />
                        </Motion.div>
                    )}

                    {step === 'checkout' && (
                        <Motion.div
                            key="checkout"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => setStep('seats')} className="text-gray-500 hover:text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <ArrowLeft size={16} /> Back to Seats
                                </button>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Secure Checkout</h2>
                            </div>
                            <CheckoutStep 
                                trip={selectedTrip} 
                                seats={selectedSeats} 
                                totalPrice={selectedSeats.length * selectedTrip.price} 
                                onPaymentConfirm={handlePaymentConfirm} 
                            />
                        </Motion.div>
                    )}

                    {step === 'confirmation' && (
                        <Motion.div
                            key="confirmation"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10"
                        >
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCheck size={40} className="text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Ticket Booked!</h2>
                                <p className="text-gray-500 font-medium">Your adventure is ready. Show this pass at boarding.</p>
                            </div>
                            <BoardingPass ticket={bookedTicket} />
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => setStep('search')}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    Book Another Trip
                                </button>
                            </div>
                        </Motion.div>
                    )}
                </AnimatePresence>

                <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLoginSuccess}
                />
            </div>
        </div>
    );
};

// Simple Arrow icon for internal use if lucide not imported
const ArrowLeft = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const CheckCheck = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
);

export default TicketBooking;
