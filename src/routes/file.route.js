const express = require("express");
const file = express.Router();
const fileControllers = require('../controllers/file.controller.js');
const authenticateToken = require('../middlewares/auth.middleware');

file.post('/uploadfile', authenticateToken.authenticateToken, fileControllers.uploadFile, fileControllers.check);

module.exports = file;