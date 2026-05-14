import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Thermometer, Wind, MapPin } from 'lucide-react';

const WeatherWidget = ({ location = 'Dhaka' }) => {
    const [weather, setWeather] = useState({
        temp: 28,
        condition: 'Sunny',
        humidity: 65,
        wind: 12
    });

    // Simulated Real-time update for demo purposes
    useEffect(() => {
        const fetchWeather = () => {
            // In production, use: fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_KEY`)
            const conditions = ['Sunny', 'Cloudy', 'Rainy'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            setWeather({
                temp: Math.floor(Math.random() * (34 - 22) + 22),
                condition: randomCondition,
                humidity: Math.floor(Math.random() * (90 - 40) + 40),
                wind: Math.floor(Math.random() * 20)
            });
        };

        fetchWeather();
    }, [location]);

    const getIcon = () => {
        switch (weather.condition) {
            case 'Sunny': return <Sun className="text-yellow-400" size={32} />;
            case 'Rainy': return <CloudRain className="text-blue-400" size={32} />;
            default: return <Cloud className="text-gray-400" size={32} />;
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white shadow-xl">
            <div className="bg-white/10 p-3 rounded-xl">
                {getIcon()}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">{weather.temp}°C</span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">{weather.condition}</span>
                </div>
                <p className="text-[10px] font-medium opacity-60 flex items-center gap-2">
                    <MapPin size={10} /> {location} | <Wind size={10} /> {weather.wind} km/h
                </p>
            </div>
        </div>
    );
};

export default WeatherWidget;
