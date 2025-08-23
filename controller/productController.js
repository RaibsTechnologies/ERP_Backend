const db = require('../db.js'); // Importing the database connection 


const fetchData = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productList'); // Fetching all products from the database
        console.log(rows);
        res.status(200).json(rows); // Sending a 200 OK response with the fetched data
    } catch (error) {
        console.error("Error fetching data:", error.message); // Logging any errors that occur during data fetching
        return res.status(500).json({ message: "Internal server error" }); // Sending a 500 Internal Server Error response   
    }
}

module.exports = { fetchData }; // Exporting the fetchData function for use in other files