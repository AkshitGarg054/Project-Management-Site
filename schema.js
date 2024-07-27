const Joi = require("joi");

const projectSchema = Joi.object({
    newP: Joi.object({
        projectName: Joi.string().required(),
        repoLink: Joi.string().required(),
        img: Joi.string().allow("", null),
        hostLink: Joi.string().required(),
    }).required(),
});

const registerSchema = Joi.object({

    username: Joi.string().min(2).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    type: Joi.string().valid('Student', 'Admin').required(),
    'g-recaptcha-response': Joi.string().required().label('Google reCAPTCHA response'),

});

const loginSchema = Joi.object({

    email: Joi.string().email().required(),
    password: Joi.string().required(),

});

module.exports = { projectSchema, registerSchema, loginSchema };

