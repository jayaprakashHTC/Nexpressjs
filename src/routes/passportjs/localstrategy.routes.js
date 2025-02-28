const express = require('express');
const router = express.Router();

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

// const {localstrategyPostData} = require('../../controller/passportjs/localstrategy.controller');

require('../../controller/passportjs/localstrategy.controller');




// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle errors (e.g., database errors)
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ message: "user not define", info:info.message }); // Send error message
    }

    // Authentication successful
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle errors during login
      }
      return res.status(200).json({ message: 'Login successful', user }); // Send success response
    });
  })(req, res, next); // Pass req, res, and next to the middleware
});
// Dashboard route (protected)
router.get('/dashboard', (req, res) => {
  // if (!req.isAuthenticated()) {
  //   return res.redirect('/login');
  // }
  const data = req.user
  // console.log("data", data);

  if(data){
    res.status(201).send({message:`Hello, Welcome ${data.user.username}`, data});
  }else{
    res.status(401).json({message:"User data not find"});
  }
 
});

router.post('/logout', async (req, res, next) => {
  req.logout(function(err) {
     
     if(err){
      res.status(401).json({message:"User ind error", err:err.message});
     }

     req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err);
      }

      // Clear the session cookie
      res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different

      // Redirect to the home page or login page
      res.status(201).json({message:"user successfully logout"});
    });
  });
});

module.exports = router;