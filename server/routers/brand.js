const express = require('express');
const router = express.Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

const ctrls = require('../controllers/brand');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBrand);
router.get('/', ctrls.getBrands);
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBrand);
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBrand);

module.exports = router;
