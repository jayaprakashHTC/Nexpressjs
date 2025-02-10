require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // Load from .env

const dbName = "importFilesDB"; // Replace with your actual database name

const client = new MongoClient(uri);

// const options = {
//     useNewUrlParser: true, // <-- no longer necessary
//     useUnifiedTopology: true // <-- no longer necessary
// }

const connectMongodb = async () => {
    try {
        return (await client.connect()).db(dbName);
    } catch (error) {
        console.error("MongoDB Connection Failed:", {error:error.message});
    }
};

module.exports = connectMongodb;
