const mongoose = require("mongoose");

//basic nft schema
const nftSchema = new mongoose.Schema({
    tags: {
        type: Array,
        default: []
    },
    name: String,
    picture: String,
    txHash: String,
    tokenId: String,
    evolutionHistory: {
        type: [{
            picture: String,
            tags: Array,
            evolvedAt: { type: Date, default: Date.now }
        }],
        default: []
    }
});

module.exports = mongoose.model("nft", nftSchema);