require("dotenv").config();

const express = require("express");
const cors = require("cors");

const notificationRoutes = require(
  "./routes/notificationRoutes"
);

const {
  connectRabbitMQ,
} = require("./messaging/rabbitmq");

const {
  startEventConsumer,
} = require("./messaging/eventConsumer");

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  "/notifications",
  notificationRoutes
);

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "notification-service",
    status: "healthy",
  });
});

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    await connectRabbitMQ();

    await startEventConsumer();

    app.listen(PORT, () => {
      console.log(
        `Notification Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Notification Service:",
      error
    );

    process.exit(1);
  }
};

startServer();

module.exports = app;
