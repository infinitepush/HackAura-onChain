const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

// Placeholder for POST /api/analyze-tags
router.post('/analyze-tags', nftController.analyzeTags);

module.exports = router;
