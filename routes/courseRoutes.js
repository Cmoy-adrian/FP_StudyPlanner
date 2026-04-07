const express = require("express");
const router = express.Router();

const { Course } = require("../models");
const authenticateUser = require("../middleware/auth");

// Makes all routes require login automatically
router.use(authenticateUser);

// GET /courses - Gets ALL course information
router.get("/", async (req, res , next) => {
    try {
        const courses = await Course.findAll({
            where: {
                userId: req.user.id
            }
        });
        
        res.status(200).json(courses);

    } catch (error) {
        next(error);
    }
});

// GET /courses/:id - Get individual course by id
router.get("/:id", async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course){
            return res.status(404).json({
                error: "Course not found"
            });
        }

        // Check for course ownership
        if (course.userId !== req.user.id) {
            return res.status(403).json({
                error: "Access denied"
            })
        }

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
});

// POST /courses - Creates new course & information
router.post("/", async (req, res, next) => {
    try {
        const {name} = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json({
                error: "Course name is required"
            });
        }

        const newCourse = await Course.create({
            name,
            userId: req.user.id
        });

        res.status(201).json(newCourse);

    } catch (error) {
        next(error);
    }
});

// PUT /courses/:id - Updates an existing course
router.put("/:id", async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            });
        }

        // Check for course ownership
        if (course.userId !== req.user.id) {
            return res.status(403).json({
                error: "Access denied"
            })
        }

        await course.update(req.body);

        res.status(200).json(course);

    } catch (error) {
        next(error);
    }
});

// DELETE /courses/:id - Deletes a specific course
router.delete("/:id", async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            }); 
        }

        // Check for course ownership
        if (course.userId !== req.user.id) {
            return res.status(403).json({
                error: "Access denied"
            })
        }

        await course.destroy();
        
        res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        next(error);
    }
})

// Exports
module.exports = router;