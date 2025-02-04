const connectMongodb = require("../models/user.model"); // Import DB connection function
const dbCollection = "UserDetails";
exports.getAllUsers = async (req, res) => {
    try {
        const db = await connectMongodb(); // Get database instance
        const users = await db.collection(dbCollection).find().toArray(); // Fetch users
        res.status(200).send(users); // Send response
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
