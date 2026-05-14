const express = require('express');
const router = express.Router();
const District = require('../models/District');

// GET all districts
router.get('/', async (req, res) => {
    try {
        const districts = await District.find();
        res.json(districts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET district by ID
router.get('/:id', async (req, res) => {
    try {
        const district = await District.findOne({ id: req.params.id });
        if (!district) return res.status(404).json({ message: 'District not found' });
        res.json(district);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
