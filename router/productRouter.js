const express = require('express');
const upload = require('../middleware/fileUpload'); 
const router = express.Router();// Creating a new router instance   
const auth = require('../middleware/auth');
const { fetchData } = require('../controller/productController');

router.get('/fetchData', auth, fetchData);

module.exports = router; // Exporting the router for use in other modules