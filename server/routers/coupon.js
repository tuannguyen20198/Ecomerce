const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrl = require('../controllers/coupon');

router.post('/', [verifyAccessToken, isAdmin], ctrl.createNewCoupon);
router.put('/:cid', [verifyAccessToken, isAdmin], ctrl.updateCoupon);
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrl.deleteCoupon);
router.get('/', ctrl.getCoupons);

module.exports = router;
