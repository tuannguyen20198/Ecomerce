const { response } = require('express');
const Product = require('../models/product'); // Erase if already required
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createProduct: newProduct ? newProduct : 'Cannot create new product',
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product',
    });
});
// Filtering, sorting & pagination
// const getProducts = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((el) => delete queries[el]);

//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(
//         /\b(gte|gt|lt|lte)\b/g,
//         (matchedEl) => `$${matchedEl}`
//     );
//     const formattedQueries = JSON.parse(queryString);

//     // Filtering
//     if (queries?.title)
//         formattedQueries.title = { $regex: queries.title, $options: 'i' };

//     let queryCommand = Product.find(formattedQueries);
//     // Sorting
//     //acb,efg => [abc,efg] => abc efg
//     if (req.query.sort) {
//         const sortBy = await req.query.sort.split(',').join(' ');
//         console.log(sortBy);
//         queryCommand = queryCommand.sort(sortBy);
//     }
//     //Execute query
//     //Số lượng sản phẩm thỏa điều kiện !== số lượng sp trả về 1 lần gọi API
//     queryCommand.exec(async (err, response) => {
//         if (err) throw new Error(err.message);
//         // Get counts using a separate query
//         const counts = await Product.countDocuments(formattedQueries);

//         // Respond with the data
//         return res.status(200).json({
//             success: response ? true : false,
//             products: response ? response : 'Cannot get products',
//             counts,
//         });
//     });
// });
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: 'i' };

    // Create a copy of the formatted queries for counting
    const countQueries = { ...formattedQueries };

    let queryCommand = Product.find(formattedQueries);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    try {
        // Execute query and get counts using a separate query
        const [response, counts] = await Promise.all([
            queryCommand,
            Product.countDocuments(countQueries),
        ]);

        // Respond with the data
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products',
        });
    } catch (err) {
        // Handle errors
        throw new Error(err.message);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    let { pid } = req.params;
    if (req.body && req.body.title)
        req.body.slug = slugify(req.body.title.toLowerCase());
    const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: updateProduct ? true : false,
        updateProduct: updateProduct ? updateProduct : 'Cannot update product',
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct
            ? deletedProduct
            : 'Cannot delete product',
    });
});
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) throw new Error('Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(
        (el) => el.postedBy.toString() === _id
    );
    // console.log({ alreadyRating });
    // console.log(alreadyRating);
    if (alreadyRating) {
        //update star & comment
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
            },
            { new: true }
        );
    } else {
        //add star & comment
        await Product.findByIdAndUpdate(
            pid,
            {
                $push: { ratings: { star, comment, postedBy: _id } },
            },
            { new: true }
        );
    }
    //Sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce(
        (sum, el) => sum + +el.star,
        0
    );
    updatedProduct.totalRatings =
        Math.round((sumRatings * 10) / ratingCount) / 10;

    await updatedProduct.save();

    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});
const uploadImagesProduct = asyncHandler(async (req, res) => {
    console.log(req.file);
    return res.json('OKE');
});
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
};
