export const places = [
    // Cox's Bazar District
    {
        id: 1,
        name: "Cox's Bazar",
        location: "Cox's Bazar",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The world's longest natural sea beach, offering golden sands and amazing sunsets.",
        details: "Cox's Bazar is the tourist capital of Bangladesh. Key spots include Laboni Beach, Sugandha Beach, and Inani Beach.",
        fareChart: [
            { vehicle: "Rickshaw (Short Distance)", rate: "30-50 BDT" },
            { vehicle: "CNG (Town Trip)", rate: "150-200 BDT" },
            { vehicle: "Tomtom (Shared)", rate: "10-20 BDT" },
            { vehicle: "Marine Drive CNG", rate: "800-1200 BDT" }
        ],
        hiddenSpots: ["Mermaid Beach Resort", "Radiant Fish World", "Moheshkhali Island", "100 Feet Buddha", "Darianagar Caves", "Kana Rajar Guha"],
        foodHotels: ["Poushee Restaurant", "Jhaubon Restaurant", "Salt Bistro", "Mermaid Café"]
    },
    {
        id: 2,
        name: "Saint Martin's Island",
        location: "Bay of Bengal",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The only coral island in Bangladesh, known for its crystal clear blue water and coconut groves.",
        details: "A small island in the northeastern part of the Bay of Bengal. Famous for Chera Dwip and coral reefs.",
        fareChart: [
            { vehicle: "Van (Island Tour)", rate: "200-300 BDT" },
            { vehicle: "Bicycle Rental", rate: "40-50 BDT/hour" }
        ],
        hiddenSpots: ["Chera Dwip", "West Beach", "Humayun Ahmed's House"],
        foodHotels: ["Blue Marine Restaurant", "Narikel Jinjira Restaurant", "Local Sea Fish BBQ Stalls"]
    },
    {
        id: 17,
        name: "Marine Drive Road",
        location: "Cox's Bazar",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1628062049232-23d243e33d49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The world's longest marine drive, offering breathtaking views of the sea and hills.",
        details: "A scenic road stretching from Cox's Bazar to Teknaf, flanked by the Bay of Bengal on one side and hills on the other.",
        fareChart: [
            { vehicle: "CNG (Reserve)", rate: "1000-1500 BDT" },
            { vehicle: "Chander Gari", rate: "2000-3000 BDT" }
        ],
        hiddenSpots: ["Himchari Waterfall", "Inani Beach", "Teknaf Sea Beach"],
        foodHotels: ["Coral Reef", "Sea Pearl Beach Resort Dining"]
    },
    {
        id: 18,
        name: "Dulahazara Safari Park",
        location: "Chakaria, Cox's Bazar",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A major attraction for wildlife lovers, featuring free-roaming animals.",
        details: "Home to elephants, lions, tigers, bears, and hippos. A great place for family visits.",
        fareChart: [
            { vehicle: "Entry Fee", rate: "50 BDT" },
            { vehicle: "Safari Bus", rate: "100 BDT" }
        ],
        hiddenSpots: ["Orchid Garden", "Natural History Museum"],
        foodHotels: ["Park Cafeteria", "Local Highway Restaurants"]
    },

    // Chittagong District
    {
        id: 13,
        name: "Chittagong City",
        location: "Chittagong",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1565689791095-202901c18092?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The port city offering a mix of beaches, lakes, and hills.",
        details: "Key spots include Patenga Sea Beach, Foy's Lake, and the Ethnological Museum.",
        fareChart: [
            { vehicle: "Rickshaw", rate: "40-60 BDT" },
            { vehicle: "CNG", rate: "150-250 BDT" },
            { vehicle: "Bus (City)", rate: "10-30 BDT" }
        ],
        hiddenSpots: ["Bhatiary Lake", "War Cemetery", "Naval Beach", "Guliakhali Sea Beach", "Khoiyachara Waterfall"],
        foodHotels: ["Mezzan Haile Ayun", "Barcode Cafe", "Handi Restaurant"]
    },
    {
        id: 19,
        name: "Sitakunda",
        location: "Chittagong",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1605628962804-4b4765720306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A hub for trekking and nature lovers, featuring hills, waterfalls, and eco-parks.",
        details: "Famous for Chandranath Hill, Sitakunda Eco Park, and numerous waterfalls like Khoiyachara and Napittachora.",
        fareChart: [
            { vehicle: "CNG (Local)", rate: "100-200 BDT" },
            { vehicle: "Trekking Guide", rate: "300-500 BDT" }
        ],
        hiddenSpots: ["Mohamaya Lake", "Suptadhara Waterfall", "Banshkhali Eco Park"],
        foodHotels: ["Local Highway Dhabas", "Eco Park Canteen"]
    },

    // Rangamati District
    {
        id: 4,
        name: "Sajek Valley",
        location: "Rangamati",
        region: "Chittagong Hill Tracts",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The Queen of Hills, famous for cloud-covered mountains and serene atmosphere.",
        details: "Located in Baghaichhari Upazila. Famous for Ruilui Para, Konglak Para, and sunrise views.",
        fareChart: [
            { vehicle: "Chander Gari (Reserve)", rate: "8000-10000 BDT" },
            { vehicle: "Bike Ride", rate: "300-500 BDT" }
        ],
        hiddenSpots: ["Hajachora Waterfall", "Risang Waterfall (Nearby)", "Alutila Cave (Nearby)"],
        foodHotels: ["Runmoy Resort", "Megh Machang", "Chimbal Restaurant"]
    },
    {
        id: 10,
        name: "Kaptai Lake",
        location: "Rangamati",
        region: "Chittagong Hill Tracts",
        image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The largest man-made lake in Bangladesh, offering scenic boat rides.",
        details: "Visit the Hanging Bridge, Shuvolong Waterfall, and Polwel Park. Enjoy kayaking and boat dining.",
        fareChart: [
            { vehicle: "Boat (Reserve)", rate: "1500-2500 BDT" },
            { vehicle: "CNG (Town)", rate: "100-150 BDT" }
        ],
        hiddenSpots: ["Rajban Bihar", "Chakma Rajbari", "Peda Ting Ting", "Tuk Tuk Eco Village"],
        foodHotels: ["Peda Ting Ting", "Lake View Restaurant", "Polwel Park Cafe"]
    },

    // Bandarban District
    {
        id: 9,
        name: "Bandarban",
        location: "Bandarban",
        region: "Chittagong Hill Tracts",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Home to the highest peaks, waterfalls, and rich tribal culture.",
        details: "Attractions include Nilgiri, Nilachal, Boga Lake, Keokradong, and Nafakhum Waterfall.",
        fareChart: [
            { vehicle: "Chander Gari (Nilgiri)", rate: "2500-3000 BDT" },
            { vehicle: "CNG (Local)", rate: "150-200 BDT" }
        ],
        hiddenSpots: ["Sangu River", "Buddha Dhatu Jadi", "Shoilo Propat", "Rijuk Waterfall", "Amiakum Waterfall", "Debotakhum"],
        foodHotels: ["Feast Restaurant", "Ruposhi Bangla", "Hillside Resort Dining"]
    },

    // Sylhet Division
    {
        id: 6,
        name: "Jaflong",
        location: "Sylhet",
        region: "Sylhet Division",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Famous for its stone collections and views of the Khasia-Jaintia hills.",
        details: "Located at the border. Visit the Piyain River, tea gardens, and nearby waterfalls.",
        fareChart: [
            { vehicle: "Boat (River)", rate: "500-800 BDT" },
            { vehicle: "Bus from Sylhet", rate: "80-100 BDT" }
        ],
        hiddenSpots: ["Lalakhal", "Bholaganj Sada Pathor", "Tamabil", "Pantumai Waterfall"],
        foodHotels: ["Border View Restaurant", "Sengram Punji Cafe"]
    },
    {
        id: 5,
        name: "Ratargul Swamp Forest",
        location: "Sylhet",
        region: "Sylhet Division",
        image: "https://images.unsplash.com/photo-1440342359726-c408163b7228?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The only freshwater swamp forest in Bangladesh.",
        details: "Best visited during monsoon. Navigate through submerged trees on a small boat.",
        fareChart: [
            { vehicle: "Boat (Small)", rate: "700-1000 BDT" },
            { vehicle: "CNG from Sylhet", rate: "500-700 BDT" }
        ],
        hiddenSpots: ["Bisnakandi", "Khadimnagar National Park", "Dibir Haor"],
        foodHotels: ["Panshi Restaurant", "Five Brothers", "Local Snacks"]
    },
    {
        id: 7,
        name: "Srimangal",
        location: "Moulvibazar",
        region: "Sylhet Division",
        image: "https://images.unsplash.com/photo-1598556776374-2c358606f287?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The tea capital of Bangladesh, famous for endless tea gardens.",
        details: "Visit Lawachara National Park, Madhabkunda Waterfall, and Seven Layer Tea Cabin.",
        fareChart: [
            { vehicle: "CNG (Day Tour)", rate: "1200-1500 BDT" },
            { vehicle: "Rickshaw (Local)", rate: "30-50 BDT" }
        ],
        hiddenSpots: ["Hum Hum Waterfall", "Madhobpur Lake", "Baikka Beel", "Hakaluki Haor"],
        foodHotels: ["Panch Bhai Restaurant", "Kutumbari", "Grand Sultan Dining"]
    },

    // Khulna & Bagerhat
    {
        id: 3,
        name: "Sundarbans",
        location: "Khulna",
        region: "Khulna Division",
        image: "https://images.unsplash.com/photo-1544228906-8d591e528b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The largest mangrove forest in the world, home to the Royal Bengal Tiger.",
        details: "UNESCO World Heritage site. Visit Karamjal, Hiran Point, Kotka Beach, and Dublar Char.",
        fareChart: [
            { vehicle: "Boat (Day Tour)", rate: "3000-5000 BDT" },
            { vehicle: "Ship (3 Days)", rate: "10000-15000 BDT" }
        ],
        hiddenSpots: ["Shat Gombuj Mosque (Bagerhat)", "Khan Jahan Ali Mazar", "Mongla Port", "Putney Dwip"],
        foodHotels: ["Ship Catering", "Mongla Port Hotels", "Local Fish Markets"]
    },

    // Patuakhali District
    {
        id: 8,
        name: "Kuakata",
        location: "Patuakhali",
        region: "Barisal Division",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "The 'Daughter of the Sea', offering both sunrise and sunset views.",
        details: "Famous for its calm beach, Gangamati Reserved Forest, and Buddhist temples.",
        fareChart: [
            { vehicle: "Van (Beach Tour)", rate: "300-400 BDT" },
            { vehicle: "Motorbike", rate: "200-300 BDT" }
        ],
        hiddenSpots: ["Lal Kakra Char", "Fatrar Char", "Misripara Buddhist Temple", "Sonar Char"],
        foodHotels: ["Kuakata Grand", "Hotel Graver Inn", "Local Sea Fish Fry"]
    },

    // Noakhali District
    {
        id: 12,
        name: "Nijhum Dwip",
        location: "Noakhali",
        region: "Chittagong Division",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e596e35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A cluster of islands famous for spotted deer and migratory birds.",
        details: "Located in Hatiya. A sanctuary for nature lovers. Visit Namar Bazar Beach and Mangrove Forest.",
        fareChart: [
            { vehicle: "Motorbike", rate: "100-200 BDT" },
            { vehicle: "Boat (Crossing)", rate: "50-100 BDT" }
        ],
        hiddenSpots: ["Bajra Shahi Mosque", "Gandhi Ashram", "Musapur Closure", "Dream World Park"],
        foodHotels: ["Local Homestays", "Island Kitchen", "Fresh Fish Market"]
    }
];
