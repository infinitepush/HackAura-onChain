const nftModel = require("../models/nftSchema");
const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
  try {
    let { name, username, email, password } = req.body;
    //hasing our password using bcrypt
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        } else {
          const user = await userModel.findOne({ email });
          // console.log(user);
          if (user) {
            return res.status(400).json({ error: "User already exists" });
          }
          let newUser = await userModel.create({
            fullname: name,
            username,
            email,
            password: hash,
          });

          // res.status(201).json({
          //   success: true,
          //   message: "User registered successfully",
          //   newUser,
          // });

          // setting up jwt token
          let token = generateToken(newUser);
          // adding cookie in the browser
          res.cookie("token", token);
          res.status(200).json({ user: { id: newUser._id, name: newUser.fullname, username: newUser.username, email: newUser.email }, token });
        }
      });
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

module.exports.login = async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "invalid credentials" });
  }
  // comparing the password
  bcrypt.compare(password, user.password, function (err, result) {
    if(result){
        let token = generateToken(user);
        res.cookie("token", token);
        res.status(200).json({ user: { id: user._id, name: user.fullname, username: user.username, email: user.email }, token });
    }
    else{
      res.status(400).json({ error: "invalid credentials" });
    }
  });
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports.getProfile = async (req, res) => {
  try {
    // req.user is attached by isLoggedIn middleware
    const user = await userModel.findById(req.user.id).select('-password').populate('nfts');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New endpoint to get user profile
module.exports.addNftToProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, image, tags } = req.body;

    const newNft = await nftModel.create({
      name,
      picture: image,
      tags,
    });

    const user = await userModel.findById(req.user._id);
    user.nfts.push(newNft._id);
    await user.save();

    res.status(201).json({ success: true, message: "NFT added to profile successfully", nft: newNft });
  } catch (error) {
    console.error("Error adding NFT to profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};