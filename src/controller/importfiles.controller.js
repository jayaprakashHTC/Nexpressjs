const express = require('express');

const app = express();

const fs = require('fs');

const path = require('path');

const bodyParser = require('body-parser');

// const { MongoClient, ObjectId } = require('mongodb');

app.use(bodyParser.json()) // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const connectMongodb = require("../models/importfiles.model"); // Import DB connection function

const dbCollection = "filescollection";

const filePath = path.join(__dirname, '../../fake.json');

const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
}

exports.importfilesTodb = async(req, res) =>{
     
    const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    console.log(file);

    try{
        const db = await connectMongodb(); // Get database instance
        const users = await db.collection(dbCollection).insertMany(file);
        res.status(201).json({message:"Json file imported successfully", users});
    }catch(error){
        res.status(401).json({error:error.message})
    }
}

exports.getImportJsonData = async(req, res) =>{
     try {
        const users = await dbConnection();
        res.status(200).send(users); // Send response
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}