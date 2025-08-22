const e = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to store uploaded files
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${Date.now()}${ext}`); // Create a unique filename
    }
});

const upload = multer({ 
    storage,
    fileFilter : (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype); // Check the file's mimetype
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check the file's extension

        if (mimetype && extname) {
            return cb(null, true); // Accept the file
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes); // Reject the file
        }
    }
 });

 module.exports = upload; // Export the upload middleware for use in other modules