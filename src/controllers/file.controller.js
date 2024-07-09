const express = require('express');
// const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');
const uploadfile = require('../services/file.service.js');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

const uploadFile = upload.single('myFile');

const check = async(req, res, next) => {
    const file = req.file;
    const result = await uploadfile(file);
    console.log({result});
    if (result == 'success') {
        return res.status(200).json({
            message: 'Success'
        });
    } else {
        return res.status(400).json({
            message: "error!"
        });
    }
}

module.exports = {
    uploadFile,
    check
}

// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//     const file = req.file;
//     if (!file) {
//         const error = new Error('Please upload a file');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     res.send('success');
// });