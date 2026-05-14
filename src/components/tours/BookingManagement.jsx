import React from 'react';
import { Download, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const BookingManagement = ({ bookings = [], totalCount = 0, currentPage = 1, onPageChange, loading }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
            case 'partial_paid':
            case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'unpaid':
            case 'failed': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'confirmed': return <CheckCircle size={14} />;
            case 'partial_paid':
            case 'pending': return <Clock size={14} />;
            case 'unpaid':
            case 'failed': return <AlertCircle size={14} />;
            default: return null;
        }
    };

    const totalPages = Math.ceil(totalCount / 10);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Booking Management</h2>
                    <p className="text-xs text-gray-500 mt-1">Total {totalCount} bookings found</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                    <Download size={16} />
                    Export
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Booking ID</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Trip Name</th>
                            <th className="p-4 font-semibold">Amount</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-400">Loading bookings...</td></tr>
                        ) : bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-[10px] font-mono text-gray-400">{booking.id.slice(0, 8)}...</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(booking.booking_date || booking.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-sm font-bold text-gray-900">
                                    {booking.tours?.title || booking.eventId || 'Unknown Trip'}
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="font-bold text-gray-900">৳{booking.total_price || booking.paidAmount}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(booking.payment_status || booking.status)}`}>
                                        {getStatusIcon(booking.payment_status || booking.status)}
                                        {booking.payment_status || booking.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-primary hover:underline text-xs font-bold">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && bookings.length === 0 && (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-400">No bookings found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">
                        Showing page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;
