require("dotenv").config();

const express = require("express");

const { sequelize } = require("./models");

const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());

app.use(logger);

// Routes
app.use("/courses", courseRoutes);

app.use("/assignments", assignmentRoutes);

app.use("/study-sessions", studySessionRoutes);

app.use("/auth", authRoutes);

app.use("/admin", adminRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Error middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

// Func: Run to boot up server
async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

if (process.env.NODE_ENV !== "test") {
    startServer();
}

// Export app for testing
module.exports = app;
