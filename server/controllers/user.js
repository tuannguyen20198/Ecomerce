const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs',
        });
    const user = await User.findOne({ email });
    if (user) throw new Error('User has existed!');
    else {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser
                ? 'Register is successfully. Please go login'
                : 'Something went wrong',
        });
    }
});
//Refesh token => Cấp mới access token
//Access token => Xác thực người dùng,phân quyền nguời dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs',
        });
    //plain object
    const response = await User.findOne({ email });
    if (response && (await response.isCorrectPassword(password))) {
        //Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } =
            response.toObject();
        //Tạo access token
        const accessToken = generateAccessToken(response._id, role);
        //Tạo refesh token
        const newRefreshToken = generateRefreshToken(response._id);
        // Luu refesh token vào database
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken: newRefreshToken },
            { new: true }
        );
        // Luu refesh token vào cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error('Invalid credentials!');
    }
});

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select(
        '-refreshToken -password -role'
    );
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not foubd',
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies;
    //Check xem có token hay không
    // const {_id} =
    if (!cookie && !cookie.refreshToken)
        //Check token có hợp lệ hay không
        throw new Error('No refesh token in cookies');
    //Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({
        _id: rs._id,
        refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : 'Refresh token not matched',
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
        throw new Error('No refresh token in cookies');
    //Xóa refresh token ở db
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );
    //Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        success: true,
        mes: 'Logout is done',
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) throw new Error('Missing email');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const html = `Xin vui lòng click và link dưới đây để thay đổi mật khẩu của bạ.Link này sẽ hết hẹn sau 15 phút kể từ bây giờ.crypto
  <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;
    const data = {
        email,
        html,
    };
    const rs = await sendMail(data);
    return res.status(200).json({
        success: true,
        rs,
    });
});
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error('Missing inputs');
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpire: { $gt: Date.now() },
    });
    if (!user) throw new Error('Invalid reset token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpire = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong',
    });
});
const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role');
    return res.status(200).json({
        success: response ? true : false,
        users: response,
    });
});
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if (!_id) throw new Error('Missing inputs');
    const response = await User.findByIdAndDelete(_id);
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response
            ? `User with email ${response.email} deleted`
            : 'No user delete',
    });
});
const updateUser = asyncHandler(async (req, res) => {
    // ''
    const { _id } = req.user;
    if (!_id || Object.keys(req.body).length === 0)
        throw new Error('Missing inputs');
    const response = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    }).select('-password -role');
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Some thing went wrong',
    });
});
const updateUserByAdmin = asyncHandler(async (req, res) => {
    // ''
    const { uid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Some thing went wrong',
    });
});
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing inputs');
    const response = await User.findByIdAndUpdate(
        _id,
        { $push: { address: req.body.address } },
        {
            new: true,
        }
    ).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Some thing went wrong',
    });
});

module.exports = {
    register,
    login,
    getCurrent,
    getUsers,
    deleteUser,
    updateUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    updateUserByAdmin,
    updateUserAddress,
};
