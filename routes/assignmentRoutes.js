const express = require("express");
const router = express.Router();

const {Assignment, Course} = require("../models")

// GET /assignments - Gets ALL assignments
router.get("/", async (req, res, next) => {
    try {
        const assignments = await Assignment.findAll({
            include: Course
        });

        res.status(200).json(assignments);

    } catch (error) {
        next(error);
    }
});

// GET /assignments/:id - Get individual assignment by id
router.get("/:id", async (req, res, next) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id, {
            include: Course
        });

        if (!assignment) {
            return res.status(404).json({
                error: "Assignment not found"
            });
        }

        res.status(200).json(assignment);

    } catch (error) {
        next(error);
    }
});

// POST /assignments - Creates new assignment
router.post("/", async (req, res, next) => {
    try {
        const {title, courseId} = req.body;

        // Validate required fields
        if (!title || !courseId) {
            return res.status(400).json({
                error: "Title and courseId are required"
            });
        }

        // Validate course exists
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(400).json({
                error: "Invalid courseId"
            });
        }

        const assignment = await Assignment.create(req.body);

        res.status(201).json(assignment);

    } catch (error) {
        next(error);
    }
});

// PUT /assignments/:id - Updates existing assignment
router.put("/:id", async (req, res, next) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                error: "Assignment not found"
            });
        }

        // Validate updated course Id if present
        if (req.body.courseId) {
            const course = await Course.findByPk(req.body.courseId);

            if (!course) {
                return res.status(400).json({
                    error: "Invalid courseId"
                });
            }
        }

        await assignment.update(req.body);

        res.status(200).json(assignment);

    } catch (error) {
        next(error);
    }
});

// DELETE /assignments/:id - Deletes assignment
router.delete("/:id", async (req, res, next) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                error: "Assignment not found"
            });
        }

        await assignment.destroy();

        res.status(200).json({
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

// Exports
module.exports = router;