const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrl = require('../controllers/order');

router.post('/', verifyAccessToken, ctrl.createOrder);
router.put('/status/:oid', verifyAccessToken, isAdmin, ctrl.updateStatus);
router.get('/', verifyAccessToken, ctrl.getUserOrder);
router.get('/admin', verifyAccessToken, isAdmin, ctrl.getOrders);

module.exports = router;
