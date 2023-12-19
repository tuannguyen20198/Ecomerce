const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Check if the authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Invalid access token",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication!!!",
    });
  }
});
const isAdmin = asyncHandler((req,res,next) => {
  const {role} = req.user
  if (role !== 'admin')
  return res.status(401).json({
    success: false,
    mes:'REQUIRE ADMIN ROLE'
  })
  next()
})

module.exports = {
  verifyAccessToken,
  isAdmin
};
