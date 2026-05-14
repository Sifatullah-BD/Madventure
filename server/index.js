const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travel-tracer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const districtRoutes = require('./routes/districts');
const divisionRoutes = require('./routes/divisions');
const tourRoutes = require('./routes/tours');
const placeRoutes = require('./routes/places');

app.use('/api/districts', districtRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/places', placeRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Travel Tracer API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
