const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoryController.js');

router.post('/create', categoryController.create);
router.get('/', categoryController.index);

module.exports = router;