const express = require("express");
const router = express.Router();
const {verifyAccessToken,isAdmin} = require("../middlewares/verifyToken");

const ctrls = require("../controllers/user");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotPassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/",[verifyAccessToken, isAdmin], ctrls.getUsers);

module.exports = router;
