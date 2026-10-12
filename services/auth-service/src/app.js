require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const pool = require("./config/database");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      service: "auth-service",
      status: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error.message);

    res.status(500).json({
      service: "auth-service",
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});