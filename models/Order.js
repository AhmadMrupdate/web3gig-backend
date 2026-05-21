const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  gigId:        { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
  clientId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price:        { type: Number, required: true },
  status:       { type: String, enum: ["pending","active","delivered","completed","cancelled","disputed"], default: "pending" },
  paymentMethod:{ type: String, enum: ["fiat","crypto"], default: "fiat" },
  txHash:       { type: String, default: "" },
  requirements: { type: String, default: "" },
  deliveryDays: { type: Number },
  dueDate:      { type: Date },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
