import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const StudentTourSection = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTours() {
            try {
                const { data, error } = await supabase
                    .from('tours')
                    .select('*')
                    .eq('category', 'student')
                    .limit(4);
                
                if (data) setTours(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTours();
    }, []);

    if (loading) {
        return (
            <div className="py-16 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-green-50/30">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            Budget Friendly
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                            Student Backpack Trips 🎒
                        </h2>
                        <p className="text-gray-600 mt-3 max-w-xl text-lg">
                            Explore Bangladesh under 2000৳. Curated plans for students and backpackers.
                        </p>
                    </div>
                    <Link
                        to="/student-tours"
                        className="group flex items-center gap-2 text-primary font-bold hover:text-green-700 transition-colors"
                    >
                        View All Trips
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tours.map((tour) => (
                        <div key={tour.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={tour.images?.[0] || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07"}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                                    <Clock size={12} className="text-orange-500" />
                                    {tour.duration}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-1 text-gray-500 text-xs font-medium mb-2">
                                    <MapPin size={12} />
                                    {tour.destination}, Bangladesh
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                                    {tour.title}
                                </h3>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500">Est. Cost</p>
                                        <p className="text-green-600 font-bold flex items-center gap-1">
                                            <Wallet size={14} />
                                            ৳{tour.price}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/tour/${tour.id}`}
                                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-full transition-all"
                                    >
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudentTourSection;
