const { DataTypes } = require("sequelize");
const db = require("../database/db");

// Define Assignment Model
const Assignment = db.define("Assignment", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {notEmpty: true}
    },

    description: {
        type: DataTypes.TEXT
    },

    dueDate: {
        type: DataTypes.DATE
    },

    estimatedHours: {
        type: DataTypes.FLOAT,
        validate: {min: 0}
    },

    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Exports
module.exports = Assignment;