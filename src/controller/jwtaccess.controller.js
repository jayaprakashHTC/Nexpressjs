require('dotenv').config();
const express = require('express');

const app = express();

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

const crypto = require('crypto');

app.use(bodyParser.json()) // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const connectMongodb = require("../models/user.model"); // Import DB connection function

const dbCollection = "jwtaccess";

const SECRET_KEY = process.env.SESSION_SECRET;

const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
}


exports.jwtAccessRegsiterUser = async (req, res) =>{
    const body = req.body;
    try {
        const {  body:{
            stu_id, 
            stu_fname, 
            stu_lname, 
            stu_db, 
            stu_email, 
            stu_passout, 
            stu_marks, 
            stu_status, 
            stu_father_fname, 
            stu_father_lname, 
            stu_clg, 
            stu_pwd, 
            stu_cpwd, 
            stu_phone
        }} = req;
        
        const salt = crypto.randomBytes(16); // Random salt
        const iterations = 100000; // Number of iterations
        const keylen = 64; // Desired key length
        const digest = 'sha512'; // Hash function

       const cryptoPassword =  crypto.pbkdf2Sync(stu_pwd, salt, iterations, keylen, digest);

      
       const cryptoConfirmPassword =  crypto.pbkdf2Sync(stu_cpwd, salt, iterations, keylen, digest);



        const bodyResults = {
            stu_id:stu_id,
            stu_fname:stu_fname, 
            stu_lname:stu_lname, 
            stu_db:stu_db, 
            stu_email:stu_email, 
            stu_passout:stu_passout, 
            stu_marks:stu_marks, 
            stu_status:stu_status, 
            stu_father_fname:stu_father_fname, 
            stu_father_lname:stu_father_lname, 
            stu_clg:stu_clg, 
            stu_phone:stu_phone,
            stu_pwd:cryptoPassword.toString('hex'),
            stu_cpwd:cryptoConfirmPassword.toString('hex'),
            
        }
        const db = await connectMongodb();
        const result = await db.collection(dbCollection).insertMany([bodyResults]); // Insert data
        res.status(201).json({ message: "Regsiter user data added successfully", result});
    } catch (error) {
        res.status(400)
            .json({ error: error.message });
    }
};


exports.jwtaccessLogin = async (req, res) =>{
    const {body:{stu_email, stu_pwd}} = req;

    console.log(`JWT access login username - ${stu_email} and password - ${stu_pwd}`);



        try {
            const users = await dbConnection();
    
            // console.log("users", users);
    
            const findUser = users.find((user) => user.stu_email === stu_email);
            console.log("findUser", findUser);
    
    
            if (!findUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // const pwd = await crypto.compare(password, findUser.password);
    
            const saltdata = crypto.randomBytes(16).toString('hex');
            const hashPassword = (stu_pwd, salt) => crypto.pbkdf2Sync(stu_pwd, salt, 100000, 64, 'sha512').toString('hex');
    
            const hash = hashPassword(stu_pwd, saltdata);   
            
            const comparePassword = (inputPassword, storedHash, salt) =>{
                const hashpwd  = hashPassword(inputPassword, salt);
                return hashpwd === storedHash;
            };
            
            const isMatch = comparePassword(stu_pwd, hash, saltdata);
    
            if (findUser.stu_email === stu_email && isMatch === true ) {
                const token = jwt.sign({user:findUser}, SECRET_KEY , {expiresIn:'1h'});
                res.status(201).json({message:"user login successfully", token});
            } else {
                res.status(401).json({message:"Invalid user login details"});
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }

}


exports.jwtaccessGetUsers = async (req, res) => {
    const requestUser = req.user;
    console.log("requestUser", requestUser);
    try {
        res.status(200).send({message:'JWT Access users', user:requestUser}); // Send response
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

