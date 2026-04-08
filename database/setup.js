require("dotenv").config();

const { sequelize } = require("../models")

// Func: runs database setup
async function setupDatabase() {
  try {
    await sequelize.sync({ force: true });

    console.log("Database + tables created successfully");

  } catch (error) {
    console.error("Database setup failed:", error);

  } finally {
    process.exit();

  }
}

setupDatabase();