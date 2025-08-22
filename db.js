const mysql = require("mysql2/promise"); // Importing the mysql module

require("dotenv").config(); // Loading environment variables from .env file

const db = mysql.createPool({
  host: process.env.DB_HOST, // Database host from environment variables   
    user: process.env.DB_USER, // Database user from environment variables
    password: process.env.DB_PASSWORD, // Database password from environment variables
    database: process.env.DB_DATABASE, // Database name from environment variables
});

db.getConnection()
    .then((connection) => {
        console.log("Database connected successfully!"); // Logging a success message when the connection is established
        connection.release(); // Releasing the connection back to the pool
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error.message); // Logging an error message if the connection fails
    });

module.exports = db; // Exporting the database connection pool for use in other modules