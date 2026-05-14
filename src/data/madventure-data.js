// MADVENTURE MASTER DATA FILE
// All data across the app should be pulled from this file.

export const AGENCIES = [
  {
    id: "agency-001",
    name: "Wanderlust Adventures",
    verified: true,
    rating: 4.8,
    logo: "https://ui-avatars.com/api/?name=Wanderlust+Adventures&background=0D8ABC&color=fff",
    phone: "+880 1711-000001",
    email: "contact@wanderlust.com"
  },
  {
    id: "agency-002",
    name: "Hill Tracts Explorers",
    verified: true,
    rating: 4.9,
    logo: "https://ui-avatars.com/api/?name=Hill+Tracts&background=1B5E20&color=fff",
    phone: "+880 1811-000002",
    email: "explore@hilltracts.com"
  },
  {
    id: "agency-003",
    name: "Beach Vibes Tours",
    verified: false,
    rating: 4.5,
    logo: "https://ui-avatars.com/api/?name=Beach+Vibes&background=FF5722&color=fff",
    phone: "+880 1911-000003",
    email: "hello@beachvibes.com"
  }
];

export const REVIEWS = [
  { id: "rev-01", targetId: "coxs-bazar-3days", userId: "user-1", userName: "আহমেদ ফয়সাল", rating: 5, date: "2026-03-15", comment: "অসাধারণ অভিজ্ঞতা ছিল। গাইড খুব হেল্পফুল।", images: [] },
  { id: "rev-02", targetId: "hotel-001", userId: "user-2", userName: "নাসিমা আক্তার", rating: 4, date: "2026-04-01", comment: "রিসোর্টটি সুন্দর তবে খাবারের দাম কিছুটা বেশি।", images: [] },
];

