require('dotenv').config();

const express = require('express');

// const bcrypt = require('bcrypt');

const crypto = require('crypto');

const bodyParser = require('body-parser');

// const cookieParser = require('cookie-parser');

const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(bodyParser.json()) // for parsing application/json


// app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const connectMongodb = require("../models/user.model"); // Import DB connection function

// const uri = process.env.MONGO_URI; 

// const dbuser = "users";
const dbCollection = "register";

// console.log("uri", uri);


const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
}

exports.postRegsiter = async(req, res) =>{
    try {
        const {  body:{username, email, contact, password, confirmPassword, address}} = req;
        // Hash the password
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(password, saltRounds);
        // const hashedConfirmPassword = await bcrypt.hash(confirmPassword, saltRounds);

        const salt = crypto.randomBytes(16); // Random salt
        const iterations = 100000; // Number of iterations
        const keylen = 64; // Desired key length
        const digest = 'sha512'; // Hash function

       const cryptoPassword =  crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);

       console.log("cryptoPassword", cryptoPassword);
      
       const cryptoConfirmPassword =  crypto.pbkdf2Sync(confirmPassword, salt, iterations, keylen, digest);

       console.log("cryptoConfirmPassword", cryptoConfirmPassword);


        const bodyResults = {
            username:username,
            email:email,
            contact:contact,
            password:cryptoPassword.toString('hex'),
            confirmPassword:cryptoConfirmPassword.toString('hex'),
            address:address
        }
        console.log("email body", password);
        console.log("email body", confirmPassword);
        console.log("adress", address.street, address.landmark);
        const db = await connectMongodb();
        const result = await db.collection(dbCollection).insertMany([bodyResults]); // Insert data
        res.status(201).json({ message: "Regsiter user data added successfully", result});
    } catch (error) {
        res.status(400)
            .json({ error: error.message });
    }

};

exports.loginUser = async (req, res) =>{
    const {body:{username, password}} = req;

    console.log(`username - ${username} and password - ${password}`);

    // const salt = crypto.randomBytes(16); // Random salt
    // const iterations = 100000; // Number of iterations
    // const keylen = 64; // Desired key length
    // const digest = 'sha512'; // Hash function

    try {
        const users = await dbConnection();

        // console.log("users", users);

        const findUser = users.find((user) => user.username === username);
        console.log("findUser", findUser);


        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // const pwd = await crypto.compare(password, findUser.password);

        const saltdata = crypto.randomBytes(16).toString('hex');
        const hashPassword = (password, salt) => crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

        const hash = hashPassword(password, saltdata);   
        
        const comparePassword = (inputPassword, storedHash, salt) =>{
            const hashpwd  = hashPassword(inputPassword, salt);
            return hashpwd === storedHash;
        };
        
        const isMatch = comparePassword(password, hash, saltdata);

        if (findUser.username === username && isMatch === true ) {
            // res.cookie('myCookie', findUser.username, {
            //     maxAge: 60000, // Cookie expires in 1 minute
            //     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            //     path:'/user/dashboard',
            // });
            
            
            if (!req.session) {
                return res.status(500).json({ message: "Session not initialized" });
            }

            req.session.userId = findUser._id
            req.session.username = findUser.username

            return res.status(200).send({ message: "Login successful"});
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

exports.dashboard = async(req, res) =>{
    // try{
    //     const getMyCookies = await req.cookies.myCookie
    //     console.log("getMyCookies", getMyCookies);

    //     res.status(201).json({message:"Cookies:", getMyCookies});
    // }catch(error){
    //    console.log("Error getting cookies", error)
    // }

    console.log("dashboard userid", req.session.userId);

    try {
        // Check if the user is authenticated
        if (req.session.userId) {
            const db = await connectMongodb();
            const user = await db.collection(dbCollection).findOne({ _id: new ObjectId(req.session.userId) });
            if (user) {
                return res.status(200).json({ message: `Welcome to your dashboard, ${user.username}!`, user });
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } else {
            return res.status(401).json({ message: "Not authenticated" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
   
}