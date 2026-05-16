import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ContextMap = ({ districtName }) => {
    const [bangladeshGeoJSON, setBangladeshGeoJSON] = useState(null);

    useEffect(() => {
        fetch('/data/bd-geojson/bangladesh.json')
            .then(res => res.json())
            .then(data => setBangladeshGeoJSON(data))
            .catch(err => console.error("Error loading geojson", err));
    }, []);

    // Mapping for district names if they differ between app data and GeoJSON
    const geoJsonNameMapping = {
        "Chattogram": "Chittagong",
        "Bogura": "Bogra",
        "Cox's Bazar": "Cox's Bazar",
        "Barishal": "Barisal",
        "Jashore": "Jessore",
        "Cumilla": "Comilla"
    };

    const districtNameInGeoJSON = geoJsonNameMapping[districtName] || districtName;

    // Style function to highlight the selected district
    const style = (feature) => {
        const isSelected = feature.properties.district_name === districtNameInGeoJSON || 
                          feature.properties.district_name === districtName;
        
        return {
            fillColor: isSelected ? '#ffcc00' : '#006a4e', // Yellow for selected, Green for others
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: isSelected ? 1 : 0.4
        };
    };

    return (
        <div className="py-16 bg-white relative overflow-hidden border-t border-gray-100">
            <div className="max-w-[1140px] mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Location in Bangladesh</h2>

                <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-blue-50 rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
                    <MapContainer
                        center={[23.6850, 90.3563]}
                        zoom={6}
                        scrollWheelZoom={false}
                        dragging={false}
                        zoomControl={false}
                        doubleClickZoom={false}
                        className="w-full h-full bg-blue-50"
                    >
                        {/* We use a very light TileLayer or none for context */}
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                        {bangladeshGeoJSON && (
                            <GeoJSON
                                data={bangladeshGeoJSON}
                                style={style}
                            />
                        )}
                    </MapContainer>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100">
                            <p className="text-sm font-bold text-gray-800">Geographic Context</p>
                            <p className="text-xs text-primary font-medium">{districtName} highlighted on map</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextMap;
