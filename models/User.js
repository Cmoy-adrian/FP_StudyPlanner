const { DataTypes } = require("sequelize");
const db = require("../database/db");
const bcrypt  = require("bcrypt");

// Define User Model
const User = db.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 25],
        }, 
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']]
        },
    }
}, {
    // Security Improvement: Removes password when using .findAll()
    defaultScope:{
        attributes: {exclude: ["password"]}
    },

    // Allows password to be obtained during login
    scopes: {
        withPassword: {
            attributes: {}
        }
    }
});

// Hash Password w/ bcrypt
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

// Password Comparison Method
User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Exports
module.exports = User;