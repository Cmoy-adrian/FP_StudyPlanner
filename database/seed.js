require("dotenv").config();

const {
  db,
  User,
  Course,
  Assignment,
  StudySession
} = require("../models");

async function seedDatabase() {

  try {

    await db.sync({ force: true });

    console.log("Database reset complete");


    /*
    =========================
    Create Users
    =========================
    */

    const studentUser = await User.create({
      username: "student1",
      email: "student@test.com",
      password: "password123",
      role: "user"
    });

    const adminUser = await User.create({
      username: "admin1",
      email: "admin@test.com",
      password: "admin123",
      role: "admin"
    });

    // Second student for permission testing
    const studentUser2 = await User.create({
      username: "student2",
      email: "student2@test.com",
      password: "password123",
      role: "user"
    });


    /*
    =========================
    Create Courses
    =========================
    */

    const calcCourse = await Course.create({
      name: "Calculus II",
      term: "Spring 2026",
      userId: studentUser.id
    });

    const csCourse = await Course.create({
      name: "Backend Development",
      term: "Spring 2026",
      userId: studentUser.id
    });


    /*
    =========================
    Create Assignments
    =========================
    */

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


    /*
    =========================
    Create Study Sessions
    =========================
    */

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


    /*
    =========================
    Test Login Credentials
    =========================
    */

    console.log(`
      Test Accounts Created:

      Student 1:
      email: student@test.com
      password: password123

      Student 2:
      email: student2@test.com
      password: password123

      Admin:
      email: admin@test.com
      password: admin123
    `);

  } catch (error) {

    console.error("Seeding failed:", error);

  } finally {

    process.exit();

  }

}

seedDatabase();