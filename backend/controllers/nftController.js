const Nft = require('../models/nftSchema');
const User = require('../models/userModel');
const axios = require('axios');

exports.createNft = async (req, res) => {
  try {
    const { name, tags, picture } = req.body;
    const userId = req.user.id; // from isLoggedIn middleware

    if (!name || !picture) {
      return res.status(400).json({ success: false, message: 'Name and picture are required' });
    }

    // Create new NFT
    const newNft = new Nft({
      name,
      tags: tags || [],
      picture,
    });

    const savedNft = await newNft.save();

    // Add NFT to user's collection
    await User.findByIdAndUpdate(userId, { $push: { nfts: savedNft._id } });

    res.status(201).json({ success: true, nft: savedNft });
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMyNfts = async (req, res) => {
  try {
    const userId = req.user.id; // from isLoggedIn middleware
    const user = await User.findById(userId).populate('nfts');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, nfts: user.nfts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.analyzeTags = async (req, res) => {
  try {
    const { base_tags, max_new_tags } = req.body;

    if (!base_tags || base_tags.length === 0) {
      return res.status(400).json({ success: false, message: 'base_tags array is required and cannot be empty' });
    }

    const externalApiResponse = await axios.post('https://mk-analysis-1.onrender.com/analyze', {
      base_tag: base_tags[0], // Send the first tag as a single string
      max_new_tags,
    });

    res.status(200).json(externalApiResponse.data);
  } catch (error) {
    if (error.response) {
      console.error('Error from external API:', JSON.stringify(error.response.data, null, 2));
      return res.status(error.response.status).json(error.response.data);
    }
    console.error('Error calling external analysis API:', error.message);
    res.status(500).json({ success: false, message: 'Error calling external analysis API' });
  }
};

