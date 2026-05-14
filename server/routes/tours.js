const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');

// GET all tours
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.json(tours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET tour by ID
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findOne({ id: req.params.id });
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.json(tour);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
