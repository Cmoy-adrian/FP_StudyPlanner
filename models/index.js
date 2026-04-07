const sequelize = require("../database/db");

const Course = require("./Course");
const Assignment = require("./Assignment");
const StudySession = require("./StudySession");
const User = require("./User");

// USER → COURSE
User.hasMany(Course, {
  foreignKey: {
    name: "userId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

Course.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
});

// COURSE → ASSIGNMENT
Course.hasMany(Assignment, {
  foreignKey: {
    name: "courseId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

Assignment.belongsTo(Course, {
  foreignKey: {
    name: "courseId",
    allowNull: false
  }
});

// ASSIGNMENT → STUDY SESSION
Assignment.hasMany(StudySession, {
  foreignKey: {
    name: "assignmentId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

StudySession.belongsTo(Assignment, {
  foreignKey: {
    name: "assignmentId",
    allowNull: false
  }
});

// Exports
module.exports = {
  sequelize,
  User,
  Course,
  Assignment,
  StudySession
};