const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController.js');

router.get('/all', productController.getProducts);
router.post('/update', productController.updateProducts);
router.get('/create', productController.cProduct);
router.post('/create', productController.createProduct);
router.post('/delete', productController.deleteProducts);
router.post('/search', productController.search);
router.get('/', productController.index);

module.exports = router;