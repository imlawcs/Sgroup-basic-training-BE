const db = require("../database/connection");
const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');

const uploadfile = async(file) => {
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    return 'success';
}

module.exports = uploadfile;


