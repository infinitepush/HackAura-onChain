const express = require('express');
const router = express.Router();
const { createNft, getMyNfts, evolveNft } = require('../controllers/nftController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// All routes in this file are protected
router.use(isLoggedIn);

// POST /api/nfts/create - Create a new NFT
router.post('/create', createNft);

// GET /api/nfts/my-nfts - Get user's NFTs
router.get('/my-nfts', getMyNfts);

// POST /api/nfts/evolve - Evolve an NFT
router.post('/evolve', evolveNft);

module.exports = router;
