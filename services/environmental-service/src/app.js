require("dotenv").config();
const environmentalRoutes = require("./routes/environmentalRoutes");
const express = require("express");
const pool = require("./config/database");
const { connectRabbitMQ } = require("./messaging/rabbitmq");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/environmental-data", environmentalRoutes);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      service: "environmental-service",
      status: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error.message);

    res.status(500).json({
      service: "environmental-service",
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(
        `Environmental Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Environmental Service:",
      error.message
    );

    process.exit(1);
  }
};

startServer();