import React, { useState } from 'react';
import { Users, DoorClosed, Check } from 'lucide-react';
import { useToast } from '../ui/Toast';

const Step2Guests = ({ hotelRooms, formData, setFormData, onNext, onPrev }) => {
    const toast = useToast();
    // Fallback if no rooms provided (mock mode)
    const displayRooms = (hotelRooms && hotelRooms.length > 0) 
        ? hotelRooms 
        : [
            { id: 'mock-1', room_type: 'Standard Room', price_per_night: 2500, capacity: 2 },
            { id: 'mock-2', room_type: 'Deluxe Suite', price_per_night: 4500, capacity: 4 }
        ];

    const [selectedRoomId, setSelectedRoomId] = useState(formData.roomId || '');
    const [roomsCount, setRoomsCount] = useState(formData.roomsCount || 1);
    const [adults, setAdults] = useState(formData.adults || 2);
    const [children, setChildren] = useState(formData.children || 0);

    const handleNext = () => {
        if (!selectedRoomId) {
            toast.warning("Please select a room type.");
            return;
        }
        const room = displayRooms.find(r => r.id === selectedRoomId);
        if (adults < roomsCount) {
            toast.warning("You must have at least 1 adult per room.");
            return;
        }
        setFormData({ 
            ...formData, 
            roomId: selectedRoomId, 
            roomType: room.room_type,
            roomPrice: room.price_per_night,
            roomsCount, 
            adults, 
            children,
            travelers: Array(adults + children).fill({ name: '', age: '', nid: '' }) // Placeholder for travelers
        });
        onNext();
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <DoorClosed className="text-primary" /> Select Room Type
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {displayRooms.map((room) => (
                        <div 
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center ${selectedRoomId === room.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                        >
                            <div>
                                <h4 className="font-bold text-gray-900">{room.room_type}</h4>
                                <p className="text-sm text-gray-500">Max Guests: {room.capacity}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">৳{room.price_per_night.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">per night</div>
                            </div>
                            {selectedRoomId === room.id && <Check className="text-blue-600 ml-4" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Users className="text-primary" /> Guests
                </h3>
                {/* Rooms Count */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                    <div>
                        <h4 className="font-bold text-gray-900">Number of Rooms</h4>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1">
                        <button disabled={roomsCount <= 1} onClick={() => setRoomsCount(r => r - 1)} className="bg-white px-4 py-1 rounded shadow-sm font-bold disabled:opacity-50">-</button>
                        <span className="font-bold w-4 text-center">{roomsCount}</span>
                        <button disabled={roomsCount >= 4} onClick={() => setRoomsCount(r => r + 1)} className="bg-white px-4 py-1 rounded shadow-sm font-bold disabled:opacity-50">+</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                        <span className="font-medium">Adults</span>
                        <div className="flex items-center gap-4">
                            <button disabled={adults <= 1} onClick={() => setAdults(a => a - 1)} className="bg-gray-100 px-3 py-1 rounded">-</button>
                            <span className="font-bold">{adults}</span>
                            <button onClick={() => setAdults(a => a + 1)} className="bg-gray-100 px-3 py-1 rounded">+</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                        <span className="font-medium">Children</span>
                        <div className="flex items-center gap-4">
                            <button disabled={children <= 0} onClick={() => setChildren(c => c - 1)} className="bg-gray-100 px-3 py-1 rounded">-</button>
                            <span className="font-bold">{children}</span>
                            <button onClick={() => setChildren(c => c + 1)} className="bg-gray-100 px-3 py-1 rounded">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <button onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold">Back</button>
                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md">Review Booking</button>
            </div>
        </div>
    );
};

export default Step2Guests;
