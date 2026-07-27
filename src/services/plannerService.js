import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const generateItinerary = async (destination, days, budget, interests) => {
    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            console.warn("Gemini API key is missing. Using mock data.");
            return generateMockItinerary(destination, days);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        You are an expert travel planner for Bangladesh. 
        Create a detailed ${days}-day itinerary for a trip to ${destination}.
        Budget category: ${budget}. 
        Interests: ${interests.join(', ')}.
        
        Respond ONLY with a valid JSON array of days. Do not include markdown formatting like \`\`\`json or \`\`\`.
        Each day must follow this EXACT structure:
        [
            {
                "day": 1,
                "title": "Short title for the day",
                "activities": [
                    { "time": "Morning (09:00 AM)", "title": "Activity name", "description": "Short description" },
                    { "time": "Afternoon (01:00 PM)", "title": "Activity name", "description": "Short description" }
                ]
            }
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown block syntax if Gemini accidentally includes it
        if (text.startsWith('```json')) text = text.replace('```json', '');
        if (text.startsWith('```')) text = text.replace('```', '');
        if (text.endsWith('```')) text = text.replace(/```$/, '');
        
        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Gemini API Error:", error);
        return generateMockItinerary(destination, days);
    }
};

const generateMockItinerary = (destination, days) => {
    return Array.from({ length: days }).map((_, i) => ({
        day: i + 1,
        title: `Explore ${destination} Day ${i + 1}`,
        activities: [
            { time: '09:00 AM', title: 'Start Journey', description: 'Begin your day with local breakfast.' },
            { time: '02:00 PM', title: 'Sightseeing', description: 'Visit popular local spots.' },
            { time: '06:00 PM', title: 'Sunset Views', description: 'Enjoy the beautiful sunset.' }
        ]
    }));
};

export const saveItinerary = async (itineraryData) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .insert([itineraryData])
            .select()
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const getUserItineraries = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const getItineraryBySlug = async (slug) => {
    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .eq('share_slug', slug)
            .single();
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};
