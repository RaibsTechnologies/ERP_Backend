const db = require('../db.js'); // Importing the database connection   
const bcrpty = require('bcryptjs'); // Importing bcrypt for password hashing

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
        const { username, password_hash } = req.body; // Destructuring username and password from request body
        if (!username || !password_hash) {
            return res.status(400).json({ message: "Username and password are required" }); // Sending a 400 Bad Request response if any field is missing
        }
        const [user] = await db.query('SELECT * FROM login WHERE username = ?', [username]); // Fetching the user from the database by username
        console[user];
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" }); // Sending a 404 Not Found response if user does not exist
        }
        const isPasswordValid = await bcrpty.compare(password_hash, user[0].password_hash); // Comparing the provided password with the stored hashed password
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" }); // Sending a 401 Unauthorized response if password is incorrect
        }
        res.status(200).json({ message: "Login successful", userId: user[0].id }); // Sending a 200 OK response with the user's ID
    } catch (error) {
        console.error("Error registering user:", error.message); // Logging any errors that occur during registration
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }
}

module.exports = { registerUser, login }; // Exporting the registerUser function for use in other modules