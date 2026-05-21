const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["client", "freelancer"], default: "client" },
  avatar:   { type: String, default: "" },
  bio:      { type: String, default: "" },
  wallet:   { type: String, default: "" },
  rating:   { type: Number, default: 0 },
  reviews:  { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
