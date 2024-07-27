const express = require('express');
const router = express.Router();
const wrapAsyncFunc = require("../utils/wrapAsync.js");

const emailController = require("../controllers/email.js");

router.get("/verify-email/:token", wrapAsyncFunc(emailController.emailVerify));

module.exports = router;