const express = require('express');
const router = express.Router();

router.get('/user', (req, res) =>{
    console.log("This is router folder inside user route file. Say Hi!!");
    res.status(201).send("This is router folder inside user route file. Say Hi!!");
});


module.exports = router;