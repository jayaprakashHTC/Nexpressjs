const express = require('express');
const router = express.Router();

//Controller file start here
const userControllerDetails = require('../controller/importfiles.controller')
//Controller file end here

router.get('/data', userControllerDetails.getImportJsonData);
router.post('/data', userControllerDetails.importfilesTodb);


module.exports = router;