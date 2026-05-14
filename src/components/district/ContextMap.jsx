import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import bangladeshGeoJSON from '../../data/bangladesh.json';

const ContextMap = ({ districtName }) => {
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
        const isSelected = feature.properties.NAME_2 === districtNameInGeoJSON;
        return {
            fillColor: isSelected ? '#ffcc00' : '#006a4e', // Yellow for selected, Green for others
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: isSelected ? 1 : 0.7
        };
    };

    // Filter to ensure we only render valid features if needed, 
    // but for context map we want all of them.
    // We might want to optimize if the geojson is too large, but for now rendering all is fine for context.

    return (
        <div className="py-16 bg-white relative overflow-hidden">
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
                        {/* 
                           We can omit TileLayer for a cleaner "map only" look, 
                           or keep it for context. Let's keep it minimal or remove it 
                           if we want just the polygon shapes. 
                           Let's try without TileLayer for a pure SVG look, 
                           or with a very light one.
                        */}
                        {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" /> */}

                        {bangladeshGeoJSON && (
                            <GeoJSON
                                data={bangladeshGeoJSON}
                                style={style}
                            />
                        )}
                    </MapContainer>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                            <p className="text-sm font-bold text-gray-600">Map Context</p>
                            <p className="text-xs text-gray-500">{districtName} is highlighted here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextMap;
