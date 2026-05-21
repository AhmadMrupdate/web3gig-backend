const router = require("express").Router();
const User = require("../models/User");
const Gig = require("../models/Gig");
const auth = require("../middleware/auth");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -email");
    if (!user) return res.status(404).json({ error: "User not found" });
    const gigs = await Gig.find({ userId: req.params.id });
    res.json({ user, gigs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/me", auth, async (req, res) => {
  try {
    const allowed = ["name", "bio", "avatar", "wallet"];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
