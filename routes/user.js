const express = require('express');
const router = express.Router();
const wrapAsyncFunc = require("../utils/wrapAsync.js");
const { validateSignup } = require("../middleware.js");
const { validateLogin } = require("../middleware.js");
const passport = require('passport');

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(validateSignup, wrapAsyncFunc(userController.registerUser));

router.route("/login")
.get(userController.renderLoginPage)
.post(validateLogin, 
    passport.authenticate("local", { 
    failureRedirect: "/login", 
    failureFlash: true 
    }), 
    wrapAsyncFunc(userController.loginUser)
);

router.get("/logout", userController.logoutUser);

module.exports = router;