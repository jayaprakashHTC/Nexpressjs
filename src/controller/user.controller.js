const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const { MongoClient, ObjectId } = require('mongodb');

app.use(bodyParser.json()) // for parsing application/json

//app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const connectMongodb = require("../models/user.model"); // Import DB connection function

const dbCollection = "UserDetails";



const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await dbConnection();
        res.status(200).send(users); // Send response
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

exports.getFilterUsers = async (req, res) => {
    let keyword = req.query;
    try{
    const db = await connectMongodb(); 
    const users = await db.collection(dbCollection).find({ 
        // $and: [
        //     keyword.fname ? { fname: { $regex: keyword.fname, $options: "i" } } : null &&
        //     keyword.lname ? { lname: { $regex: keyword.lname, $options: "i" } } : null
        // ].filter(Boolean) // Removes null values if fname or lname is missing
        $or: [
            keyword.fname ? { fname: { $regex: keyword.fname, $options: "i" } } : null ||
            keyword.lname ? { lname: { $regex: keyword.lname, $options: "i" } } : null
        ].filter(Boolean) // Removes null values if fname or lname is missing
    }).toArray();
    
    if(users.length === 0){
        res.status(201).json({message:"Users list empty!!"});
    }
    // const mData = users.map((list)=> {return(list.fname, list.lname)});
    // console.log(mData);
    // if(mData == keyword.fname || mData == keyword.lname){
    //     res.status(201).send({message:"Data fileter done!!", users});
    // }
    // else{
    //     res.status(201).send({message:"Data fileter done!!", users});
    // }
    res.status(201).send({message:"Data fileter done!!", users});
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.postUsers = async(req, res) =>{
    try {
        const body = req.body;
        console.log(body);
        const db = await connectMongodb();
        const result = await db.collection(dbCollection).insertMany([body]); // Insert data
        res.status(201).json({ message: "User added successfully", result});
    } catch (error) {
        res.status(400)
            .json({ error: error.message });
    }

};

exports.putUsers = async (req, res) => {
    try {
        const bodyUpdate = req.body;
        const db = await connectMongodb();
        const result = await db.collection(dbCollection).updateOne(
            { "_id": new ObjectId(req.params._id)}, // Filter
            {$set: {...bodyUpdate}}, // Update
            {upsert: true}, // add document with req.body._id if not exists 
            {update:true}
        ); // Insert data
        if(!result){
            res.status(404).json({message:"Exit data not updated!!"})
        }
        res.status(201).json({ message: "User added successfully", result});
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUsers = async(req, res) =>{
     const id = req.params.id
     try{
        const db = await connectMongodb();
        const result = await db.collection(dbCollection).deleteOne({"_id": new ObjectId(req.params.id)});
        res.status(201).json({message:"User deleted successfully", result});
     }catch(error){
        res.status(404).json({error:error.message});
     }
}