const express = require('express');
const router = express.Router();
const { createAuction, getAuctions } = require('../controllers/auctionController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// All routes in this file are protected
router.use(isLoggedIn);

// POST /api/auctions/create - Create a new auction
router.post('/create', createAuction);

// GET /api/auctions - Get all auctions
router.get('/', getAuctions);

module.exports = router;