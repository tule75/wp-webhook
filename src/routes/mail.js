const express = require('express');
const router = express.Router();

const emailController = require('../app/controllers/EmailController');


router.post('/sendbill', emailController.sendBill);

module.exports = router;