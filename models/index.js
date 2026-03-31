const db = require("../database/db");

const Course = require("./Course");
const Assignment = require("./Assignment");
const StudySession = require("./StudySession");


// Relationships
Course.hasMany(Assignment, {
  foreignKey: "courseId",
  onDelete: "CASCADE"
});

Assignment.belongsTo(Course);

Assignment.hasMany(StudySession, {
  foreignKey: "assignmentId",
  onDelete: "CASCADE"
});

StudySession.belongsTo(Assignment);

module.exports = {
  db,
  Course,
  Assignment,
  StudySession
};