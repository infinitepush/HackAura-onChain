const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/connectDB");

const port = process.env.BACKEND_PORT || 3000;

app.use(cookieParser());

// Configure CORS to allow requests from any origin
app.use(cors({ credentials: true, origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importing routes
const userRouter = require("./routes/userRouter");
const nftRouter = require("./routes/nftRouter");
const uploadRouter = require("./routes/uploadRouter");
const apiRouter = require("./routes/apiRouter");

// main route for health check
app.get("/", (req, res) => {
  res.send("server is running....");
});

app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/api/nfts", nftRouter);
app.use("/", uploadRouter); // Mount at root to get /upload-image

connectDB();
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
