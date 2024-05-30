const express = require('express');
const router = express.Router();

const GPTController = require('../app/controllers/GPTController.js');
const AutomationController = require('../app/controllers/AutomationController.js')

router.post('/description',GPTController.generateDescription);
router.post('/newVoucher', AutomationController.newVoucherBlog);

// router.get('/', categoryController.index);

module.exports = router;