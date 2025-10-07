const Auction = require("../models/auctionSchema");

exports.createAuction = async (req, res) => {
  try {
    const { nftId, startingPrice, endTime } = req.body;
    const userId = req.user.id;

    if (!nftId || !startingPrice || !endTime) {
      return res.status(400).json({ success: false, message: "nftId, startingPrice, and endTime are required" });
    }

    const newAuction = new Auction({
      nft: nftId,
      seller: userId,
      startingPrice,
      currentPrice: startingPrice,
      endTime,
    });

    const savedAuction = await newAuction.save();

    res.status(201).json({ success: true, auction: savedAuction });
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate("nft").populate("seller");
    res.status(200).json({ success: true, auctions });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};