const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrl = require('../controllers/insertData');
const uploader = require('../config/cloundinary.config');

router.post('/', ctrl.insertProduct);
router.post('/cate', ctrl.insertCategory);

module.exports = router;
