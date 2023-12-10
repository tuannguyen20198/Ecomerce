const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const {response} = require("express");

const register = asyncHandler(async (req, res) => {
  const {email, password, firstname, lastname} = req.body;
  if (!email || !password || !firstname || !lastname)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  const user = await User.findOne({email});
  if (user) throw new Error("User has existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Register is successfully. Please go login"
        : "Something went wrong",
    });
  }
});
//Refesh token => Cấp mới access token
//Access token => Xác thực người dùng,phân quyền nguời dùng
const login = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  //plain object
  const response = await User.findOne({email});
  if (response && (await response.isCorrectPassword(password))) {
    //Tách password và role ra khỏi response
    const {password, role, ...userData} = response.toObject();
    //Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    //Tạo refesh token
    const refreshToken = generateRefreshToken(response._id);
    // Luu refesh token vào database
    await User.findByIdAndUpdate(response._id, {refreshToken}, {new: true});
    // Luu refesh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const {_id} = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: false,
    rs: user ? user : "User not foubd",
  });
});
module.exports = {
  register,
  login,
  getCurrent,
};
