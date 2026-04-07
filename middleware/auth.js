const jwt = require("jsonwebtoken");
const User = require("../models/User");

// func: authenticate user using JWT token
const authenticateUser = async (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Authentication token missing"
            });

        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Confirm user still exists
        const user = await User.findByPk(decoded.id);

        if (!user) {

            return res.status(401).json({
                message: "User no longer exists"
            });

        }

        // Attach user to request
        req.user = {
            id: user.id,
            role: user.role
        };

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

module.exports = authenticateUser;