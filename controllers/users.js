const User = require("../models/user.js");
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../utils/email-config.js');
const axios = require('axios');

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs", { showNavbar: false });
};

module.exports.registerUser = async (req, res) => {
    try {
        let { username, email, password, type, 'g-recaptcha-response': captchaResponse } = req.body;
        const secretKey = process.env.CAPTCHA_SECRET_KEY;

        const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
        const response = await axios.post(captchaVerificationUrl);
        const { success } = response.data;

        if (!success) {
            req.flash('error', 'CAPTCHA verification failed. Please try again.');
            return res.redirect('/signup');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "User already exists with this email.");
            return res.redirect('/signup');
        }

        const newUser = new User({
            username,
            email,
            type,
            emailVerificationToken: uuidv4(),
            emailVerificationTokenExpiry: Date.now() + 60 * 60 * 1000,
        });

        const registeredUser = await User.register(newUser, password);

        await sendVerificationEmail(registeredUser);

        req.flash("success", "Registered successfully! Please check your email for verification.");
        res.redirect("/login");
    } catch(e) {
        req.flash('error', e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginPage = (req, res) => {
    res.render("users/login.ejs", { showNavbar: false });
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to Dashboard!");
    if (req.user.type === 'Student') {
        res.redirect("/projects");
    } else if (req.user.type === 'Admin') {
        res.redirect("/admin/users");
    }
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logged out!");
        res.redirect("/signup");
    });
};

