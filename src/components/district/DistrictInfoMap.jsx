import React, { useMemo } from 'react';
import { MapPin, Info, History } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import bangladeshGeoJSON from '../../data/bangladesh.json';
import districtsList from '../../data/districts_list.json';

// Fix for default marker icon in Leaflet with React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DistrictInfoMap = ({ district }) => {
    // Mapping for district names if they differ between app data and GeoJSON
    const geoJsonNameMapping = {
        "Chattogram": "Chittagong",
        "Bogura": "Bogra",
        "Cox's Bazar": "Cox's Bazar",
        "Barishal": "Barisal",
        "Jashore": "Jessore",
        "Cumilla": "Comilla"
        // Add more mappings as needed
    };

    const districtNameInGeoJSON = geoJsonNameMapping[district.name_en] || district.name_en;

    const districtGeoJSON = useMemo(() => {
        if (!bangladeshGeoJSON || !bangladeshGeoJSON.features) return null;
        return bangladeshGeoJSON.features.find(
            feature => feature.properties.NAME_2 === districtNameInGeoJSON
        );
    }, [districtNameInGeoJSON]);

    // Calculate center of the district
    const mapCenter = useMemo(() => {
        // Priority 1: Use precise coordinates from districts_list.json
        const preciseDistrict = districtsList.districts.find(d => d.name === district.name_en);
        if (preciseDistrict && preciseDistrict.lat && preciseDistrict.long) {
            return [parseFloat(preciseDistrict.lat), parseFloat(preciseDistrict.long)];
        }

        // Priority 2: Fallback to GeoJSON centroid
        if (districtGeoJSON) {
            const layer = L.geoJSON(districtGeoJSON);
            const bounds = layer.getBounds();
            return bounds.getCenter();
        }

        // Priority 3: Default to Bangladesh center
        return [23.6850, 90.3563];
    }, [districtGeoJSON, district.name_en]);


    return (
        <div className="py-16 bg-white">
            <div className="max-w-[1140px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Info (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Description */}
                        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Info size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">About {district.name_en}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {district.short_description} {district.notes && <span>{district.notes}</span>}
                                <br /><br />
                                {district.name_en} is a prominent district in the {district.division} division. It offers a unique blend of natural beauty and cultural heritage.
                            </p>
                        </div>

                        {/* History Placeholder */}
                        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
                                    <History size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Historical Significance</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                This district has a rich history dating back centuries. From ancient settlements to modern developments, it has played a crucial role in the region's cultural evolution.
                            </p>
                        </div>
                    </div>

                    {/* Right: Map (5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-100 rounded-3xl p-2 h-full min-h-[400px] flex items-center justify-center relative overflow-hidden shadow-inner border-4 border-white">
                            {districtGeoJSON ? (
                                <MapContainer
                                    center={mapCenter}
                                    zoom={9}
                                    scrollWheelZoom={false}
                                    className="w-full h-full rounded-2xl z-0"
                                    style={{ minHeight: "400px" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <GeoJSON
                                        data={districtGeoJSON}
                                        style={{
                                            fillColor: '#006a4e', // User requested Green
                                            weight: 2,
                                            opacity: 1,
                                            color: 'white',       // User requested White border
                                            dashArray: '3',       // User requested dashed border
                                            fillOpacity: 0.7
                                        }}
                                    />
                                </MapContainer>
                            ) : (
                                <div className="text-center p-6">
                                    <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500">Map data not available for {district.name_en}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistrictInfoMap;
