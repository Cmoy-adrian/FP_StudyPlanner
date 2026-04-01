require("dotenv").config();
const {Sequelize}= require("sequelize");

// Choose database depending on environment
const dbName =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_DB_NAME
        : process.env.DB_NAME || "planner.db";

// Init database connection
const db = new Sequelize({
    dialect: "sqlite",
    storage: `database/${dbName}`,
    logging: false
});

// Exports
module.exports = db;