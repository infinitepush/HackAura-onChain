const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateToken =  (newUser) => {
    return jwt.sign({ email: newUser.email, id: newUser._id}, process.env.JWT_SECRET);
}
module.exports =  generateToken;

