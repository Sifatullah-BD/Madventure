const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

// Load Models
const Division = require('./models/Division');
const District = require('./models/District');
const Tour = require('./models/Tour');
const Place = require('./models/Place');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel-tracer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Read JSON files
const divisions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'divisions.json'), 'utf-8'));
const districts = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'districts.json'), 'utf-8'));
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf-8'));
const places = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'places.json'), 'utf-8'));

// Import Data
const importData = async () => {
    try {
        // Clear existing data
        await Division.deleteMany();
        await District.deleteMany();
        await Tour.deleteMany();
        await Place.deleteMany();

        console.log('Data Destroyed...');

        // Insert new data
        await Division.insertMany(divisions);
        await District.insertMany(districts);
        await Tour.insertMany(tours);
        await Place.insertMany(places);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Destroy Data (Optional utility)
const destroyData = async () => {
    try {
        await Division.deleteMany();
        await District.deleteMany();
        await Tour.deleteMany();
        await Place.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
