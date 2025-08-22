const express = require('express'); // Importing the express module
require('dotenv').config(); // Loading environment variables from .env file
const authRouter = require('./router/authRouter'); // Importing the auth router
const path = require('path'); // Importing the path module for handling file paths
const cookieParser = require('cookie-parser'); // Importing cookie-parser for handling cookies
const cors = require('cors'); // Importing cors for handling Cross-Origin Resource Sharing

const app = express(); // Creating an instance of an Express application

app.use(cors({
  origin:"http://localhost:5173", // Allowing requests from this origin
  credentials: true, // Allowing credentials (cookies, authorization headers, etc.) to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowing these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowing these headers in requests
})); // Enabling CORS for all routes

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serving static files from the uploads directory 
app.use('/api/auth', authRouter); // Mounting the auth router on the /api/auth path

const PORT = process.env.PORT || 3000; // Setting the port to listen on, defaulting to 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Logging a message when the server starts
}); // Starting the server and listening on the specified port