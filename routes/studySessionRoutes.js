const express = require("express");
const router = express.Router();

const {StudySession, Assignment} = require("../models")

// GET /study-sessions - Get ALL study sessions
router.get("/", async (req, res, next) => {
    try {
        const sessions = await StudySession.findAll({
            include: Assignment
        });

        res.status(200).json(sessions);

    } catch (error) {
        next(error);
    }
});

// GET /study-sessions/:id - Get single study session
router.get("/:id", async (req, res, next) => {
    try {
        const session = await StudySession.findByPk(req.params.id, {
            include: Assignment
        });

        if (!session) {
            return res.status(404).json({
                error: "Study Session not found"
            });
        }

        res.status(200).json(session);

    } catch (error) {
        next(error);
    }
});

// POST /study-sessions - Create new study session
router.post("/", async (req, res, next) => {
    try {
        const {assignmentId, startTime, endTime} = req.body;

        // Validate required fields
        if (!assignmentId || !startTime || !endTime) {
            return res.status(400).json({
                error: "assignmentId, startTime, and endTime are required"
            });
        }

        // Validate assignment exists
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            return res.status(400).json({
                error: "Invalid assignmentId"
            });
        }

        const session = await StudySession.create(req.body);

        res.status(201).json(session);
    } catch (error) {
        next(error)
    }
});

// PUT /study-sessions/:id - Update study session
router.put("/:id", async (req, res, next) => {
    try {
        const session = await StudySession.findByPk(req.params.id);

        if (!session) {
            return res.status(404).json({
                error: "Study session not found"
            });
        }

        // Validate updated assignmentId
        if (req.body.assignmentId) {
            const assignment= await Assignment.findByPk(req.body.assignmentId);

            if (!assignment) {
                return res.status(400).json({
                    error: "Invalid assignmentId"
                });
            }
        }

        await session.update(req.body);

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

// DELETE /study-sessions/:id - Delete study session
router.delete("/:id", async (req, res, next) => {
    try {
        const session = await StudySession.findByPk(req.params.id);

        if (!session) {
            return res.status(404).json({
                error: "Study session not found"
            });
        }
        await session.destroy();

        res.status(200).json({
            message: "Study session deleted successfully"
        });
    } catch (error) {
        next(error)
    }
});

// Exports
module.exports = router;