export const HOTELS = [
  {
    id: "hotel-001",
    name: "সি পার্ল বিচ রিসোর্ট",
    districtId: "cox-bazar",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-c65fae1132f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    stars: 5,
    pricePerNight: { min: 3500, max: 12000 },
    rating: 4.5,
    reviewCount: 89,
    amenities: ["WiFi", "Pool", "Restaurant", "AC", "Gym", "Breakfast Included"],
    location: "ইনানী বিচ রোড, কক্সবাজার",
    lat: 21.1887, lng: 92.0514,
    rooms: [
      { id: "rm-1", name: "সুপিরিয়র রুম", price: 3500, capacity: 2, bedType: "১ ডাবল বেড" },
      { id: "rm-2", name: "ওশান ভিউ সুইট", price: 12000, capacity: 3, bedType: "১ কিং বেড, ১ সিঙ্গেল বেড" }
    ],
    reviews: ["rev-02"],
    nearbyAttractions: ["ইনানী বিচ (১০০ মি)", "হিমছড়ি (৫ কিমি)"],
    checkIn: "02:00 PM", checkOut: "12:00 PM"
  },
  {
    id: "hotel-002",
    name: "সাজেকের মেঘমাচাং",
    districtId: "rangamati",
    images: [
      "https://images.unsplash.com/photo-1542314831-c65fae1132f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    stars: 3,
    pricePerNight: { min: 2500, max: 4000 },
    rating: 4.8,
    reviewCount: 156,
    amenities: ["View", "Balcony", "Restaurant"],
    location: "সাজেক ভ্যালি, রাঙ্গামাটি",
    lat: 23.3853, lng: 92.2934,
    rooms: [
      { id: "rm-3", name: "কটেজ", price: 3000, capacity: 2, bedType: "১ ডাবল বেড" }
    ],
    reviews: [],
    nearbyAttractions: ["রুন্ময় (১ কিমি)", "কংলাক পাহাড় (৩ কিমি)"],
    checkIn: "01:00 PM", checkOut: "11:00 PM"
  }
];

export const RESTAURANTS = [
  {
    id: "rest-001",
    name: "মেজবান রেস্তোরাঁ",
    districtId: "cox-bazar",
    isHalal: true,
    isVerified: true,
    cuisine: ["বাংলা", "সীফুড"],
    specialDish: "তাজা ইলিশ ভাজা",
    priceRange: "৳150-৳500",
    rating: 4.6,
    reviewCount: 234,
    address: "কলাতলী রোড, কক্সবাজার",
    phone: "+880 1711-000000",
    openTime: "সকাল ৭টা — রাত ১১টা",
    images: ["https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    tags: ["হালাল", "সীফুড", "পরিবার-বান্ধব"],
    lat: 21.4290, lng: 92.0100
  },
  {
    id: "rest-002",
    name: "সাজন রেস্তোরাঁ",
    districtId: "bandarban",
    isHalal: true,
    isVerified: false,
    cuisine: ["বাংলা", "পাহাড়ি"],
    specialDish: "ব্যাম্বু চিকেন",
    priceRange: "৳200-৳600",
    rating: 4.3,
    reviewCount: 89,
    address: "বান্দরবান বাজার",
    phone: "+880 1811-000000",
    openTime: "সকাল ৮টা — রাত ১০টা",
    images: ["https://images.unsplash.com/photo-1606728035253-49e8a23146de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    tags: ["হালাল", "পাহাড়ি খাবার"],
    lat: 22.1953, lng: 92.2184
  }
];

export const FARES = {
  "cox-bazar": {
    "স্থলপথ": [
      { from: "শহর", to: "লাবণী বিচ", vehicle: "রিকশা", minFare: 30, maxFare: 60, note: "দরদাম করুন" },
      { from: "কলাতলী", to: "ইনানী বিচ", vehicle: "সিএনজি / অটো", minFare: 150, maxFare: 200, note: "শেয়ার হলে کم (৩০-৫০৳)" },
      { from: "কক্সবাজার বাস স্টেশন", to: "মহেশখালী ঘাট (৬ নং ঘাট)", vehicle: "অটো", minFare: 40, maxFare: 60, note: "" },
    ],
    "নৌপথ": [
      { from: "৬ নং ঘাট", to: "মহেশখালী", vehicle: "স্পিডবোট", minFare: 80, maxFare: 100, duration: "১৫ মিনিট", note: "লাইফ জ্যাকেট অবশ্যই পরবেন" },
      { from: "৬ নং ঘাট", to: "মহেশখালী", vehicle: "লোকাল ট্রলার", minFare: 30, maxFare: 40, duration: "৩০-৪০ মিনিট", note: "ধীরে চলে" }
    ],
    "আকাশপথ": []
  },
  "bandarban": {
    "স্থলপথ": [
      { from: "শহর", to: "নীলাচল", vehicle: "চাঁন্দের গাড়ি / সিএনজি", minFare: 300, maxFare: 500, note: "রিজার্ভ ভাড়া, শেয়ারে কম" },
      { from: "শহর", to: "থানচি", vehicle: "বাস", minFare: 200, maxFare: 250, note: "লোকাল বাস, সময় লাগে" },
    ],
    "নৌপথ": [
      { from: "থানচি", to: "রেমাক্রি", vehicle: "ইঞ্জিন নৌকা", minFare: 1000, maxFare: 1200, duration: "২ ঘণ্টা", note: "রিজার্ভ ভাড়া" }
    ],
    "আকাশপথ": []
  }
};

export const HIDDEN_GEMS = [
  {
    id: "gem-001",
    name: "নীলাচল সূর্যোদয় পয়েন্ট",
    districtId: "bandarban",
    description: "বেশিরভাগ পর্যটক সূর্যাস্ত দেখতে নীলাচল যান, তবে ভোরের কুয়াশা ও সূর্যোদয় আরও মায়াবী রূপ ধারণ করে।",
    bestTime: "ভোর ৫:৩০ — ৬:৩০",
    howToGet: "নীলাচল মেইন পয়েন্ট থেকে ১৫ মিনিট ডানদিকের ট্রেইল ধরে হাঁটা",
    entryFee: "বিনামূল্যে (নীলাচল মেইন গেটের ফি প্রযোজ্য)",
    crowdLevel: "low", // low | medium | high
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    tips: ["ভোরে যান", "গাইড নিতে পারেন", "পানি সঙ্গে রাখুন"],
    addedBy: "Tarek Explorer",
    likes: 127,
    lat: 22.1953, lng: 92.2184
  },
  {
    id: "gem-002",
    name: "মহেশখালীর লুকানো সৈকত",
    districtId: "cox-bazar",
    description: "আদিনাথ মন্দিরের পিছনের দিকের পাহাড় দিয়ে নামলে এই নির্জন সৈকতটির দেখা মেলে।",
    bestTime: "বিকাল ৪:০০ — ৫:৩০",
    howToGet: "আদিনাথ মন্দির হয়ে লোকাল ট্রেইল ধরে ২০ মিনিটের হাঁটা পথ",
    entryFee: "বিনামূল্যে",
    crowdLevel: "low",
    images: ["https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    tips: ["জোয়ার-ভাটার সময় জেনে যাবেন", "সন্ধ্যার আগে ফিরে আসুন"],
    addedBy: "Mahin Cxb",
    likes: 85,
    lat: 21.5272, lng: 91.9058
  }
];

export const GUIDES = [
  {
    id: "guide-001",
    name: "তারেক রহমান",
    districtId: "bandarban",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    languages: ["বাংলা", "মারমা", "English"],
    rating: 4.9,
    pricePerDay: 1500,
    specialty: "ট্রেকিং, রেমাক্রি, নাফাখুম"
  }
];

export const EVENTS = [
  {
    id: "event-001",
    title: "কক্সবাজার বিচ ক্লিনিং ড্রাইভ",
    districtId: "cox-bazar",
    date: "2026-05-10T09:00:00",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "পরিবেশ রক্ষায় বিচ ক্লিনিং ইভেন্ট।",
    organizer: "Save The Ocean BD"
  }
];

export const TOURS = [
  {
    id: "coxs-bazar-3days",
    title: "কক্সবাজার ৩ দিন ২ রাত",
    districtId: "cox-bazar",
    agencyId: "agency-001",
    images: [
      "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 4500,
    originalPrice: 6000,
    duration: "৩ দিন ২ রাত",
    groupSize: { min: 2, max: 20 },
    difficulty: "easy",
    category: ["beach", "relax"],
    rating: 4.7,
    reviewCount: 128,
    bookedCount: 340,
    includes: ["নন এসি বাস", "হোটেল ২ রাত", "সকালের নাস্তা", "গাইড"],
    excludes: ["লাঞ্চ ও ডিনার", "ব্যক্তিগত খরচ"],
    itinerary: [
      { day: 1, title: "ঢাকা থেকে কক্সবাজার", activities: ["বাসে যাত্রা", "সকালে পৌঁছানো", "বিচে সময় কাটানো"] },
      { day: 2, title: "সমুদ্র সৈকত ভ্রমণ", activities: ["সকালে ইনানী ট্রিপ", "হিমছড়ি দেখা", "বিকালে সূর্যাস্ত"] },
      { day: 3, title: "শপিং ও ফেরা", activities: ["বার্মিজ মার্কেটে শপিং", "রাতের বাসে ঢাকা ফেরা"] }
    ],
    availableDates: ["2026-05-10", "2026-05-15", "2026-05-20"],
    reviews: ["rev-01"],
    relatedTours: ["saint-martin-3days"]
  },
  {
    id: "bandarban-nafakhum",
    title: "বান্দরবান: নাফাখুম ট্রেকিং",
    districtId: "bandarban",
    agencyId: "agency-002",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 6500,
    originalPrice: null,
    duration: "৪ দিন ৩ রাত",
    groupSize: { min: 4, max: 15 },
    difficulty: "hard",
    category: ["mountain", "adventure"],
    rating: 4.9,
    reviewCount: 56,
    bookedCount: 120,
    includes: ["পরিবহন", "বোট ভাড়া", "আদিবাসী কটেজ", "গাইড", "খাবার"],
    excludes: ["বাসের যাত্রা বিরতির খাবার"],
    itinerary: [
      { day: 1, title: "যাত্রা", activities: ["বান্দরবান পৌঁছানো", "থানচি যাওয়া"] },
      { day: 2, title: "ট্রেকিং শুরু", activities: ["সাঙ্গু নদী হয়ে রেমাক্রি", "নাফাখুমের উদ্দেশ্যে ট্রেকিং"] },
      { day: 3, title: "নাফাখুম ও আমিয়াখুম", activities: ["জলপ্রপাত দেখা"] },
      { day: 4, title: "ফেরা", activities: ["বান্দরবান ফেরা", "ঢাকার উদ্দেশ্যে যাত্রা"] }
    ],
    availableDates: ["2026-04-15", "2026-04-20"],
    reviews: [],
    relatedTours: []
  },
  {
    id: "sylhet-ratargul",
    title: "সিলেটের জল-জঙ্গল",
    districtId: "sylhet",
    agencyId: "agency-003",
    images: [
      "https://images.unsplash.com/photo-1596472620703-e2e4242c2629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600100598079-423568e6227c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    price: 3500,
    originalPrice: 4000,
    duration: "২ দিন ১ রাত",
    groupSize: { min: 4, max: 30 },
    difficulty: "medium",
    category: ["nature", "relax", "water"],
    rating: 4.6,
    reviewCount: 88,
    bookedCount: 210,
    includes: ["ট্রেন টিকেট", "নৌকা ভাড়া", "ഹোটেল", "গাইড"],
    excludes: ["প্রবেশ ফি", "ব্যক্তিগত খরচ"],
    itinerary: [
      { day: 1, title: "রাতারগুল ও বিছানাকান্দি", activities: ["সকালে পৌঁছানো", "সোয়াম্প ফরেস্ট এক্সপ্লোর", "বিছানাকান্দিতে গোসল"] },
      { day: 2, title: "জাফলং রূপ দর্শন", activities: ["পিয়াইন নদী", "সংগ্রামপুঞ্জি ঝর্ণা", "রাতে ফেরা"] }
    ],
    availableDates: ["2026-04-18", "2026-04-25"],
    reviews: [],
    relatedTours: []
  }
];

export const EMERGENCY = {
  "cox-bazar": {
    hospitals: [
      { name: "কক্সবাজার সদর হাসপাতাল", phone: "0341-63333", address: "হাসপাতাল রোড, কক্সবাজার", lat: 21.4484, lng: 92.0286 },
      { name: "ফুয়াদ আল খতিব হাসপাতাল", phone: "0341-64542", address: "হাসপাতাল রোড, কক্সবাজার", lat: 21.4468, lng: 92.0279 }
    ],
    police: { phone: "0341-63100", emergencyPhone: "999" },
    fireService: { phone: "0341-63101", emergencyPhone: "199" },
    coastGuard: { phone: "0341-63334" }
  },
  "bandarban": {
    hospitals: [
      { name: "বান্দরবান সদর হাসপাতাল", phone: "0361-62233", address: "হাসপাতাল রোড, বান্দরবান", lat: 22.1963, lng: 92.2190 }
    ],
    police: { phone: "0361-62283", emergencyPhone: "999" },
    fireService: { phone: "0361-62211", emergencyPhone: "199" }
  },
  "sylhet": {
    hospitals: [
      { name: "সিলেট এম.এ.জি. ওসমানী মেডিকেল", phone: "0821-713667", address: "কাজলশাহ, সিলেট", lat: 24.8997, lng: 91.8606 }
    ],
    police: { phone: "0821-716968", emergencyPhone: "999" },
    fireService: { phone: "0821-716211", emergencyPhone: "199" }
  }
};


export const DISTRICTS = [
  {
    id: "cox-bazar",
    name: "কক্সবাজার",
    nameEn: "Cox's Bazar",
    division: "চট্টগ্রাম",
    description: "বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত, নীল জলরাশি আর পাহাড়ের এক অপূর্ব মেলবন্ধন কক্সবাজার পর্যটকদের কাছে সবচেয়ে জনপ্রিয় গন্তব্য।",
    heroImage: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587222318638-f2039184d3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    lat: 21.4272, lng: 92.0058,
    bestTime: "অক্টোবর — মার্চ",
    weather: "গ্রীষ্মমণ্ডলীয়, বর্তমান তাপমাত্রা ২৮°C",
    language: "চট্টগ্রামী ও বাংলা",
    highlights: ["সুগন্ধা বিচ", "ইনানী বিচ", "হিমছড়ি", "মহেশখালী"],
    thingsToDo: ["সার্ফিং", "প্যারাসেইলিং", "সৈকতে সাইক্লিং", "সীফুড টেস্ট"],
    localFood: ["লইট্টা ফ্রাই", "রূপচাঁদা", "শুটকি ভর্তা"],
    howToGet: {
      bus: { cost: 1000, details: "ঢাকা থেকে ১২-১৪ ঘণ্টা (এসি ১৫০০-২৫০০৳)" },
      train: { cost: 800, details: "ঢাকা থেকে চট্টগ্রাম হয়ে ট্রেন (নতুন রুটে কক্সবাজার এক্সপ্রেস)" },
      plane: { cost: 4500, details: "ঢাকা থেকে ১ ঘণ্টার ফ্লাইট" }
    },
    safetyTips: ["সাঁতার না জানলে গভীর পানিতে যাবেন না", "লাল পতাকা উড়লে পানিতে নামা নিষেধ"],
    emergencyNumbers: EMERGENCY["cox-bazar"],
    tours: ["coxs-bazar-3days"],
    hotels: ["hotel-001"],
    restaurants: ["res-001"],
    guides: [],
    events: ["event-001"]
  },
  {
    id: "bandarban",
    name: "বান্দরবান",
    nameEn: "Bandarban",
    division: "চট্টগ্রাম",
    description: "মেঘ আর পাহাড়ের লুকোচুরি, বাংলার দার্জিলিং খ্যাত বান্দরবান ট্রেকার এবং অ্যাডভেঞ্চার প্রেমীদের স্বর্গরাজ্য।",
    heroImage: "https://images.unsplash.com/photo-1615803986705-4c07c2ff888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    lat: 22.1953, lng: 92.2184,
    bestTime: "অক্টোবর — ফেব্রুয়ারি (শীতকাল) ও জুলাই — অগাস্ট (ঝর্ণা দেখতে বর্ষায়)",
    weather: "২২°C - ৩০°C",
    language: "বাংলা, মারমা, বম, মুরং",
    highlights: ["নীলগিরি", "নীলাচল", "বগা লেক", "নাফাখুম", "সাজেক"],
    thingsToDo: ["ট্রেকিং", "ক্যাম্পিং", "সাঙ্গু নদীতে নৌভ্রমণ"],
    localFood: ["ব্যাম্বু চিকেন", "মুন্ডি", "পাহাড়ি ফলমূল"],
    howToGet: {
      bus: { cost: 900, details: "ঢাকা থেকে সরাসরি বাস (এসি ১৫০০৳)" }
    },
    safetyTips: ["দুর্গম এলাকায় গাইড নিতে হবে", "বৃষ্টিতে পাহাড়ি রাস্তা পিচ্ছিল থাকে"],
    emergencyNumbers: EMERGENCY["bandarban"],
    tours: ["bandarban-nafakhum"],
    hotels: [],
    restaurants: [],
    guides: ["guide-001"],
    events: []
  },
  {
    id: "sylhet",
    name: "সিলেট",
    nameEn: "Sylhet",
    division: "সিলেট",
    description: "দুটি পাতা একটি কুঁড়ির দেশ সিলেট। চা বাগান, ঝর্ণা, আর সোয়াম্প ফরেস্টের এক অনন্য সৌন্দর্যের স্থান।",
    heroImage: "https://images.unsplash.com/photo-1600100598079-423568e6227c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596472620703-e2e4242c2629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    lat: 24.8949, lng: 91.8687,
    bestTime: "জুন — নভেম্বর (বর্ষায় ঝর্ণা ও সবুজের সমারোহ দেখতে)",
    weather: "২৫°C - ২৭°C",
    language: "সিলেটি, বাংলা",
    highlights: ["রাতারগুল", "জাফলং", "বিছানাকান্দি", "চা বাগান", "শাহজালাল মাজার"],
    thingsToDo: ["চা বাগানে হাঁটা", "সোয়াম্প ফরেস্টে নৌকা ভ্রমণ", "ঝর্ণায় গোসল"],
    localFood: ["সাতকড়া গরুর মাংস", "সাত রঙের চা"],
    howToGet: {
      bus: { cost: 600, details: "৬-৭ ঘণ্টা ফকিরাপুল বা সায়দাবাদ থেকে" },
      train: { cost: 350, details: "পারাবত, উপবন, জয়ন্তিকা এক্সেপ্রেস" },
      plane: { cost: 3800, details: "৪০ মিনিটের ফ্লাইট" }
    },
    safetyTips: ["বর্ষায় পাহাড়ি ছড়ায় নামার সময় সাবধান", "রাতারগুলে ছাতা ও পানি নিয়ে যাবেন"],
    emergencyNumbers: EMERGENCY["sylhet"],
    tours: ["sylhet-ratargul"],
    hotels: [],
    restaurants: [],
    guides: [],
    events: []
  },
  {
    id: "sundarbans",
    name: "সুন্দরবন (খুলনা)",
    nameEn: "Sundarbans",
    division: "খুলনা",
    description: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন, যা রয়েল বেঙ্গল টাইগারের আবাসস্থল।",
    heroImage: "https://images.unsplash.com/photo-1616893699665-2432ec2af8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    gallery: [],
    lat: 21.9497, lng: 89.1833,
    bestTime: "নভেম্বর — ফেব্রুয়ারি",
    weather: "২৩°C - ৩০°C",
    language: "বাংলা",
    highlights: ["কটকা", "কচিখালী", "হিরণ পয়েন্ট", "করমজল"],
    thingsToDo: ["বোট সাফারি", "বার্ড ওয়াচিং", "ক্যানোপি ওয়াক"],
    localFood: ["সুন্দরবনের মধু", "চুইঝাল মাংস"],
    howToGet: {
      bus: { cost: 800, details: "ঢাকা থেকে খুলনা, সেখান থেকে মোংলা" },
      train: { cost: 600, details: "ঢাকা থেকে খুলনা (সুন্দরবন এক্সপ্রেস)" }
    },
    safetyTips: ["বনরক্ষী বা গাইড ছাড়া জঙ্গলে নামবেন না"],
    emergencyNumbers: {},
    tours: [],
    hotels: [],
    restaurants: [],
    guides: [],
    events: []
  }
];

// Helper functions for easy cross-referencing
export const getDistrictById = (id) => DISTRICTS.find(d => d.id === id);
export const getToursByDistrict = (districtId) => TOURS.filter(t => t.districtId === districtId);
export const getHotelsByDistrict = (districtId) => HOTELS.filter(h => h.districtId === districtId);
export const getRestaurantsByDistrict = (districtId) => RESTAURANTS.filter(r => r.districtId === districtId);
export const getGuidesByDistrict = (districtId) => GUIDES.filter(g => g.districtId === districtId);
export const getEventsByDistrict = (districtId) => EVENTS.filter(e => e.districtId === districtId);
export const getReviewsForTarget = (targetId) => REVIEWS.filter(r => r.targetId === targetId);
export const getAgencyById = (agencyId) => AGENCIES.find(a => a.id === agencyId);

export const FORUM_THREADS = [
  {
    id: "thread-001",
    title: "কক্সবাজারে December-এ গেলে কী কী নিয়ে যাব?",
    category: "tips",
    districtId: "cox-bazar",
    author: { name: "রাহেলা বেগম", avatar: "RB", joinedDate: "2024-03" },
    content: "এই ডিসেম্বরে পরিবার নিয়ে যাওয়ার পরিকল্পনা করছি। বাচ্চাদের জন্য শীতের কী কী জামাকাপড় নিতে হবে? আর কোন কোন লোকেশনগুলো ছোট বাচ্চাদের জন্য বেশি সেইফ?",
    tags: ["কক্সবাজার", "শীতকাল", "পরিবার"],
    likes: 47, views: 312, replyCount: 18,
    isPinned: false, isSolved: true,
    createdAt: "2025-11-15",
    replies: [
      { id: "r1", author: "করিম সাহেব", avatar: "KS", content: "অবশ্যই হালকা শীতের কাপড় এবং বাচ্চাদের জন্য কিছু ভারী কাপড় নিবেন। দিনের বেলা গরম লাগলেও রাতে বেশ বাতাস থাকে। লাবনী পয়েন্টের চেয়ে ইনানী বা সুগন্ধা পয়েন্ট একটু বেশি নিরিবিলি এবং বাচ্চাদের জন্য ভালো।", likes: 12, createdAt: "2025-11-16", isVerified: true }
    ]
  },
  {
    id: "thread-002",
    title: "সাজেকে বর্তমান পর্যটক পরিস্থিতি কেমন?",
    category: "question",
    districtId: "bandarban",
    author: { name: "আহমেদ জুবায়ের", avatar: "AJ", joinedDate: "2025-01" },
    content: "সামনের সপ্তাহে সাজেক যাওয়ার প্ল্যান আছে। রিসোর্ট বুকিং এবং সিকিউরিটি পরিস্থিতি কেমন এখন?",
    tags: ["সাজেক", "নিরাপত্তা", "রিসোর্ট"],
    likes: 24, views: 501, replyCount: 5,
    isPinned: true, isSolved: false,
    createdAt: "2025-12-05",
    replies: []
  }
];

export const TRAVEL_PARTNERS = [
  {
    id: "partner-001",
    name: "সাইফুল ইসলাম",
    age: 26, gender: "male",
    location: "ঢাকা, মিরপুর",
    destination: "cox-bazar",
    travelDate: "2025-12-20",
    duration: "৩ দিন",
    groupSize: 2,
    budget: "মধ্যম (৳5000-৳8000)",
    interests: ["beach", "photography", "local food"],
    about: "ফটোগ্রাফি পছন্দ করি, শান্তিপ্রিয় মানুষ। ছবি তুলতে ভালো ব্যাকপ্যাকিং ট্রিপ দিতে চাই। খরচ শেয়ার করে ট্যুর দেওয়ার জন্য ২ জন সঙ্গী খুঁজছি।",
    contact: "WhatsApp only",
    verified: false,
    postedAt: "2025-12-01"
  },
  {
    id: "partner-002",
    name: "নাদিয়া সুলতানা",
    age: 24, gender: "female",
    location: "সিলেট",
    destination: "sylhet",
    travelDate: "2025-12-25",
    duration: "২ দিন",
    groupSize: 3,
    budget: "বাজেট (৳3000-৳5000)",
    interests: ["nature", "group travel"],
    about: "সিলেটের আশেপাশে ঘোরার প্ল্যান। শুধুমাত্র ফিমেল ট্রাভেলার খুঁজছি।",
    contact: "Phone",
    verified: true,
    postedAt: "2025-12-05"
  }
];



export const MECHANICS = [
  {
    id: "mech-001", districtId: "cox-bazar",
    name: "আল-আমিন মোটরস",
    type: "mechanic",
    speciality: ["CNG", "মাইক্রোবাস", "মোটরসাইকেল"],
    phone: "01711000001", whatsapp: "+8801711000001",
    address: "কলাতলী রোড, কক্সবাজার",
    openHours: "সকাল ৮টা — রাত ৯টা",
    isOpen24h: false, rating: 4.2,
    lat: 21.4280, lng: 92.0080
  },
  {
    id: "pharm-001", districtId: "cox-bazar",
    name: "মেডিনোভা ফার্মেসি",
    type: "pharmacy",
    speciality: ["ফার্মেসি", "24/7"],
    phone: "01811000002", whatsapp: "+8801811000002",
    address: "হাসপাতাল রোড মোড়",
    openHours: "২৪ ঘণ্টা",
    isOpen24h: true, rating: 4.8,
    lat: 21.4484, lng: 92.0286
  }
];
