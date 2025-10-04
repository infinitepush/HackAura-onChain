const pinataSDK = require('@pinata/sdk');
const streamifier = require('streamifier');
const axios = require('axios');

module.exports.uploadImage = async (req, res) => {
  console.log('[UPLOAD] Received request to /upload-image');

  if (!req.file) {
    console.error('[UPLOAD] No file was uploaded.');
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  console.log('[UPLOAD] Initializing Pinata SDK.');
  const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

  try {
    console.log('[UPLOAD] Creating file stream for image.');
    const fileStream = streamifier.createReadStream(req.file.buffer);
    
    console.log('[UPLOAD] Uploading image to Pinata.');
    const imageResult = await pinata.pinFileToIPFS(fileStream, {
      pinataMetadata: {
        name: req.file.originalname,
      },
    });
    console.log('[UPLOAD] Image uploaded to Pinata:', imageResult.IpfsHash);

    const metadata = {
      name: req.body.name || 'Untitled NFT',
      description: req.body.description || 'No description provided',
      image: `ipfs://${imageResult.IpfsHash}`,
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : [],
    };

    console.log('[UPLOAD] Uploading metadata to Pinata.');
    const metadataResult = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `${req.body.name || 'Untitled NFT'} Metadata`,
      },
    });
    console.log('[UPLOAD] Metadata uploaded to Pinata:', metadataResult.IpfsHash);

    try {
      const mintPayload = {
        to: '0x5c55d91583CC15709Ee086Db68524f8721FF0c2b',
        metadataUri: `ipfs://${metadataResult.IpfsHash}`,
      };
      console.log('[MINT] Calling minting service with payload:', JSON.stringify(mintPayload, null, 2));
      const mintResponse = await axios.post('https://evo-nft-web3.onrender.com/mint', mintPayload);
      console.log('[MINT] SUCCESS: Minting service responded with:', mintResponse.data);
    } catch (mintError) {
      console.error('[MINT] ERROR: Error calling minting service:', mintError.message);
      if (mintError.response) {
        console.error('[MINT] ERROR response:', mintError.response.data);
      }
      // We will not fail the request if minting fails, just log the error.
    }

    let analysisResult = null;
    console.log('[DEBUG] Starting market analysis step.');

    if (req.body.tags) {
      console.log('[DEBUG] Tags received from request body:', req.body.tags);
      console.log('[DEBUG] Type of tags:', typeof req.body.tags);

      let baseTags;
      if (typeof req.body.tags === 'string') {
        console.log('[DEBUG] Tags are a string. Attempting to parse.');
        try {
          baseTags = JSON.parse(req.body.tags);
          console.log('[DEBUG] Successfully parsed tags from JSON string:', baseTags);
        } catch (e) {
          console.log('[DEBUG] Failed to parse tags as JSON. Splitting by comma.');
          baseTags = req.body.tags.split(',').map(tag => tag.trim());
          console.log('[DEBUG] Parsed tags from comma-separated string:', baseTags);
        }
      } else {
        console.log('[DEBUG] Tags are not a string. Using as is.');
        baseTags = req.body.tags;
      }

      console.log('[DEBUG] Final baseTags to be used for analysis:', baseTags);
      console.log('[DEBUG] Checking if baseTags is an array:', Array.isArray(baseTags));

      if (Array.isArray(baseTags)) {
        console.log('[DEBUG] baseTags is an array. Proceeding to call analysis API.');
        try {
          const analysisPayload = {
            base_tags: baseTags,
            max_new_tags: 3,
          };
          console.log('[DEBUG] Calling analysis API with payload:', JSON.stringify(analysisPayload, null, 2));
          
          const analysisResponse = await axios.post('https://mk-analysis-1.onrender.com/analyze', analysisPayload);
          
          console.log('[DEBUG] SUCCESS: Analysis API responded with status:', analysisResponse.status);
          console.log('[DEBUG] SUCCESS: Analysis API Response Data:', analysisResponse.data);
          analysisResult = { success: true, data: analysisResponse.data };
        } catch (analysisError) {
          console.error('[DEBUG] ERROR: An error occurred while calling the analysis API.');
          if (axios.isAxiosError(analysisError)) {
            console.error('[DEBUG] Axios error details:', {
              message: analysisError.message,
              code: analysisError.code,
              status: analysisError.response?.status,
              data: analysisError.response?.data,
            });
          } else {
            console.error('[DEBUG] Non-Axios error details:', analysisError);
          }
          analysisResult = { success: false, message: analysisError.message, error: analysisError };
        }
      } else {
        const errorMsg = 'Could not parse tags into a processable array.';
        console.error('[DEBUG] ERROR:', errorMsg);
        analysisResult = { success: false, message: errorMsg };
      }
    } else {
      console.log('[DEBUG] No tags were provided in the request body. Skipping analysis.');
      analysisResult = { success: false, message: 'No tags provided.' };
    }
    console.log('[DEBUG] Final analysis result:', analysisResult);

    const mockResponse = {
      success: true,
      imageCid: imageResult.IpfsHash,
      metadataCid: metadataResult.IpfsHash,
      metadataUri: `ipfs://${metadataResult.IpfsHash}`,
      metadata: metadata,
      analysis: analysisResult,
    };

    console.log('[UPLOAD] Sending final response to client.');
    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('[UPLOAD] ERROR: An error occurred during the upload process:', error);
    res.status(500).json({ success: false, message: 'Error uploading to Pinata.' });
  }
};
