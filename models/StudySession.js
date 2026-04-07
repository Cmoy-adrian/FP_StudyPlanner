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

// Calculate duration
beforeValidate(session => {
    session.durationMinutes =
        (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
});

// Exports
module.exports = StudySession;