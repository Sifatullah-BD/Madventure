/**
 * useBookingStore.js – Multi-step booking wizard state using Zustand
 * Tracks every step of the checkout pipeline from tour/hotel selection
 * all the way through payment confirmation.
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const INITIAL_STATE = {
    // Step tracking: 'select' | 'travelers' | 'review' | 'payment' | 'success'
    step: 'select',

    // What we are booking
    bookingType: null, // 'tour' | 'hotel'
    item: null,        // full tour or hotel object
    schedule: null,    // selected schedule/inventory slot

    // Guest & traveler details
    quantity: 1,
    travelers: [],    // [{ full_name, age, gender, phone }]
    checkIn: null,
    checkOut: null,
    notes: '',

    // Pricing
    unitPrice: 0,
    totalPrice: 0,

    // Final booking/payment result
    bookingId: null,
    paymentMethod: null,
    couponCode: '',
    discountAmount: 0,
};

const useBookingStore = create(
    devtools(
        persist(
            (set, get) => ({
                ...INITIAL_STATE,

                // Navigation
                setStep: (step) => set({ step }),

                // Initialise a new booking from item + type
                initBooking: (bookingType, item, unitPrice) => set({
                    ...INITIAL_STATE,
                    bookingType,
                    item,
                    unitPrice,
                    totalPrice: unitPrice,
                    step: 'travelers',
                }),

                // Travelers
                setQuantity: (quantity) => set(state => ({
                    quantity,
                    totalPrice: (state.unitPrice - state.discountAmount) * quantity,
                })),

                addTraveler: (traveler) => set(state => ({
                    travelers: [...state.travelers, traveler],
                })),

                removeTraveler: (index) => set(state => ({
                    travelers: state.travelers.filter((_, i) => i !== index),
                })),

                updateTraveler: (index, updates) => set(state => ({
                    travelers: state.travelers.map((t, i) => i === index ? { ...t, ...updates } : t),
                })),

                // Schedule selection (tour departure date / hotel room)
                setSchedule: (schedule) => set({ schedule }),
                setCheckIn: (date) => set({ checkIn: date }),
                setCheckOut: (date) => set({ checkOut: date }),
                setNotes: (notes) => set({ notes }),

                // Payment
                setPaymentMethod: (method) => set({ paymentMethod: method }),

                // Coupon
                applyCoupon: (code, discountAmount) => set(state => ({
                    couponCode: code,
                    discountAmount,
                    totalPrice: (state.unitPrice - discountAmount) * state.quantity,
                })),

                // After confirmed booking
                setBookingId: (id) => set({ bookingId: id, step: 'payment' }),

                // Success
                markSuccess: () => set({ step: 'success' }),

                // Reset everything
                reset: () => set(INITIAL_STATE),
            }),
            {
                name: 'madventure-booking',
                // Only persist non-sensitive items
                partialise: (state) => ({
                    bookingType: state.bookingType,
                    item: state.item,
                    schedule: state.schedule,
                    quantity: state.quantity,
                    checkIn: state.checkIn,
                    checkOut: state.checkOut,
                    notes: state.notes,
                    unitPrice: state.unitPrice,
                    totalPrice: state.totalPrice,
                    step: state.step,
                }),
            }
        ),
        { name: 'BookingStore' }
    )
);

export default useBookingStore;
