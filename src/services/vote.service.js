const db = require("../database/connection");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');

const currentDate = new Date();

const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
const year = currentDate.getFullYear();

const formattedDate = `${year}-${month}-${day}`;

console.log(formattedDate); 


const createPoll = async(title, userId) => {
    const isValidUser = 'SELECT * FROM users WHERE id = ?';
    const results = await db.query(isValidUser, [userId]);
    if (results[0].length === 0) {
        return 'Invalid user';
    }
    else {
        const query = 'INSERT INTO polls (title, CreateDate, userId, isLock) VALUES (?, ?, ?, ?)';
        const createStatus = await db.query(query, [title, formattedDate, userId, 0]);
        if(createStatus) 
            return 'create poll success';
        else return 'create poll fail';
    }
}

const createOption = async(title, pollId) => {
    const isValidPoll = 'SELECT * FROM polls WHERE id = ?';
    const results = await db.query(isValidPoll, [pollId]);
    if (results[0].length === 0) {
        return 'Invalid poll';
    }
    else {
        const query = 'INSERT INTO options (title, CreateDate, pollId) VALUES (?, ?, ?)';
        const createStatus = await db.query(query, [title, formattedDate, pollId]);
        if(createStatus) 
            return 'create option success';
        else return 'create option fail';
    }
}

const submit = async(userId, optionId) => {
    const isValidPoll = 'SELECT * FROM options WHERE id = ?';
    const result = await db.query(isValidPoll, [optionId]);
    const isValidUser = 'SELECT * FROM users WHERE id = ?';
    const results = await db.query(isValidUser, [userId]);
    if (result[0].length === 0 || results[0].length === 0) {
        return 'Invalid';
    }
    else {
        const query = 'INSERT INTO user_option (userId, optionId) VALUES (?, ?)';
        const createStatus = await db.query(query, [userId, optionId]);
        if(createStatus) 
            return 'create user option success';
        else return 'create user option fail';
    }
}

const unsubmit = async(userId, optionId) => {
    const isValidPoll = 'SELECT * FROM options WHERE id = ?';
    const result = await db.query(isValidPoll, [optionId]);
    const isValidUser = 'SELECT * FROM users WHERE id = ?';
    const results = await db.query(isValidUser, [userId]);
    if (result[0].length === 0 || results[0].length === 0) {
        return 'Invalid';
    }
    else {
        const query = 'DELETE FROM user_option WHERE userId = ? AND optionId = ?';
        const createStatus = await db.query(query, [userId, optionId]);
        if(createStatus) 
            return 'delete user option success';
        else return 'delete user option fail';
    }
}

const resultPoll = async() => {
    const query = 'SELECT u.id as idUserCreate, o.title as option_title, p.title as poll_title, uo.userId as idUserSubmit FROM polls p LEFT JOIN options o ON o.pollId = p.id LEFT JOIN users u ON u.id = p.userId LEFT JOIN user_option uo ON uo.userId = p.userId AND uo.optionId = o.id;';
    const result = await db.query(query);
    if (result[0].length === 0) {
        return 'Invalid result';
    }
    else {
        return result;
    }
}

module.exports = {
    createPoll, 
    createOption,
    submit,
    unsubmit,
    resultPoll
}