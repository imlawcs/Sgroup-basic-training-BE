const jwt = require('jsonwebtoken');
const db = require('../database/connection');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    
    if (token == null) return res.sendStatus(401); // Nếu không có token
    console.log(jwtSecret);
    const decode = jwt.verify(token, jwtSecret);
    console.log(decode);
    if(!decode) {
        return res.sendStatus(403);
    }
    next();
};

const authorization = async(req, res, next) => {
    const authorize = req.body;
    const query = "SELECT * FROM users WHERE id = ? AND role = ?";
    const autho = await db.query(query, [authorize.userId, 'admin']);
    if (autho[0].length === 0) {
        return res.status(500).send('You do not have access');
    }
    next();
    // return res.status(200).send('You have access');
}

module.exports = {
    authenticateToken,
    authorization
};
