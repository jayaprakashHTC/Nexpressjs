const express = require('express');
const router = express.Router();

//Controller file start here
const userControllerDetails = require('../controller/importfiles.controller')
//Controller file end here

const {getImportJsonData, importfilesTodb} = userControllerDetails;

router.get('/data', getImportJsonData);
router.post('/data', importfilesTodb);


module.exports = router;