import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourById, getTourDepartures } from '../api/tours';
import Step1DateSeat from '../components/booking/Step1DateSeat';
import Step2Travelers from '../components/booking/Step2Travelers';
import Step3Summary from '../components/booking/Step3Summary';
import { ChevronRight } from 'lucide-react';
import { logEvent } from '../api/analytics';
import { useAuth } from '../hooks/useAuth';

const TourBookingFlow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tour, setTour] = useState(null);
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        seats: 1,
        travelers: []
    });

    useEffect(() => {
        const fetchTour = async () => {
            const [tourRes, depRes] = await Promise.all([
                getTourById(id),
                getTourDepartures(id)
            ]);

            if (tourRes.error) {
                setError('Tour not found or an error occurred.');
            } else {
                setTour(tourRes.data);
                setDepartures(depRes.data || []);
            }
            setLoading(false);
        };
        fetchTour();
        logEvent('tour_booking_started', { tour_id: id }, user?.id);
    }, [id]);

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading booking engine...</div>;
    if (error || !tour) return <div className="min-h-screen pt-24 text-center text-red-500 font-bold">{error}</div>;

    const steps = [
        { num: 1, title: 'Dates & Seats' },
        { num: 2, title: 'Travelers Info' },
        { num: 3, title: 'Review & Pay' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header with Title */}
                    <div className="bg-primary p-6 text-white text-center">
                        <h1 className="text-2xl font-bold font-heading">{tour.title}</h1>
                        <p className="text-green-100 mt-1">Booking Workspace</p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-center gap-2 items-center text-sm md:text-base">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.num}>
                                <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full ${currentStep === step.num ? 'bg-primary text-white shadow' : 'text-gray-400'}`}>
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === step.num ? 'bg-white text-primary' : 'bg-gray-300 text-white'}`}>{step.num}</span>
                                    <span className="hidden md:inline">{step.title}</span>
                                </div>
                                {idx < steps.length - 1 && <ChevronRight size={16} className="text-gray-300" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Body container */}
                    <div className="p-6 md:p-8">
                        {currentStep === 1 && (
                            <Step1DateSeat 
                                tourData={tour} 
                                departures={departures}
                                formData={formData} 
                                setFormData={setFormData}
                                onNext={() => setCurrentStep(2)} 
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Travelers 
                                formData={formData} 
                                setFormData={setFormData}
                                onPrev={() => setCurrentStep(1)} 
                                onNext={() => setCurrentStep(3)} 
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3Summary 
                                tourData={tour} 
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

export default TourBookingFlow;
