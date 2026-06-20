require("dotenv").config({ path: __dirname + "/.env" });
const dns = require("dns");

// Fix for Windows: Node.js sometimes uses loopback (127.0.0.1) as the DNS resolver,
// causing querySrv ECONNREFUSED on MongoDB Atlas connection strings.
if (dns.getServers().includes("127.0.0.1") || dns.getServers().includes("::1")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/devspark";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/services", require("./routes/services"));
app.use("/api/team", require("./routes/team"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
