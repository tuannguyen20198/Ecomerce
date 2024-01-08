const useRouter = require('./user');
const productRouter = require('./product');
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');
const blog = require('./blog');
const brand = require('./brand');
const coupon = require('./coupon');
const { notFound, errHandler } = require('../middlewares/errHandler');

const initRoutes = (app) => {
    app.use('/api/user', useRouter);
    app.use('/api/product', productRouter);
    app.use('/api/blogCategory', blogCategoryRouter);
    app.use('/api/prodCategory', productCategoryRouter);
    app.use('/api/blog', blog);
    app.use('/api/brand', brand);
    app.use('/api/coupon', coupon);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
