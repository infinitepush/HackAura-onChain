const express = require('express');
const router = express.Router();
const { createAuction, getAuctions, getMyAuctions, placeBid } = require('../controllers/auctionController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// All routes in this file are protected
router.use(isLoggedIn);

// POST /api/auctions/create - Create a new auction
router.post('/create', createAuction);

// GET /api/auctions - Get all auctions
router.get('/', getAuctions);

// GET /api/auctions/my-auctions - Get user's auctions
router.get('/my-auctions', getMyAuctions);

// POST /api/auctions/bid - Place a bid on an auction
router.post('/bid', placeBid);

module.exports = router;