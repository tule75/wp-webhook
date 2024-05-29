const express = require('express');
const router = express.Router();

const WPtoLarkController = require('../app/controllers/WPtoLarkController.js');

router.get('/all', productController.getProducts);
router.post('/update', productController.updateProducts);
router.get('/create', productController.cProduct);
router.post('/product/deleted', productController.deleteProduct);
router.post('/product/updated', productController.updateProduct);
router.post('/product/created', WPtoLarkController.createProduct);
// router.get('/', productController.index);

module.exports = router;