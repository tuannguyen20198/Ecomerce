const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const ctrls = require('../controllers/product');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get('/', ctrls.getProducts);

router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);

router.get('/:pid', ctrls.getProduct);

module.exports = router;
