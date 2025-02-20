require('dotenv').config();

const express = require('express');

const app = express();

// const bcrypt = require('bcrypt');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const MongoStore = require('connect-mongo');

// const { MongoClient, ObjectId } = require('mongodb');

// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// const connectMongodb = require("./models/user.model.js"); // Import DB connection function

app.use(cookieParser());

app.use(express.json());



// const dbuser = "users";
// const dbCollection = "register";

// console.log("uri", uri);
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,  // MongoDB connection URI
    dbName:'users',
    collectionName: 'register',       // (Optional) Collection name
    ttl: 14 * 24 * 60 * 60,           // Time-to-live (14 days)
    autoRemove: 'native',             // Automatically remove expired sessions
    touchAfter: 24 * 3600,            // Update session only if modified after 24 hours
});

app.use(session({
    secret: process.env.SESSION_SECRET || "my-secret-key", // Use the secret from .env
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false, // ✅ Secure cookies only in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax',
    }    
}))


//routes files start here
const userRoutes = require('./routes/user.routes.js');
const importFiles = require('./routes/importfiles.routes.js');
const regsiter = require('./routes/register.routes.js');
//routes files end here

// const dbConnection = async() =>{
//     const db = await connectMongodb(); // Get database instance
//     const users = await db.collection(dbCollection).find().toArray(); // Fetch users
//     return users;
// }


//app.use(userRoutes);
app.use('/api', userRoutes);
app.use('/user', regsiter);
app.use('/file', importFiles);
//app.use(middlewareTest);



// app.post('/login', async(req, res)=>{
//    const {body:{username, password}} = req;
  
//       console.log(`username - ${username} and password - ${password}`);
  
      
//       try {
//           const users = await dbConnection();
  
//           // console.log("users", users);
  
//           const findUser = users.find((user) => user.username === username);
  
//           if (!findUser) {
//               return res.status(404).json({ message: "User not found" });
//           }
  
//           const pwd = await bcrypt.compare(password, findUser.password);
  
//           if (findUser.username === username && pwd === true) {
//               // res.cookie('myCookie', findUser.username, {
//               //     maxAge: 60000, // Cookie expires in 1 minute
//               //     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//               //     path:'/user/dashboard',
//               // });
              
              
//               // if (!req.session) {
//               //     return res.status(500).json({ message: "Session not initialized" });
//               // }
  
//               req.session.userId = findUser._id
//               req.session.username = findUser.username
              
//               console.log("sessionRes", req.session.userId);

//               console.log("findUser.username", findUser);
  
//               return res.status(200).send({ message: "Login successful"});
//           } else {
//               return res.status(401).json({ message: "Invalid username or password" });
//           }
//       } catch (error) {
//           console.error("Error during login:", error);
//           return res.status(500).json({ message: "Internal server error" });
//       }
// })

// app.get('/dashboard', async(req, res)=>{
//     try {
//         // Check if the user is authenticated
//         if (req.session.userId) {
//             const db = await connectMongodb();
//             const user = await db.collection(dbCollection).findOne({ _id: new ObjectId(req.session.userId) });
//             console.log("user:", user);
//             if (user) {
//                 return res.status(200).json({ message: `Welcome to your dashboard, ${user.username}!`, user });
//             } else {
//                 return res.status(404).json({ message: "User not found" });
//             }
//         } else {
//             return res.status(401).json({ message: "Not authenticated" });
//         }
//     } catch (error) {
//         console.error("Error in dashboard:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// })


// app.use('/', (req, res) =>{
//    console.log(req.session.id);
// //    req.session.visited = true;
//    res.status(201).send("Hello");
// })






module.exports = app;