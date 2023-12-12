const express = require("express");
const router = express.Router();
const {verifyAccessToken} = require("../middlewares/verifyToken");

const ctrls = require("../controllers/user");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);

module.exports = router;
