require("dotenv").config();

const express = require("express");
const riskAssessmentRoutes = require("./routes/riskAssessmentRoutes");
const cors = require("cors");

const { connectRabbitMQ } = require("./messaging/rabbitmq");
const {
  startEventConsumer,
} = require("./messaging/eventConsumer");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/risk-assessments", riskAssessmentRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "risk-assessment-service",
    status: "healthy",
  });
});

const PORT = process.env.PORT || 3004;

const startServer = async () => {
  try {
    await connectRabbitMQ();

    await startEventConsumer();

    app.listen(PORT, () => {
      console.log(
        `Risk Assessment Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Risk Assessment Service:",
      error
    );

    process.exit(1);
  }
};

startServer();