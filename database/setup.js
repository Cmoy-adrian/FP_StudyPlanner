require("dotenv").config();

const {db} = require("../models")

// Func: runs database setup
async function setupDatabase() {
  try {
    await db.sync({ force: true });

    console.log("Database + tables created successfully");

  } catch (error) {
    console.error("Database setup failed:", error);

  } finally {
    process.exit();

  }
}

setupDatabase();