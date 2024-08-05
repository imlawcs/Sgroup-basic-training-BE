const jwt = require('jsonwebtoken');
const db = require('../database/connection');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    const decode = jwt.verify(token, jwtSecret);
    if (!decode) {
      return res.sendStatus(403);
    }
    next();
  } catch (err) {
    res.status(400).send('Token is invalid');
  }
};
const authorization = async (req, res, next) => {
  const authorize = req.body;
  const query = "SELECT * FROM users WHERE id = ? AND role = ?";
  const autho = await db.query(query, [authorize.userId, 'admin']);
  if (autho[0].length === 0) {
    return res.status(500).send('You do not have access');
  }
  next();
};
module.exports = {
  authenticateToken,
  authorization
};