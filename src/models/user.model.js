require("dotenv").config();
const { MongoClient } = require("mongodb");


const uri = process.env.MONGO_URI; // Load from .env
const dbName = "users"; // Replace with your actual database name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectMongodb = async () => {
    try {
        // if (!client.topology || !client.topology.isConnected()) {
        //     await client.connect();
        //     console.log("MongoDB Connected");
        // }
        // await client.connect();
        // return client.db(dbName);
        return (await client.connect()).db(dbName);
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
    }
};

module.exports = connectMongodb;
