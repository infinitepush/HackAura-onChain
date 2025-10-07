const mongoose = require("mongoose");

//basic user schema
const userSchema = new mongoose.Schema({
    fullname: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    cart: {
        type: Array,
        default: []
    },
    orders:  {
        type: Array,
        default: []
    },
    picture: String,
    contact: Number,
    nfts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "nft"
    }]
});

module.exports = mongoose.model("User", userSchema);