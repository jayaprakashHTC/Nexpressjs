const express = require('express');
const app = express();

//routes files start here
const userRoutes = require('./routes/user.routes.js');
//routes files end here

app.use(express.json());

app.use(userRoutes);








module.exports = app;