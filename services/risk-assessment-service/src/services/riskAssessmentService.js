const axios = require("axios");

const riskAssessmentRepository = require(
  "../repositories/riskAssessmentRepository"
);

const { calculateRisk } = require(
  "../utils/riskCalculator"
);

const { getChannel, EXCHANGE_NAME } = require(
  "../messaging/rabbitmq"
);

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL ||
  "http://localhost:3001";

const ENVIRONMENTAL_SERVICE_URL =
  process.env.ENVIRONMENTAL_SERVICE_URL ||
  "http://localhost:3003";

const createRiskAssessment = async ({
  userId,
  latitude,
  longitude,
}) => {
  let allergyResponse;

try {
  allergyResponse = await axios.get(
    `${USER_SERVICE_URL}/users/${userId}/allergies`
  );

 
} catch (error) {
  console.error(
    "ALLERGY REQUEST FAILED:",
    error.response?.status,
    error.response?.data || error.message
  );

  throw error;
}

  let environmentalResponse;

try {
  environmentalResponse = await axios.get(
    `${ENVIRONMENTAL_SERVICE_URL}/environmental-data/external`,
    {
      params: {
        latitude,
        longitude,
      },
    }
  );

  console.log(
    "ENVIRONMENTAL RESPONSE STATUS:",
    environmentalResponse.status
  );

  console.log(
    "ENVIRONMENTAL RESPONSE DATA:",
    environmentalResponse.data
  );
} catch (error) {
  console.error(
    "ENVIRONMENTAL REQUEST FAILED:",
    error.response?.status,
    error.response?.data || error.message
  );

  throw error;
}

  const allergies =
    allergyResponse.data.allergies || [];

  const environmentalData =
    environmentalResponse.data;

 let riskResult;

try {
  riskResult = calculateRisk(
    allergies,
    environmentalData
  );

 
} catch (error) {


  throw error;
}

const { riskScore, riskLevel } = riskResult;

  const assessment =
    await riskAssessmentRepository.createRiskAssessment({
      
      userId,
      latitude,
      longitude,
      riskLevel,
      riskScore,
      grassPollenLevel:
        environmentalData.grass_pollen_level,
      treePollenLevel:
        environmentalData.tree_pollen_level,
      weedPollenLevel:
        environmentalData.weed_pollen_level,
    });

  const channel = getChannel();

  const event = {
    eventType: "RiskAssessmentCreated",
    userId: assessment.user_id,
    assessmentId: assessment.id,
    riskLevel: assessment.risk_level,
    riskScore: assessment.risk_score,
    latitude: assessment.latitude,
    longitude: assessment.longitude,
    createdAt: assessment.calculated_at,
  };

  channel.publish(
    EXCHANGE_NAME,
    "RiskAssessmentCreated",
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
      contentType: "application/json",
    }
  );

  console.log(
    "Published RiskAssessmentCreated event:",
    event
  );

  return assessment;
};

const getRiskAssessmentsByUser = async (userId) => {
  return riskAssessmentRepository.getRiskAssessmentsByUser(
    userId
  );
};

module.exports = {
  createRiskAssessment,
  getRiskAssessmentsByUser,
};

