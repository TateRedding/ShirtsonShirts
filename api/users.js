const express = require("express");
const { requireUser, requireAdmin } = require("./utils");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
    getUser,
    getUserByUsername,
    getUserById,
    createUser,
    getUserByEmail,
} = require("../db/users");

// POST /api/users/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) return;
        const user = await getUser({ username, password });
        if (user) {
            const token = jwt.sign(
                {
                    id: user.id,
                    username,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1w",
                }
            );
            res.send({
                success: true,
                message: "Login succesful!",
                token,
                user,
            });
        } else {
            res.send({
                success: false,
                error: "IncorrectCredentialsError",
                message: "Username and password do not match!",
            });
        };
    } catch (error) {
        console.error(error);
    };
});

// POST /api/users/register
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    try {
        if (!username || !password) return;
        const existingUser = await getUserByUsername(username);
        const existingEmail = await getUserByEmail(email);
        if (existingUser) {
            res.send({
                success: false,
                error: "UsernameTakenError",
                message: "Username is already taken.",
            });
        } else if (existingEmail) {
            res.send({
                success: false,
                error: "EmailAlreadyInUse",
                message: "There is already an account registered under that email."
            });
        } else if (password.length < 8) {
            res.send({
                success: false,
                error: "PasswordTooShortError",
                message: "Password must be atleast 8 characters long.",
            });
        } else {
            const user = await createUser(req.body);
            if (user) {
                delete user.password;
                const token = jwt.sign(
                    {
                        id: user.id,
                        username,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1w",
                    }
                );
                res.send({
                    success: true,
                    message: "Thank you for signing up!",
                    token,
                    user,
                });
            };
        };
    } catch (error) {
        console.error(error);
    };
});

// GET /api/users/me
router.get("/me", requireUser, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (user) {
            res.send({
                success: true,
                user
            });
        } else {
            res.send({ success: false });
        };
    } catch (error) {
        console.log(error);
    };
});

module.exports = router;