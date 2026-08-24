import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Car, Compass, Hotel, LifeBuoy, MapPin, ShieldCheck, Store, Utensils } from 'lucide-react';

const SERVICES = {
    hotels: { title: 'Hotels & Stays', description: 'Find comfortable places to stay near your next destination.', icon: Hotel, action: '/destinations', actionLabel: 'Explore destinations' },
    restaurants: { title: 'Restaurants', description: 'Discover local food, trusted restaurants and regional specialties.', icon: Utensils, action: '/explore?tab=BUSINESSES', actionLabel: 'Find food services' },
    'car-rental': { title: 'Car Rental', description: 'Arrange a car, microbus or local transport for your journey.', icon: Car, action: '/marketplace/transport', actionLabel: 'Browse transport' },
    transport: { title: 'Transport', description: 'Search buses, trains, flights and boats for your route.', icon: Compass, action: '/tickets', actionLabel: 'Search tickets' },
    guides: { title: 'Local Guides', description: 'Connect with people who know the places beyond the usual route.', icon: MapPin, action: '/marketplace/guides', actionLabel: 'Browse local guides' },
    mechanic: { title: 'Vehicle Help', description: 'Get roadside support when your vehicle needs attention.', icon: LifeBuoy, action: '/marketplace/register', actionLabel: 'Offer vehicle help' },
    emergency: { title: 'Emergency Help', description: 'Reach safety information and emergency guidance while travelling.', icon: ShieldCheck, action: '/safety', actionLabel: 'Open safety center' },
};

export default function ServiceDirectory() {
    const { service } = useParams();
    const item = SERVICES[service] || { title: 'Travel Services', description: 'Choose a service to make your trip easier.', icon: Store, action: '/destinations', actionLabel: 'Start exploring' };
    const Icon = item.icon;
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12"><div className="mx-auto max-w-4xl"><div className="rounded-3xl bg-green-900 p-8 text-white md:p-12"><Icon size={40} className="mb-5 text-green-300" /><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-300">Madventure Services</p><h1 className="text-4xl font-black">{item.title}</h1><p className="mt-3 max-w-xl text-white/80">{item.description}</p><Link to={item.action} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-green-900 hover:bg-green-100">{item.actionLabel}<ArrowRight size={17} /></Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link to="/marketplace/register" className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><Store className="mb-3 text-primary" /><h2 className="font-bold">Offer a service</h2><p className="mt-1 text-sm text-gray-500">Register as a vendor and add your service details.</p></Link><Link to="/planner" className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><Compass className="mb-3 text-primary" /><h2 className="font-bold">Plan around this service</h2><p className="mt-1 text-sm text-gray-500">Build your itinerary with the Smart Planner.</p></Link></div></div></div>;
}