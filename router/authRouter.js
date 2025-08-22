const express = require('express');
const {registerUser , login} = require('../controller/authController');
const upload = require('../middleware/fileUpload');
const router = express.Router();// Creating a new router instance


router.post('/register', upload.single("profile"), registerUser )
router.post('/login', login);

 
module.exports = router; // Exporting the router for use in other modules