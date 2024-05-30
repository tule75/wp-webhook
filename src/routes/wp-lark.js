const express = require('express');
const router = express.Router();

const WPtoLarkController = require('../app/controllers/WPtoLarkController.js');

router.post('/product/deleted', WPtoLarkController.deleteProduct);
router.post('/product/updated', WPtoLarkController.updateProduct);
router.post('/product/created', WPtoLarkController.createProduct);
// router.get('/', productController.index);

module.exports = router;