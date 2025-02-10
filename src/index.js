const express = require('express');
const app = express();

//routes files start here
const userRoutes = require('./routes/user.routes.js');
const importFiles = require('./routes/importfiles.routes.js');
//routes files end here

app.use(express.json());

app.use(userRoutes);
app.use(importFiles);








module.exports = app;