const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for creating JWT tokens

const auth = (req, res, next) => {
    const token = req.cookies.token; // Getting the token from cookies
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." }); // Sending a 401 Unauthorized response if no token is provided
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token using the secret key
        console.log("Decoded token:", decoded); // Logging the decoded token for debugging purposes 
        req.user = decoded; // Attaching the decoded user information to the request object
        next(); // Calling the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error.message); // Logging any errors that occur during token verification
        return res.status(400).json({ message: "Invalid token" }); // Sending a 400 Bad Request response if the token is invalid
    }
}
module.exports = auth; // Exporting the auth middleware for use in other files