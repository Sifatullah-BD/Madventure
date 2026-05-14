export const popularLocations = [
    "Dhaka", "Chittagong", "Cox's Bazar", "Sylhet", "Khulna", "Rajshahi", "Barisal", "Rangpur"
];

export const operators = [
    {
        id: "GL-101",
        name: "Green Line",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Green_Line_Paribahan_Logo.jpg/640px-Green_Line_Paribahan_Logo.jpg", // Placeholder
        type: "bus",
        rating: 4.8,
        reviews: 1205
    },
    {
        id: "SR-202",
        name: "Shohagh Paribahan",
        logo: "https://seeklogo.com/images/S/shohagh-paribahan-logo-1C1F6F6F5C-seeklogo.com.png", // Placeholder
        type: "bus",
        rating: 4.6,
        reviews: 890
    },
    {
        id: "ENA-303",
        name: "Ena Transport",
        logo: "https://seeklogo.com/images/E/ena-transport-logo-E0C6C6C6C6-seeklogo.com.png", // Placeholder
        type: "bus",
        rating: 4.5,
        reviews: 1500
    },
    {
        id: "US-404",
        name: "US-Bangla Airlines",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/US-Bangla_Airlines_Logo.svg/1200px-US-Bangla_Airlines_Logo.svg.png",
        type: "air",
        rating: 4.9,
        reviews: 2300
    },
    {
        id: "MV-505",
        name: "MV Sundarban-10",
        logo: "https://i.ytimg.com/vi/qX1X1X1X1X1/maxresdefault.jpg", // Placeholder
        type: "launch",
        rating: 4.7,
        reviews: 500
    }
];

export const searchResults = [
    {
        id: "TRIP-001",
        operatorId: "GL-101",
        from: "Dhaka",
        to: "Cox's Bazar",
        departureTime: "10:00 PM",
        arrivalTime: "06:00 AM",
        duration: "8h",
        price: 1500,
        class: "AC Business",
        seatsAvailable: 12,
        type: "bus"
    },
    {
        id: "TRIP-002",
        operatorId: "SR-202",
        from: "Dhaka",
        to: "Cox's Bazar",
        departureTime: "11:30 PM",
        arrivalTime: "07:30 AM",
        duration: "8h",
        price: 1200,
        class: "AC Economy",
        seatsAvailable: 20,
        type: "bus"
    },
    {
        id: "TRIP-003",
        operatorId: "US-404",
        from: "Dhaka",
        to: "Cox's Bazar",
        departureTime: "09:00 AM",
        arrivalTime: "10:00 AM",
        duration: "1h",
        price: 4500,
        class: "Economy",
        seatsAvailable: 50,
        type: "air"
    },
    {
        id: "TRIP-004",
        operatorId: "MV-505",
        from: "Dhaka",
        to: "Barisal",
        departureTime: "08:00 PM",
        arrivalTime: "05:00 AM",
        duration: "9h",
        price: 1800,
        class: "VIP Cabin",
        seatsAvailable: 5,
        type: "launch"
    }
];

export const seatLayouts = {
    "bus-2x2": {
        rows: 10,
        cols: 4,
        aisleAfter: 2,
        seats: [
            { id: "A1", status: "booked", price: 1500, type: "window" },
            { id: "A2", status: "available", price: 1500, type: "aisle" },
            { id: "A3", status: "women_only", price: 1500, type: "aisle" },
            { id: "A4", status: "selected", price: 1500, type: "window" },
            { id: "B1", status: "available", price: 1500, type: "window" },
            { id: "B2", status: "available", price: 1500, type: "aisle" },
            { id: "B3", status: "booked", price: 1500, type: "aisle" },
            { id: "B4", status: "booked", price: 1500, type: "window" },
            // ... more seats generated programmatically or hardcoded
        ]
    }
};

// Helper to generate a full bus layout
export const generateBusLayout = (rows = 10, price = 1200) => {
    const layout = [];
    const rowsLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    rowsLabel.forEach(row => {
        for (let i = 1; i <= 4; i++) {
            let status = "available";
            if (Math.random() < 0.3) status = "booked";
            else if (Math.random() < 0.1) status = "women_only";

            layout.push({
                id: `${row}${i}`,
                status: status,
                price: price,
                type: (i === 1 || i === 4) ? "window" : "aisle"
            });
        }
    });
    return layout;
};
