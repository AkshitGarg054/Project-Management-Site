const nodemailer = require("nodemailer");
const User = require("../models/user");
const ExpressError = require("./ExpressError.js");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.SITE_PASS,
    }
});

async function sendNotification(email, message) {
    const mailOptions = {
        from: '"Project Management Site 👻" <hak.shittt@gmail.com>',
        to: email, 
        subject: "Project Update Notification",
        text:  message,
    };

    await transporter.sendMail(mailOptions, (error) => {
        if (error) {
            throw new ExpressError(400, "Error sending email");
        }
    });
}

async function sendVerificationEmail(user) {
    const verificationUrl = 'http://localhost:8080/verify-email/' + user.emailVerificationToken;

    const mailOptions = {
        from: '"Project Management Site 👻" <hak.shittt@gmail.com>',
        to: user.email, 
        subject: "Email Verification", 
        text:  `Please verify your email by clicking the following link: ${verificationUrl}`,
        html: `<h4>Please verify your email by clicking the following link: <a href="${verificationUrl}">Click here!</a></h4>`
    };

    await transporter.sendMail(mailOptions, (error) => {
        if (error) {
            throw new ExpressError(400, "Error sending email");
        }
    });
}

module.exports = { sendVerificationEmail, sendNotification };