const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrl = require('../controllers/order');

router.post('/', verifyAccessToken, ctrl.createOrder);
module.exports = router;
