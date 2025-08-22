const express = require('express');
const {registerUser , login} = require('../controller/authController');
const upload = require('../middleware/fileUpload');
const auth = require('../middleware/auth');
const {getUserDetails} = require('../controller/authController');
const router = express.Router();// Creating a new router instance


router.post('/register', upload.single("profile"), registerUser )
router.post('/login', login);
router.get('/me' , auth , getUserDetails);

 
module.exports = router; // Exporting the router for use in other modules