const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const ctrls = require('../controllers/productCategory');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory);
router.get('/', ctrls.getCategories);
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory);
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory);

module.exports = router;
