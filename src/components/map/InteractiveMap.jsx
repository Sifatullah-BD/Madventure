import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not appearing in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 13, { duration: 1.5 });
        }
    }, [coords, map]);
    return null;
};

const InteractiveMap = ({ items, height = "400px", initialCenter = [23.8103, 90.4125] }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [boundary, setBoundary] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetch('/data/bd-geojson/bangladesh.geojson')
            .then(response => response.ok ? response.json() : null)
            .then(data => { if (mounted) setBoundary(data); })
            .catch(() => {});
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (err) => console.error("Geolocation denied", err)
            );
        }
    }, []);

    return (
        <div style={{ height }} className="rounded-2xl overflow-hidden border border-gray-200 z-0">
            <MapContainer center={initialCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Boundaries © geoBoundaries CC BY 4.0'
                />

                {boundary && (
                    <GeoJSON
                        data={boundary}
                        style={{ color: '#1B5E20', weight: 1, fillColor: '#43A047', fillOpacity: 0.06 }}
                    />
                )}
                
                {items && items.map((item) => {
                    // Extract coordinates (mocking if not present)
                    const lat = Number(item.latitude || item.lat || item.latitude_deg);
                    const lng = Number(item.longitude || item.lng || item.long || item.longitude_deg);
                    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
                    
                    return (
                        <Marker key={item.id} position={[lat, lng]}>
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <h4 className="font-bold text-gray-900 border-b pb-1 mb-2">{item.title || item.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2 truncate max-w-[150px]">{item.location}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary font-bold">৳{item._price || item.price}</span>
                                        <button className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg">View Details</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }).filter(Boolean)}

                {userLocation && (
                    <>
                        <Marker 
                            position={userLocation} 
                            icon={L.divIcon({
                                className: 'user-location-icon',
                                html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>'
                            })}
                        >
                            <Popup>You are here</Popup>
                        </Marker>
                        <Circle center={userLocation} radius={500} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
                    </>
                )}

                <RecenterMap coords={userLocation} />
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
