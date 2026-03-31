const { DataTypes } = require("sequelize");
const db = require("../database/db");

// Define Course Model
const Course = db.define("Course", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },
    
    term: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Exports
module.exports = Course;