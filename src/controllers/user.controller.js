// const db = require("../database/connection.js");
const mailService = require("../middlewares/mailService.js");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');
const userServices = require('../services/user.service.js');
const register = async (req, res) => {
    const user = req.body;
    try {
        const users = await userServices.register(user);
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const login = async (req, res) => {
    const user = req.body;
    try {
        const accessToken = await userServices.login(user);
        res.status(200).json({accessToken});
    }
    catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
};

const getMail = async(email) => {
    // const user = req.body;
    try {
        const users = await userServices.getMail(email);
        return {users};
    }
    catch (err) {
        console.log(err);
    }
}

const sendMail = async(req, res) => {
    try {
      const { emailTo, emailText } = req.body;
      await mailService.sendEmail({
        emailFrom: "daolehanhnguyen@gmail.com",
        emailTo: emailTo,
        emailSubject: "HI",
        emailText: emailText,
      });
  
      return res.status(200).json({
        message: 'reset password email sent successfully',
      });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'error',
        });
    }
};

const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await getMail(email);
        console.log(user);
        if (user.users != 'Email not found') {
          const forgotStatus = await userServices.forgotPassword(email);
          console.log(forgotStatus);
          if (forgotStatus == 'success') {
              return res.status(200).json({
                  message: 'Reset password email sent successfully'
              });
          } else {
              return res.status(400).json({
                  message: "Can't reset password!"
              });
          }
      } else {
          return res.status(404).json({
              message: 'User not found!'
          });
      }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'error',
        });
    }
}

const resetPassword = async(req, res) => {
    try {
        const { email, passwordResetToken, newPassword } = req.body;
        const user = await userServices.isValidUser(email, passwordResetToken);
    
        if (user == 'User not found') {
          return res.status(400).json({
            message: 'invalid token or token has expired',
          });
        }

        const updateStatus = await userServices.resetPassword(email, newPassword);
        if (updateStatus == 'Success') {
          return res.status(200).json({
            message: 'reset password successfully',
          });
        }
    
        return res.status(400).json({
          message: 'reset password failed',
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: 'error',
        });
      }
}

module.exports = {
    register,
    login,
    getAllUsers,
    getMail,
    sendMail,
    forgotPassword,
    resetPassword
}
