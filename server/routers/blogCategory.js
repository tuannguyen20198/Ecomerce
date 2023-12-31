const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const ctrls = require('../controllers/blogCategory');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory);
router.get('/', ctrls.getCategories);
router.put('/:bcid', [verifyAccessToken, isAdmin], ctrls.updateCategory);
router.delete('/:bcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory);

module.exports = router;
