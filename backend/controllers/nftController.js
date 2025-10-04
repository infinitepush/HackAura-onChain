// Add the form-data library
const { URLSearchParams } = require('url');
const Nft = require('../models/nftSchema');
const User = require('../models/userModel');
const axios = require('axios');
const FormData = require('form-data'); // 🚨 NEW IMPORT

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

exports.evolveImagePrompt = async (req, res) => {
  try {
    const { nftId, name, base_tags, max_new_tags, image } = req.body;

    if (!nftId || !name || !base_tags || base_tags.length === 0 || !image) {
      return res.status(400).json({ success: false, message: 'nftId, name, base_tags, and image are required.' });
    }

    // 1. Generate the prompt
    const analysisResponse = await axios.post('https://mk-analysis-1.onrender.com/analyze', {
      base_tag: base_tags[0],
      max_new_tags,
    });
    const { base_tag, generated_tags } = analysisResponse.data;
    const tagsString = generated_tags.join(', ');
    const generatedPrompt = `Visually stunning masterpiece titled '${name}'. A ${base_tag} creation embodying styles of ${tagsString}. High detail, captivating aesthetic, digital evolution. It should be an evolved, mature version of the character with an aura of mystic power and strength, retaining some of the original features but showing a more powerful, aged, and wise appearance, with a slight weathered charm.`;

    // 2. Fetch the image from the URL and convert to a Buffer
    const imageUrl = image.replace('ipfs.io', 'gateway.pinata.cloud');
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    // Convert ArrayBuffer to Node.js Buffer
    const imageBuffer = Buffer.from(imageResponse.data); 

    // 3. Call the image-to-image generation API using FormData (multipart/form-data)
    // 🚨 Use FormData to send the image as an uploaded file
    const formData = new FormData();
    formData.append('prompt', generatedPrompt);
    // Append the Buffer as a file, which the API expects for 'init_image'
    formData.append('init_image', imageBuffer, {
        filename: 'image.jpg', // Provide a filename
        contentType: 'image/jpeg', // Provide a content type (adjust if the source image type is known)
    });
    formData.append('strength', '0.35');

        const imageGenResponse = await axios.post(
            'https://image-gen-zaqj.onrender.com/img2img',
            formData,
            {
                headers: formData.getHeaders(),
                responseType: 'arraybuffer' // Expect a binary response
            }
        );
    
        // The response is the image data itself. Convert it to base64.
        const imageData = Buffer.from(imageGenResponse.data, 'binary').toString('base64');
    
        if (imageData) {
          // Send the image data to the frontend for display
          res.status(200).json({ success: true, imageData: imageData });
        } else {
          throw new Error("Image generation failed: No image data in response.");
        }  } catch (error) {
    console.error('Error in evolveImagePrompt:', error);
    if (error.response) {
      console.error('Axios Error Data:', error.response.data);
      res.status(error.response.status).json({ success: false, message: 'Error from external API', details: error.response.data });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error', details: error.message });
    }
  }
};