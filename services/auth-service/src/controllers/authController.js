const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({
        message: "userId, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const loginResult = await authService.loginUser(email, password);

res.status(200).json({
  message: "Login successful",
  user: loginResult.user,
  token: loginResult.token,
});;
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Registration failed:", error.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const loginResult = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: loginResult.user,
      token: loginResult.token,
    });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        message: error.message,
      });
    }

    console.error("Login failed:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  register,
  login,
};