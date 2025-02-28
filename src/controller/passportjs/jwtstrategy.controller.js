require('dotenv').config();
const express = require('express');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const SECRET_KEY = process.env.SESSION_SECRET;

const { MongoClient, ObjectId } = require('mongodb');

const connectMongodb = require("../../models/user.model"); // Import DB connection function

// JWT configuration
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
    secretOrKey: SECRET_KEY, // Secret used to sign the JWT
};

// console.log("jwtOptions", jwtOptions)

const dbCollection = "register";



const dbConnection = async() =>{
    const db = await connectMongodb(); // Get database instance
    const users = await db.collection(dbCollection).find().toArray(); // Fetch users
    return users;
};

// const findUserById = async (user) => {
//     const users = await dbConnection();
//     return users.find((user) => user.username === user);
// };

// Passport JWT strategy
passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        // console.log("jwtPayload", jwtPayload.user.username);
      try {
        // const user = await findUserById(jwtPayload.username);
        const users = await dbConnection();

        // Find the user by ID in the JWT payload
        
        const user = users.find((u) => u.username === jwtPayload.user.username);
        if (!user) {
          return done(null, false); // User not found
        }
        return done(null, user); // User found
      } catch (err) {
        return done(err, false); // Handle errors
      }
    })
);

module.exports = passport;