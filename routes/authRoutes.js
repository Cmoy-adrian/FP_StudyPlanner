const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const {User} = require("../models");
const authenticateUser = require("../middleware/auth");
const { ValidationError, UniqueConstraintError } = require("sequelize");

// POST /auth/register - Register new user
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required"
            });
        }

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

        // Converts instance to JSON & removes password
        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json({
            message: "User created successfully",
            user: userResponse
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.errors.map(err => err.message) // Returns what validation failed
            })
        }

        if (error instanceof UniqueConstraintError) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
});

// POST /auth/login - Login existing user
router.post("/login", async (req, res) =>  {
    try {
        const { email, password } = req.body;

        // Required field validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Need password included (defaultScope excludes it)
        const user = await User.scope("withPassword").findOne({
            where: { email }
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

        const safeUser = user.toJSON();
        delete safeUser.password;

        res.json({
            message: "Login successful",
            token,
            user: safeUser
        });

    } catch (error) {

        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.errors.map(err => err.message)
            });
        }

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

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error retrieving user"
        });
    }
});

// Exports
module.exports = router;