import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createPendingBooking } from '../../api/bookings';
import { trackEvent } from '../../utils/analytics';

const Step3Summary = ({ tourData, formData, onPrev }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    
    // Calculate totals
    const costPerPerson = parseFloat(tourData.price) || tourData.price_per_person || 0;
    const subtotal = costPerPerson * formData.seats;
    const platformFee = 0; // Promotional
    const totalPayable = subtotal + platformFee;

    const handleCheckout = async () => {
        if (!user?.id) {
            navigate('/', { state: { showLogin: true } });
            return;
        }
        setSubmitting(true);
        try {
            const { data, error } = await createPendingBooking({
                userId: String(user.id),
                entityType: 'tour',
                entityId: String(tourData.id),
                bookingDate: formData.date,
                totalPrice: totalPayable,
                extras: {
                    seats: formData.seats,
                    travelers: formData.travelers,
                    tourTitle: tourData.title,
                },
            });
            if (error) throw error;
            trackEvent(
                'booking_started',
                { tour_id: tourData.id, booking_id: data.id, seats: formData.seats },
                String(user.id),
            );
            const checkoutPayload = {
                id: data.id,
                amount: totalPayable,
                title: tourData.title,
                customerName: formData.travelers[0]?.name || user.name || 'Traveler',
                customerPhone: formData.travelers[0]?.phone || '01700000000',
                customerEmail: user.email || '',
                bookingData: { ...formData, tourId: tourData.id },
            };
            navigate('/checkout', { state: { booking: checkoutPayload } });
        } catch (e) {
            console.error(e);
            window.alert(e.message || 'Could not create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-primary" /> Review Final Details
            </h3>

            <div className="bg-green-50 border border-green-100 p-5 rounded-xl">
                <h4 className="font-bold text-gray-800 text-lg mb-2">{tourData.title}</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium text-gray-900">{new Date(formData.date).toLocaleDateString('en-GB')}</span>
                    
                    <span className="text-gray-600">Seats Reserved:</span>
                    <span className="font-medium text-gray-900">{formData.seats} Person(s)</span>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Traveler List</h4>
                <ul className="space-y-2 text-sm">
                    {formData.travelers.map((t, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="font-medium text-gray-800">{idx+1}. {t.name} (Age {t.age})</span>
                            {t.nid && <span className="text-xs text-gray-500 font-mono">ID: {t.nid}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white border text-sm border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Cost per person</span>
                    <span className="text-gray-800">৳{costPerPerson.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({formData.seats} persons)</span>
                    <span className="text-gray-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                        Platform Fee <AlertCircle size={12} className="text-gray-400"/>
                    </span>
                    <span className="text-gray-800">৳0</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3">
                    <span className="text-gray-800">Total Payable</span>
                    <span className="text-primary">৳{totalPayable.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button 
                    onClick={onPrev}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                    Edit Travelers
                </button>
                <button 
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Saving…' : 'Proceed to Payment'}
                </button>
            </div>
        </div>
    );
};

export default Step3Summary;
