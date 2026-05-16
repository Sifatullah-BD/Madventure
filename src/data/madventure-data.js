// MADVENTURE MASTER DATA FILE - PRODUCTION READY
// All data across the app is centralized here for consistency and SEO.

export const AGENCIES = [
  {
    id: "agency-001",
    name: "Wanderlust Adventures BD",
    verified: true,
    rating: 4.9,
    logo: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=100&q=80",
    phone: "+880 1711-020304",
    email: "hello@wanderlustbd.com",
    address: "Banani, Dhaka"
  },
  {
    id: "agency-002",
    name: "Hill-Tract Explorers",
    verified: true,
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=100&q=80",
    phone: "+880 1811-998877",
    email: "tours@hilltracts.com",
    address: "Bandarban Town"
  }
];

export const HOTELS = [
  {
    id: "hotel-001",
    name: "Sea Pearl Beach Resort & Spa",
    districtId: "cox-bazar",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    stars: 5,
    pricePerNight: { min: 8500, max: 25000 },
    rating: 4.6,
    reviewCount: 1240,
    amenities: ["WiFi", "Infinity Pool", "Private Beach", "AC", "Luxury Spa", "Ocean View"],
    location: "Inani Beach, Cox's Bazar",
    lat: 21.1887, lng: 92.0514,
    checkIn: "02:00 PM", checkOut: "11:00 AM"
  },
  {
    id: "hotel-002",
    name: "Meghmachang Sajek",
    districtId: "rangamati",
    images: [
      "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=1200&q=80"
    ],
    stars: 4,
    pricePerNight: { min: 4500, max: 6500 },
    rating: 4.9,
    reviewCount: 450,
    amenities: ["Cloud View", "Wooden Cottage", "Authentic Food"],
    location: "Sajek Valley, Rangamati",
    lat: 23.3853, lng: 92.2934
  }
];

export const DISTRICTS = [
  {
    id: "cox-bazar",
    name: "কক্সবাজার",
    nameEn: "Cox's Bazar",
    division: "Chittagong",
    description: "Experience the world's longest natural sea beach. From the vibrant Laboni point to the serene Inani beach, Cox's Bazar is the ultimate destination for sun, sand, and surf in Bangladesh.",
    heroImage: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Laboni Beach", "Inani Beach", "Himchori Falls", "Maheshkhali Island"],
    thingsToDo: ["Surfing", "Parasailing", "Night Market Shopping", "Jet Skiing"],
    localFood: ["Loitta Fry", "Rupchanda BBQ", "Shutki Bhorta"],
    bestTime: "Nov - March",
    lat: 21.4272, lng: 92.0058
  },
  {
    id: "bandarban",
    name: "বান্দরবান",
    nameEn: "Bandarban",
    division: "Chittagong",
    description: "The roof of Bangladesh. Home to the highest peaks, crystal clear falls like Nafakhum, and the ethereal beauty of Nilgiri where you can touch the clouds.",
    heroImage: "https://images.unsplash.com/photo-1615803986705-4c07c2ff888b?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Nilgiri", "Nilachal", "Boga Lake", "Nafakhum Falls"],
    thingsToDo: ["Trekking", "Camping", "Sangu River Cruise"],
    localFood: ["Bamboo Chicken", "Mundi", "Hill Fruits"],
    bestTime: "Oct - Feb",
    lat: 22.1953, lng: 92.2184
  },
  {
    id: "sylhet",
    name: "সিলেট",
    nameEn: "Sylhet",
    division: "Sylhet",
    description: "The land of two leaves and a bud. Famous for lush tea gardens, the magical Ratargul swamp forest, and the crystal stone beds of Bisnakandi.",
    heroImage: "https://images.unsplash.com/photo-1600100598079-423568e6227c?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596472620703-e2e4242c2629?auto=format&fit=crop&w=800&q=80"
    ],
    highlights: ["Ratargul Forest", "Jaflong", "Bisnakandi", "Tea Gardens"],
    thingsToDo: ["Tea Tasting", "Boat Riding", "Waterfall Chasing"],
    localFood: ["Shatkora Beef", "7-Layer Tea"],
    bestTime: "June - Oct",
    lat: 24.8949, lng: 91.8687
  },
  {
    id: "sajek",
    name: "সাজেক ভ্যালি",
    nameEn: "Sajek Valley",
    division: "Chittagong",
    description: "Known as the Queen of Hills, Sajek is a remote paradise where the road leads you above the clouds. Perfect for stargazing and sunrise views.",
    heroImage: "https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&w=1600&q=80",
    gallery: [],
    highlights: ["Konglak Hill", "Helipad Sunrise", "Stone Garden"],
    thingsToDo: ["Cloud Watching", "Star Gazing", "Tribal Food Experience"],
    localFood: ["Papaya Salad", "Stone Chicken"],
    bestTime: "All year round",
    lat: 23.3853, lng: 92.2934
  }
];

