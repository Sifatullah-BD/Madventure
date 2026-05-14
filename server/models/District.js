const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    division_id: { type: String, required: true },
    name: { type: String, required: true },
    bn_name: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
});

module.exports = mongoose.model('District', districtSchema);
