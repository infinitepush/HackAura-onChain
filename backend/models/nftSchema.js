const mongoose = require("mongoose");

//basic nft schema
const nftSchema = new mongoose.Schema({
    tags: {
        type: Array,
        default: []
    },
    name: String,
    picture: String,
});

module.exports = mongoose.model("nft", nftSchema);