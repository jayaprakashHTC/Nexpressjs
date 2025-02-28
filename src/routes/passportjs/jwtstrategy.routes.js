require('dotenv').config();
const express = require('express');

const router = express.Router();

const passport = require('passport');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

// const LocalStrategy = require('passport-local').Strategy;

// const bcrypt = require('bcryptjs');

// const {localstrategyPostData} = require('../../controller/passportjs/localstrategy.controller');

const connectMongodb = require("../../models/user.model"); // Import DB connection function

require('../../controller/passportjs/jwtstrategy.controller');

const SECRET_KEY = process.env.SESSION_SECRET;

const dbCollection = "register";



const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
};

router.post('/login', async (req, res) => {
    const { body:{username, password} } = req;

    const users = await dbConnection();
    // Step 1: Find the user by username
    const user = users.find((u) => u.username === username);
    console.log("login user data", user);
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username.' });
    }

    const saltdata = crypto.randomBytes(16).toString('hex');
    const hashPassword = (password, salt) => crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    
    const hash = hashPassword(password, saltdata);   
            
    const comparePassword = (inputPassword, storedHash, salt) =>{
       const hashpwd  = hashPassword(inputPassword, salt);
            return hashpwd === storedHash;
    };
            
    const isMatch = comparePassword(password, hash, saltdata);

    if (user.username === username && isMatch === true ) {
       
         // Step 2: Create a JWT
         const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });
  
        // Step 3: Send the JWT to the client
        return res.status(200).send({ message: "Login successful", token, user:user});

    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
  
  
});
  
  // Protected route
  router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    const data = req.user
    // const datas = req
    // console.log("data", datas);

    if(!data){
        res.status(401).json({message:"User data not found"})
    }else{
        res.status(201).json({ message: 'You are authenticated!', data });
    }
   
  });



module.exports = router;