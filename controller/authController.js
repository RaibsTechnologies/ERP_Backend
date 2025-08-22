const db = require('../db.js'); // Importing the database connection   
const bcrpty = require('bcryptjs'); // Importing bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for creating JWT tokens

const registerUser = async (req, res) => {
    try {
        const { username, email, password_hash } = req.body; // Destructuring username and password from request body
        const profile = req.file ? `/uploads/${req.file.filename}` : null; // Getting the uploaded file's filename if it exists
        if (!username || !email || !password_hash) {
            return res.status(400).json({ message: "All fields are required" }); // Sending a 400 Bad Request response if any field is missing
        }

        const [existingUser] = await db.query('SELECT * FROM login WHERE username = ?', [username]); // Checking if the user already exists
        //check the user is already exist
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User already exists" }); // Sending a 409 Conflict response if user already exists
        }

        //hashed password

        const hashedPassword = await bcrpty.hash(password_hash, 10); // Hashing the password with bcrypt

        //store the user in the database
        const [result] = await db.query('INSERT INTO login (username, email, password_hash, profile) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, profile]); // Inserting the new user into the database
        res.status(201).json({ message: "User registered successfully", userId: result.insertId }); // Sending a 201 Created response with the new user's ID
    } catch (error) {
        console.error("Error registering user:", error.message); // Logging any errors that occur during registration
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }
}

const login = async (req, res) => {
    try {
        console.log("incoming body", req.body);
        const { email, password } = req.body; // Destructuring username and password from request body
        if (!email || !password) {
            return res.status(400).json({ message: "Username and password are required" }); // Sending a 400 Bad Request response if any field is missing
        }

        // check the user is already exist
        const [user] = await db.query('SELECT * FROM login WHERE email = ?', [email]); // Fetching the user from the database by username
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" }); // Sending a 404 Not Found response if user does not exist
        }

        // check password
        const isPasswordValid = await bcrpty.compare(password, user[0].password_hash); // Comparing the provided password with the stored hashed password
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" }); // Sending a 401 Unauthorized response if password is incorrect
        }

        // create and send JWT token in cookie

        const token = jwt.sign(
            { userId: user[0].user_id }, // or { username: user[0].username }
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000 // Cookie expiration time
        });
        res.status(200).json({
            message: "Login successful",
            user: { id: user[0].user_id, username: user[0].username, email: user[0].email, profile: user[0].profile }
        });

    } catch (error) {
        console.error("Error logging in:", error.message); // Logging any errors that occur during login
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }
}

const getUserDetails = async (req, res) => {
    try {
        const user_id = req.user.userId; // Getting the user ID from the authenticated request
        const [user] = await db.query('SELECT user_id, username, email, profile FROM login WHERE user_id = ?', [user_id]); // Fetching the user details from the database
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" }); // Sending a 404 Not Found response if user does not exist
        }
        res.json(user[0]); // Sending a 200 OK response with the user details        
    } catch (error) {
        console.error("Error fetching user details:", error.message); // Logging any errors that occur while fetching user details
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }

}

const uploadProfilePhoto = async (req, res) => {
    try {
        const user_id = req.user.userId; // Getting the user ID from the authenticated request
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" }); // Sending a 400 Bad Request response if no file is uploaded
        }
        const profile = `/uploads/${req.file.filename}`; // Getting the uploaded file's filename
        const [result] = await db.query('UPDATE login SET profile = ? WHERE user_id = ?', [profile, user_id]); // Updating the user's profile photo in the database
        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" }); // Sending a 404 Not Found response if user does not exist
        }
        res.status(200).json({ message: "Profile photo updated successfully", profile }); // Sending a 200 OK response with the new profile photo path
    } catch (error) {
        console.error("Error uploading profile photo:", error.message); // Logging any errors that occur during profile photo upload
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }
}

module.exports = { registerUser, login, getUserDetails, uploadProfilePhoto }; // Exporting the registerUser function for use in other modules