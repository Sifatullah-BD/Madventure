import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createPendingBooking } from '../../services/bookingService';

const Step3Summary = ({ hotelData, formData, onPrev, districtId }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    
    const pricePerNight = formData.roomPrice || parseFloat(hotelData.price_per_night || hotelData.price) || 0;
    const roomsCost = pricePerNight * formData.roomsCount;
    const subtotal = roomsCost * (formData.nights || 1);
    
    // Taxes (15%) + Service (10%)
    const taxes = subtotal * 0.25;
    const totalPayable = subtotal + taxes;

    const handleCheckout = async () => {
        if (!user?.id) {
            navigate('/', { state: { showLogin: true } });
            return;
        }
        setSubmitting(true);
        try {
            const { data, error } = await createPendingBooking({
                userId: String(user.id),
                entityType: 'hotel',
                entityId: String(hotelData.id),
                bookingDate: formData.checkIn,
                totalPrice: Math.round(totalPayable),
                extras: {
                    districtId: districtId || hotelData.district_id,
                    nights: formData.nights,
                    roomsCount: formData.roomsCount,
                    roomId: formData.roomId,
                    roomType: formData.roomType,
                    adults: formData.adults,
                    children: formData.children,
                    checkOut: formData.checkOut,
                    hotelName: hotelData.name,
                    travelers: formData.travelers || []
                },
            });
            if (error) throw error;
            const checkoutPayload = {
                id: data.id,
                amount: Math.round(totalPayable),
                title: hotelData.name,
                customerName: user.name || 'Hotel Guest',
                customerPhone: '01700000000',
                customerEmail: user.email || '',
                bookingData: { ...formData, hotelId: hotelData.id, type: 'hotel' },
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
                <CheckCircle className="text-primary" /> Confirm Reservation
            </h3>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <h4 className="font-bold text-gray-800 text-lg mb-2">{hotelData.name}</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium text-blue-700">{formData.roomType}</span>

                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium text-gray-900">{new Date(formData.checkIn).toLocaleDateString('en-GB')}</span>
                    
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium text-gray-900">{new Date(formData.checkOut).toLocaleDateString('en-GB')}</span>

                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{formData.nights} Nights</span>
                </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl text-sm">
                <div className="flex-1 text-center border-r border-gray-200">
                    <span className="block text-gray-500 mb-1">Rooms</span>
                    <span className="font-bold text-lg text-gray-900">{formData.roomsCount}</span>
                </div>
                <div className="flex-1 text-center border-r border-gray-200">
                    <span className="block text-gray-500 mb-1">Adults</span>
                    <span className="font-bold text-lg text-gray-900">{formData.adults}</span>
                </div>
                <div className="flex-1 text-center">
                    <span className="block text-gray-500 mb-1">Children</span>
                    <span className="font-bold text-lg text-gray-900">{formData.children}</span>
                </div>
            </div>

            <div className="bg-white border text-sm border-gray-200 rounded-xl p-5 space-y-2 shadow-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">{formData.roomsCount} x {formData.roomType}</span>
                    <span className="text-gray-800">৳{roomsCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({formData.nights} nights)</span>
                    <span className="text-gray-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                        Taxes & Hotel Fees <Info size={12} className="text-gray-400"/>
                    </span>
                    <span className="text-gray-800">৳{Math.round(taxes).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3">
                    <span className="text-gray-800">Total</span>
                    <span className="text-primary">৳{Math.round(totalPayable).toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button 
                    onClick={onPrev}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                    Modify
                </button>
                <button 
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Saving…' : 'Confirm & Reserve'}
                </button>
            </div>
        </div>
    );
};

export default Step3Summary;
