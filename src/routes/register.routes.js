const express = require('express');
const router = express.Router();

//Controller file start here
const registerControllerDetails = require('../controller/register.controller.js')
//Controller file end here
const {body, validationResult, checkSchema} = require('express-validator');

const {postRegsiter, loginUser, dashboard} = registerControllerDetails

const validationResultData = require('../validations/validationResult');
const {checkRegisterSchemaValidation} = require('../schemaValidation/checkValidationSchema.js');



router.post('/regsiter', checkRegisterSchemaValidation, validationResultData, postRegsiter);

router.post('/login', loginUser);

router.get('/dashboard', dashboard);


// Catch-all middleware for undefined routess
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