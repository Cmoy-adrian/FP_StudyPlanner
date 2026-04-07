const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/auth");
const role = require("../middleware/role");

const User = require("../models/User");

// GET /admin/users - Get all users
router.get("/users", authenticateUser, role("admin"), async (req, res) => {
    try {
        const users = await User.findAll();

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve users",
            error: error.message
        });
    }
});

// PATCH /admin/users/:id/role - Updates user role
router.patch("/users/:id/role", authenticateUser, role("admin"), async (req, res) => {
    try {
        const {role: newRole}= req.body;

        if (!["user", "admin"].includes(newRole)) {
            return res.status(400).json({
                message: "Invalid role value"
            });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = newRole;

        await user.save();

        res.json({
            message: "User role updated",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update role",
            error: error.message
        })
    }
});

// DELETE /admin/users/:id - Delete user
router.delete("/user/:id", authenticateUser, role("admin"), async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent admins from deleting themselves
        if (req.user.id === user.id) {
            return res.statusMessage(400).json({
                message: "Admins cannot delete themselves"
            });
        }

        await user.destroy();

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
});

// Exports
module.exports = router;