import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, User, Download, Share2, ShieldCheck, Ticket } from 'lucide-react';

const BoardingPass = ({ ticket }) => {
    if (!ticket) return null;

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                {/* Header Section */}
                <div className="bg-[#0a0a0a] p-8 text-white relative">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Ticket size={18} className="text-black" />
                            </div>
                            <span className="font-black text-sm tracking-tighter italic">MADVENTURE</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Boarding Pass</p>
                            <p className="text-xs font-black text-emerald-400">{ticket.pnr}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end relative">
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-[2px] border-t border-dashed border-white/20"></div>
                        
                        <div className="z-10 bg-[#0a0a0a] pr-4">
                            <h2 className="text-4xl font-black">{ticket.from?.substring(0, 3).toUpperCase() || 'DAC'}</h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{ticket.from || 'Dhaka'}</p>
                        </div>

                        <div className="z-10 bg-[#0a0a0a] px-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                <MapPin size={16} className="text-emerald-400" />
                            </div>
                        </div>

                        <div className="z-10 bg-[#0a0a0a] pl-4 text-right">
                            <h2 className="text-4xl font-black text-emerald-400">{ticket.to?.substring(0, 3).toUpperCase() || 'CXB'}</h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{ticket.to || "Cox's Bazar"}</p>
                        </div>
                    </div>
                </div>

                {/* Perforation Line */}
                <div className="relative h-4 flex items-center">
                    <div className="absolute left-0 -translate-x-1/2 w-6 h-6 bg-gray-50 dark:bg-gray-950 rounded-full border border-gray-100 dark:border-gray-800"></div>
                    <div className="w-full border-t-2 border-dashed border-gray-100"></div>
                    <div className="absolute right-0 translate-x-1/2 w-6 h-6 bg-gray-50 dark:bg-gray-950 rounded-full border border-gray-100 dark:border-gray-800"></div>
                </div>

                {/* Body Section */}
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Passenger</p>
                            <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                                <User size={14} className="text-emerald-500" /> Sifat Ullah
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-black text-gray-800 flex items-center justify-end gap-2">
                                <Calendar size={14} className="text-emerald-500" /> {ticket.date}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Class</p>
                            <p className="text-xs font-black text-gray-800">Economy</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Seat</p>
                            <p className="text-xs font-black text-emerald-600">{ticket.seats?.join(', ')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                            <p className="text-xs font-black text-gray-800">{ticket.time}</p>
                        </div>
                    </div>

                    {/* Barcode Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                            <div className="w-full h-16 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_4px)] opacity-80 mb-2"></div>
                            <p className="text-[10px] font-black text-gray-400 tracking-[0.5em]">{ticket.id}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-gray-950 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                            <Download size={16} /> Download
                        </button>
                        <button className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-all border border-emerald-100">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Footer Security Badge */}
                <div className="bg-emerald-500 py-3 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-black" />
                        <span className="text-[9px] font-black text-black uppercase tracking-widest">Verified Digital Pass</span>
                    </div>
                    <span className="text-[9px] font-black text-black/50 uppercase tracking-widest">MADVENTURE OS</span>
                </div>
            </div>
        </div>
    );
};

export default BoardingPass;
