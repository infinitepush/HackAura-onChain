const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /upload-image - Handle the image upload
// The `upload.single('file')` middleware parses the multipart/form-data
// and attaches the file to req.file
router.post('/upload-image', upload.single('file'), uploadImage);

module.exports = router;
