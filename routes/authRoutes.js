const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const {User} = require("../models/User");
const authenticateUser = require("../middleware/auth");

// POST /auth/register - Register new user
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body

        // Check existing user
        const existingUser = await User.findOne({
            where: {email}
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Password hashing handled automatically by model hook
        const newUser = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
});

// POST /auth/login - Login existing user
router.post("/login", async (req, res) =>  {
    try {
        const {email, password} = req.body;

        // Need password included (defaultScope excludes it)
        const user = await User.scope(null).findOne({
            where: {email}
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
});

// Get /auth/me - Gets current user information
router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        res.json(user);
        
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error retrieving user"
        });
    }
});

// Exports
module.exports = router;