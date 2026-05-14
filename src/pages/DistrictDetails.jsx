import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessagesSquare } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import DistrictHero from '../components/district/DistrictHero';
import FamousItems from '../components/district/FamousItems';
import DistrictInfoMap from '../components/district/DistrictInfoMap';
import TouristSpotsGallery from '../components/district/TouristSpotsGallery';
import ContextMap from '../components/district/ContextMap';
import StudentTourPlan from '../components/district/StudentTourPlan';
import Navbar from '../components/Navbar';

const DistrictDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [district, setDistrict] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDistrictData = async () => {
            setLoading(true);
            try {
                // 1. Fetch District Info
                let districtData;
                // Check if ID is numeric (from DB) or slug (from URL)
                if (/^\d+$/.test(id)) {
                    // It's a numeric ID, but we don't have getDistrictById exposed yet, 
                    // and the current flow uses names mostly. 
                    // Let's assume for now we might get a name or ID.
                    // Actually, let's try by name first if it's not numeric.
                    // But wait, our service has getDistrictByName.
                    // If ID is numeric, we should use getDistrictById (need to add it or use select).
                    // For simplicity, let's assume the URL param is a name/slug like 'dhaka'
                    districtData = await supabaseService.getDistrictByName(id);
                } else {
                    // It's a slug/name
                    districtData = await supabaseService.getDistrictByName(id);
                }

                if (!districtData) {
                    // Try finding by ID if name failed (fallback)
                    const { data } = await supabaseService.getDistricts();
                    districtData = data.find(d => d.id === id);
                }

                if (!districtData) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch Related Data (Spots/Places)
                // We'll search places where location or description contains the district name
                // Or ideally we should have a district_id in places, but we don't.
                // We'll use the 'region' or 'location' field.
                const allPlaces = await supabaseService.getPlaces();
                const districtPlaces = allPlaces.filter(p =>
                    p.location.toLowerCase().includes(districtData.name.toLowerCase()) ||
                    p.region.toLowerCase().includes(districtData.name.toLowerCase())
                );

                // 3. Fetch Related Tours
                const allTours = await supabaseService.getTours();
                const districtTours = allTours.filter(t =>
                    t.destination.toLowerCase().includes(districtData.name.toLowerCase())
                );

                // 4. Construct the rich object expected by components
                // We need to mock some fields that are missing in DB (famous_food, hero_image, etc.)
                // or map them if available.
                // For now, we'll use placeholders or map what we have.

                const richDistrict = {
                    ...districtData,
                    name_en: districtData.name,
                    division: "Bangladesh", // We could fetch division name if needed
                    short_description: `Explore the beautiful district of ${districtData.name}.`,
                    famous_food: [], // Placeholder
                    top_spots: districtPlaces.map(p => ({
                        name: p.name,
                        image: p.image
                    })),
                    student_tours: districtTours.map(t => ({
                        title: t.title,
                        budget: `${t.price} BDT`,
                        duration: t.duration,
                        spots: [t.destination], // Simplified as we don't have a separate spots array in tours yet
                        notes: t.category || t.description
                    })),
                    // Use a default hero image or one from the first place
                    hero_image: districtPlaces.length > 0 ? districtPlaces[0].image : "https://images.unsplash.com/photo-1600100598079-423568e6227c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
                    notes: ""
                };

                setDistrict(richDistrict);
            } catch (error) {
                console.error("Error fetching district details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDistrictData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!district) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">District Not Found</h2>
                    <p className="text-gray-600 mb-6">The district you are looking for does not exist or has not been added yet.</p>
                    <button
                        onClick={() => navigate('/destinations')}
                        className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-colors"
                    >
                        Back to Destinations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <DistrictHero district={district} />

            <FamousItems items={district.famous_food} />

            <DistrictInfoMap district={district} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 text-center shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                        <h3 className="text-2xl font-black text-blue-900 mb-2">এই গন্তব্য নিয়ে কোনো প্রশ্ন আছে?</h3>
                        <p className="text-blue-700 font-medium">ম্যাডভেঞ্চার কমিউনিটির লোকাল গাইড ও এক্সপেরিয়েন্সড ট্রাভেলারদের কাছে যেকোনো ট্যুর বা রুট নিয়ে প্রশ্ন করুন।</p>
                    </div>
                    <button 
                        onClick={() => navigate(`/community?tab=forum&threadId=new&districtId=${district.id || id}`)}
                        className="bg-blue-600 text-white min-w-[220px] px-8 py-4 rounded-full font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        <MessagesSquare size={20}/> প্রশ্ন করুন
                    </button>
                </div>
            </div>

            <TouristSpotsGallery spots={district.top_spots} />

            <StudentTourPlan tours={district.student_tours} />

            <ContextMap districtName={district.name_en} />
        </div>
    );
};

export default DistrictDetails;
