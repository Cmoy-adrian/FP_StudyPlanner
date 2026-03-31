require("dotenv").config();
const {Sequelize}= require("sequelize");

// Init database connection
const db = new Sequelize({
    dialect: 'sqlite',
    storage: `database/${process.env.DB_NAME}` || 'planner.db',
    logging: false
});