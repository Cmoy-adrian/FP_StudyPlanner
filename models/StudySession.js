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
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
});

// Calculate duration
StudySession.beforeCreate((session) => {
    if (session.startTime && session.endTime) {
        session.durationMinutes = Math.round(
            (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)
    );
    }
});

// Exports
module.exports = StudySession;