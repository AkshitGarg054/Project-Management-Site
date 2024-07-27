const { admins } = require("./utils/admins");
const { projectSchema, registerSchema, loginSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isStudent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.type === 'Student') {
        return next();
    } else {
        req.flash('error', 'Cannot access this page.');
        res.redirect('/login');
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && admins.includes(req.user.email)) {
        return next();
    } else {
        req.flash('error', 'You do not have permission to access the Admin Panel.');
        res.redirect('/login');
    }
};

module.exports.validateProject = (req, res, next) => {
    let result = projectSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

module.exports.validateSignup = (req, res, next) => {
    let result = registerSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

module.exports.validateLogin = (req, res, next) => {
    let result = loginSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}

