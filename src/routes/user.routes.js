const express = require('express');
const router = express.Router();

const {body, validationResult, checkSchema} = require('express-validator');

//Controller file start here
const userControllerDetails = require('../controller/user.controller')
//Controller file end here


const {getAllUsers, getFilterUsers, postUsers, putUsers, deleteUsers} = userControllerDetails

const validationResultData = require('../validations/validationResult');
const {checkSchemaValidation} = require('../schemaValidation/checkValidationSchema.js');

router.get('/user',getAllUsers);
router.get('/users', getFilterUsers);
router.post('/user', checkSchemaValidation, validationResultData, postUsers);
router.put('/user/:id', putUsers);
router.delete('/user/:id', deleteUsers);

// Catch-all middleware for undefined routes
router.use((req, res, next) => {
    const err = new Error('Page not found');
    err.status = 404; // Set error status to 404
    next(err); // Pass the error to the error-handling middleware
});

// Error-handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message); // Use correct status
});

module.exports = router;