const express = require("express");
const router = express.Router();
const userControllers = require('../controllers/user.controller.js');
const authenticateToken = require('../middlewares/auth.middleware');

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/users", authenticateToken, userControllers.getAllUsers);
router.post("/email", userControllers.getMail);
router.post("/test", userControllers.sendMail);
router.post("/forgot-password", userControllers.forgotPassword);
router.post("/reset-password", userControllers.resetPassword);

module.exports = router;
