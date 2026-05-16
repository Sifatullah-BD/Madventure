import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const APP_CONTEXT = `
You are Madventure AI, a helpful travel assistant for the "Madventure" travel platform in Bangladesh. 
Madventure offers:
1. Tour Packages: Sajek, Sundarban, Saint Martin, Sylhet, etc.
2. Smart Planner: AI-powered travel planning.
3. Adventure Hub: Trekking, Camping, and Waterfall exploration.
4. Gear Shop: Rent or buy travel gear.
5. Community: A forum for travelers to share stories and find partners.
6. Safety: Emergency map and SOS features.

You should answer questions in either English or Bengali (depending on the user's language). 
Keep responses concise, professional, and helpful. 
If asked about prices, provide general ranges or tell them to check the specific tour details.
`;

export const getAIResponse = async (userMessage) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([APP_CONTEXT, userMessage]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Assistant Error:", error);
        return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later! (আমি দুঃখিত, আমার সিস্টেমে কিছু সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।)";
    }
};
