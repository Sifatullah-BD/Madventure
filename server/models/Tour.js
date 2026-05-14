const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    itinerary: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
});

module.exports = mongoose.model('Tour', tourSchema);
