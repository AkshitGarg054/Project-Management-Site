const User = require("../models/user");

module.exports.emailVerify = async (req, res) => {
    const token = req.params.token;

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send("Invalid or expired token!");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();
    req.flash("success", 'Email successfully verified!');
    res.redirect("/login");
};