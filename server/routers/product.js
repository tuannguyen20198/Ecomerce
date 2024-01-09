const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloundinary.config');

const ctrls = require('../controllers/product');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get('/', ctrls.getProducts);
router.put('/ratings', verifyAccessToken, ctrls.ratings);

router.put(
    '/uploadimage/:pid',
    [verifyAccessToken, isAdmin],
    uploader.array('images', 10),
    ctrls.uploadImagesProduct
);
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);

router.get('/:pid', ctrls.getProduct);

module.exports = router;
