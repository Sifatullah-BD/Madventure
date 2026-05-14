const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// GET all places
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET place by ID
router.get('/:id', async (req, res) => {
    try {
        const place = await Place.findOne({ id: req.params.id });
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json(place);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
