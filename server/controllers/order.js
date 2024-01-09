const Order = require('../models/order');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const userCart = await User.findById(_id).select('cart');
    console.log(userCart);
    const response = await Blog.create(req.body);
    return res.json({
        success: userCart ? true : false,
        createdBlog: userCart ? userCart : 'Cannot create new blog',
    });
});

module.exports = {
    createOrder,
};
