const express = require("express")
const router = express.Router();
const {register, login, logout, getProfile} = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.use(express.json());

router.get("/", (req, res) => {
  res.send("User route is working");
});

// Define user-related routes here
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isLoggedIn, getProfile);

module.exports = router;

// our task is to bcrypt the password before saving it to the database
// also save session cookies in frontend
// also create login route
// also create forgot password route