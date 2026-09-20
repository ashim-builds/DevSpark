require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const { initDBWithRetry } = require("./db");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://devsparkco.com",
  "https://www.devsparkco.com",
];

if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(",").map((u) => u.trim().replace(/\/$/, ""));
  urls.forEach((url) => {
    if (url && !allowedOrigins.includes(url)) {
      allowedOrigins.push(url);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.includes("rjflowers.com") ||
        origin.includes("devsparkco.com") ||
        origin.includes("localhost");

      if (isAllowed) {
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

// API Routes & Health
const apiRouter = express.Router();

apiRouter.get("/health", async (req, res) => {
  try {
    const { query } = require("./db");
    await query("SELECT 1 as ping");
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: err.message,
      code: err.code || "UNKNOWN",
      config: {
        host: process.env.DB_HOST ? `${process.env.DB_HOST.slice(0, 4)}***` : "not_set",
        database: process.env.DB_NAME || "not_set",
        user: process.env.DB_USER || "not_set",
        port: process.env.DB_PORT || 3306,
      },
    });
  }
});

apiRouter.get("/", (req, res) => {
  res.json({ status: "ok", message: "DevSpark Backend API is live", timestamp: new Date().toISOString() });
});

apiRouter.use("/auth", require("./routes/auth"));
apiRouter.use("/projects", require("./routes/projects"));
apiRouter.use("/services", require("./routes/services"));
apiRouter.use("/team", require("./routes/team"));
apiRouter.use("/testimonials", require("./routes/testimonials"));
apiRouter.use("/contact", require("./routes/contact"));
apiRouter.use("/dashboard", require("./routes/dashboard"));
apiRouter.use("/images", require("./routes/images"));
apiRouter.use("/settings", require("./routes/settings"));

// Mount on both /api and / so it works with any cPanel subpath or root mapping
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
