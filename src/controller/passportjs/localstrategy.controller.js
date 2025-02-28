const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const crypto = require('crypto');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');


const { MongoClient, ObjectId } = require('mongodb');

app.use(bodyParser.json()) // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const connectMongodb = require("../../models/user.model"); // Import DB connection function

const dbCollection = "register";



const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
};



passport.use(
    new LocalStrategy(
      // Verify callback
      async (username, password, done) => {
        try {

          const users = await dbConnection(username);
          // Step 1: Find the user by username
          const user = users.find((u) => u.username === username);
          // console.log("user passport", user);
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          console.log("user password", password);
          console.log("user password", user.password);
  
          // Step 2: Compare the provided password with the stored hash
          const saltdata = crypto.randomBytes(16).toString('hex');
          const hashPassword = (password, salt) => crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
          
          const hash = hashPassword(password, saltdata);   
                  
          const comparePassword = (inputPassword, storedHash, salt) =>{
          const hashpwd  = hashPassword(inputPassword, salt);
                return hashpwd === storedHash;
          };
                  
          const isMatch = comparePassword(password, hash, saltdata);

          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          if( user.username === username &&  isMatch === true){
            return done(null, user);
          }else{
             console.log("User details not fetched");
          }
  
          // Step 3: Authentication successful
          
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  
  // Serialize user
  passport.serializeUser((user, done) => {
  //  / console.log("serializer user", user);
    done(null, { id: user.id, user}); // Store the username in the session
  });
  
  // Deserialize user
  passport.deserializeUser(async (user, done) => {
    // console.log('deserializer user', user);
    done(null, user); // Retrieve the user object from the username
  });

module.exports = passport;