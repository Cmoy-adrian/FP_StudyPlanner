const db = require("../database/db");

const Course = require("./Course");
const Assignment = require("./Assignment");
const StudySession = require("./StudySession");


// Relationships
Course.hasMany(Assignment, {
  foreignKey: {
    name:"courseId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

Assignment.belongsTo(Course, {
  foreignKey: {
    name:"courseId",
    allowNull: false
  }
});

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

module.exports = {
  db,
  Course,
  Assignment,
  StudySession
};