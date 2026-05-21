const router = require("express").Router();
const Gig = require("../models/Gig");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    let sortOpt = { createdAt: -1 };
    if (sort === "price_asc") sortOpt = { price: 1 };
    if (sort === "price_desc") sortOpt = { price: -1 };
    if (sort === "rating") sortOpt = { rating: -1 };
    const gigs = await Gig.find(query).sort(sortOpt).populate("userId", "name avatar rating");
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId", "name avatar bio rating reviews");
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const gig = await Gig.create({ ...req.body, userId: req.user.id });
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    if (gig.userId.toString() !== req.user.id) return res.status(403).json({ error: "Not authorized" });
    const updated = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ error: "Gig not found" });
    if (gig.userId.toString() !== req.user.id) return res.status(403).json({ error: "Not authorized" });
    await gig.deleteOne();
    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
