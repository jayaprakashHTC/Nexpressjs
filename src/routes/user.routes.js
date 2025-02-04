const express = require('express');
const router = express.Router();

//Controller file start here
const userControllerDetails = require('../controller/user.controller')
//Controller file end here


router.get('/user', userControllerDetails.getAllUsers);


module.exports = router;