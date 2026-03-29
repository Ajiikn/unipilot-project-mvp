const express = require("express");
const { register, login, logout } = require("../controllers/Auth.controller");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post("/login", login);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", logout);

module.exports = router;
