require("dotenv").config();

const { db, Course, Assignment, StudySession } = require("../models");

async function seedDatabase() {

  try {

    await db.sync({ force: true });

    console.log("Database reset complete");


    // Create Courses
    const calcCourse = await Course.create({
      name: "Calculus II",
      term: "Spring 2026"
    });

    const csCourse = await Course.create({
      name: "Backend Development",
      term: "Spring 2026"
    });


    // Create Assignments
    const assignment1 = await Assignment.create({
      title: "Integration Worksheet",
      description: "Practice integration by parts problems",
      dueDate: "2026-04-05",
      estimatedHours: 2,
      courseId: calcCourse.id
    });

    const assignment2 = await Assignment.create({
      title: "REST API Project Setup",
      description: "Initialize Express server structure",
      dueDate: "2026-04-08",
      estimatedHours: 3,
      courseId: csCourse.id
    });


    // Create Study Sessions
    await StudySession.create({
      startTime: new Date("2026-04-01T14:00:00"),
      endTime: new Date("2026-04-01T15:30:00"),
      assignmentId: assignment1.id
    });

    await StudySession.create({
      startTime: new Date("2026-04-02T10:00:00"),
      endTime: new Date("2026-04-02T11:15:00"),
      assignmentId: assignment2.id
    });


    console.log("Seed data inserted successfully");

  } catch (error) {

    console.error("Seeding failed:", error);

  } finally {

    process.exit();

  }

}

seedDatabase();