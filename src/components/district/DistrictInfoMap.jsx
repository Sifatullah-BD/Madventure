import React, { useMemo } from 'react';
import { Info, History, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import the new comprehensive GeoJSON
import bangladeshGeoJSON from '../../data/bd-geojson/bangladesh.json';

const DistrictInfoMap = ({ district }) => {
    // 1. Filter features for this district (showing its Upazilas)
    const districtFeatures = useMemo(() => {
        if (!bangladeshGeoJSON || !district) return null;
        
        const filtered = {
            ...bangladeshGeoJSON,
            features: bangladeshGeoJSON.features.filter(f => 
                f.properties.district_name === district.name_en || 
                f.properties.district_name === district.name
            )
        };
        
        return filtered.features.length > 0 ? filtered : null;
    }, [district]);

    // 2. Style function for Upazilas
    const style = (feature) => {
        return {
            fillColor: '#006a4e', // Bangladesh Green
            weight: 1.5,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6,
            dashArray: '3'
        };
    };

    // 3. Interaction
    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    fillOpacity: 0.9,
                    weight: 2,
                    fillColor: '#ffcc00' // Yellow highlight
                });
            },
            mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(style(feature));
            }
        });
    };

    if (!district) return null;

    // Center map on district coordinates
    const center = district.lat && district.long 
        ? [parseFloat(district.lat), parseFloat(district.long)]
        : [23.6850, 90.3563];

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
                                {district.short_description || `Explore the beautiful district of ${district.name_en}.`} 
                                {district.notes && <span className="block mt-2">{district.notes}</span>}
                                <br />
                                {district.name_en} is a prominent district in the {district.division || 'Bangladesh'}. It offers a unique blend of natural beauty and cultural heritage.
                            </p>
                        </div>

                        {/* Upazila List Placeholder (Dynamic would be better) */}
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Administrative Areas</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {districtFeatures?.features.map((f, i) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-blue-100 rounded-full text-sm font-medium text-blue-700 shadow-sm">
                                        {f.properties.bn_name || f.properties.name}
                                    </span>
                                ))}
                                {(!districtFeatures || districtFeatures.features.length === 0) && (
                                    <p className="text-gray-500 italic text-sm">Upazila data loading or unavailable.</p>
                                )}
                            </div>
                        </div>

                        {/* History */}
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
                        <div className="bg-gray-100 rounded-3xl p-2 h-full min-h-[500px] flex items-center justify-center relative overflow-hidden shadow-inner border-4 border-white">
                            <MapContainer
                                center={center}
                                zoom={districtFeatures ? 10 : 8}
                                scrollWheelZoom={false}
                                className="w-full h-full rounded-2xl z-0"
                                style={{ minHeight: "500px" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                />
                                {districtFeatures && (
                                    <GeoJSON
                                        data={districtFeatures}
                                        style={style}
                                        onEachFeature={onEachFeature}
                                    >
                                        <Tooltip sticky>
                                            {(layer) => (
                                                <div className="font-bold text-primary">
                                                    {layer.feature.properties.bn_name || layer.feature.properties.name}
                                                </div>
                                            )}
                                        </Tooltip>
                                    </GeoJSON>
                                )}
                            </MapContainer>
                            
                            {!districtFeatures && (
                                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="text-center p-6">
                                        <MapPin size={48} className="mx-auto text-gray-400 mb-2 animate-bounce" />
                                        <p className="text-gray-500 font-bold">Map data loading...</p>
                                    </div>
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
