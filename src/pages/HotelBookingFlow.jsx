import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, getHotelRooms } from '../api/hotels';
import Step1Dates from '../components/hotel-booking/Step1Dates';
import Step2Guests from '../components/hotel-booking/Step2Guests';
import Step3Summary from '../components/hotel-booking/Step3Summary';
import { ChevronRight, Hotel } from 'lucide-react';

const HotelBookingFlow = () => {
    const { districtId, hotelId } = useParams();
    const navigate = useNavigate();
    
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        nights: 0,
        roomId: '',
        roomType: '',
        roomPrice: 0,
        roomsCount: 1,
        adults: 2,
        children: 0,
        travelers: []
    });

    useEffect(() => {
        const fetchHotelData = async () => {
            const [hotelRes, roomsRes] = await Promise.all([
                getHotelById(districtId, hotelId),
                getHotelRooms(hotelId)
            ]);

            if (hotelRes.error) {
                setError('Hotel not found or an error occurred.');
            } else {
                setHotel(hotelRes.data);
                setRooms(roomsRes.data || []);
            }
            setLoading(false);
        };
        fetchHotelData();
    }, [districtId, hotelId]);

    if (loading) return <div className="min-h-screen pt-24 text-center text-gray-500">Retrieving hotel availability...</div>;
    if (error || !hotel) return <div className="min-h-screen pt-24 text-center text-red-500 font-bold">{error}</div>;

    const steps = [
        { num: 1, title: 'Dates' },
        { num: 2, title: 'Room & Guests' },
        { num: 3, title: 'Checkout' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Hotel size={24} className="opacity-90"/>
                            <h1 className="text-2xl font-bold font-heading">{hotel.name}</h1>
                        </div>
                        <p className="text-blue-100 text-sm">{hotel.location || 'Secure Reservation Portal'}</p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-center gap-2 items-center text-sm md:text-base">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.num}>
                                <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full ${currentStep === step.num ? 'bg-blue-600 text-white shadow' : 'text-gray-400'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === step.num ? 'bg-white text-blue-600' : 'bg-gray-300 text-white'}`}>{step.num}</span>
                                    <span className="hidden md:inline">{step.title}</span>
                                </div>
                                {idx < steps.length - 1 && <ChevronRight size={16} className="text-gray-300" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Body container */}
                    <div className="p-6 md:p-8">
                        {currentStep === 1 && (
                            <Step1Dates 
                                hotelData={hotel} 
                                formData={formData} 
                                setFormData={setFormData}
                                onNext={() => setCurrentStep(2)} 
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Guests 
                                hotelRooms={rooms}
                                formData={formData} 
                                setFormData={setFormData}
                                onPrev={() => setCurrentStep(1)} 
                                onNext={() => setCurrentStep(3)} 
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Summary 
                                hotelData={hotel} 
                                districtId={districtId}
                                formData={formData} 
                                onPrev={() => setCurrentStep(2)} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBookingFlow;
