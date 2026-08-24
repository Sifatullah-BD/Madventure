import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Hotel, MapPin, Plane, Star, Ticket } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { getHotels, getTours } from '../services/tourService';
import SEO from '../components/SEO';

const DestinationHub = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [tours, setTours] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        const loadHub = async () => {
            setLoading(true);
            setError(false);
            try {
                const destination = await supabaseService.getPlaceById(id);
                const [allTours, allHotels] = await Promise.all([
                    getTours(),
                    getHotels(),
                ]);
                if (!mounted) return;
                setPlace(destination);
                const matchesDestination = item =>
                    item.place_id === id || item.district_id === destination.district_id ||
                    item.destination?.toLowerCase() === destination.name?.toLowerCase();
                setTours((allTours || []).filter(matchesDestination).slice(0, 6));
                setHotels((allHotels || []).filter(matchesDestination).slice(0, 6));
            } catch (loadError) {
                console.error('Failed to load destination hub:', loadError);
                if (mounted) setError(true);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadHub();
        window.scrollTo(0, 0);
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6"><div className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" /></div>;
    }

    if (error || !place) {
        return (
            <div className="min-h-[60vh] grid place-items-center bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-200">
                <div className="text-center">
                    <p className="font-bold text-lg mb-3">Destination not found</p>
                    <Link to="/destinations" className="text-primary font-bold hover:underline">Back to destinations</Link>
                </div>
            </div>
        );
    }

    const image = place.image || place.cover_image || place.images?.[0];
    const rating = place.rating || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-16">
            <SEO title={`${place.name} | Madventure`} description={place.description || `Explore ${place.name} with Madventure.`} />
            <section className="relative min-h-[390px] overflow-hidden">
                {image && <img src={image} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-10 min-h-[390px] flex flex-col justify-between text-white">
                    <button onClick={() => navigate(-1)} className="self-start p-2 rounded-xl bg-white/15 hover:bg-white/25" title="Go back"><ArrowLeft size={18} /></button>
                    <div>
                        <div className="flex flex-wrap gap-3 text-sm font-bold mb-3">
                            {place.region && <span className="inline-flex items-center gap-1"><MapPin size={15} />{place.region}</span>}
                            <span className="inline-flex items-center gap-1 text-yellow-300"><Star size={15} fill="currentColor" />{rating}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">{place.name}</h1>
                        {place.description && <p className="max-w-2xl mt-3 text-white/85 leading-relaxed">{place.description}</p>}
                        <Link to={`/tour-plans?destination=${encodeURIComponent(place.name)}`} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-green-700 transition-colors">
                            <Plane size={17} /> Plan a trip
                        </Link>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5"><MapPin className="text-primary mb-3" /><p className="text-xs text-gray-500">Location</p><p className="font-bold mt-1">{place.region || 'Bangladesh'}</p></div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5"><Ticket className="text-orange-500 mb-3" /><p className="text-xs text-gray-500">Tours available</p><p className="font-bold mt-1">{tours.length}</p></div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5"><Hotel className="text-blue-500 mb-3" /><p className="text-xs text-gray-500">Stays available</p><p className="font-bold mt-1">{hotels.length}</p></div>
                </section>

                <InventorySection title="Tours & adventures" icon={Ticket} items={tours} empty="No tours are listed for this destination yet." renderItem={tour => (
                    <Link to={`/tours/${tour.id}`} className="block bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
                        <p className="font-bold">{tour.title || tour.name}</p><p className="text-sm text-gray-500 mt-2">{tour.duration || 'Flexible duration'}</p><p className="text-primary font-black mt-4">৳{Number(tour.price_per_person || tour.price || tour.base_price || 0).toLocaleString()}</p>
                    </Link>
                )} />
                <InventorySection title="Where to stay" icon={Hotel} items={hotels} empty="No hotels are listed for this destination yet." renderItem={hotel => (
                    <div key={hotel.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5"><p className="font-bold">{hotel.name}</p><p className="text-sm text-gray-500 mt-2">{hotel.type || 'Hotel'}{hotel.rating ? ` · ${hotel.rating} stars` : ''}</p><p className="text-primary font-black mt-4">৳{Number(hotel.price_per_night || hotel.price_from || 0).toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ night</span></p></div>
                )} />
                <Link to="/planner" className="flex items-center gap-4 rounded-2xl bg-green-900 text-white p-6 hover:bg-green-800 transition-colors"><CalendarDays size={25} /><span><strong className="block">Build your itinerary</strong><span className="text-sm text-white/75">Use the Smart Planner to shape the perfect {place.name} trip.</span></span></Link>
            </main>
        </div>
    );
};

const InventorySection = ({ title, icon, items, empty, renderItem }) => (
    <section>
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">{React.createElement(icon, { className: 'text-primary', size: 22 })}{title}</h2>
        {items.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{items.map(renderItem)}</div> : <p className="text-gray-500">{empty}</p>}
    </section>
);

export default DestinationHub;