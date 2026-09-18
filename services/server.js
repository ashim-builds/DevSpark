require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const { initDBWithRetry } = require("./db");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://devsparkhq.onrender.com"
];

if (process.env.FRONTEND_URL) {
  const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanFrontendUrl)) {
    allowedOrigins.push(cleanFrontendUrl);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Initialize MySQL Database
initDBWithRetry().catch((err) => {
  console.error("MySQL initialization error:", err.message);
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/services", require("./routes/services"));
app.use("/api/team", require("./routes/team"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/images", require("./routes/images"));
app.use("/api/settings", require("./routes/settings"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "mysql", timestamp: new Date().toISOString() });
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
