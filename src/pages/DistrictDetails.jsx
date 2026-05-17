import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessagesSquare, Map as MapIcon, ChevronRight } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import DistrictHero from '../components/district/DistrictHero';
import FamousItems from '../components/district/FamousItems';
import DistrictInfoMap from '../components/district/DistrictInfoMap';
import TouristSpotsGallery from '../components/district/TouristSpotsGallery';
import ContextMap from '../components/district/ContextMap';
import StudentTourPlan from '../components/district/StudentTourPlan';


// Import local data for Upazilas and Districts mapping
import bdDistricts from '../data/bd-geojson/bd-districts.json';
import bdUpazilas from '../data/bd-geojson/bd-upazilas.json';

const DistrictDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [district, setDistrict] = useState(null);
    const [loading, setLoading] = useState(true);

    // Find Upazilas for this district
    const upazilas = useMemo(() => {
        if (!district) return [];
        
        // Find district ID from our local JSON using name
        const localDistrict = bdDistricts.districts.find(d => 
            d.name.toLowerCase() === district.name.toLowerCase() || 
            d.bn_name === district.name
        );
        
        if (!localDistrict) return [];
        
        return bdUpazilas.upazilas.filter(u => u.district_id === localDistrict.id);
    }, [district]);

    useEffect(() => {
        const fetchDistrictData = async () => {
            setLoading(true);
            try {
                // 1. Fetch District Info from Supabase
                let districtData;
                districtData = await supabaseService.getDistrictByName(id);

                if (!districtData) {
                    // Fallback to searching all districts if direct name match fails
                    const { data } = await supabaseService.getDistricts();
                    districtData = data.find(d => d.id === id || d.name.toLowerCase() === id.toLowerCase());
                }

                if (!districtData) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch Related Data (Spots/Places)
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

                // 4. Enrich object with local data (lat/long from our JSON if missing)
                const localInfo = bdDistricts.districts.find(d => 
                    d.name.toLowerCase() === districtData.name.toLowerCase()
                );

                const richDistrict = {
                    ...districtData,
                    name_en: districtData.name,
                    lat: districtData.lat || localInfo?.lat,
                    long: districtData.long || localInfo?.long,
                    division: districtData.division || "Bangladesh",
                    short_description: districtData.description || `Explore the beautiful district of ${districtData.name}.`,
                    famous_food: [], 
                    top_spots: districtPlaces.map(p => ({
                        name: p.name,
                        image: p.image
                    })),
                    student_tours: districtTours.map(t => ({
                        title: t.title,
                        budget: `${t.price} BDT`,
                        duration: t.duration,
                        spots: [t.destination],
                        notes: t.category || t.description
                    })),
                    hero_image: districtPlaces.length > 0 ? districtPlaces[0].image : "https://images.unsplash.com/photo-1600100598079-423568e6227c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020d06] pt-24">
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#020d06] pt-20">

            <DistrictHero district={district} />

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                                <MapIcon className="text-primary" size={28} /> উপজেলার তালিকা
                            </h2>
                            <p className="text-gray-500 font-medium">{district.name} জেলায় মোট {upazilas.length}টি উপজেলা রয়েছে</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:max-w-2xl justify-end">
                            {upazilas.map((u) => (
                                <div key={u.id} className="group cursor-pointer">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-all duration-300">
                                        {u.bn_name} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <FamousItems items={district.famous_food} />

            <DistrictInfoMap district={district} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="text-left relative z-10">
                        <h3 className="text-3xl font-black text-white mb-3">এই গন্তব্য নিয়ে কোনো প্রশ্ন আছে?</h3>
                        <p className="text-blue-50 font-medium text-lg max-w-xl">ম্যাডভেঞ্চার কমিউনিটির লোকাল গাইড ও এক্সপেরিয়েন্সড ট্রাভেলারদের কাছে যেকোনো ট্যুর বা রুট নিয়ে প্রশ্ন করুন।</p>
                    </div>
                    <button 
                        onClick={() => navigate(`/community?tab=forum&threadId=new&districtId=${district.id || id}`)}
                        className="bg-white text-blue-700 min-w-[220px] px-8 py-5 rounded-2xl font-black shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-3 relative z-10"
                    >
                        <MessagesSquare size={24}/> প্রশ্ন করুন
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
