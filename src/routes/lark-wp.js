const express = require('express');
const router = express.Router();

const LarktoWPController = require('../app/controllers/LarktoWPController.js');

router.post('/order/updated', LarktoWPController.updateOrder);
router.post('/product/updated', LarktoWPController.updateProduct);
router.post('/product/created', LarktoWPController.createProduct);
// router.get('/', productController.index);

module.exports = router;