import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, FileText, MessageCircle, Share2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { getBookingById } from '../services/bookingService';
import { unicornService } from '../services/unicornService';

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const { user } = useAuth();
    const toast = useToast();
    const [printing, setPrinting] = useState(false);
    const [agencyId, setAgencyId] = useState(null);
    const [contacting, setContacting] = useState(false);

    useEffect(() => {
        if (!bookingId) return;
        getBookingById(bookingId).then(booking => {
            setAgencyId(booking?.tours?.agency_id || booking?.agency_id || null);
        }).catch(() => {});
    }, [bookingId]);

    const contactAgency = async () => {
        if (!user || !agencyId) {
            toast.warning(agencyId ? 'Please log in to contact the agency.' : 'Agency contact is not available for this booking yet.');
            return;
        }
        setContacting(true);
        try {
            const room = await unicornService.getOrCreateDirectChat(user.id, agencyId, `Booking ${bookingId || ''}`);
            navigate(`/messages?room=${room.id}`);
        } catch (error) { toast.error(error.message || 'Unable to open agency chat.'); }
        finally { setContacting(false); }
    };

    const handlePrint = () => {
        setPrinting(true);
        setTimeout(() => {
            window.print();
            setPrinting(false);
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 flex justify-center items-center font-sans">
            <div className={`max-w-xl w-full bg-white rounded-2xl ${printing ? 'shadow-none' : 'shadow-xl'} overflow-hidden animate-in zoom-in-95 duration-300`}>
                
                {/* Header Ticket Strip */}
                <div className="bg-primary p-6 text-white text-center rounded-t-2xl relative">
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                    
                    <CheckCircle size={40} className="mx-auto mb-3 text-green-100" />
                    <h2 className="text-2xl font-bold font-heading mb-1">Booking Confirmed!</h2>
                    <p className="text-green-100/80 text-sm">Thank you for choosing Madventure</p>
                </div>

                <div className="p-8 pb-4">
                    <div className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-100 pb-6 mb-6 border-dashed">
                        <div className="flex-1 w-full text-center md:text-left">
                            <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Booking Reference</span>
                            <span className="font-mono text-xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded inline-block">{bookingId || 'MDV-XXXXXX'}</span>
                            <p className="text-xs text-gray-400 mt-2">Issued on: {new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <div className="bg-white p-2 border border-gray-100 rounded-xl shadow-sm shrink-0">
                            <QRCodeSVG 
                                value={`https://madventure.com/verify/${bookingId}`} 
                                size={100}
                                bgColor={"#ffffff"}
                                fgColor={"#1f2937"}
                                level={"L"}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600 mb-8">
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">PAID</span>
                        </div>
                        <button
                            onClick={contactAgency}
                            disabled={contacting}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-green-50 py-3 font-bold text-primary hover:bg-green-100 disabled:opacity-50"
                        >
                            <MessageCircle size={18} /> {contacting ? 'Opening chat...' : 'Contact Agency'}
                        </button>
                        <div className="flex justify-between">
                            <span>Payment Mode</span>
                            <span className="font-medium text-gray-800">SSLCommerz Digital Gateway</span>
                        </div>
                        <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-700">
                                <ShieldCheck size={16} />
                                <span className="text-xs font-bold">Inventory Lock: Verified</span>
                            </div>
                            <span className="text-[10px] text-blue-600">Atomic Reservation Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Print & Share Actions - Hidden during print */}
                {!printing && (
                    <div className="bg-gray-50 p-6 flex flex-col md:flex-row gap-3 border-t border-gray-100 rounded-b-2xl">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download size={18} /> Save as PDF
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-primary hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            <FileText size={18} /> View in Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingConfirmation;
