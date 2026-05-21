const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    // Ba ya tsaya — yana ci gaba
  }
};

module.exports = connectDB;
