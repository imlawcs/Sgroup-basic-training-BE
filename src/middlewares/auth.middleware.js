const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

// Middleware xác thực JWT token
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

// const authorization = (req, res, next) => {

// }

module.exports = authenticateToken;
