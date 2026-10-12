const userRoutes = require("./routes/userRoutes");
const express = require("express");
const preferencesRoutes = require("./routes/preferencesRoutes");
const allergyRoutes = require("./routes/allergyRoutes");
const { connectRabbitMQ } = require("./config/rabbitmq");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/users", userRoutes);
app.use("/users", allergyRoutes);
app.use("/users", preferencesRoutes);


app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      service: "user-service",
      status: "healthy",
      database: "connected"
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      service: "user-service",
      status: "unhealthy",
      database: "disconnected"
    });
  }
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start User Service:", error.message);
    process.exit(1);
  }
};

startServer();