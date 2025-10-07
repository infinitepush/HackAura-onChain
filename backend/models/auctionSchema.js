const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nft",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      },
      amount: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("auction", auctionSchema);