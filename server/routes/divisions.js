const express = require('express');
const router = express.Router();
const Division = require('../models/Division');

// GET all divisions
router.get('/', async (req, res) => {
    try {
        const divisions = await Division.find();
        res.json(divisions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
