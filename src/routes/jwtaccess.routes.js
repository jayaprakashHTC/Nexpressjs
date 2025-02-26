const express = require('express');
const router = express.Router();

const jwtaccessController = require('../controller/jwtaccess.controller');

const verifyToken = require('../utilites/jwt.verification.token');

const { jwtAccessRegsiterValidations } = require('../schemaValidation/checkValidationSchema');

const  postValidation = require('../validations/validationResult');

const {jwtAccessRegsiterUser, jwtaccessGetUsers, jwtaccessLogin} = jwtaccessController


router.post('/register', jwtAccessRegsiterValidations, postValidation, jwtAccessRegsiterUser);


router.post('/login', jwtaccessLogin);


router.get('/users', verifyToken,  jwtaccessGetUsers);


module.exports = router;