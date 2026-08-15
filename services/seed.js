require("dotenv").config({ path: __dirname + "/.env" });
const dns = require("dns");

// Fix for Windows: Node.js sometimes uses loopback (127.0.0.1) as the DNS resolver,
// causing querySrv ECONNREFUSED on MongoDB Atlas connection strings.
if (
  dns.getServers().includes("127.0.0.1") ||
  dns.getServers().includes("::1")
) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/devspark";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing admin data
    await Admin.deleteMany({});
    console.log("Cleared existing admin data");

    // Admin user - pass plain password, model will hash it
    const admin = await Admin.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@devspark.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
    });
    console.log("Created admin user:", admin.email);

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
