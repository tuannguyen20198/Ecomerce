const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const ctrl = require('../controllers/blog');
const uploader = require('../config/cloundinary.config');

router.get('/', ctrl.getBlogs);
router.get('/one/:bid', ctrl.getBlog);
router.post('/', [verifyAccessToken, isAdmin], ctrl.createNewBlog);
router.put('/like/:bid', [verifyAccessToken], ctrl.likeBlog);
router.put(
    '/image/:bid',
    [verifyAccessToken, isAdmin],
    uploader.single('image'),
    ctrl.uploadImagesProduct
);
router.put('/dislike/:bid', [verifyAccessToken], ctrl.dislikeBlog);
router.put('/:bid', [verifyAccessToken, isAdmin], ctrl.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrl.deleteBlog);

module.exports = router;
