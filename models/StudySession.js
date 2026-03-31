const { DataTypes } = require("sequelize");
const db = require("../database/db");

// Define Study Session Model
const StudySession = db.define("StudySession", {
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },

    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },

    durationMinutes: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0
        }
    }
});

// Exports
module.exports = StudySession;