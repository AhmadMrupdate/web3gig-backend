const router = require("express").Router();
const Order = require("../models/Order");
const Gig = require("../models/Gig");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { gigId, requirements, paymentMethod } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + gig.deliveryDays);
    const order = await Order.create({ gigId, clientId: req.user.id, freelancerId: gig.userId, price: gig.price, deliveryDays: gig.deliveryDays, dueDate, requirements, paymentMethod: paymentMethod || "fiat" });
    await Gig.findByIdAndUpdate(gigId, { $inc: { orders: 1 } });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ clientId: req.user.id }, { freelancerId: req.user.id }] })
      .populate("gigId", "title price").populate("clientId", "name avatar").populate("freelancerId", "name avatar");
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
