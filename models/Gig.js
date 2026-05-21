const mongoose = require("mongoose");

const GigSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },
  deliveryDays:{ type: Number, default: 3 },
  tags:        [String],
  images:      [String],
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating:      { type: Number, default: 0 },
  reviews:     { type: Number, default: 0 },
  orders:      { type: Number, default: 0 },
  web3Enabled: { type: Boolean, default: false },
  tokenPayment:[String],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gig", GigSchema);
