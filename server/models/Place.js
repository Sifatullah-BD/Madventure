const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    rating: { type: Number },
    type: { type: String }, // e.g., "Historical", "Nature"
});

module.exports = mongoose.model('Place', placeSchema);