export const TOURS = [
  {
    id: "coxs-bazar-premium",
    title: "Cox's Bazar: Luxury Escape",
    districtId: "cox-bazar",
    agencyId: "agency-001",
    images: ["https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80"],
    price: 12500,
    duration: "3 Days, 2 Nights",
    category: ["Luxury", "Beach"],
    rating: 4.9,
    includes: ["5-Star Hotel", "Air Tickets", "Private Guide", "Seafood Dinner"],
    availableDates: ["2026-06-15", "2026-06-25"]
  },
  {
    id: "nafakhum-adventure",
    title: "Remakri & Nafakhum Trek",
    districtId: "bandarban",
    agencyId: "agency-002",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"],
    price: 6800,
    duration: "4 Days, 3 Nights",
    category: ["Adventure", "Trekking"],
    rating: 4.8,
    includes: ["Native Cottage", "Boat Rides", "Forest Guide", "Traditional Food"],
    availableDates: ["2026-07-05", "2026-07-15"]
  }
];

export const TRAVEL_PARTNERS = [
  {
    id: "p-1",
    name: "Ariful Islam",
    age: 27, gender: "male",
    destination_id: "cox-bazar",
    travel_date: "2026-06-20",
    budget_range: "৳5000-৳8000",
    description: "Looking for a fun group to join for a weekend in Cox's Bazar. Photography and seafood are my priorities!",
    profiles: { full_name: "Ariful Islam", gender: "male", rating: 4.9, level: 7, isExpert: true, phone: "+8801711223344" }
  },
  {
    id: "p-2",
    name: "Sumiya Akter",
    age: 24, gender: "female",
    destination_id: "sajek",
    travel_date: "2026-06-25",
    budget_range: "৳4000-৳6000",
    description: "Female only trip to Sajek. Already 2 of us, need 2 more to share a cottage and car costs.",
    profiles: { full_name: "Sumiya Akter", gender: "female", rating: 4.7, level: 4, isExpert: false, phone: "+8801811556677" }
  }
];

export const FORUM_THREADS = [
  {
    id: "f-1",
    title: "Current road conditions for Bandarban?",
    category: "question",
    districtId: "bandarban",
    author: "Tanvir Ahmed",
    content: "Planning to drive my own SUV to Nilgiri. Are the roads safe after the recent rains?",
    likes: 45, replyCount: 12, createdAt: "2h ago", authorLevel: 8,
    avatar: "https://i.pravatar.cc/150?u=tanvir"
  },
  {
    id: "f-2",
    title: "Hidden Gem: Guliakhali Beach",
    category: "tips",
    districtId: "chittagong",
    author: "Nabila Khan",
    content: "If you want to see green grass meeting the sea, Guliakhali is the place. Take a local boat from Sitakunda.",
    likes: 120, replyCount: 24, createdAt: "5h ago", authorLevel: 10,
    avatar: "https://i.pravatar.cc/150?u=nabila"
  }
];

// Helper functions for easy cross-referencing
export const getDistrictById = (id) => DISTRICTS.find(d => d.id === id);
export const getToursByDistrict = (districtId) => TOURS.filter(t => t.districtId === districtId);
export const getHotelsByDistrict = (districtId) => HOTELS.filter(h => h.districtId === districtId);
export const getRestaurantsByDistrict = (districtId) => RESTAURANTS?.filter(r => r.districtId === districtId) || [];
export const getGuidesByDistrict = (districtId) => GUIDES?.filter(g => g.districtId === districtId) || [];
export const getEventsByDistrict = (districtId) => EVENTS?.filter(e => e.districtId === districtId) || [];
export const getReviewsForTarget = (targetId) => REVIEWS?.filter(r => r.targetId === targetId) || [];
export const getAgencyById = (agencyId) => AGENCIES.find(a => a.id === agencyId);
