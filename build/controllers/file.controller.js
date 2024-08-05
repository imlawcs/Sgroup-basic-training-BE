const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');
const uploadfile = require('../services/file.service.js');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
const uploadFile = upload.single('myFile');
const check = async (req, res, next) => {
  const file = req.file;
  const result = await uploadfile(file);
  console.log({
    result
  });
  if (result == 'success') {
    return res.status(200).json({
      message: 'Upload file success'
    });
  } else {
    return res.status(400).json({
      message: "Error!"
    });
  }
};
module.exports = {
  uploadFile,
  check
};