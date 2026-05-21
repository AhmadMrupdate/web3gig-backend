const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: "*" }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, validate: { xForwardedForHeader: false } });
app.use("/api/", limiter);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/gigs", require("./routes/gigs"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => res.json({ status: "Web3Gig API running", version: "2.0.0" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
