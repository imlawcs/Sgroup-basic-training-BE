const db = require("../database/connection");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || 'abc';  
var jwt = require('jsonwebtoken');
// const { forgotPassword, resetPassword } = require("../controllers/user.controller");
const mailService = require("../middlewares/mailService.js");

const register = async (user) => {
    // Hash the password
    try {
        if(user.username === '' || user.password === '' || user.email === '') return 'No Empty';
        const query0 = 'SELECT * FROM users WHERE username = ?';
        const results = await db.query(query0, [user.username])
        if (results[0].length != 0) {
            return 'Username already exists';
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        // Insert the user into the database
        user.password = hashedPassword;
        const query = 'INSERT INTO users (username, password, email, fullname, role) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [user.username, hashedPassword, user.email, user.fullname, user.role]);
        return user;
    } catch (err) {
        console.error('Error hashing password:', err);
    }
};


const login = async (user) => {
    try {
        // Retrieve the user from the database
        if(user.username === '' || user.password === '' || user.email === '') return 'No Empty';
        const query = 'SELECT * FROM users WHERE username = ?';
        const results = await db.query(query, [user.username])
        if (results[0].length === 0) {
            return 'Invalid username or password';
        }
        const users = results[0][0];
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(user.password, users.password);
        if (!passwordMatch) 
            return 'Invalid username or password';
        // return 'Login successful';
        // Tạo JWT token
        const token = jwt.sign({ username: users.username }, jwtSecret, { expiresIn: '1h' });
        // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
        // res.status(200).send(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};
  
const getAllUsers = async () => {
    try {
        const query = "SELECT * FROM users";
        const result = await db.query(query);
        return result;
    } catch(err) {
        console.log(err);
    }
};

const getMail = async(email) => {
    try {
        const query = "SELECT * FROM users WHERE email = ?";
        const results = await db.query(query, [email]);
        if (results[0].length === 0) {
            return 'Email not found';
        }
        else return results[0][0];
    }
    catch(err) {
        console.log(err);
    }
}

const sendMail = async(emailTo, emailText) => {
    try {
    await mailService.sendEmail({
        emailTo: emailTo,
        emailText: emailText,
    });
  
    return res.status(200).json({
        message: 'reset password email sent successfully',
    })
    }   
    catch (error) {
        return res.status(500).json({
            message: 'error',
        });
    }
}

const forgotPassword = async(email) => {

    var passwordResetToken = '';
    for (let i = 0; i < 6; i++) {
        passwordResetToken += Math.floor(Math.random() * 10).toString();
    }
    const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const query = 'UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?';
    const updateStatus = await db.query(query, [passwordResetToken, passwordResetExpiration, email])
    if (updateStatus) {
        mailService.sendEmail({
          emailFrom: 'daolehanhnguyen@gmail.com',
          emailTo: email,
          emailSubject: 'Reset password',
          emailText: 'Here is your reset password token: ' + passwordResetToken,
        });
        return 'success';
    }
    else {
        return 'fail';
    }
}

const isValidUser = async(email, passwordResetToken) => {
    try {
        const query = 'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?';
        const user = await db.query(query, [email, passwordResetToken, new Date(Date.now())]);
        if(user[0].length === 0) return 'User not found';
        else return 'Found';
    }
    catch(err) {
        console.log(err);
    }
}

const resetPassword = async(email, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const update = 'UPDATE users SET password = ?, passwordResetToken = null, passwordResetExpiration = null WHERE email = ?';
        const updateStatus = await db.query(update, [hashedPassword, email]);
        if(updateStatus.affectedRows === 0) return 'Fail';
        else return 'Success';
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {
    register,
    login,
    getAllUsers,
    getMail,
    forgotPassword,
    isValidUser,
    resetPassword
}
